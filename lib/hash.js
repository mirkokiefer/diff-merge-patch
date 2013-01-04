
var _ = require('underscore')

function Result(data) {
  this.hash = data.hash
  if (data.conflicts && data.conflicts.length) this.conflicts = data.conflicts
} 

Result.prototype.resolveConflicts = function() {
  var result = this.hash
  this.conflicts.forEach(function(conflictKey) {
    var values = result[conflictKey]
    result[conflictKey] = _.without(values, null).sort()[0]
  })
  return new Result({hash: result})
}

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
  return new Result({hash: result, conflicts: conflicts})
}

merge.Result = Result

module.exports = merge