
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
  var result = {insert: {}, delete: {}}
  diffs.forEach(function(diff) {
    updateMapWithMaxCount(diff.insert, result.insert)
    updateMapWithMaxCount(diff.delete, result.delete)
  })
  return result
}

var merge = function(origin, diffs) {
  var maps = maxValueCountMaps(diffs)

  var insertedValues = []
  _.each(maps.insert, function(each) {
    _.times(each.count, function() { insertedValues.push(each.value) })
  })
  var equalValues = origin.filter(function(value, i) {
    var deleteCount = maps.delete[i] ? maps.delete[i].count : 0
    if (deleteCount > 0) {
      maps.delete[i].count--
      return false
    } else {
      return true
    }
  })
  return equalValues.concat(insertedValues)
}

module.exports = merge