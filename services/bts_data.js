export async function getBtsWriteRatioData() {
  const csv = await d3.csv('./data/BTS작사비율.csv');
  return csv.map(d => {
    d.value = parseFloat(d.value);
    return d;
  })
}

export async function getBtsComposeRatioData() {
  const csv = await d3.csv('./data/BTS작곡비율.csv');
  return csv.map(d => {
    d.value = parseFloat(d.value);
    return d;
  })
}

export async function getBtsMakeOwnSongData() {
  const data = await d3.csv('./data/BTS년도별작곡작사횟수.csv');
  return data.map(d => {
    d.date = new Date(d.date);
    d.value = parseInt(d.value);
    return d;
  })
}

export async function getBoyBandWriteData() {
  const csv = await d3.csv('./data/남자아이돌작사비율.csv');
  const data = csv.map(d => {
    d['참여'] = parseFloat(d['참여']);
    d['비참여'] = parseFloat(d['비참여']);
    return d;
  })
  return data.sort((a, b) => b['참여'] - a['참여']);
}

export async function getBoyBandComposeData() {
  const csv = await d3.csv('./data/남자아이돌작곡비율.csv');
  const data = csv.map(d => {
    d['참여'] = parseFloat(d['참여']);
    d['비참여'] = parseFloat(d['비참여']);
    return d;
  })
  return data.sort((a, b) => b['참여'] - a['참여']);
}

export async function getBoybandOwnSongData() {
  const dateSet = new Set();
  const csv = await d3.csv('./data/남자아이돌년도별작곡작사횟수.csv');
  const data = csv.map(d => {
    dateSet.add(new Date(d.date));
    d.date = new Date(d.date);
    return d;
  }).sort((a, b) => a.date - b.date);
  const keys = ['BTS', 'EXO', 'GOT7'];
  const series = keys.map(key => 
    data.map(({[key]: value, date}, index) => 
      ({key, name: index, date, value: parseInt(value)})
    )
  );
  return {
    dates: Array.from(dateSet).sort(),
    series,
    keys
  }
}

export async function getSongByBtsMembersData() {
  const dateSet = new Set();
  const keySet = new Set();

  const csv = await d3.csv('./data/BTS멤버년도별작곡작사횟수.csv');
  csv.forEach(({date, member, value}) => {
    dateSet.add(new Date(date));
    keySet.add(member);
  })
  const series = Array.from(keySet).map(key => 
    csv.filter(({date, member, value}) => member === key)
      .map(({date, member, value}, index) => ({key: member, name: index, date: new Date(date), value: parseInt(value)}))
  );
  return {
    dates: Array.from(dateSet).sort(),
    series,
    keys: Array.from(keySet)
  }
}