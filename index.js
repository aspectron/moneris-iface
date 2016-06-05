"use strict";
var EasyXml = require('easyxml');
var _ 		= require('underscore');
var request = require('request');

var MpiRequest = require('./lib/mpi/mpi-request');
var MpgRequest = require('./lib/mpg/mpg-request');
var XMLParser = require('./lib/xmlparser');


function getXMLSerializer(options){
	var options = _.extend({
	    singularize: true,
	    rootElement: 'response',
	    dateFormat: 'ISO',
	    manifest: true
	}, options || {});

	return new EasyXml(options);
}


function IFace(options){
	var self 		= this;
	options = _.extend(options || {}, {
		sandbox: true,
		debug: false,
		mpiEndPoint: "/mpi/servlet/MpiServlet",
		mpgEndPoint: "/gateway2/servlet/MpgRequest",
		sandboxUrl: "https://esqa.moneris.com",
		productionUrl: "https://www3.moneris.com"
	})
	var baseUrl 	= options.sandbox ? options.sandboxUrl : options.productionUrl;
	var storeId 	= options.storeId;
	var apiToken 	= options.apiToken;
	if (!storeId)
		throw new Error("storeId is required");
	if (!apiToken)
		throw new Error("apiToken is required");


	self.mpgRequestBuilder = getXMLSerializer({rootElement: "request"});
	self.mpiRequestBuilder = getXMLSerializer({rootElement: "MpiRequest"});

	self.post = function (args, callback) {
		var endPoint 	= args.endPoint;
			endPoint 	= endPoint || (args.isMPI ? options.mpiEndPoint : options.mpgEndPoint );

		var data 		= args.data;
		var data 		= _.extend({
			store_id: storeId,
			api_token: apiToken
		}, data);

		data = args.isMPI ? self.mpiRequestBuilder.render(data) : self.mpgRequestBuilder.render(data);
		options.debug && console.log("Sending\n" , baseUrl + endPoint, data);

		var req = {
			uri: baseUrl + endPoint,
			method: 'POST',
			body: data
		};

		request(req, function (err, res, body) {
			options.debug && console.log("request result:".greenBG, body)
			if (err)
				return callback(err);

			// Convert to JSON
			var xmlParser 	= new XMLParser();
			try{
				var result 		= xmlParser.parse(body);
			}catch(e){
				return callback({error: e.message, body:body, e:e, res:res, xmlerror: true});
			}

			callback(null, {result: result, res: res, body: body })
		});
	}
}

IFace.MpiRequest = MpiRequest;
IFace.MpgRequest = MpgRequest;
IFace.XMLParser = XMLParser;
module.exports = IFace;
