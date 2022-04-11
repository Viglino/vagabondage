var t = { symbo: {}, txt_typo: {}, nature: {} };

function getInfo(l, type) {
  var filter = l.filter;
  if (filter[0]==='all') filter = filter[1];
  if (filter[1] === type) {
    for (let i=2; i<filter.length; i++) {
      if ((!l.maxzoom || l.maxzoom>17) && (!l.minzoom || l.minzoom<16)) {
        t[type][filter[i]] = {
          id: l.id,
          layer: l,//['source-layer']
        }
      }
    }
    return true
  } else {
    return false
  }
}

d.layers.forEach(l => {
  if (l.filter) {
    if (!(getInfo(l, 'symbo') || getInfo(l, 'txt_typo') || getInfo(l, 'nature'))) {
      console.log(l)
    }
  } else {
    // console.log(l)
  }
})