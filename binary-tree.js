(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BinaryNode = require('./binary_node.js');

var compareBasic = function( a, b ){
	// this is a basic comparison function that mimics numeric comparison (a - b)
	// if a is bigger than b, it returns true (1)
	// if a is equal to b, it also returns true (1)
	// if a is less than b, it returns false (0)
	return a >= b;
};

function BinaryTree( data, comparatorFunction, key ){
	this.root = null;
	this.size = 0;
  this.cursor = null;


	// the accessor function receives the data and returns the value to be used
	// as a sorting key.
	if( key === undefined ){
		this._get = function(n){ return n.data; };
	} else {
		this._get = function(n){
			return key(n.data);
		};
	}

	comparatorFunction = comparatorFunction || compareBasic;
	this._compare = function( n, m ){
		// there should only be two possible directions.
		// to go left we want less than, for right greater than / equal to
		var result = comparatorFunction( this._get(n), this._get(m) );
		// comparatorFunctions can return either numbers or truthy / falsey
		// they are fed in their data (default) or whatever is returned 
		// by the key
		if( !result || result < 0 ){
			return true; // go left
		} else {
			return false; // go right
		}
	};

	if( data ){
		this.insertMany( data );
	}
}

BinaryTree.prototype = {

	_dataOrNull: function( node ){
		if( node ){ 
			return node.data;
		} else { 
			return null; 
		}
	},

	_min: function( node ){
    this.cursor = node;
		while( node.left !== null ){
			node = node.left;
      this.cursor = node;
		}
		return node;
	},
	min: function(){
		return this._dataOrNull( this._min(this.root) );
	},

	_max: function( node ){
    this.cursor = node;
		while( node.right !== null ){
			node = node.right;
      this.cursor = node;
		}
		return node;
	},
	max: function(){
		return this._dataOrNull( this._max(this.root) );
	},

	removeKey: function( keyValue ){
		// remove an item from the tree
		var node = this._find( keyValue );
		// this function doesn't care if the value doesn't exist
		// similar to the behavior of Javascript's `delete` operator
		if( node ){
			this._delete( this._find( keyValue ) );
		}
	},

	_delete: function( node ){
		if( node.left === null ){
			this._transplant( node, node.right );
		} else if( node.right === null ){
			this._transplant( node, node.left );
		} else {
			var successor = this._min( node.right );
			if( successor.parent !== node ){
				this._transplant( successor, successor.right );
				successor.right = node.right;
				successor.right.parent = successor;
			}
			this._transplant( node, successor );
			successor.left = node.left;
			successor.left.parent = successor;
		}
		this.size--;
	},

	_transplant: function( outgoing, incoming ){
		// switch out one node for another.
		if( outgoing.parent === null ){
			this.root = incoming;
		} else if( outgoing == outgoing.parent.left ){
			outgoing.parent.left = incoming;
		} else {
			outgoing.parent.right = incoming;
		}
		if( incoming !== null ){
			incoming.parent = outgoing.parent;
		}
	},

	_walk: function( node ){
    this.cursor = node;
		if( node ){
			this._walk( node.left );
			this._nodelist.push( node.data );
			this._walk( node.right );
		}
	},

	walk: function(){
		if( !this.root ){
			return [];
		}
		this._nodelist = [];
		this._walk(this.root);
		var nodes = this._nodelist;
		delete this._nodelist;
		return nodes;
	},

	insert: function( item ){
		var node,
		    parent = null;
    this.cursor = this.root;
		node = new BinaryNode( this, item );

		while( this.cursor !== null ){
			parent = this.cursor;
			if( this._compare(node, parent) ){
				this.cursor = this.cursor.left;
			} else {
				this.cursor = this.cursor.right;
			}
		}
		node.parent = parent;
    this.cursor = node;
		if( parent === null ){
			this.root = node;
		} else if( this._compare(node, parent) ){
			parent.left = node;
		} else {
			parent.right = node;
		}
		this.size++;
		return this;
	},

	insertMany: function( items ){
		var me = this;
		items.forEach(function(item){
			me.insert(item);
		});
		return this;
	},

	_find: function( key ){
		var node = this.root;
    this.cursor = node;
		while( node !== null && key !== this._get(node) ){
			if( key < this._get(node) ){
				node = node.left;
        this.cursor = node;
			} else {
				node = node.right;
        this.cursor = node;
			}
		}
		return node;
	},
	findKey: function( keyValue ){
		return this._dataOrNull( this._find( keyValue ) );
	},

	_step: function( node, direction ){
    this.cursor = node;
		if( node[direction] !== null ){
			return this._min( node[direction] );
		} 
		var next = node.parent;
		while( next !== null && node == next[direction] ){
			node = next;
			next = next.parent;
		}
    this.cursor = next;
		return next;
	},

	next: function(){
		return this._dataOrNull(this._step( this.cursor, 'right' ));
	},

	prev: function( node ){
		return this._dataOrNull(this._step( this.cursor, 'left' ));
	}

};

module.exports = BinaryTree;

},{"./binary_node.js":2}],2:[function(require,module,exports){
function BinaryNode( tree, data ){
	this.tree = tree;
	this.data = data;
	this.parent = null;
	this.left = null;
	this.right = null;
}

BinaryNode.prototype.toString = function nodeToString(){
	return "BinaryTreeNode(key: " + this.tree._get(this) + ", data: " + this.data.toString() + ")";
};

module.exports = BinaryNode;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iZ29sZGVyL3Byb2plY3RzL2pzZ2lzL3RyZWUtYmluYXJ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9iaW5hcnlfdHJlZS5qcyIsIi9Vc2Vycy9iZ29sZGVyL3Byb2plY3RzL2pzZ2lzL3RyZWUtYmluYXJ5L3NyYy9iaW5hcnlfbm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmluYXJ5Tm9kZSA9IHJlcXVpcmUoJy4vYmluYXJ5X25vZGUuanMnKTtcblxudmFyIGNvbXBhcmVCYXNpYyA9IGZ1bmN0aW9uKCBhLCBiICl7XG5cdC8vIHRoaXMgaXMgYSBiYXNpYyBjb21wYXJpc29uIGZ1bmN0aW9uIHRoYXQgbWltaWNzIG51bWVyaWMgY29tcGFyaXNvbiAoYSAtIGIpXG5cdC8vIGlmIGEgaXMgYmlnZ2VyIHRoYW4gYiwgaXQgcmV0dXJucyB0cnVlICgxKVxuXHQvLyBpZiBhIGlzIGVxdWFsIHRvIGIsIGl0IGFsc28gcmV0dXJucyB0cnVlICgxKVxuXHQvLyBpZiBhIGlzIGxlc3MgdGhhbiBiLCBpdCByZXR1cm5zIGZhbHNlICgwKVxuXHRyZXR1cm4gYSA+PSBiO1xufTtcblxuZnVuY3Rpb24gQmluYXJ5VHJlZSggZGF0YSwgY29tcGFyYXRvckZ1bmN0aW9uLCBrZXkgKXtcblx0dGhpcy5yb290ID0gbnVsbDtcblx0dGhpcy5zaXplID0gMDtcbiAgdGhpcy5jdXJzb3IgPSBudWxsO1xuXG5cblx0Ly8gdGhlIGFjY2Vzc29yIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBkYXRhIGFuZCByZXR1cm5zIHRoZSB2YWx1ZSB0byBiZSB1c2VkXG5cdC8vIGFzIGEgc29ydGluZyBrZXkuXG5cdGlmKCBrZXkgPT09IHVuZGVmaW5lZCApe1xuXHRcdHRoaXMuX2dldCA9IGZ1bmN0aW9uKG4peyByZXR1cm4gbi5kYXRhOyB9O1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMuX2dldCA9IGZ1bmN0aW9uKG4pe1xuXHRcdFx0cmV0dXJuIGtleShuLmRhdGEpO1xuXHRcdH07XG5cdH1cblxuXHRjb21wYXJhdG9yRnVuY3Rpb24gPSBjb21wYXJhdG9yRnVuY3Rpb24gfHwgY29tcGFyZUJhc2ljO1xuXHR0aGlzLl9jb21wYXJlID0gZnVuY3Rpb24oIG4sIG0gKXtcblx0XHQvLyB0aGVyZSBzaG91bGQgb25seSBiZSB0d28gcG9zc2libGUgZGlyZWN0aW9ucy5cblx0XHQvLyB0byBnbyBsZWZ0IHdlIHdhbnQgbGVzcyB0aGFuLCBmb3IgcmlnaHQgZ3JlYXRlciB0aGFuIC8gZXF1YWwgdG9cblx0XHR2YXIgcmVzdWx0ID0gY29tcGFyYXRvckZ1bmN0aW9uKCB0aGlzLl9nZXQobiksIHRoaXMuX2dldChtKSApO1xuXHRcdC8vIGNvbXBhcmF0b3JGdW5jdGlvbnMgY2FuIHJldHVybiBlaXRoZXIgbnVtYmVycyBvciB0cnV0aHkgLyBmYWxzZXlcblx0XHQvLyB0aGV5IGFyZSBmZWQgaW4gdGhlaXIgZGF0YSAoZGVmYXVsdCkgb3Igd2hhdGV2ZXIgaXMgcmV0dXJuZWQgXG5cdFx0Ly8gYnkgdGhlIGtleVxuXHRcdGlmKCAhcmVzdWx0IHx8IHJlc3VsdCA8IDAgKXtcblx0XHRcdHJldHVybiB0cnVlOyAvLyBnbyBsZWZ0XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTsgLy8gZ28gcmlnaHRcblx0XHR9XG5cdH07XG5cblx0aWYoIGRhdGEgKXtcblx0XHR0aGlzLmluc2VydE1hbnkoIGRhdGEgKTtcblx0fVxufVxuXG5CaW5hcnlUcmVlLnByb3RvdHlwZSA9IHtcblxuXHRfZGF0YU9yTnVsbDogZnVuY3Rpb24oIG5vZGUgKXtcblx0XHRpZiggbm9kZSApeyBcblx0XHRcdHJldHVybiBub2RlLmRhdGE7XG5cdFx0fSBlbHNlIHsgXG5cdFx0XHRyZXR1cm4gbnVsbDsgXG5cdFx0fVxuXHR9LFxuXG5cdF9taW46IGZ1bmN0aW9uKCBub2RlICl7XG4gICAgdGhpcy5jdXJzb3IgPSBub2RlO1xuXHRcdHdoaWxlKCBub2RlLmxlZnQgIT09IG51bGwgKXtcblx0XHRcdG5vZGUgPSBub2RlLmxlZnQ7XG4gICAgICB0aGlzLmN1cnNvciA9IG5vZGU7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRtaW46IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGFPck51bGwoIHRoaXMuX21pbih0aGlzLnJvb3QpICk7XG5cdH0sXG5cblx0X21heDogZnVuY3Rpb24oIG5vZGUgKXtcbiAgICB0aGlzLmN1cnNvciA9IG5vZGU7XG5cdFx0d2hpbGUoIG5vZGUucmlnaHQgIT09IG51bGwgKXtcblx0XHRcdG5vZGUgPSBub2RlLnJpZ2h0O1xuICAgICAgdGhpcy5jdXJzb3IgPSBub2RlO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0bWF4OiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLl9kYXRhT3JOdWxsKCB0aGlzLl9tYXgodGhpcy5yb290KSApO1xuXHR9LFxuXG5cdHJlbW92ZUtleTogZnVuY3Rpb24oIGtleVZhbHVlICl7XG5cdFx0Ly8gcmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgdHJlZVxuXHRcdHZhciBub2RlID0gdGhpcy5fZmluZCgga2V5VmFsdWUgKTtcblx0XHQvLyB0aGlzIGZ1bmN0aW9uIGRvZXNuJ3QgY2FyZSBpZiB0aGUgdmFsdWUgZG9lc24ndCBleGlzdFxuXHRcdC8vIHNpbWlsYXIgdG8gdGhlIGJlaGF2aW9yIG9mIEphdmFzY3JpcHQncyBgZGVsZXRlYCBvcGVyYXRvclxuXHRcdGlmKCBub2RlICl7XG5cdFx0XHR0aGlzLl9kZWxldGUoIHRoaXMuX2ZpbmQoIGtleVZhbHVlICkgKTtcblx0XHR9XG5cdH0sXG5cblx0X2RlbGV0ZTogZnVuY3Rpb24oIG5vZGUgKXtcblx0XHRpZiggbm9kZS5sZWZ0ID09PSBudWxsICl7XG5cdFx0XHR0aGlzLl90cmFuc3BsYW50KCBub2RlLCBub2RlLnJpZ2h0ICk7XG5cdFx0fSBlbHNlIGlmKCBub2RlLnJpZ2h0ID09PSBudWxsICl7XG5cdFx0XHR0aGlzLl90cmFuc3BsYW50KCBub2RlLCBub2RlLmxlZnQgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHN1Y2Nlc3NvciA9IHRoaXMuX21pbiggbm9kZS5yaWdodCApO1xuXHRcdFx0aWYoIHN1Y2Nlc3Nvci5wYXJlbnQgIT09IG5vZGUgKXtcblx0XHRcdFx0dGhpcy5fdHJhbnNwbGFudCggc3VjY2Vzc29yLCBzdWNjZXNzb3IucmlnaHQgKTtcblx0XHRcdFx0c3VjY2Vzc29yLnJpZ2h0ID0gbm9kZS5yaWdodDtcblx0XHRcdFx0c3VjY2Vzc29yLnJpZ2h0LnBhcmVudCA9IHN1Y2Nlc3Nvcjtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RyYW5zcGxhbnQoIG5vZGUsIHN1Y2Nlc3NvciApO1xuXHRcdFx0c3VjY2Vzc29yLmxlZnQgPSBub2RlLmxlZnQ7XG5cdFx0XHRzdWNjZXNzb3IubGVmdC5wYXJlbnQgPSBzdWNjZXNzb3I7XG5cdFx0fVxuXHRcdHRoaXMuc2l6ZS0tO1xuXHR9LFxuXG5cdF90cmFuc3BsYW50OiBmdW5jdGlvbiggb3V0Z29pbmcsIGluY29taW5nICl7XG5cdFx0Ly8gc3dpdGNoIG91dCBvbmUgbm9kZSBmb3IgYW5vdGhlci5cblx0XHRpZiggb3V0Z29pbmcucGFyZW50ID09PSBudWxsICl7XG5cdFx0XHR0aGlzLnJvb3QgPSBpbmNvbWluZztcblx0XHR9IGVsc2UgaWYoIG91dGdvaW5nID09IG91dGdvaW5nLnBhcmVudC5sZWZ0ICl7XG5cdFx0XHRvdXRnb2luZy5wYXJlbnQubGVmdCA9IGluY29taW5nO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvdXRnb2luZy5wYXJlbnQucmlnaHQgPSBpbmNvbWluZztcblx0XHR9XG5cdFx0aWYoIGluY29taW5nICE9PSBudWxsICl7XG5cdFx0XHRpbmNvbWluZy5wYXJlbnQgPSBvdXRnb2luZy5wYXJlbnQ7XG5cdFx0fVxuXHR9LFxuXG5cdF93YWxrOiBmdW5jdGlvbiggbm9kZSApe1xuICAgIHRoaXMuY3Vyc29yID0gbm9kZTtcblx0XHRpZiggbm9kZSApe1xuXHRcdFx0dGhpcy5fd2Fsayggbm9kZS5sZWZ0ICk7XG5cdFx0XHR0aGlzLl9ub2RlbGlzdC5wdXNoKCBub2RlLmRhdGEgKTtcblx0XHRcdHRoaXMuX3dhbGsoIG5vZGUucmlnaHQgKTtcblx0XHR9XG5cdH0sXG5cblx0d2FsazogZnVuY3Rpb24oKXtcblx0XHRpZiggIXRoaXMucm9vdCApe1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblx0XHR0aGlzLl9ub2RlbGlzdCA9IFtdO1xuXHRcdHRoaXMuX3dhbGsodGhpcy5yb290KTtcblx0XHR2YXIgbm9kZXMgPSB0aGlzLl9ub2RlbGlzdDtcblx0XHRkZWxldGUgdGhpcy5fbm9kZWxpc3Q7XG5cdFx0cmV0dXJuIG5vZGVzO1xuXHR9LFxuXG5cdGluc2VydDogZnVuY3Rpb24oIGl0ZW0gKXtcblx0XHR2YXIgbm9kZSxcblx0XHQgICAgcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMucm9vdDtcblx0XHRub2RlID0gbmV3IEJpbmFyeU5vZGUoIHRoaXMsIGl0ZW0gKTtcblxuXHRcdHdoaWxlKCB0aGlzLmN1cnNvciAhPT0gbnVsbCApe1xuXHRcdFx0cGFyZW50ID0gdGhpcy5jdXJzb3I7XG5cdFx0XHRpZiggdGhpcy5fY29tcGFyZShub2RlLCBwYXJlbnQpICl7XG5cdFx0XHRcdHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3IubGVmdDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3IucmlnaHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5vZGUucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY3Vyc29yID0gbm9kZTtcblx0XHRpZiggcGFyZW50ID09PSBudWxsICl7XG5cdFx0XHR0aGlzLnJvb3QgPSBub2RlO1xuXHRcdH0gZWxzZSBpZiggdGhpcy5fY29tcGFyZShub2RlLCBwYXJlbnQpICl7XG5cdFx0XHRwYXJlbnQubGVmdCA9IG5vZGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmVudC5yaWdodCA9IG5vZGU7XG5cdFx0fVxuXHRcdHRoaXMuc2l6ZSsrO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGluc2VydE1hbnk6IGZ1bmN0aW9uKCBpdGVtcyApe1xuXHRcdHZhciBtZSA9IHRoaXM7XG5cdFx0aXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdG1lLmluc2VydChpdGVtKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRfZmluZDogZnVuY3Rpb24oIGtleSApe1xuXHRcdHZhciBub2RlID0gdGhpcy5yb290O1xuICAgIHRoaXMuY3Vyc29yID0gbm9kZTtcblx0XHR3aGlsZSggbm9kZSAhPT0gbnVsbCAmJiBrZXkgIT09IHRoaXMuX2dldChub2RlKSApe1xuXHRcdFx0aWYoIGtleSA8IHRoaXMuX2dldChub2RlKSApe1xuXHRcdFx0XHRub2RlID0gbm9kZS5sZWZ0O1xuICAgICAgICB0aGlzLmN1cnNvciA9IG5vZGU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlID0gbm9kZS5yaWdodDtcbiAgICAgICAgdGhpcy5jdXJzb3IgPSBub2RlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0ZmluZEtleTogZnVuY3Rpb24oIGtleVZhbHVlICl7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGFPck51bGwoIHRoaXMuX2ZpbmQoIGtleVZhbHVlICkgKTtcblx0fSxcblxuXHRfc3RlcDogZnVuY3Rpb24oIG5vZGUsIGRpcmVjdGlvbiApe1xuICAgIHRoaXMuY3Vyc29yID0gbm9kZTtcblx0XHRpZiggbm9kZVtkaXJlY3Rpb25dICE9PSBudWxsICl7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbWluKCBub2RlW2RpcmVjdGlvbl0gKTtcblx0XHR9IFxuXHRcdHZhciBuZXh0ID0gbm9kZS5wYXJlbnQ7XG5cdFx0d2hpbGUoIG5leHQgIT09IG51bGwgJiYgbm9kZSA9PSBuZXh0W2RpcmVjdGlvbl0gKXtcblx0XHRcdG5vZGUgPSBuZXh0O1xuXHRcdFx0bmV4dCA9IG5leHQucGFyZW50O1xuXHRcdH1cbiAgICB0aGlzLmN1cnNvciA9IG5leHQ7XG5cdFx0cmV0dXJuIG5leHQ7XG5cdH0sXG5cblx0bmV4dDogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5fZGF0YU9yTnVsbCh0aGlzLl9zdGVwKCB0aGlzLmN1cnNvciwgJ3JpZ2h0JyApKTtcblx0fSxcblxuXHRwcmV2OiBmdW5jdGlvbiggbm9kZSApe1xuXHRcdHJldHVybiB0aGlzLl9kYXRhT3JOdWxsKHRoaXMuX3N0ZXAoIHRoaXMuY3Vyc29yLCAnbGVmdCcgKSk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCaW5hcnlUcmVlO1xuIiwiZnVuY3Rpb24gQmluYXJ5Tm9kZSggdHJlZSwgZGF0YSApe1xuXHR0aGlzLnRyZWUgPSB0cmVlO1xuXHR0aGlzLmRhdGEgPSBkYXRhO1xuXHR0aGlzLnBhcmVudCA9IG51bGw7XG5cdHRoaXMubGVmdCA9IG51bGw7XG5cdHRoaXMucmlnaHQgPSBudWxsO1xufVxuXG5CaW5hcnlOb2RlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIG5vZGVUb1N0cmluZygpe1xuXHRyZXR1cm4gXCJCaW5hcnlUcmVlTm9kZShrZXk6IFwiICsgdGhpcy50cmVlLl9nZXQodGhpcykgKyBcIiwgZGF0YTogXCIgKyB0aGlzLmRhdGEudG9TdHJpbmcoKSArIFwiKVwiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCaW5hcnlOb2RlO1xuIl19
