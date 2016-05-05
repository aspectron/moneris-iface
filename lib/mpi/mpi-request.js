var _ 		= require('underscore');

function MpiRequest(iface, txnObj){
	var self = this;
	self.txnArray = [];

	var txnTypes = {
		txn: [
			'xid', 'amount', 'pan', 'expdate','MD', 'merchantUrl','accept',
			'userAgent','currency','recurFreq', 'recurEnd','install'
		],
		acs: ['PaRes','MD']
	};

	self.getData = function (){
		var type = txnObj.type;
		var requiredKeys = txnTypes[type];
		var txn = {};
		txn[type] = {};
		_.each(requiredKeys, function(k, i){
			if (!_.isUndefined(txnObj[k]))
				txn[type][k] = txnObj[k];
		})
		return txn;
	}

	self.post = function(callback){
		if (!iface)
			return callback({error: "Invalid iface object"});

		iface.post({
			isMPI: true,
			data: self.getData()
		}, callback)	
	}

	function getMpiInLineForm(){
		
	}
}
module.exports = MpiRequest;