var MoneriesIFace = require('../index');
var mIFace = new MoneriesIFace({
	storeId: "moneris",
	apiToken: "hurgle"
});

/* #### direct method #### */
/*
mIFace.post({
	data: {
		refund: {
			order_id: "14624085585513483230", // last purchase: responce.ReceiptId == request.order_id
			amount: "1.00",
			txn_number: "75607-0_10", //last purchase order: responce.TransID
			crypt_type: "7",
			dynamic_descriptor: "sss"
		}
	}
}, function (err, r) {
	if (err)
		return console.error(err);

	console.log("result", r.result, r.body)
})
*/

/* #### using MpgRequest #### */

var txn = {
	type: "refund",
	order_id: "14624085585513483230", // last purchase: responce.ReceiptId == request.order_id
	amount: "1.00",
	txn_number: "75607-0_10", //last purchase order: responce.TransID
	crypt_type: "7",
	dynamic_descriptor: "sss"
};

var mpgRequest = new MoneriesIFace.MpgRequest(mIFace, txn);

mpgRequest.post(function (err, r) {
	if (err)
		return console.error(err);

	var result = r.result;
	console.log("mpgRequest:result", result, r.body)

	//in case of already refunded fully
	//error: Invalid Refund Request: Check transaction type or transaction id mismatch';

});


