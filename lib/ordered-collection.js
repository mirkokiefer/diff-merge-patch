
var _ = require('underscore')
var longestCommonSubstring = require('longest-common-substring')

function Insert(value) {
  this.insert = value
}
function Equal(count) {
  this.equal = count
}
function Delete(count) {
  this.delete = count
}

var diff = function(before, after) {
  var commonSeq = longestCommonSubstring(before, after)
  var startBefore = commonSeq.startString1
  var startAfter = commonSeq.startString2
  if (commonSeq.length == 0) {
    var result = []
    if (before.length) result.push(new Delete(before.length))
    if (after.length) result.push(new Insert(after))
    return result
  }
  var beforeLeft = before.slice(0, startBefore)
  var afterLeft = after.slice(0, startAfter)
  var equal = [new Equal(commonSeq.length)]
  var beforeRight = before.slice(startBefore + commonSeq.length)
  var afterRight = after.slice(startAfter + commonSeq.length)
  return _.union(diff(beforeLeft, afterLeft), equal, diff(beforeRight, afterRight))
}

var orderedSetDiff = function(before, after) {
  var diffRes = invert(diff(before, after))
  if (!diffRes.delete) return diffRes
  var result = {insert: [], delete: [], move: []}
  var cutValues = {}
  diffRes.delete.forEach(function(each) {
    var startIndex = each[0]
    var count = 0
    _.times(each[1], function(i) {
      var current;
      if (_.contains(after, before[startIndex+i])) {
        cutValues[before[startIndex+i]] = startIndex+i
        if (count > 0) {
          result.delete.push([startIndex, count])
          startIndex += count
          count = 0
        }
      } else {
        count++        
      }
    })
    if (count > 0) result.delete.push([startIndex, count])
  })
  diffRes.insert.forEach(function(each) {
    var previous = result.insert
    var startIndex = each[0]
    var values = []
    var cutIndex
    var count = 0
    var pushToken = function() {
      if ((previous == result.insert) && values.length) {
        previous.push([startIndex, values])
        values = []
      } else if (count > 0) {
        previous.push([startIndex, [cutIndex, count]])
        count = 0
      }
    }
    each[1].forEach(function(value, i) {
      var currentCutIndex = cutValues[value]
      if (currentCutIndex !== undefined) {
        if ((previous == result.insert) || (currentCutIndex != cutIndex+i)) {
          pushToken()
          cutIndex = currentCutIndex
          previous = result.move
        }
        count++
      } else {
        if (previous == result.move) {
          pushToken()
          previous = result.insert
        }
        values.push(value)
      }
    })
    pushToken()
  })
  _.each(result, function(array, key) {
    if (array.length == 0) delete result[key]
  })
  return result
}

var invert = function(diff) {
  var result = {}
  var originIndex = 0
  diff.forEach(function(each) {
    switch (each.constructor) {
      case Equal:
        originIndex += each.equal
        break;
      case Insert:
        result.insert = result.insert || []
        result.insert.push([originIndex-1, each.insert])
        break;
      case Delete:
        result.delete = result.delete || []
        result.delete.push([originIndex, each.delete])
        originIndex += each.delete
    }
  })
  return result
}

module.exports = function(opts) {
  opts = opts || {}
  return function(before, after) {
    return opts.unique ? orderedSetDiff(before, after) : diff(before, after)
  }
}

module.exports.types = {Insert: Insert, Equal: Equal, Delete: Delete}
