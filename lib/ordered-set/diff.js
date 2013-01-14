
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

function ArrayDiff() {
  this.diff = []
}

ArrayDiff.prototype.newIndex = function(index) {
  var array = _.find(this.diff, function(each) { return each[0] == index })
  if (!array) {
    array = [index, []]
    this.diff.push(array)
  }
  return array[1]
}

ArrayDiff.prototype.addMove = function(newIndex, oldIndex) {
  var entries = this.newIndex(newIndex)
  entries.push({move: oldIndex})
}

ArrayDiff.prototype.addInsert = function(newIndex, value) {
  var entries = this.newIndex(newIndex)
  entries.push({insert: value})
}

ArrayDiff.prototype.addDelete = function(oldIndex) { this.addMove(null, oldIndex) }

var orderedSetDiff = function(before, after) {
  var diffRes = invert(diff(before, after))
  var result = new ArrayDiff()
  
  var cutValues = {}
  // find all deletes who are actually moved/cut values:
  if (diffRes.delete) diffRes.delete.forEach(function(each) {
    var index = each[0]
    _.times(each[1], function(i) {
      if (_.contains(after, before[index+i])) {
        cutValues[before[index+i]] = index+i
      } else {
        result.addDelete(index+i)
      }
    })
  })
  // find out which inserts are actually moved values:
  if (diffRes.insert) diffRes.insert.forEach(function(each) {
    each[1].forEach(function(value, i) {
      var currentCutIndex = cutValues[value]
      if (currentCutIndex === undefined) {
        result.addInsert(each[0], value)
      } else {
        result.addMove(each[0], currentCutIndex)
      }
    })
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

module.exports = orderedSetDiff

module.exports.types = {Insert: Insert, Equal: Equal, Delete: Delete}
