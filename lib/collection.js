
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
  before = _.clone(before).sort()
  after = _.clone(after).sort()
  var result = {
    insert: [],
    delete: []
  }
  var afterIndex = 0
  before.forEach(function(each, i) {
    while(each > after[afterIndex]) {
      result.insert.push(after[afterIndex])
      afterIndex++
    }
    if (each == after[afterIndex]) {
      afterIndex++
    } else {
      result.delete.push(i)
    }
  })
  result.insert = result.insert.concat(after.slice(afterIndex))
  return result
}

module.exports = diff