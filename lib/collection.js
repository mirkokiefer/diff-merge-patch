
var _ = require('underscore')

var updateMap = function(values, map) {
  var localMap = {}
  values.forEach(function(value) {
    localMap[value] = localMap[value] || {value: value, count: 0}
    localMap[value].count++
  })
  _.each(localMap, function(each) {
    map[each.value] = map[each.value] || {value: each.value, count: 0}
    if (map[each.value].count < each.count) map[each.value].count = each.count
  })
}

var merge = function(origin, diffs) {
  var addMap = {}
  var deleteMap = {}
  diffs.forEach(function(diff) {
    updateMap(diff.added, addMap)
    updateMap(diff.deleted, deleteMap)
  })
  var addedValues = []
  _.each(addMap, function(each) {
    _.times(each.count, function() { addedValues.push(each.value) })
  })
  console.log(addMap, deleteMap)
  var equalValues = origin.filter(function(value) {
    var deleteCount = deleteMap[value] ? deleteMap[value].count : 0
    if (deleteCount > 0) {
      deleteMap[value].count--
      return false
    } else {
      return true
    }
  })
  return equalValues.concat(addedValues)
}

module.exports = merge