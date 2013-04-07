
var _ = require('underscore')

var mapSources = function(diffs) {
  return diffs.map(function(eachDiff, source) {
    return eachDiff.map(function(each) {
      var each = _.clone(each)
      delete each.indexAfter
      each.source = [source]
      return each
    })
  })
}

var findMinimum = function(items, iterator) {
  var min = null
  var indexes = []
  items.forEach(function(each, i) {
    var value = iterator(each)
    if (!value) return
    if ((min === null) || (value <= min)) {
      if (value < min) indexes = []
      min = value
      indexes.push(i)
    }
  })
  return {value: min, indexes: indexes}
}

var compareArrays = function(array1, array2) {
  var val1 = array1[0]
  var val2 = array2[0]
  if (val1 < val2) {
    return -1
  } else if (val1 > val2) {
    return 1
  } else {
    if (array1.length && array2.length) {
      return compareArrays(array1.slice(1), array2.slice(1))
    } else if (array2.length) {
      return -1
    } else if (array2.length) {
      return 1
    } else {
      return 0
    }
  }
}

var merge = function(diffs) {
  var mergedDiff = []
  diffs = mapSources(diffs)

  while (_.any(diffs, function(each) { return each.length })) {
    var min = findMinimum(diffs, function(each) { if (each.length) return each[0].indexBefore })
    var minUpdates = min.indexes.map(function(i) { return diffs[i].shift() })
    minUpdates.sort(function(a, b) { return compareArrays(a.values || [], b.values || []) })
    mergedDiff = mergedDiff.concat(minUpdates)
  }

  return mergedDiff
}

module.exports = merge