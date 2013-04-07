

var _ = require('underscore')
var longestCommonSubstring = require('longest-common-substring')

function Insert(value, indexBefore, indexAfter) {
  this.op = '+'
  this.values = value
  this.indexBefore = indexBefore
  this.indexAfter = indexAfter
}
function Delete(length, indexBefore, indexAfter) {
  this.op = '-'
  this.length = length
  this.indexBefore = indexBefore
  this.indexAfter = indexAfter
}

var diff = function(before, after, startBefore, startAfter) {
  startBefore = startBefore || 0
  startAfter = startAfter || 0

  var commonSeq = longestCommonSubstring(before, after)
  var endBeforeLeft = commonSeq.startString1
  var endAfterLeft = commonSeq.startString2
  var startBeforeRight = endBeforeLeft + commonSeq.length
  var startAfterRight = endAfterLeft + commonSeq.length

  if (commonSeq.length == 0) {
    var result = []
    if (before.length) result.push(new Delete(before.length, startBefore - 1, startAfter - 1))
    if (after.length) result.push(new Insert(after, startBefore + before.length - 1, startAfter - 1))
    return result
  }

  var beforeLeft = before.slice(0, endBeforeLeft)
  var afterLeft = after.slice(0, endAfterLeft)
  var beforeRight = before.slice(startBeforeRight)
  var afterRight = after.slice(startAfterRight)

  return _.union(
    diff(beforeLeft, afterLeft, startBefore, startAfter),
    diff(beforeRight, afterRight, startBefore + startBeforeRight, startAfter + startAfterRight)
  )
}

module.exports = diff