
var _ = require('underscore')

var patch = function(collection, diff) {
  var deletes = []
  var inserts = []
  diff.diff.forEach(function(each) {
    each.insert != undefined ? inserts.push(each.insert) : deletes.push(each.delete)
  })
  return _.difference(collection, deletes).concat(inserts)
}

module.exports = patch