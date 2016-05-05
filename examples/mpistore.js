"use strict";

var MoneriesIFace = require('../index');
var path = require("path");
var mIFace = new MoneriesIFace({
	storeId: "moneris",
	apiToken: "hurgle"
});







var express = require('express');
var serverPort = 3123;
var app = express();
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use('/', express.static(__dirname + '/../public'));
app.listen(serverPort, function() { console.log('listening on '+serverPort); });


app.get("/", function(req, res){
	res.render("index");
})

function getXid(){
	var id = "";
	id += Date.now();
	id += Math.floor((Math.random() * 99999) + 11111);
	id += Math.floor((Math.random() * 99999) + 11111);
	id += Math.floor((Math.random() * 99999) + 11111);
	//console.log("id", id);
	return id.substr(0, 20);
}

app.post("/", function(req, res){
	var data = req.body;

	console.log("data", data)
	var xid = getXid();//"19999999912323415655";//20 chars
	var purchase_amount = data.purchase_amount;
	var pan = data.pan;
	var expiry = data.expiry;
	var merchUrl = "http://localhost:"+serverPort+"/acs";
	var cust_id = "customer_1";

	var MD = {
		xid: xid,
		pan: pan,
		expiry: expiry,
		amount: purchase_amount,
		cust_id: cust_id
	}

	var txn = {
		type: "txn",
		xid: xid,
		amount: purchase_amount,
		pan: pan,
		expdate: expiry,
		merchantUrl: merchUrl,
		MD: JSON.stringify(MD),
		/*MD: "xid="  + xid           //MD is merchant data that can be passed along
		+ "&amp;pan=" + pan
		+ "&amp;expiry=" + expiry
		+ "&amp;amount=" + purchase_amount*/

		
		//accept: HTTP_ACCEPT,
		//userAgent: HTTP_USER_AGENT
	}

	var mpiRequest = new MoneriesIFace.MpiRequest(mIFace, txn);

	mpiRequest.post(function (err, r) {
		if (err)
			return console.error(err);

		var result = r.result;
		console.log("mpiRequest:result", result, r.body)

		if (!result.MpiResponse)
			return res.send("<h4>Server Error: Invalid response from Moneries</h4>");

		if (result.MpiResponse.message == "Y") {
			res.render("vbv-form", {data: result.MpiResponse, result:result});
			return;
		}

		var crypt_type = "6";// merchant is not liable for chargeback (attempt was made)
		if (result.MpiResponse.message == 'U'){
			// merchant assumes liability for charge back (usu. corporate cards)
			crypt_type='7';
		}

		// Send regular transaction with appropriate ECI
		var txn = {
			type: "purchase",
			order_id: xid,
			cust_id: cust_id,
			amount: purchase_amount,
			pan: pan,
			expdate: expiry,
			crypt_type: crypt_type
		};

		var mpgRequest = new MoneriesIFace.MpgRequest(mIFace, txn);

		mpgRequest.post(function (err, r) {
			if (err)
				return console.error(err);

			var result = r.result;
			console.log("mpgRequest:result", result, r.body)

			res.send("<h1>Regular transaction with appropriate ECI</h1><pre>"+JSON.stringify(r, null, "\t")+"</pre>")
		});
	})
});

app.get("/acs", function(req, res){
	res.redirect("/");
});
app.post("/acs", function(req, res){
	var data = req.body;
	console.log("/acs:", data, req.query)

	var txn = {
		type: "acs",
		PaRes: data.PaRes,
		MD: data.MD
	}

    var mpiRequest = new MoneriesIFace.MpiRequest(mIFace, txn);

	mpiRequest.post(function (err, r) {
		if (err)
			return console.error(err);

		var result = r.result;
		console.log("mpiRequest:result", result, r.body)

		if (!result.MpiResponse)
			return res.send("<h4>Server Error: Invalid response from Moneries</h4>");

	    if( result.MpiResponse.success != "true"){
	    	//At this point the merchant should deny this transaction
	    	res.send("<h1>MPI: ACS: Error: </h1><textarea style='width:100%;height:100vh;font-size: 14px;'>"+JSON.stringify(r, null, "\t")+"</textarea>")
	    	return
	    }
        var order_id = getXid();
        
        var cavv = result.MpiResponse.cavv;
        var MD;
        try{
	        MD = JSON.parse(data.MD, true);
	    }catch(e){
	    	res.send("<h1>Error Parsing MD</h1>"+e.message)
	    	return;
	    }
        console.log("MD:", MD)

        var txn = {
			type: "cavv_purchase",
			order_id: order_id,
			cust_id: MD.cust_id,
			amount: MD.amount,
			pan: MD.pan,
			expdate: MD.expiry,
			cavv: cavv
		};

        var mpgRequest = new MoneriesIFace.MpgRequest(mIFace, txn);

		mpgRequest.post(function (err, r) {
			if (err)
				return console.error(err);

			var result = r.result;
			console.log("mpgRequest:result", result, r.body)

			res.send("<h1>CAVV transaction</h1><textarea style='width:100%;height:100vh;font-size: 14px;'>"+JSON.stringify(r, null, "\t")+"</textarea>")
		});
	});
})

