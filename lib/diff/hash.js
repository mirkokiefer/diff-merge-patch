
var _ = require('underscore')

function Result(diff) {
  this.diff = diff.diff
}

Result.prototype.difference = function(otherDiff) {
  var result = _.clone(this.diff)
  _.each(otherDiff.diff, function(value, key) {
    if (result[key] === value) delete result[key]
  })
  return new Result({diff: result})
}

var diff = function(before, after) {
  after = _.clone(after)
  var result = {}
  _.each(before, function(value, key) {
    var afterValue = after[key]
    if(afterValue === undefined) return result[key] = null
    if(value != afterValue) {
      result[key] = afterValue
    }
    delete after[key]
  })
  _.each(after, function(value, key) {
    result[key] = value
  })
  return new Result({diff: result})
}

diff.Result = Result
module.exports = diff