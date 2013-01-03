
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
  console.log(walkers.map(function(each) { return each.current }))
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
  // find conflicts:
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
    var range = walker.current.range
    if (startsWithin(minRange, range)) {
      if (minRange[1] >= range[1]) {
        walker.result.push(walker.current)
        walker.next()
      } else {
        walker.result.push({range: [range[0], minRange[1]], value: walker.current.value})
        walker.current.range[0] = minRange[1] + 1
      }
    }
  }
  var takeOtherValue = function(walker) {
    walker.result.push({range: _.clone(minRange), value: value})
    if (!walker.current) return
    var range = walker.current.range
    if (minRange[1] >= range[0]) {
      if (minRange[1] < range[1]) {
        walker.current.range[0] = minRange[1] + 1
      } else {
        walker.next()
      }
    }
  }
  if (conflict) {
    walkers.forEach(takeOwnValue)
  } else {
    walkers.forEach(takeOtherValue)
  }
  return conflict
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
  var results = []
  var walkers = maps.map(function(each) { return new Walker(each) })
  var conflict = false
  while (anyNotAtEnd(walkers)) {
    var conflictInStep = walk(walkers)
    conflict = conflict || conflictInStep
  }
  console.log('++++', walkers[0].result, walkers[1].result)
  if (conflict) {
    return {conflict: true, result: walkers.map(function(each) { return mergeEqualNeighbours(each.result) })}
  } else {
    return {result: mergeEqualNeighbours(walkers[0].result)}
  }
}

module.exports = merge
