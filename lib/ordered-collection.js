
var _ = require('underscore')
var mergeRanges = require('./range-map')

function Result(data) {
  this.changes = data.changes
  if (data.conflict) this.conflict = true
}

var pickIndex = function(changes, index) {
  changes = _.clone(changes)
  if (changes.move) { changes.move = changes.move[index] }
  if (changes.delete) { changes.delete = changes.delete[index] }
  return changes
}

Result.prototype.resolveConflicts = function() {
  var changes = this.changes
  var arrays
  if (changes.move && changes.delete) {
    arrays = changes.move.map(function(each, i) { return each.concat(changes.delete[i]) })
  } else if (changes.move) {
    arrays = changes.move
  } else if (changes.delete) {
    arrays = changes.delete
  } else {
    return this
  }
  var hashs = arrays
    .map(function(each, i) { return {hash: _.flatten(each).toString(), index: i} })
    .sort(function(a, b) { return a.hash > b.hash })
  var index = hashs[0].index
  return new Result({changes: pickIndex(changes, index)})
}

var diffToRanges = function(diff) {
  var moveRanges = (diff.move || []).map(function(each) {
    return {range: [each[1][0], each[1][0] + each[1][1] - 1], value: each[0]}
  })
  var deleteRanges = (diff.delete || []).map(function(each) {
    return {range: [each[0], each[0] + each[1] - 1], value: null}
  })
  return moveRanges.concat(deleteRanges)
}

var rangesToDiff = function(ranges) {
  var result = {}
  ranges.forEach(function(each) {
    if (each.value === null) {
      if (!result.delete) result.delete = []
      result.delete.push([each.range[0], each.range[1] - each.range[0] + 1])
    } else {
      if (!result.move) result.move = []
      result.move.push([each.value, [each.range[0], each.range[1] - each.range[0] + 1]])
    }
  })
  return result
}

var merge = function(diffs) {
  var updateRanges = diffs.map(diffToRanges)
  var mergedUpdateRanges = mergeRanges(updateRanges)

  var insert = []
  diffs.forEach(function(each) { if (each.insert) insert = insert.concat(each.insert) })
  var result = {}
  if (insert.length) result.insert = insert

  if (mergedUpdateRanges.conflict) {
    result.move = []; result.delete = []
    mergedUpdateRanges.result.forEach(function(each) {
      var updateResult = rangesToDiff(each)
      result.move.push(updateResult.move || [])
      result.delete.push(updateResult.delete || [])
    })

    var keys = ['move', 'delete']
    keys.forEach(function(key) {
      if (_.all(result[key], function(each) { return each.length == 0 }))
        delete result[key]
    })
    return new Result({conflict: true, changes: result})
  } else {
    var updateResult = rangesToDiff(mergedUpdateRanges.result)
    return new Result({changes: _.extend(result, updateResult)})
  }
}

merge.Result = Result
module.exports = merge
