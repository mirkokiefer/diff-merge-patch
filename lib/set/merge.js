
var _ = require('underscore')

function Result(diff) {
  this.diff = diff
}

var merge = function(diffs) {
  diffs = diffs.map(function(each) { return _.clone(each.diff) })
  var result = []

  while (_.any(diffs, function(diff) { return diff.length })) {
    var diffsWithUpdates = diffs.filter(function(each) { return each.length })
    var modifier
    var smallestValue = null
    diffsWithUpdates.forEach(function(diff) {
      ['insert', 'delete'].forEach(function(eachModifier) {
        if (diff[0][eachModifier] != undefined) {
          if ((smallestValue == null) || (diff[0][eachModifier] < smallestValue)) {
            smallestValue = diff[0][eachModifier]
            modifier = eachModifier
          }
        }
      })
    })

    var sources = []
    diffs.forEach(function(diff, i) {
      if (diff.length && (diff[0][modifier] == smallestValue)) {
        sources.push(i)
        diff.shift()
      }
    })
    
    var update = {source: sources}
    update[modifier] = smallestValue
    result.push(update)
  }
  
  return new Result(result)
}

module.exports = merge