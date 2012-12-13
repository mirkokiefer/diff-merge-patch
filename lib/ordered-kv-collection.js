
var arrayDiff = require('./ordered-collection')({unique:true})

var idMap = function(array) {
  var map = {}
  array.forEach(function(each) {
    map[each.id] = each.value
  })
  return map
}

var ids = function(idValueArray) {
  return idValueArray.map(function(each) {return each.id})
}

var diff = function(before, after) {
  var valueDiff = {}
  var afterMap = idMap(after)
  before.forEach(function(each) {
    var afterValue = afterMap[each.id]
    if(afterValue === undefined) return valueDiff[each.id] = ['-', each.value]
    if(each.value != afterValue) {
      valueDiff[each.id] = ['m', each.value, afterValue]
    } else {
      valueDiff[each.id] = ['=', each.value]
    }
  })
  var idDiff = arrayDiff(ids(before), ids(after))
  idDiff.forEach(function(each) {
    if(each[0] == '+') valueDiff[each[1]] = ['+', afterMap[each[1]]]
  })
  return {values: valueDiff, ids: idDiff}
}

module.exports = diff