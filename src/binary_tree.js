var BinaryNode = require('./binary_node.js');

function BinaryTree( data, accessorFunction ){
	this.root = null;
	if( accessorFunction == undefined ){
		this._get = function(n){ return n.data; };
	} else {
		this._get = function(n){
			return accessorFunction(n.data);
		}
	}
	if( data ){
		this.extend( data );
	}
};

BinaryTree.prototype = {

	min: function(){
		node = this.root;
		while( node.left !== null ){
			node = node.left;
		}
		return node.data;
	},

	max: function(){
		node = this.root;
		while( node.right !== null ){
			node = node.right;
		}
		return node.data;
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

	append: function( data ){
		var node,
		    parent = null,
		    cursor = this.root;
		node = new BinaryNode( this, data );

		while( cursor !== null ){
			parent = cursor;
			if( this._get(node) < this._get(parent) ){
				cursor = cursor.left;
			} else {
				cursor = cursor.right;
			}
		}
		node.parent = parent;
		if( parent == null ){
			this.root = node;
		} else if( this._get(node) < this._get(parent) ){
			parent.left = node;
		} else {
			parent.right = node;
		}
	},

	extend: function( items ){
		var length = items.length,
			i      = 0,
			item;
		for( i; i < length; i++ ){
			item = items[i];
			this.append( item );
		}
	},

	find: function( keyValue ){
		var node = this.root;
		while( node !== null && keyValue !== this._get(node) ){
			if( keyValue < this._get(node) ){
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return node.data;
	},
};

module.exports = BinaryTree;
