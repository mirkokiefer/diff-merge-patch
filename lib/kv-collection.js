
var _ = require('underscore')

var keyMap = function(array) {
  var map = {}
  array.forEach(function(each) {
    map[each.key] = {key: each.key, value: each.value}
  })
  return map
}

var diff = function(before, after) {
  var afterMap = keyMap(after)
  var result = {
    add: [],
    delete: [],
    update: []
  }
  before.forEach(function(each) {
    var afterEntry = afterMap[each.key]
    if(afterEntry === undefined) return result.delete.push(each.key)
    if(each.value != afterEntry.value) {
      result.update.push({key: each.key, value: afterEntry.value})
    }
    delete afterMap[each.key]
  })
  _.each(afterMap, function(entry) {
    result.add.push({key: entry.key, value: entry.value})
  })
  return result
}

module.exports = diff