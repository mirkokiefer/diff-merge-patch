
var _ = require('underscore')

var compareByValue = function(a, b) {
  var values = [a, b].map(function(each) { return each.insert !== undefined ? each.insert : each.delete })
  return values[0] > values[1]
}

function Result(diff) {
  this.diff = diff.sort(compareByValue)
}

var diff = function(before, after) {
  before = _.clone(before).sort()
  after = _.clone(after).sort()
  var result = []
  var afterIndex = 0
  before.forEach(function(each, i) {
    while(each > after[afterIndex]) {
      result.push({insert: after[afterIndex]})
      afterIndex++
    }
    if (each == after[afterIndex]) {
      afterIndex++
    } else {
      result.push({delete: each})
    }
  })
  var rest = after.slice(afterIndex).map(function(each) { return {insert: each} })
  return new Result(result.concat(rest))
}

diff.Result = Result

module.exports = diff
