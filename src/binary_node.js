function BinaryNode( tree, data ){
	this.tree = tree;
	this.data = data;
	this.parent = null;
	this.left = null;
	this.right = null;
};

BinaryNode.prototype.toString = function nodeToString(){
	return "BinaryTreeNode(key: " + this.tree._get(this) + ", data: " + this.data.toString() + ")";
};

module.exports = BinaryNode;
