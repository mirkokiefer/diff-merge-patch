

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

var compress = function(diff) {
  var inserts = []
  var deletes = []
  var originIndex = 0
  diff.forEach(function(each) {
    switch (each.constructor) {
      case Equal:
        originIndex += each.equal
        break;
      case Insert:
        inserts.push([originIndex-1, [{values: each.insert}]])
        break;
      case Delete:
        _.times(each.delete, function(i) {
          deletes.push({index: originIndex - 1 + each.delete})
        })
        originIndex += each.delete
    }
  })
  var result = {}
  if (inserts.length) result.insert = inserts
  if (deletes.length) result.delete = deletes
  return result
}

module.exports = function(before, after) {
  return compress(diff(before, after))
}