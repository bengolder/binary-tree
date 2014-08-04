# binary-tree

[![Build Status](https://travis-ci.org/bengolder/binary-tree.svg?branch=master)](https://travis-ci.org/bengolder/binary-tree) [![Coverage Status](https://coveralls.io/repos/bengolder/binary-tree/badge.png?branch=master)](https://coveralls.io/r/bengolder/binary-tree?branch=master)

A Binary Tree object implemented in JavaScript.

This is currently not a public package. I'm using this as a personal project
to learn more about algorithms and JavaScript unit testing. 

If you'd like to use a public npm package containing Binary Trees and Red Black
trees, you can see [someone else's existing project here](https://github.com/vadimg/js_bintrees).

If you're interested, please feel free to fork this or drop me a line.

---

### Installation

1. Clone the repo.

        git clone git@github.com:bengolder/js-btree

2. Install development dependencies.

        cd js-btree
        npm install

3. run `gulp`

        gulp # runs tests, creates bundled file

---

### API

To create a new binary tree, import using `browserify` or node.js `require()`

    var BinaryTree = require('btree.js');
    var tree = new BinaryTree();

A new BinaryTree can take several optional arguments:

    var tree = BinaryTree( data, comparatorFunction, key );

#### `data`

`data` is assumed to be an array-like collection of items to add to the tree.
`data` must support the `.forEach()` method.

    if( data ){
        this.insertMany( data );
    }

#### `comparatorFunction`

The `comparatorFunction` is a function used to compare the data held in two nodes of the
tree. This function determines where to insert new items in the tree. In a
binary tree, one value must be placed to the left or right of another. In a
simple case, where the `comparatorFunction` is

    function compare( a, b ){
        return a - b;
    }

and `a` and `b` are numbers, there are only two possible outcomes to the
comparison: `a` goes to the left of `b` (if `a` is less than `b`) or `a` 
goes to the right of `b` (if `a` is greater than or equal to `b`).

With no input, the default `comparatorFunction` is

    function( a, b ){
        return a >= b;
    }

which works to compare either numbers or strings.

For `a` to go on the left `b`, your `comparatorFunction` should return one of two possible
values:

* a number less than 0
* a "falsey" value.

For `a` to go on the right of `b`, it should return:

* a number equal to or greater than 0
* a "truthy" value

#### `key`

The `key` is used to extract the value passed to the
`comparatorFunction`. For example, if we were sorting objects based on a
`title` attribute contained in each, we would create a `comparatorFunction`
like this:

    function key( n ){
        return n.name;
    }

If no `key` is given, the default is to assume that the items
added to the tree can be passed directly to the `comparatorFunction` for
sorting.

#### `.insert( item )`

Adds a new item to the tree.

#### `.insertMany( items )`

Adds an array of items to the tree.

#### `.min()`

Returns the leftmost item in the tree.

#### `.max()`

Returns the rightmost item in the tree.

#### `.walk()`

Returns an array containing all the items in the tree, in sorted order from
left to right.

#### `.find( keyValue )`

Searches the tree for the item with a key matching the input `keyValue`
argument. Returns the item found or `null` if the item is not found.

