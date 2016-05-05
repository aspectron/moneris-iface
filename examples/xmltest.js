var IFace = require('../index');
var parser = new IFace.XMLParser();
var d = parser.parse(
	"<aa></aa>"+
	"<request>"+
		"<purchase>"+
			"<cust_id>customer1</cust_id>"+
			"<order_id>order_1462382695094</order_id>"+
			"<amount>1.00</amount>"+
			"<pan>4242424242424242</pan>"+
		    "<expdate>1119</expdate>"+
		    "<crypt_type>7</crypt_type>"+
		    "<dynamic_descriptor>12345</dynamic_descriptor>"+
		    "<item1>"+
				"<cust_id>xxxx</cust_id>"+
			"</item1>"+
		"</purchase>"+
		"<purchase>"+
			"<cust_id>customer1</cust_id>"+
			"<order_id>order_1462382695094</order_id>"+
			"<amount>1.00</amount>"+
			"<pan>4242424242424242</pan>"+
		    "<expdate>1119</expdate>"+
		    "<crypt_type>7</crypt_type>"+
		    "<dynamic_descriptor>12345</dynamic_descriptor>"+
		    "<item2>"+
				"<cust_id>eee</cust_id>"+
			"</item2>"+
		"</purchase>"+
		"<store_id>moneris</store_id>"+
		"<api_token>hurgle</api_token>"+
	"</request>"
)

var d1 = parser.parse('<?xml version="1.0" encoding="UTF-8"?>'+
'<MpiResponse>'+"\n"+
  '<type></type>'+
 '<success>true</success>'+
  '<message>Y</message>'+
  '<PaReq>eJxdUttO4zAQfecrorxTX5oUWjlGXS4i2jVES7qvKKRDE8gN21kKX4+d1qQlUiTPmTM+njnDLrZ1'+
'5f0Hqcq2iXwywb4HTd6uy2YT+av05vTcv+AnLC0kwNUD5L0EfuJ5TIBS2Qa8ch35GE8xxTicBfPg'+
'fO4+Qqd0GpBwRs98W2KKkuVfeNudTbRX5UZ0QhlyoUsLkHmRNdoBBsryt1/xHQ9CYvQY2odjvgYZ'+
'X/Gj5zC0A0dSk9XARduALJWXgtIMDdDIyNu+0fKDExow5IIx3cuKF1p3C4SqNs+qolUawcP1n+vL'+
'tKt69ZjcJo/LJD4VSYzqrlS6lTDpio4hW+r6Qz8bZElvAXX4lG255vfpa+h+kcaf4kVgka6oeMkj'+
'hixj5K8zDZxiMsMhDjxytiB4MQ0ZGvCDQda2K04n2I5xF4zZzr5juadYxiFwMKZeSrMrbk4uGgmw'+
'7cyY7SUMfZ+/2//ZLbu8PbI618Y2KeCuSOm/1evzs3y6qTZPH/Hv9yiy5g+EI7XSmjYnZJArR9MY'+
'cncbWbeD1oBhh816o+P9/gLVGNlr</PaReq>'+
  '<TermUrl>http://localhost/eSELECTplus_PHP_API-MPI/mpistore.php</TermUrl>'+
  '<MD>xid=99999999912323415627&amp;amp;pan=4242424242424242&amp;amp;expiry=1911&amp;amp;amount=2.00</MD>'+
  '<ACSUrl>https://dropit.3dsecure.net:9443/PIT/ACS</ACSUrl>'+
  '<cavv>null</cavv>'+
  '<PAResVerified>null</PAResVerified>'+
'</MpiResponse>'
)

console.log(d)
console.log(JSON.stringify(d, null, "\t"))
