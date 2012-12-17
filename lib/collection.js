
var _ = require('underscore')

var updateMapWithMaxCount = function(values, map) {
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

var maxValueCountMaps = function(diffs) {
  var result = {added: {}, deleted: {}}
  diffs.forEach(function(diff) {
    updateMapWithMaxCount(diff.added, result.added)
    updateMapWithMaxCount(diff.deleted, result.deleted)
  })
  return result
}

var merge = function(origin, diffs) {
  var maps = maxValueCountMaps(diffs)

  var addedValues = []
  _.each(maps.added, function(each) {
    _.times(each.count, function() { addedValues.push(each.value) })
  })
  var equalValues = origin.filter(function(value) {
    var deleteCount = maps.deleted[value] ? maps.deleted[value].count : 0
    if (deleteCount > 0) {
      maps.deleted[value].count--
      return false
    } else {
      return true
    }
  })
  return equalValues.concat(addedValues)
}

module.exports = merge