var _ 		= require('underscore');

function MpgRequest(iface, txnObj){
	var self = this;
	self.txnArray = [];

	var txnTypes = {
		purchase:["order_id","cust_id","amount","pan","expdate","crypt_type","dynamic_descriptor"],
		refund:["order_id","amount","txn_number","crypt_type","dynamic_descriptor"],
		idebit_purchase:["order_id","cust_id","amount","idebit_track2","dynamic_descriptor"],
		idebit_refund:["order_id","amount","txn_number"],
		purchase_reversal:["order_id","amount"],
		ind_refund:["order_id","cust_id","amount","pan","expdate","crypt_type","dynamic_descriptor"],
		preauth:["order_id","cust_id","amount","pan","expdate","crypt_type","dynamic_descriptor"],
		reauth:["order_id","cust_id","amount","orig_order_id","txn_number","crypt_type","dynamic_descriptor"],
		completion:["order_id","comp_amount","txn_number","crypt_type","dynamic_descriptor"],
		purchasecorrection:["order_id","txn_number","crypt_type","dynamic_descriptor"],
		opentotals:["ecr_number"],
		batchclose:["ecr_number"],
		cavv_purchase:["order_id","cust_id","amount","pan","expdate","cavv","dynamic_descriptor"],
		cavv_preauth:["order_id","cust_id","amount","pan","expdate","cavv","dynamic_descriptor"],
		card_verification:["order_id","cust_id","pan","expdate","crypt_type"],
		recur_update:["order_id","cust_id","pan","expdate","recur_amount","add_num_recurs","total_num_recurs","hold","terminate"]
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
			data: self.getData()
		}, callback)	
	}


}
module.exports = MpgRequest;