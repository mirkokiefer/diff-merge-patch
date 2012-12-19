
var _ = require('underscore')

var diff = function(before, after) {
  after = _.clone(after)
  var result = {
    insert: {},
    delete: [],
    update: {}
  }
  _.each(before, function(value, key) {
    var afterValue = after[key]
    if(afterValue === undefined) return result.delete.push(key)
    if(value != afterValue) {
      result.update[key] = afterValue
    }
    delete after[key]
  })
  _.each(after, function(value, key) {
    result.insert[key] = value
  })
  return result
}

module.exports = diff