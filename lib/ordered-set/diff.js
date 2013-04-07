
var _ = require('underscore')
//var listDiff = require('../ordered-list/index').diff
var listDiff = require('diff-merge-patch').orderedList.diff

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
  var diffRes = listDiff(before, after)
  var result = new ArrayDiff()
  
  var cutValues = {}
  // find all deletes who are actually moved/cut values:
  if (diffRes.delete) diffRes.delete.forEach(function(each) {
    var index = each.index
    if (_.contains(after, before[index])) {
      cutValues[before[index]] = index
    } else {
      result.addDelete(index)
    }
  })
  // find out which inserts are actually moved values:
  if (diffRes.insert) diffRes.insert.forEach(function(each) {
    each[1][0].values.forEach(function(value, i) {
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

module.exports = orderedSetDiff
