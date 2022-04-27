function m2km(m, fixed) {
  return (m/1000).toFixed(fixed || 0) + '&nbsp;km'
}

function formatDate(d) {
  return '<span class="date">'
    + d.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
    + '</span>'
    + '<span class="hour">' 
    + d.toLocaleTimeString(navigator.language, { hour: '2-digit', minute:'2-digit' }) 
    + '</span>'
}

export { m2km, formatDate }