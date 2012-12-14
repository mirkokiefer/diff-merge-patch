
var _ = require('underscore')

var valueMap = function(array) {
  var map = {}
  array.forEach(function(each) {
    map[each] = map[each] || {value: each, count: 0}
    map[each].count++
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
  _.each(beforeMap, function(eachBefore) {
    var afterCount = afterMap[eachBefore.value] || 0
    if (afterCount < eachBefore.count) {
      _.times(eachBefore.count - afterCount, function() { result.deleted.push(eachBefore.value) })
      delete afterMap[eachBefore.value]
    } else if (afterCount > eachBefore.count) {
      _.times(afterCount - eachBefore.count, function() { result.added.push(eachBefore.value) })
      delete afterMap[eachBefore.value]
    } else {
      delete afterMap[eachBefore.value]
    }
  })
  _.each(afterMap, function(each) {
    _.times(each.count, function() { result.added.push(each.value) })
  })
  return result
}

module.exports = diff