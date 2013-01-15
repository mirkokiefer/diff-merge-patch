
var _ = require('underscore')

var patch = function(before, diff) {
  var result = _.clone(before)
  var prefix = []
  var insertValues = function(index) { return function(update) {
    if (index == -1) {
      prefix = prefix.concat(update.values)
    } else {
      if (result[index].constructor != Array) result[index] = [result[index]]
      result[index] = result[index].concat(update.values)      
    }
  }}

  if (diff.insert) diff.insert.forEach(function(each) {
    each[1].forEach(insertValues(each[0]))
  })

  if (diff.delete) diff.delete.forEach(function(each) {
    if (result[each.index].constructor != Array) result[each.index] = [result[each.index]]
    result[each.index] = result[each.index].slice(1)
  })

  return prefix.concat(_.flatten(result))
}

module.exports = patch