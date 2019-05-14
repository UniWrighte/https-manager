
module.exports.adjustDateByYear = years => {
  const date = new Date()
  return ((date.getTime() / 1000) + years * 31536000) * 1000
}

module.exports.adjustDateByCalendarYears = years => {
  const date = new Date()
  return [
    new Date(date).setFullYear(date.getFullYear() - years),
    new Date(date).setFullYear(date.getFullYear() + years)
  ]
}
