var IFace = require('../index');
var iface = new IFace({
	storeId: "moneris",
	apiToken: "hurgle"
});


iface.post({
	data: {
		purchase: {
			cust_id: "customer1",
			order_id: "order_"+(new Date()).getTime(),
			amount: "1.00",
			pan: "4242424242424242",
			expdate: "1119",
			crypt_type: "7",
			dynamic_descriptor: "12345"
		}
	}
}, function (err, r) {
	if (err)
		return console.error(err);

	console.log("result", r.result, r.body)
})
