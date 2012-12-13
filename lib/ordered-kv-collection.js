
var arrayDiff = require('./ordered-collection')({unique:true})

var keyMap = function(array) {
  var map = {}
  array.forEach(function(each) {
    map[each.key] = each.value
  })
  return map
}

var keys = function(keyValueArray) {
  return keyValueArray.map(function(each) {return each.key})
}

var diff = function(before, after) {
  var valueDiff = {}
  var afterMap = keyMap(after)
  before.forEach(function(each) {
    var afterValue = afterMap[each.key]
    if(afterValue === undefined) return valueDiff[each.key] = ['-', each.value]
    if(each.value != afterValue) {
      valueDiff[each.key] = ['m', each.value, afterValue]
    } else {
      valueDiff[each.key] = ['=', each.value]
    }
  })
  var keyDiff = arrayDiff(keys(before), keys(after))
  keyDiff.forEach(function(each) {
    if(each[0] == '+') valueDiff[each[1]] = ['+', afterMap[each[1]]]
  })
  return {values: valueDiff, keys: keyDiff}
}

module.exports = diff