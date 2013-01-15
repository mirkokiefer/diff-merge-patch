
var _ = require('underscore')

var merge = function(diffs) {
  var inserts = []
  var deletes = []
  var diffsInserts = diffs.map(function(each) { return each.insert ? _.clone(each.insert) : [] })
  while (_.any(diffsInserts, function(each) { return each.length })) {
    var smallestIndex = null
    var sources
    diffsInserts.forEach(function(each, i) {
      if (each.length) {
        if ((smallestIndex == null) || (each[0][0] < smallestIndex)) {
          smallestIndex = each[0][0]
          sources = [i]
        } else if (each[0][0] == smallestIndex) {
          sources.push(i)
        }
      }
    })

    var updates = [smallestIndex, []]
    sources.forEach(function(i) {
      var update = _.clone(diffsInserts[i][0][1][0])
      update.source = i
      updates[1].push(update)
      diffsInserts[i].shift()
    })
    inserts.push(updates)    
  }

  var diffsDeletes = diffs.map(function(each) { return each.delete ? _.clone(each.delete) : [] })
  while (_.any(diffsDeletes, function(each) { return each.length })) {
    var smallestIndex = null
    var sources = []
    diffsDeletes.forEach(function(each, i) {
      if (each.length) {
        if ((smallestIndex == null) || (each[0].index < smallestIndex)) {
          smallestIndex = each[0].index
          sources = [i]
        } else if (each[0].index == smallestIndex) {
          sources.push(i)
        }
      }
    })
    sources.forEach(function(i) { diffsDeletes[i].shift() })

    deletes.push({index: smallestIndex, source: sources})
  }
  return {insert: inserts, delete: deletes}
}

module.exports = merge