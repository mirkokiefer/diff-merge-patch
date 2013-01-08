
var _ = require('underscore')

var compareRange = function(a, b) { return a.range[0] > b.range[0] }

function Walker(map) {
  this.tokens = _.clone(map).sort(compareRange).reverse()
  this.result = []
  this.nextToken()
}

Walker.prototype.nextToken = function() {
  this.current = this.tokens.pop()
}

var findMinRange = function(walkers) {
  var minRange
  walkers.forEach(function(walker, i) {
    if (!walker.current) return
    if (!minRange) minRange = _.clone(walker.current.range)
    var range = walker.current.range
    if (range[0] < minRange[0]) {
      minRange[1] = minRange[0]
      minRange[0] = range[0]
    }
    if ((range[0] < minRange[1]) && (range[0] > minRange[0])) minRange[1] = range[0] - 1
    if (range[1] < minRange[1]) minRange[1] = range[1]
  })
  return minRange
}

var sliceCurrentRangesToMinRange = function(walkers, minRange) {
  walkers.forEach(function(walker, i) {
    if (!walker.current) return
    if ((walker.current.range[0] == minRange[0]) && (walker.current.range[1] > minRange[1])) {
      walker.tokens.push({range: [minRange[1]+1, walker.current.range[1]], value: walker.current.value, pos: walker.current.pos})
      walker.current.range[1] = minRange[1]
    } else if (walker.current.range[0] != minRange[0]) {
      walker.tokens.push(walker.current)
      walker.current = undefined
    }
  })
}

var findCommonValue = function(walkers) {
  var value
  var conflict = _.any(walkers, function(walker) {
    if (!walker.current) return
    if (value === undefined) value = walker.current.value
    if (walker.current.value !== value) return true
  })
  return {conflict: conflict, value: value}
}

var walk = function(walkers) {
  var minRange = findMinRange(walkers)

  sliceCurrentRangesToMinRange(walkers, minRange)

  var commonValue = findCommonValue(walkers)

  // write results
  if (commonValue.conflict) {
    var takeOwnValue = function(walker) {
      if (walker.current) walker.result.push(walker.current)
    }
    walkers.forEach(takeOwnValue)
  } else {
    var takeCommonValue = function(walker) {
      if (walker.current) {
        walker.result.push(walker.current)
      } else {
        walker.result.push({range: _.clone(minRange), value: commonValue.value})
      }
    }
    walkers.forEach(takeCommonValue)
  }

  walkers.forEach(function(walker) { walker.nextToken() })

  return commonValue.conflict
}

var addOrderAndSource = function(maps) {
  return maps.map(function(map, mapID) {
    return map.map(function(entry, pos) {
      return {range: entry.range, value: entry.value, pos: pos}
    })
  })
}

var restoreOrder = function(entries) {
  return entries
    .sort(function(a, b) { 
      if ((a.pos !== undefined) && (b.pos !== undefined)) {
        return a.pos > b.pos
      } else {
        return a.range[0] == b.range[0] ? a.range[1] > b.range[1] : a.range[0] > b.range[0]
      }
    })
    .map(function(each) { return {range: each.range, value: each.value} })
}

var mergeEqualNeighbours = function(entries) {
  var result = []
  entries.forEach(function(each) {
    var previous = result[result.length - 1]
    if (previous && (previous.range[1] + 1 == each.range[0]) && (previous.value == each.value)) {
      previous.range[1] = each.range[1]
    } else {
      result.push(each)
    }
  })
  return result
}

var anyNotAtEnd = function(walkers) {
  return _.any(walkers, function(each) { return each.current })
}

var merge = function(maps) {
  maps = addOrderAndSource(maps)

  var walkers = maps.map(function(each) { return new Walker(each) })

  var conflict = false
  while (anyNotAtEnd(walkers)) {
    var conflictInStep = walk(walkers)
    conflict = conflict || conflictInStep
  }

  var results = walkers.map(function(walker) { return restoreOrder(walker.result) })

  if (conflict) {
    return {conflict: true, result: results.map(function(each) { return mergeEqualNeighbours(each) })}
  } else {
    return {result: mergeEqualNeighbours(results[0])}
  }
}

module.exports = merge
