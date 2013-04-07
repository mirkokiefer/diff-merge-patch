
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
  var deleteIndex = function(index) {
    if (result[index].constructor != Array) result[index] = [result[index]]
    result[index] = result[index].slice(1)
  }

  diff.forEach(function(each) {
    if (each.op == '+') {
      insertValues(each.indexBefore, each.values)
    } else if (each.op == '-') {
      _.times(each.length, function(i) { deleteIndex(each.indexBefore + i + 1) })
    }
  })

  return prefix.concat(_.flatten(result))
}

module.exports = patch