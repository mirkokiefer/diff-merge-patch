
var _ = require('underscore')

var findMinimum = function(arrays, iterator) {
  var min = null
  var sources
  arrays.forEach(function(each, i) {
    if (each.length) {
      if ((min == null) || (iterator(each) < min)) {
        min = iterator(each)
        sources = [i]
      } else if (iterator(each) == min) {
        sources.push(i)
      }
    }
  })
  return {value: min, sources: sources}
}

var merge = function(diffs) {
  var inserts = []
  var deletes = []
  var diffsInserts = diffs.map(function(each) { return each.insert ? _.clone(each.insert) : [] })
  while (_.any(diffsInserts, function(each) { return each.length })) {
    var smallestIndex = findMinimum(diffsInserts, function(each) { return each[0][0] })

    var updates = [smallestIndex.value, []]
    smallestIndex.sources.forEach(function(i) {
      var update = _.clone(diffsInserts[i][0][1][0])
      update.source = i
      updates[1].push(update)
      diffsInserts[i].shift()
    })

    inserts.push(updates)    
  }

  var diffsDeletes = diffs.map(function(each) { return each.delete ? _.clone(each.delete) : [] })
  while (_.any(diffsDeletes, function(each) { return each.length })) {
    var smallestIndex = findMinimum(diffsDeletes, function(each) { return each[0].index })
    
    smallestIndex.sources.forEach(function(i) { diffsDeletes[i].shift() })

    deletes.push({index: smallestIndex.value, source: smallestIndex.sources})
  }
  return {insert: inserts, delete: deletes}
}

module.exports = merge