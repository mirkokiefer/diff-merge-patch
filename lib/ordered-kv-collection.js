
var kvCollectionDiff = require('./kv-collection')
var orderedCollectionDiff = require('./ordered-collection')({unique:true})
var _ = require('underscore')

var diff = function(before, after) {
  return {
    values: kvCollectionDiff(before, after),
    keys: orderedCollectionDiff(_.pluck(before, 'key'), _.pluck(after, 'key'))
  }
}

module.exports = diff