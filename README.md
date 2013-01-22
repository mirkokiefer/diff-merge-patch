#difftools
Diff, merge and patch sets, ordered lists, ordered sets and dictionaries in JavaScript:

- diff(before, after) - returns you all changes in 'after' since 'before'
- merge(diffs) - 3-way merging of multiple diffs on the same base object
- patch(before, diff) - patches an object using a (merged) diff

##Design goals
- **its all just diffs**: merge should only need diffs as input and returns itself a new diff
- **no magic**: make any merge conflicts explicit to cater for different conflict resolution mechanisms
- **be commutative**: the order of diffs in a merge should not matter
- **be recursive**: implement diff, patch and merge for basic data structures and use them to support complex data structures

##Supported Data Structures
###Sets
Sets are represented as JavasScript Arrays:

``` js
var before = [1, 2, 3, 4]
var after1 = [1, 2, 4, 5, 6]
var after2 = [1, 2, 3, 4, 5, 7]
```

####diff
Set diff returns you all inserted and deleted elements:

``` js
var diff = require('diff-patch-merge').set.diff

var diff1 = diff(before, after1)
// returns:
{diff: [{delete: 3}, {insert: 5}, {insert: 6}]}

var diff2 = diff(before, after2)
// returns:
{diff: [{insert: 5}, {insert: 7}]}

```

####merge
You can merge multiple diffs that are based on the same old object.  
It combines all diffs into a new diff annotating each change with the source diff:


``` js
var merge = require('diff-patch-merge').set.merge

var mergedDiff = merge([diff1, diff2])
// returns:
{
  diff: [
    {delete: 3, source: [0]},
    {insert: 5, source: [0, 1]},
    {insert: 6, source: [0]},
    {insert: 7, source: [1]}
  ]
}
```

####patch
You can apply diffs as patches to an old set (results of merge() are diffs too):

``` js
var patch = require('diff-patch-merge').set.patch

var patched = patch(old, mergedDiff)
// returns:
[1, 2, 4, 5, 6, 7]
```

###Ordered Lists
If you want the order of elements considered when doing a diff/merge/patch, ordered lists are the solution for you!

Just like sets they are represented as JavaScript arrays:

``` js
var before = [1, 2, 3, 4]
var after1 = [1, 2, 4, 5, 7]
var after2 = [6, 1, 2, 3, 4, 7]
```

####diff

``` js
var diff = require('diff-merge-patch').orderedList.diff

var diff1 = diff(before, after1)
// returns:
{
  insert: [
    [3, [{values: [5, 7]}]],
  ],
  delete: [{index: 2}]
}
```

####merge

Merging ordered list diffs never results in conflicts.

``` js
var merge = require('diff-merge-patch').orderedList.merge

var mergedDiff = merge([diff1, diff2])
// returns:
{
  insert: [
    [-1, [{values: [6], source: 1}]],
    [3, [{values: [5, 7], source: 0}, {values: [7], source: 1}]]
  ],
  delete: [{index: 2, source: [0]}]
}
```

####patch

``` js
var patch = require('diff-merge-patch').orderedSet.patch

var patched = patch(before, resolvedDiff)
// returns:
[6, 1, 2, 4, 5, 7, 7]
```

###Ordered Sets
Ordered Sets are similar to Ordered Lists except that all elements are globally unique.  
This allows diff/merge/patch to consider position changes of elements. In ordered list diffs there is not notion of movement, they can only be seen as a delete and insert of the same element.

Ordered Sets are represented as JavaScript arrays:

``` js
var before = [1, 2, 3, 4, 5],
var after1 = [2, 6, 1, 5, 4, 3]
var after2 = [2, 4, 1, 7, 3, 5]
```

####diff

``` js
var diff = require('diff-merge-patch').orderedSet.diff

var diff1 = diff(before, after1)
// returns:
{
  diff: [
    [3, [{insert: 6}, {move: 0}]],
    [4, [{move: 3}, {move: 2}]]
  ]
}

var diff2 = diff(before, after2)
// returns:
{
  diff: [
    [3, [{move: 0}, {insert: 7}, {move: 2}]]
  ]
}
```

####merge
Merging of Ordered List diffs can lead to conflicts:

``` js
var merge = require('diff-merge-patch').orderedSet.merge

// Note: orderedSet.merge() currently only accepts two diffs as input
var mergedDiff = merge([diff1, diff2])
// returns:
{
  diff: [
    [3, [{insert: 6, source: [0]}, {move: 0, source: [0, 1]}, {insert: 7, source: [1]}, {move: 2, conflict: 1, source: [1]}]],
    [4, [{move: 3, source: [0]}, {move: 2, conflict: 1, source: [0]}]]
  ],
  conflict: 1
}
```

Each corresponding conflict receives the same conflict-ID.  
To use a diff including conflicts to patch the old ordered set you first have to resolve them.  
The library comes with a simple conflict resolution strategy which you can invoke like this:

``` js
var resolvedDiff = mergedDiff.resolveConflicts()
// returns:
{
  diff: [
    [3, [{insert: 6, source: [0]}, {move: 0, source: [0, 1]}, {insert: 7, source: [1]}]],
    [4, [{move: 3, source: [0]}, {move: 2, source: [0]}]]
  ]
}
```
The algorithm simply picks the conflicting update that comes from the first diff (source: [0]).  
Depending on your application you may want to implement different resolution strategies.

####patch
Diffs can be used to patch the original ordered list:

``` js
var patch = require('diff-merge-patch').orderedSet.patch

var patched = patch(before, resolvedDiff)
// returns:
[2, 6, 1, 7, 5, 4, 3]
```

###Dictionaries

The same set of functions is implemented for dictionaries.  
They are represented as JavaScript Objects:

``` js
var dictionary = require('diff-merge-patch').dictionary

var before = {1: 1, 2: 2, 3: 3, 4: 4}
var after1 = {5: 6, 3: 8, 2: 2, 4: 4, 1: 5}
var after2 = {2: 2, 1: 9, 4: 5}

var diff1 = dictionary.diff(before, after1)
var diff2 = dictionary.diff(before, after2)

var diffsMerged = dictionary.merge([diff1, diff2])
// resolve all conflicts:
diffsMerged = diffsMerged.resolveConflicts()

var result = patch(before, diffsMerged)
```

##Todo
- Trees (Ordered/Unordered) - can be built using the core data structures
- Tuple set (for tabular data e.g. from a relational database)


##Contributors
This project was created by Mirko Kiefer ([@mirkok](https://github.com/mirkok)).


