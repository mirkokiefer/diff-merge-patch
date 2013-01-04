
var _ = require('underscore')

var patch = function(before, diff) {
  var result = _.clone(before)
  
  if (diff.delete) diff.delete.forEach(function(each) {
    _.times(each[1], function(i) {
      result[each[0]+i] = []
    })
  })
  var before = []

  if (diff.move) diff.move.forEach(function(each) {
    var to = each[0], from = each[1][0], length = each[1][1]
    if (to == -1) {
      before = before.concat(result.slice(from, from+length))
    } else {
      if (result[to].constructor != Array) result[to] = [result[to]]
      result[to] = result[to].concat(result.slice(from, from+length))
    }
    _.times(length, function(i) {
      if (result[from+i].constructor == Array) {
        result[from+i] = result[from+i].splice(0, 1)
      } else {
        result[from+i] = []
      }
    })
  })

  if (diff.insert) diff.insert.forEach(function(each) {
    if (each[0] == -1) {
      before = before.concat(each[1])
    } else {
      if (result[each[0]].constructor != Array) result[each[0]] = [result[each[0]]]
      result[each[0]] = result[each[0]].concat(each[1])      
    }
  })

  return _.flatten(before.concat(result))
}

module.exports = patch