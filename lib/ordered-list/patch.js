
var _ = require('underscore')

var patch = function(before, diff) {
  var result = _.clone(before)
  var prefix = []
  var insertValues = function(index, values) {
    if (index == -1) {
      prefix = prefix.concat(values)
    } else {
      if (result[index].constructor != Array) result[index] = [result[index]]
      result[index] = result[index].concat(values)      
    }
  }

  if (diff.insert) diff.insert.forEach(function(each) {
    var index = each[0], inserts = each[1]
    inserts.forEach(function(insert) {
      insertValues(index, insert.values)     
    })
  })
  if (diff.delete) diff.delete.forEach(function(each) {
    if (result[each.index].constructor != Array) result[each.index] = [result[each.index]]
    result[each.index] = result[each.index].slice(1)
  })

  return prefix.concat(_.flatten(result))
}

module.exports = patch