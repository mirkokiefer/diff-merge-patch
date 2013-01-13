
var _ = require('underscore')
var objectMerge = require('../object/index').merge
var arrayDiff = require('./diff')({unique: true})

function Result() { }

function Conflicts(values) {
  this._nextID = 1
  this.map = {}
  if (values) values.forEach(this.addConflict, this)
}

Conflicts.prototype.addConflict = function(value) {
  this.map[value] = this.nextID()
}

Conflicts.prototype.conflictID = function(value) {
  return this.map[value]
}

Conflicts.prototype.nextID = function() {
  return this._nextID++
}


var addSources = function(diff, i) {
  return diff.diff.map(function(each) {
    var entries = each[1].map(function(entry) {
      var updatedEntry = _.clone(entry)
      updatedEntry.source = [i]
      return updatedEntry
    })
    return [each[0], entries]
  })
}

var oldToNewIndexMap = function(diff, i) {
  var map = {}
  diff.forEach(function(each) {
    each[1].forEach(function(entry) {
      if (entry.move !== undefined) map[entry.move] = {value: each[0], source: [i]}
    })
  })
  return {diff: map}
}

var markIndexConflicts = function(conflicts) { return function(diff) {
  return diff.map(function(each) {
    var updates = each[1].map(function(update) {
      if (update.move) {
        var conflict = conflicts.conflictID(update.move)
        if (conflict) update.conflict = conflict
      }
      return update
    })
    return [each[0], updates]
  })
}}

var sortByNewIndexDesc = function(diff) {
  return diff.sort(function(a, b) { return a[0] < b[0] })
}

var union = function(diff1, diff2, opts) {
  var result = []
  while(diff1.length && diff2.length) {
    var entries = [diff1, diff2].map(function(each) { return each.pop() })
    var newIndexes = entries.map(function(each) { return each[0] })
    if (newIndexes[0] == newIndexes[1]) {
      result.push([ entries[0][0], opts.onUpdatesAtSameIndex(entries[0][1], entries[1][1]) ])
    } else if ((!entries[0]) || (newIndexes[0] > newIndexes[1])) {
      if (entries[0]) diff1.push(entries[0])
      result.push(entries[1])
    } else {
      if (entries[1]) diff2.push(entries[1])
      result.push(entries[0])
    }
  }
  return result.concat(diff1, diff2)
}

var serializeUpdate = function(update) {
  return update.insert !== undefined ? JSON.stringify({i: update.insert}) : update.move
}
var deserializeUpdate = function(serialized) {
  if (serialized[0] == '{') {
    return {insert: JSON.parse(serialized).i}
  } else {
    return {move: serialized}
  }
}

var mergeEntry = function(updates1, updates2, conflicts) {
  var arrays = [updates1, updates2].map(function(each) { return each.map(serializeUpdate) })
  var updateDiff = arrayDiff(arrays[0], arrays[1])

  var result = updates1.map(function(each) {
    each.source = [0, 1]
    return [each]
  })
  updateDiff.diff.forEach(function(each) {
    var index2 = each[0]
    each[1].forEach(function(diffEntry) {
      if (index2 === null) {
        var update1 = updates1[diffEntry.move]
        update1.source = [0]
      } else if (diffEntry.insert !== undefined) {
        var update2 = deserializeUpdate(diffEntry.insert)
        update2.source = [1]
        if (update2.move !== undefined) {
          var conflictID = conflicts.conflictID(update2.move)
          if (conflictID) update2.conflict = conflictID
        }
        result[index2].push(update2)
      } else if (diffEntry.move) {
        var update1 = updates1[diffEntry.move]
        var update2 = updates2[index2]
        var existingConflict = update1.move !== undefined ? conflicts.conflictID(update1.move) : undefined
        var conflictID = existingConflict ? existingConflict : conflicts.nextID()
        [update1, update2].forEach(function(each, i) {
          each.conflict = conflictID
          each.source = [i]
        })
        conflictID++
        result[index2].push(update2)
      }
    })
  })

  return _.flatten(result)
}

var merge = function(diff1, diff2) {
  var diffs = [diff1, diff2].map(addSources)

  // find all conflicts caused by moving the same object to different positions
  var moveMaps = diffs.map(oldToNewIndexMap)
  var conflicts = new Conflicts(objectMerge(moveMaps).conflict)
  diffs = diffs.map(markIndexConflicts(conflicts))

  // find all sequence conflicts for updates at the same origin position
  diffs = diffs.map(sortByNewIndexDesc)
  var diffUnion = union(diffs[0], diffs[1], {
    onUpdatesAtSameIndex: function(updates1, updates2) {
      return mergeEntry(updates1, updates2, conflicts)
    }
  })

  var result = {diff: diffUnion}
  if (conflicts._nextID > 1) result.conflict = conflicts._nextID - 1
  return result
}

merge.Result = Result
module.exports = merge
