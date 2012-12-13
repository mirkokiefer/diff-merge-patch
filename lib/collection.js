
var _ = require('underscore')

var valueMap = function(array) {
  var map = {}
  array.forEach(function(each) {
    map[each] = map[each] || 0
    map[each]++
  })
  return map
}

var diff = function(before, after) {
  var beforeMap = valueMap(before)
  var afterMap = valueMap(after)

  var result = {
    added: [],
    deleted: []
  }
  _.each(beforeMap, function(beforeCount, value) {
    var afterCount = afterMap[value] || 0
    if (afterCount < beforeCount) {
      _.times(beforeCount - afterCount, function() { result.deleted.push(value) })
      delete afterMap[value]
    } else if (afterCount > beforeCount) {
      _.times(afterCount - beforeCount, function() { result.added.push(value) })
      delete afterMap[value]
    } else {
      delete afterMap[value]
    }
  })
  _.each(afterMap, function(afterCount, value) {
    result.added.push(value)
  })
  return result
}

module.exports = diff