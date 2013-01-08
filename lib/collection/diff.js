
var _ = require('underscore')

function Result(diff) {
  if (diff.insert && diff.insert.length) this.insert = diff.insert
  if (diff.delete && diff.delete.length) this.delete = diff.delete
}

var arrayDifference = function(array1, array2) {
  var result = _.clone(array1)
  array2.forEach(function(each) {
    var index = result.indexOf(each)
    if (index > -1) result.splice(index, 1)
  })
  return result
}

Result.prototype.difference = function(diff) {
  var result = {}
  result.insert = arrayDifference((this.insert || []), (diff.insert || []))
  result.delete = arrayDifference((this.delete || []), (diff.delete || []))
  return new Result(result)
};

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
  return new Result(result)
}

diff.Result = Result

module.exports = diff
