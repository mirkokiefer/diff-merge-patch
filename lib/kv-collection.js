
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
    added: [],
    deleted: [],
    modified: []
  }
  before.forEach(function(each) {
    var afterEntry = afterMap[each.key]
    if(afterEntry === undefined) return result.deleted.push(each.key)
    if(each.value != afterEntry.value) {
      result.modified.push({key: each.key, value: afterEntry.value})
    }
    delete afterMap[each.key]
  })
  _.each(afterMap, function(entry) {
    result.added.push({key: entry.key, value: entry.value})
  })
  return result
}

module.exports = diff