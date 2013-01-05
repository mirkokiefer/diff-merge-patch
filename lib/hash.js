
var _ = require('underscore')

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
  return {diff: result}
}

module.exports = diff