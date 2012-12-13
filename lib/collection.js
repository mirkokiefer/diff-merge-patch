
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

  var added = []
  var removed = []
  _.each(beforeMap, function(beforeCount, value) {
    var afterCount = afterMap[value] || 0
    if (afterCount < beforeCount) {
      _.times(beforeCount - afterCount, function() { removed.push(value) })
      delete afterMap[value]
    } else if (afterCount > beforeCount) {
      _.times(afterCount - beforeCount, function() { added.push(value) })
      delete afterMap[value]
    } else {
      delete afterMap[value]
    }
  })
  _.each(afterMap, function(afterCount, value) {
    added.push(value)
  })
  return {'+': added, '-': removed}
}

module.exports = diff