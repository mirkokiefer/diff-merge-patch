
var _ = require('underscore')

function Result(diff) {
  if (diff.insert && diff.insert.length) this.insert = diff.insert
  if (diff.delete && diff.delete.length) this.delete = diff.delete
}

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
    if (diff.insert) updateMapWithMaxCount(diff.insert, result.insert)
    if (diff.delete) updateMapWithMaxCount(diff.delete, result.delete)
  })
  return result
}

var merge = function(diffs) {
  var maps = maxValueCountMaps(diffs)

  var result = {insert: [], delete: []}
  _.keys(result).forEach(function(key) {
    _.each(maps[key], function(each) {
      _.times(each.count, function() { result[key].push(each.value) })
    })
  })
  
  return new Result(result)
}

module.exports = merge