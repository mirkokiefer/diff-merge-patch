
var _ = require('underscore')
var mergeRanges = require('./range-map')

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
  var updates = diffs.map(diffToRanges)
  var mergedUpdateRanges = mergeRanges(updates)
  var insert = []
  diffs.forEach(function(each) { if (each.insert) insert = insert.concat(each.insert) })
  if (mergedUpdateRanges.conflict) {
    var result = mergedUpdateRanges.result.map(function(each) {
      var diff = rangesToDiff(each)
      if (insert.length) diff.insert = insert
      return diff
    })
    result.conflict = true
    return result
  } else {
    var result = rangesToDiff(mergedUpdateRanges.result)
    if (insert.length) result.insert = insert
    return {result: result}
  }
}

module.exports = merge