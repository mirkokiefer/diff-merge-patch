
var _ = require('underscore')

var merge = function(origin, diffs) {
  var result = _.clone(origin)
  var conflicts = []
  var setValue = function(value, key) {
    if (result[key] && ((result[key].constructor == Array) || (result[key] !== origin[key]))) {
      if (result[key].constructor != Array) {
        result[key] = [result[key]]
        conflicts.push(key)
      }
      result[key].push(value)
    } else {
      result[key] = value
    }
  }
  diffs.forEach(function(eachDiff) {
    _.each(eachDiff.insert, setValue)
    _.each(eachDiff.update, setValue)
    _.each(eachDiff.delete, function(each) { setValue(null, each) })
  })
  return {hash: result, conflicts: conflicts}
}

module.exports = merge