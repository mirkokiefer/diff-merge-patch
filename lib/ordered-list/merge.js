
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
  if (array1.length == 0) {
    return -1
  } else if (array2.length == 0) {
    return 1
  } else if ((array1.length == 0) && (array2.length == 0)) {
    return 0
  }
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

var isSameArray = function(array1, array2) {
  return (_.difference(array1, array2).length == 0) && (_.difference(array2, array1).length == 0)
}

var splitDelete = function(update) {
  var first = _.clone(update)
  var rest = _.clone(update)
  first.length = 1
  rest.indexBefore++
  rest.length--
  return {first: first, rest: rest}
}

var joinDeletesWithSameIndex = function(diff) {
  if (diff.length == 0) return []
  if (diff.length == 1) return diff
  var first = _.clone(diff[0])
  var next = _.clone(diff[1])
  var rest = diff.slice(2)
  if ((first.op == '-') && (next.op == '-') && (first.indexBefore == next.indexBefore)) {
    first.source = first.source.concat(next.source)
    return [first].concat(joinDeletesWithSameIndex(rest))
  }
  return [first].concat(joinDeletesWithSameIndex([next].concat(rest)))
}

var joinNeighbourDeletes = function(diff) {
  if (diff.length == 0) return []
  if (diff.length == 1) return diff
  var first = _.clone(diff[0])
  var next = _.clone(diff[1])
  var rest = diff.slice(2)
  if ((first.op == '-') && (next.op == '-')) {
    var areSameSources = isSameArray(first.source, next.source)
    var areNeighbours = (first.indexBefore + first.length) == next.indexBefore
    if (areSameSources && areNeighbours) {
      first.length++
      return [first].concat(joinNeighbourDeletes(rest))
    }
  }
  return [first].concat(joinNeighbourDeletes([next].concat(rest)))
}

var merge = function(diffs) {
  var mergedDiff = []
  diffs = mapSources(diffs)

  while (_.any(diffs, function(each) { return each.length })) {
    var min = findMinimum(diffs, function(each) { if (each.length) return each[0].indexBefore })
    var minUpdates = min.indexes.map(function(i) {
      var update = diffs[i].shift()
      if ((update.op == '-') && (update.length > 1)) {
        var splitUpdate = splitDelete(update)
        update = splitUpdate.first
        diffs[i].unshift(splitUpdate.rest)
      }
      return update
    })
    minUpdates.sort(function(a, b) { return compareArrays(a.values || [], b.values || []) })
    mergedDiff = mergedDiff.concat(minUpdates)
  }

  return joinNeighbourDeletes(joinDeletesWithSameIndex(mergedDiff))
}

module.exports = merge
