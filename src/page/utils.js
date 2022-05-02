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

function formatDuration(d) {
  const h = Math.floor(d/60);
  const m = Math.round((d/60-h) * 60);
  if (h) return '<span class="duration">' + h + ' h ' + ('0'+m).substr(-2) + ' mn</span>';
  return '<span class="duration">' + m + ' mn</span>';
}

window.formatDuration = formatDuration

export { m2km, formatDate, formatDuration }