
var _ = require('underscore')

var findMinimum = function(items, selectorFn) {
  var min = null
  var indexes = []
  items.forEach(function(each, i) {
    var value = selectorFn(each)
    if (!value) return
    if ((min === null) || (value <= min)) {
      if (value < min) indexes = []
      min = value
      indexes.push(i)
    }
  })
  return {value: min, indexes: indexes}
}

var compareArrays = function(array1, array2) {
  if (array1.length == 0) {
    return -1
  } else if (array2.length == 0) {
    return 1
  } else if ((array1.length == 0) && (array2.length == 0)) {
    return 0
  }
  var val1 = array1[0]
  var val2 = array2[0]
  if (val1 < val2) {
    return -1
  } else if (val1 > val2) {
    return 1
  } else {
    if (array1.length && array2.length) {
      return compareArrays(array1.slice(1), array2.slice(1))
    } else if (array2.length) {
      return -1
    } else if (array2.length) {
      return 1
    } else {
      return 0
    }
  }
}

var isSameArray = function(array1, array2) {
  return (_.difference(array1, array2).length == 0) && (_.difference(array2, array1).length == 0)
}

module.exports = {
  findMinimum: findMinimum,
  compareArrays: compareArrays,
  isSameArray: isSameArray
}
