
var kvCollectionDiff = require('./kv-collection')
var orderedCollectionDiff = require('./ordered-collection')({unique:true})

var keys = function(keyValueArray) {
  return keyValueArray.map(function(each) {return each.key})
}

var diff = function(before, after) {
  return {
    values: kvCollectionDiff(before, after),
    keys: orderedCollectionDiff(keys(before), keys(after))
  }
}

module.exports = diff