var sax 	= require('sax');
var _ 		= require('underscore');

function XMLParser() {
	this.parser = sax.parser(true);
	this.currentTag = {};
	this.depth = 0;
	this.tree = [];

	this.parser.onopentag = this._handleOpenTag.bind(this);
	this.parser.ontext = this._handleText.bind(this);
	this.parser.oncdata = this._handleCdata.bind(this);
	this.parser.ondoctype = this._handleDoctype.bind(this);
	this.parser.oncomment = this._handleComment.bind(this);
	this.parser.onclosetag = this._handleCloseTag.bind(this);
	this.parser.onerror = this._handleError.bind(this);
}

XMLParser.prototype._handleOpenTag = function(tag) {
	if (!this.tree[this.depth])
		this.tree[this.depth] = {};

	var currentTag = this.tree[this.depth];

	//console.log("this.depth", this.depth, tag.name)
	var newTag = {_attributes: tag.attributes};

	if (!currentTag[tag.name]){
		currentTag[tag.name] 	= newTag;
	}else if(_.isArray(currentTag[tag.name])){
		currentTag[tag.name].push(newTag);
	}else {
		currentTag[tag.name] = [currentTag[tag.name], newTag];
	}

	this.depth++;
	this.currentTagName 		= tag.name;
	this.tree[this.depth] 		= newTag;
	this.currentTag = newTag;
};



XMLParser.prototype._handleText = function(text) {
	text = text.replace(/\n  /g, "").replace(/\n/, "")
	if (this.currentTag.text){
		this.currentTag.text += text
	}else{
		this.currentTag.text = text;
	}
};

XMLParser.prototype._handleCdata = function(text) {
	this._handleText(text)
};

XMLParser.prototype._handleDoctype = function(text) {
};

XMLParser.prototype._handleComment = function(comment) {
};

XMLParser.prototype._handleCloseTag = function(tag) {
	this.depth--;
	//console.log("this.currentTag = this.lastTag", this.currentTag, this.lastTag)
};

XMLParser.prototype._handleError = function(err) {
	throw err;
};

XMLParser.prototype.feed = function(chunk) {
	this.parser.write(chunk);
};
XMLParser.prototype.parse = function(chunk) {
	this.feed(chunk);
	return this.cleanJSON();
};

XMLParser.prototype.close = function() {
	this.parser.close();
	return this.tree[0];
};

XMLParser.prototype.cleanJSON = function() {
	return digest(this.tree[0])
	function digest(node){
		var result = {};
		if(_.isArray(node))
			result = [];

		//console.log("result", result, node)
		var value;
		_.each(node, function(v, k){
			//console.log("k:", k, v, _.isArray(v), _.isUndefined(v.text))
			if (k == "_attributes" || k == "text")
				return

			value = digest(v);
			if (!value && !_.isArray(value))
				value = v.text || "";
		
			result[k] = value;
		});
		return _.isArray(result) ? result: _.isEmpty(result) ? "": result;
	}
};

module.exports = XMLParser;