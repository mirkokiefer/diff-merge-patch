
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
  var diffRes = diff(before, after)
  var result = []
  var beforeIndex = 0
  var afterIndex = 0
  diffRes.forEach(function(each) {
    switch(each.constructor) {
      case Equal:
        result.push(each)
        beforeIndex += each.equal
        afterIndex += each.equal
        break
      case Delete:
        var previousType = Delete
        var count = 0
        _.times(each.delete, function(i) {
          var value = before[beforeIndex]
          var currentType = _.contains(after, value) ? Cut : Delete
          if ((currentType != previousType) && count) {
            result.push(new previousType(count))
            count = 0
          }
          previousType = currentType
          count++
          beforeIndex++
        })
        if (count) result.push(new previousType(count))
        break
      case Insert:
        var previousType = Insert
        var values = []
        each.insert.forEach(function(value) {
          var indexBefore = before.indexOf(value)
          var currentType = indexBefore > -1 ? Paste : Insert
          if ((currentType != previousType) && values.length) {
            result.push(new previousType(values))
            values = []
          }
          previousType = currentType
          if (currentType == Paste) {
            values.push(indexBefore)
          } else {
            values.push(value)
          }
          afterIndex++
        })
        if (values.length) result.push(new previousType(values))
    }
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
        result.insert.push([originIndex, each.insert])
        break;
      case Delete:
        result.delete = result.delete || []
        result.delete.push([originIndex, each.delete])
        originIndex += each.delete
        break;
      case Cut:
        result.cut = result.cut || []
        result.cut.push([originIndex, each.cut])
        originIndex += each.cut
        break;
      case Paste:
        result.paste = result.paste || []
        result.paste.push([originIndex, each.paste])
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
module.exports.invert = invert
