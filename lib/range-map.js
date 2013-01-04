
var _ = require('underscore')

var byRange = function(a, b) { return a.range[0] > b.range[0] }

var startsWithin = function(baseRange, range) {
  return (baseRange[0] <= range[0]) && (baseRange[1] >= range[0])
}

function Walker(map) {
  this.map = _.clone(map).sort(byRange).reverse()
  this.result = []
  this.next()
}

Walker.prototype.next = function() {
  this.current = this.map.pop()
}

anyNotAtEnd = function(walkers) {
  return _.any(walkers, function(each) { return each.current })
}

var walk = function(walkers) {
  var minRange
  // find minRange:
  walkers.forEach(function(walker) {
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
  var value
  // find conflicts - if none, find the common value:
  var conflict = _.any(walkers, function(walker) {
    if (!walker.current) return
    if (startsWithin(minRange, walker.current.range)) {
      if (value === undefined) value = walker.current.value
      if (walker.current.value !== value) return true
    }
  })
  // write results
  var takeOwnValue = function(walker) {
    if (!walker.current) return
    var entry = walker.current
    var range = entry.range
    if (startsWithin(minRange, range)) {
      if (minRange[1] >= range[1]) {
        walker.result.push(walker.current)
        walker.next()
      } else {
        walker.result.push({range: [range[0], minRange[1]], value: entry.value, pos: entry.pos})
        walker.current.range[0] = minRange[1] + 1
      }
    }
  }
  var takeCommonValue = function(walker) {
    var pushOther = function() { walker.result.push({range: _.clone(minRange), value: value}) }
    var pushMine = function() { walker.result.push({range: _.clone(minRange), value: value, pos: walker.current.pos}) }
    
    if (!walker.current) { return pushOther() }

    var range = walker.current.range
    if (minRange[1] >= range[0]) {
      pushMine()
      if (minRange[1] < range[1]) {
        walker.current.range[0] = minRange[1] + 1
      } else {
        walker.next()
      }
    } else {
      pushOther()
    }
  }
  if (conflict) {
    walkers.forEach(takeOwnValue)
  } else {
    walkers.forEach(takeCommonValue)
  }
  return conflict
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
