
var _ = require('underscore')

function Result(diff) {
  this.diff = diff.diff
}

var diff = function(before, after) {
  after = _.clone(after)
  var result = {}
  _.each(before, function(value, key) {
    var afterValue = after[key]
    if(afterValue === undefined) return result[key] = {value: null}
    if(value != afterValue) {
      result[key] = {value: afterValue}
    }
    delete after[key]
  })
  _.each(after, function(value, key) {
    result[key] = {value: value}
  })
  return new Result({diff: result})
}

diff.Result = Result
module.exports = diff