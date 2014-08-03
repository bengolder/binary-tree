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
		while( node.left !== null ){
			node = node.left;
		}
		return node;
	},
	min: function(){
		return this._dataOrNull( this._min(this.root) );
	},

	_max: function( node ){
		while( node.right !== null ){
			node = node.right;
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
		    parent = null,
		    cursor = this.root;
		node = new BinaryNode( this, item );

		while( cursor !== null ){
			parent = cursor;
			if( this._compare(node, parent) ){
				cursor = cursor.left;
			} else {
				cursor = cursor.right;
			}
		}
		node.parent = parent;
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
		while( node !== null && key !== this._get(node) ){
			if( key < this._get(node) ){
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return node;
	},
	findKey: function( keyValue ){
		return this._dataOrNull( this._find( keyValue ) );
	},

	_step: function( node, direction ){
		if( node[direction] !== null ){
			return this._min( node[direction] );
		} 
		var next = node.parent;
		while( next !== null && node == next[direction] ){
			node = next;
			next = next.parent;
		}
		return next;
	},

	next: function( node ){
		return this._step( node, 'right' );
	},

	prev: function( node ){
		return this._step( node, 'left' );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iZ29sZGVyL3Byb2plY3RzL2pzZ2lzL2J0cmVlL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9iaW5hcnlfdHJlZS5qcyIsIi9Vc2Vycy9iZ29sZGVyL3Byb2plY3RzL2pzZ2lzL2J0cmVlL3NyYy9iaW5hcnlfbm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmluYXJ5Tm9kZSA9IHJlcXVpcmUoJy4vYmluYXJ5X25vZGUuanMnKTtcblxudmFyIGNvbXBhcmVCYXNpYyA9IGZ1bmN0aW9uKCBhLCBiICl7XG5cdC8vIHRoaXMgaXMgYSBiYXNpYyBjb21wYXJpc29uIGZ1bmN0aW9uIHRoYXQgbWltaWNzIG51bWVyaWMgY29tcGFyaXNvbiAoYSAtIGIpXG5cdC8vIGlmIGEgaXMgYmlnZ2VyIHRoYW4gYiwgaXQgcmV0dXJucyB0cnVlICgxKVxuXHQvLyBpZiBhIGlzIGVxdWFsIHRvIGIsIGl0IGFsc28gcmV0dXJucyB0cnVlICgxKVxuXHQvLyBpZiBhIGlzIGxlc3MgdGhhbiBiLCBpdCByZXR1cm5zIGZhbHNlICgwKVxuXHRyZXR1cm4gYSA+PSBiO1xufTtcblxuZnVuY3Rpb24gQmluYXJ5VHJlZSggZGF0YSwgY29tcGFyYXRvckZ1bmN0aW9uLCBrZXkgKXtcblx0dGhpcy5yb290ID0gbnVsbDtcblx0dGhpcy5zaXplID0gMDtcblxuXG5cdC8vIHRoZSBhY2Nlc3NvciBmdW5jdGlvbiByZWNlaXZlcyB0aGUgZGF0YSBhbmQgcmV0dXJucyB0aGUgdmFsdWUgdG8gYmUgdXNlZFxuXHQvLyBhcyBhIHNvcnRpbmcga2V5LlxuXHRpZigga2V5ID09PSB1bmRlZmluZWQgKXtcblx0XHR0aGlzLl9nZXQgPSBmdW5jdGlvbihuKXsgcmV0dXJuIG4uZGF0YTsgfTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLl9nZXQgPSBmdW5jdGlvbihuKXtcblx0XHRcdHJldHVybiBrZXkobi5kYXRhKTtcblx0XHR9O1xuXHR9XG5cblx0Y29tcGFyYXRvckZ1bmN0aW9uID0gY29tcGFyYXRvckZ1bmN0aW9uIHx8IGNvbXBhcmVCYXNpYztcblx0dGhpcy5fY29tcGFyZSA9IGZ1bmN0aW9uKCBuLCBtICl7XG5cdFx0Ly8gdGhlcmUgc2hvdWxkIG9ubHkgYmUgdHdvIHBvc3NpYmxlIGRpcmVjdGlvbnMuXG5cdFx0Ly8gdG8gZ28gbGVmdCB3ZSB3YW50IGxlc3MgdGhhbiwgZm9yIHJpZ2h0IGdyZWF0ZXIgdGhhbiAvIGVxdWFsIHRvXG5cdFx0dmFyIHJlc3VsdCA9IGNvbXBhcmF0b3JGdW5jdGlvbiggdGhpcy5fZ2V0KG4pLCB0aGlzLl9nZXQobSkgKTtcblx0XHQvLyBjb21wYXJhdG9yRnVuY3Rpb25zIGNhbiByZXR1cm4gZWl0aGVyIG51bWJlcnMgb3IgdHJ1dGh5IC8gZmFsc2V5XG5cdFx0Ly8gdGhleSBhcmUgZmVkIGluIHRoZWlyIGRhdGEgKGRlZmF1bHQpIG9yIHdoYXRldmVyIGlzIHJldHVybmVkIFxuXHRcdC8vIGJ5IHRoZSBrZXlcblx0XHRpZiggIXJlc3VsdCB8fCByZXN1bHQgPCAwICl7XG5cdFx0XHRyZXR1cm4gdHJ1ZTsgLy8gZ28gbGVmdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7IC8vIGdvIHJpZ2h0XG5cdFx0fVxuXHR9O1xuXG5cdGlmKCBkYXRhICl7XG5cdFx0dGhpcy5pbnNlcnRNYW55KCBkYXRhICk7XG5cdH1cbn1cblxuQmluYXJ5VHJlZS5wcm90b3R5cGUgPSB7XG5cblx0X2RhdGFPck51bGw6IGZ1bmN0aW9uKCBub2RlICl7XG5cdFx0aWYoIG5vZGUgKXsgXG5cdFx0XHRyZXR1cm4gbm9kZS5kYXRhO1xuXHRcdH0gZWxzZSB7IFxuXHRcdFx0cmV0dXJuIG51bGw7IFxuXHRcdH1cblx0fSxcblxuXHRfbWluOiBmdW5jdGlvbiggbm9kZSApe1xuXHRcdHdoaWxlKCBub2RlLmxlZnQgIT09IG51bGwgKXtcblx0XHRcdG5vZGUgPSBub2RlLmxlZnQ7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRtaW46IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGFPck51bGwoIHRoaXMuX21pbih0aGlzLnJvb3QpICk7XG5cdH0sXG5cblx0X21heDogZnVuY3Rpb24oIG5vZGUgKXtcblx0XHR3aGlsZSggbm9kZS5yaWdodCAhPT0gbnVsbCApe1xuXHRcdFx0bm9kZSA9IG5vZGUucmlnaHQ7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRtYXg6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGFPck51bGwoIHRoaXMuX21heCh0aGlzLnJvb3QpICk7XG5cdH0sXG5cblx0cmVtb3ZlS2V5OiBmdW5jdGlvbigga2V5VmFsdWUgKXtcblx0XHQvLyByZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSB0cmVlXG5cdFx0dmFyIG5vZGUgPSB0aGlzLl9maW5kKCBrZXlWYWx1ZSApO1xuXHRcdC8vIHRoaXMgZnVuY3Rpb24gZG9lc24ndCBjYXJlIGlmIHRoZSB2YWx1ZSBkb2Vzbid0IGV4aXN0XG5cdFx0Ly8gc2ltaWxhciB0byB0aGUgYmVoYXZpb3Igb2YgSmF2YXNjcmlwdCdzIGBkZWxldGVgIG9wZXJhdG9yXG5cdFx0aWYoIG5vZGUgKXtcblx0XHRcdHRoaXMuX2RlbGV0ZSggdGhpcy5fZmluZCgga2V5VmFsdWUgKSApO1xuXHRcdH1cblx0fSxcblxuXHRfZGVsZXRlOiBmdW5jdGlvbiggbm9kZSApe1xuXHRcdGlmKCBub2RlLmxlZnQgPT09IG51bGwgKXtcblx0XHRcdHRoaXMuX3RyYW5zcGxhbnQoIG5vZGUsIG5vZGUucmlnaHQgKTtcblx0XHR9IGVsc2UgaWYoIG5vZGUucmlnaHQgPT09IG51bGwgKXtcblx0XHRcdHRoaXMuX3RyYW5zcGxhbnQoIG5vZGUsIG5vZGUubGVmdCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgc3VjY2Vzc29yID0gdGhpcy5fbWluKCBub2RlLnJpZ2h0ICk7XG5cdFx0XHRpZiggc3VjY2Vzc29yLnBhcmVudCAhPT0gbm9kZSApe1xuXHRcdFx0XHR0aGlzLl90cmFuc3BsYW50KCBzdWNjZXNzb3IsIHN1Y2Nlc3Nvci5yaWdodCApO1xuXHRcdFx0XHRzdWNjZXNzb3IucmlnaHQgPSBub2RlLnJpZ2h0O1xuXHRcdFx0XHRzdWNjZXNzb3IucmlnaHQucGFyZW50ID0gc3VjY2Vzc29yO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fdHJhbnNwbGFudCggbm9kZSwgc3VjY2Vzc29yICk7XG5cdFx0XHRzdWNjZXNzb3IubGVmdCA9IG5vZGUubGVmdDtcblx0XHRcdHN1Y2Nlc3Nvci5sZWZ0LnBhcmVudCA9IHN1Y2Nlc3Nvcjtcblx0XHR9XG5cdFx0dGhpcy5zaXplLS07XG5cdH0sXG5cblx0X3RyYW5zcGxhbnQ6IGZ1bmN0aW9uKCBvdXRnb2luZywgaW5jb21pbmcgKXtcblx0XHQvLyBzd2l0Y2ggb3V0IG9uZSBub2RlIGZvciBhbm90aGVyLlxuXHRcdGlmKCBvdXRnb2luZy5wYXJlbnQgPT09IG51bGwgKXtcblx0XHRcdHRoaXMucm9vdCA9IGluY29taW5nO1xuXHRcdH0gZWxzZSBpZiggb3V0Z29pbmcgPT0gb3V0Z29pbmcucGFyZW50LmxlZnQgKXtcblx0XHRcdG91dGdvaW5nLnBhcmVudC5sZWZ0ID0gaW5jb21pbmc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dGdvaW5nLnBhcmVudC5yaWdodCA9IGluY29taW5nO1xuXHRcdH1cblx0XHRpZiggaW5jb21pbmcgIT09IG51bGwgKXtcblx0XHRcdGluY29taW5nLnBhcmVudCA9IG91dGdvaW5nLnBhcmVudDtcblx0XHR9XG5cdH0sXG5cblx0X3dhbGs6IGZ1bmN0aW9uKCBub2RlICl7XG5cdFx0aWYoIG5vZGUgKXtcblx0XHRcdHRoaXMuX3dhbGsoIG5vZGUubGVmdCApO1xuXHRcdFx0dGhpcy5fbm9kZWxpc3QucHVzaCggbm9kZS5kYXRhICk7XG5cdFx0XHR0aGlzLl93YWxrKCBub2RlLnJpZ2h0ICk7XG5cdFx0fVxuXHR9LFxuXG5cdHdhbGs6IGZ1bmN0aW9uKCl7XG5cdFx0aWYoICF0aGlzLnJvb3QgKXtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0dGhpcy5fbm9kZWxpc3QgPSBbXTtcblx0XHR0aGlzLl93YWxrKHRoaXMucm9vdCk7XG5cdFx0dmFyIG5vZGVzID0gdGhpcy5fbm9kZWxpc3Q7XG5cdFx0ZGVsZXRlIHRoaXMuX25vZGVsaXN0O1xuXHRcdHJldHVybiBub2Rlcztcblx0fSxcblxuXHRpbnNlcnQ6IGZ1bmN0aW9uKCBpdGVtICl7XG5cdFx0dmFyIG5vZGUsXG5cdFx0ICAgIHBhcmVudCA9IG51bGwsXG5cdFx0ICAgIGN1cnNvciA9IHRoaXMucm9vdDtcblx0XHRub2RlID0gbmV3IEJpbmFyeU5vZGUoIHRoaXMsIGl0ZW0gKTtcblxuXHRcdHdoaWxlKCBjdXJzb3IgIT09IG51bGwgKXtcblx0XHRcdHBhcmVudCA9IGN1cnNvcjtcblx0XHRcdGlmKCB0aGlzLl9jb21wYXJlKG5vZGUsIHBhcmVudCkgKXtcblx0XHRcdFx0Y3Vyc29yID0gY3Vyc29yLmxlZnQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXJzb3IgPSBjdXJzb3IucmlnaHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5vZGUucGFyZW50ID0gcGFyZW50O1xuXHRcdGlmKCBwYXJlbnQgPT09IG51bGwgKXtcblx0XHRcdHRoaXMucm9vdCA9IG5vZGU7XG5cdFx0fSBlbHNlIGlmKCB0aGlzLl9jb21wYXJlKG5vZGUsIHBhcmVudCkgKXtcblx0XHRcdHBhcmVudC5sZWZ0ID0gbm9kZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyZW50LnJpZ2h0ID0gbm9kZTtcblx0XHR9XG5cdFx0dGhpcy5zaXplKys7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0aW5zZXJ0TWFueTogZnVuY3Rpb24oIGl0ZW1zICl7XG5cdFx0dmFyIG1lID0gdGhpcztcblx0XHRpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0bWUuaW5zZXJ0KGl0ZW0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdF9maW5kOiBmdW5jdGlvbigga2V5ICl7XG5cdFx0dmFyIG5vZGUgPSB0aGlzLnJvb3Q7XG5cdFx0d2hpbGUoIG5vZGUgIT09IG51bGwgJiYga2V5ICE9PSB0aGlzLl9nZXQobm9kZSkgKXtcblx0XHRcdGlmKCBrZXkgPCB0aGlzLl9nZXQobm9kZSkgKXtcblx0XHRcdFx0bm9kZSA9IG5vZGUubGVmdDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGUgPSBub2RlLnJpZ2h0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fSxcblx0ZmluZEtleTogZnVuY3Rpb24oIGtleVZhbHVlICl7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGFPck51bGwoIHRoaXMuX2ZpbmQoIGtleVZhbHVlICkgKTtcblx0fSxcblxuXHRfc3RlcDogZnVuY3Rpb24oIG5vZGUsIGRpcmVjdGlvbiApe1xuXHRcdGlmKCBub2RlW2RpcmVjdGlvbl0gIT09IG51bGwgKXtcblx0XHRcdHJldHVybiB0aGlzLl9taW4oIG5vZGVbZGlyZWN0aW9uXSApO1xuXHRcdH0gXG5cdFx0dmFyIG5leHQgPSBub2RlLnBhcmVudDtcblx0XHR3aGlsZSggbmV4dCAhPT0gbnVsbCAmJiBub2RlID09IG5leHRbZGlyZWN0aW9uXSApe1xuXHRcdFx0bm9kZSA9IG5leHQ7XG5cdFx0XHRuZXh0ID0gbmV4dC5wYXJlbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBuZXh0O1xuXHR9LFxuXG5cdG5leHQ6IGZ1bmN0aW9uKCBub2RlICl7XG5cdFx0cmV0dXJuIHRoaXMuX3N0ZXAoIG5vZGUsICdyaWdodCcgKTtcblx0fSxcblxuXHRwcmV2OiBmdW5jdGlvbiggbm9kZSApe1xuXHRcdHJldHVybiB0aGlzLl9zdGVwKCBub2RlLCAnbGVmdCcgKTtcblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJpbmFyeVRyZWU7XG4iLCJmdW5jdGlvbiBCaW5hcnlOb2RlKCB0cmVlLCBkYXRhICl7XG5cdHRoaXMudHJlZSA9IHRyZWU7XG5cdHRoaXMuZGF0YSA9IGRhdGE7XG5cdHRoaXMucGFyZW50ID0gbnVsbDtcblx0dGhpcy5sZWZ0ID0gbnVsbDtcblx0dGhpcy5yaWdodCA9IG51bGw7XG59XG5cbkJpbmFyeU5vZGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gbm9kZVRvU3RyaW5nKCl7XG5cdHJldHVybiBcIkJpbmFyeVRyZWVOb2RlKGtleTogXCIgKyB0aGlzLnRyZWUuX2dldCh0aGlzKSArIFwiLCBkYXRhOiBcIiArIHRoaXMuZGF0YS50b1N0cmluZygpICsgXCIpXCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJpbmFyeU5vZGU7XG4iXX0=
