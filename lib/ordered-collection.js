
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
function Cut(count) {
  this.cut = count
}
function Paste(indexes) {
  this.paste = indexes
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
  var result = {equal: diffRes.equal, insert: [], delete: [], cut: [], paste: []}
  var cutValues = {}
  diffRes.delete.forEach(function(each) {
    var previous = result.delete
    var startIndex = each[0]
    var count = 0
    _.times(each[1], function(i) {
      var current;
      if (_.contains(after, before[startIndex+i])) {
        cutValues[before[startIndex+i]] = startIndex+i
        current = result.cut
      } else {
        current = result.delete
      }
      if ((previous != current) && (count > 0)) {
        previous.push([startIndex, count])
        startIndex += count
        count = 0
      }
      previous = current
      count++
    })
    if (count > 0) previous.push([startIndex, count])
  })
  diffRes.insert.forEach(function(each) {
    var previous = result.insert
    var startIndex = each[0]
    var values = []
    each[1].forEach(function(value, i) {
      var current = cutValues[value] !== undefined ? result.paste : result.insert
      if ((previous != current) && values.length) {
        previous.push([startIndex, values])
        values = []
      }
      previous = current
      current == result.insert ? values.push(value) : values.push(cutValues[value])
    })
    if (values.length) previous.push([startIndex, values])
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
        result.equal = result.equal || []
        result.equal.push([originIndex, each.equal])
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

module.exports.types = {Insert: Insert, Equal: Equal, Delete: Delete, Cut: Cut, Paste: Paste}
