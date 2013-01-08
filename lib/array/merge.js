
var _ = require('underscore')
var mergeRanges = require('../range-map/index').merge

var onlyEmptyArrays = function(arrayOfArrays) {
  return _.all(arrayOfArrays, function(each) { return each.length == 0 })
}

function Result(diff) {
  var keys = ['insert', 'move', 'delete']
  var that = this
  keys.forEach(function(key) {
    if (diff[key] && diff[key].length && !onlyEmptyArrays(diff[key])) that[key] = diff[key]
  })
  if (diff.conflict) this.conflict = true
}

var pickIndex = function(changes, index) {
  var result = {insert: changes.insert}
  if (changes.move) { result.move = changes.move[index] }
  if (changes.delete) { result.delete = changes.delete[index] }
  return result
}

Result.prototype.resolveConflicts = function() {
  var changes = this
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
  var objects = arrays
    .map(function(each, i) { return {object: _.flatten(each).toString(), index: i} })
    .sort(function(a, b) { return a.object > b.object })
  var index = objects[0].index
  return new Result(pickIndex(changes, index))
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

    result.conflict = true
    return new Result(result)
  } else {
    var updateResult = rangesToDiff(mergedUpdateRanges.result)
    return new Result(_.extend(result, updateResult))
  }
}

merge.Result = Result
module.exports = merge
