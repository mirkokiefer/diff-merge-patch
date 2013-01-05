
var _ = require('underscore')

function Result(data) {
  this.diff = data.diff
  if (data.conflicts && data.conflicts.length) this.conflicts = data.conflicts
} 

Result.prototype.resolveConflicts = function() {
  var result = this.diff
  this.conflicts.forEach(function(conflictKey) {
    var values = result[conflictKey]
    result[conflictKey] = _.without(values, null).sort()[0]
  })
  return new Result({diff: result})
}

var merge = function(diffs) {
  var result = {}
  var conflicts = []
  var setValue = function(value, key) {
    if (result[key] === undefined) {
      result[key] = value
    } else {
      if (result[key].constructor != Array) {
        result[key] = [result[key]]
        conflicts.push(key)
      }
      result[key].push(value)
    }
  }
  diffs.forEach(function(eachDiff) {
    _.each(eachDiff.insert, setValue)
    _.each(eachDiff.update, setValue)
    _.each(eachDiff.delete, function(each) { setValue(null, each) })
  })
  return new Result({diff: result, conflicts: conflicts})
}

merge.Result = Result

module.exports = merge