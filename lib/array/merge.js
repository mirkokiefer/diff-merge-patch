
var _ = require('underscore')
var objectMerge = require('../object/index').merge
var arrayDiff = require('./diff')({unique: true})

function Result(diff, conflicts) {
  this.diff = diff
  if (conflicts) this.conflict = conflicts
}

// always pick source 0
Result.prototype.resolveConflicts = function() {
  var resolved = []
  this.diff.forEach(function(each) {
    var updates = []
    each[1].forEach(function(update) {
      if (update.conflict) {
        if (update.source[0] == 0) {
          update = _.clone(update)
          delete update.conflict
          updates.push(update)
        }
      } else {
        updates.push(update)
      }
    })
    if (updates.length) resolved.push([each[0], updates])
  })
  return new Result(resolved)
}

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

var mergeEntry = function(updates1, updates2, conflicts) {
  var updates2Map = {}
  var arrays = [updates1, updates2].map(function(each) {
    return each.map(function(update) {
      var serialized = update.insert !== undefined ? 'i'+update.insert : update.move
      updates2Map[serialized] = update
      return serialized
    })
  })

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
        var update2 = updates2Map[diffEntry.insert]
        update2.source = [1]
        if (update2.move !== undefined) {
          var conflictID = conflicts.conflictID(update2.move)
          if (conflictID) update2.conflict = conflictID
        }
        result[index2].push(update2)
      } else if (diffEntry.move !== undefined) {
        var update1 = updates1[diffEntry.move]
        var update2 = updates2Map[diffEntry.move]
        var existingConflict = update1.move !== undefined ? conflicts.conflictID(update1.move) : undefined
        var conflictID = existingConflict ? existingConflict : conflicts.nextID()
        [update1, update2].forEach(function(each, i) {
          each.conflict = conflictID
          each.source = [i]
        })
        result[index2].push(update2)
      }
    })
  })

  return _.flatten(result)
}

var merge = function(diffs) {
  var diffs = diffs.map(addSources)

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

  return new Result(diffUnion, conflicts._nextID - 1)
}

merge.Result = Result
module.exports = merge
