
var _ = require('underscore')
var longestCommonSubstring = require('longest-common-substring')

var diff = function(before, after) {
  var commonSeq = longestCommonSubstring(before, after)
  var startBefore = commonSeq.startString1
  var startAfter = commonSeq.startString2
  if (commonSeq.length == 0) {
    var result = []
    if (before.length) result.push(['-', before.length])
    if (after.length) result.push(['+', after])
    return result
  }
  var beforeLeft = before.slice(0, startBefore)
  var afterLeft = after.slice(0, startAfter)
  var equal = [['=', commonSeq.length]]
  var beforeRight = before.slice(startBefore + commonSeq.length)
  var afterRight = after.slice(startAfter + commonSeq.length)
  return _.union(diff(beforeLeft, afterLeft), equal, diff(beforeRight, afterRight))
}

var orderedSetDiff = function(before, after) {
  var diffRes = diff(before, after)
  var result = []
  var beforeIndex = 0
  var afterIndex = 0
  diffRes.forEach(function(each) {
    switch(each[0]) {
      case '=':
        result.push(each)
        beforeIndex += each[1]
        afterIndex += each[1]
        break
      case '-':
        var previousType = '-'
        var count = 0
        _.times(each[1], function(i) {
          var value = before[beforeIndex]
          var currentType = _.contains(after, value) ? 'x' : '-'
          if ((currentType != previousType) && count) {
            result.push([previousType, count])
            count = 0
          }
          previousType = currentType
          count++
          beforeIndex++
        })
        if (count) result.push([previousType, count])
        break
      case '+':
        var previousType = '+'
        var values = []
        each[1].forEach(function(value) {
          var indexBefore = before.indexOf(value)
          var currentType = indexBefore > -1 ? 'p' : '+'
          if ((currentType != previousType) && values.length) {
            result.push([previousType, values])
            values = []
          }
          previousType = currentType
          if (currentType == 'p') {
            values.push(indexBefore)
          } else {
            values.push(value)
          }
          afterIndex++
        })
        if (values.length) result.push([previousType, values])
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