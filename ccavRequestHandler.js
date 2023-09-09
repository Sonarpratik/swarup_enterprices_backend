const { default: axios } = require("axios");
var http = require("http"),
  fs = require("fs"),
  ccav = require("./ccavutil.js"),
  qs = require("querystring");

exports.postReq = function (request, response) {
  var happy = "";
  var body = "",
    workingKey = "0E83944F461D014D965CB1F5C8B106D2", //Put in the 32-Bit key shared by CCAvenues.
    accessCode = "AVZI11KI38AO35IZOA", //Put in the Access Code shared by CCAvenues.
    encRequest = "",
    formbody = "";

  request.on("data", function (data) {
    body += data;
    encRequest = ccav.encrypt(body, workingKey);
    // formbody =
    //   '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
    //   encRequest +
    //   '"><input type="hidden" name="access_code" id="access_code" value="' +
    //   accessCode +
    //   '"><script language="javascript">document.redirect.submit();</script></form>';

    //ajax ifmare auto send response
    formbody =
      '<html><head><title>Sub-merchant checkout page</title><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script></head><body><center><!-- width required mininmum 482px --><iframe  width="482" height="500" scrolling="No" frameborder="0"  id="paymentFrame" src="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=' +
      "2783223" +
      "&encRequest=" +
      encRequest +
      "&access_code=" +
      accessCode +
      '"></iframe></center><script type="text/javascript">$(document).ready(function(){$("iframe#paymentFrame").load(function() {window.addEventListener("message", function(e) {$("#paymentFrame").css("height",e.data["newHeight"]+"px"); }, false);}); });</script></body></html>';
  });

  request.on("end", function () {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(formbody);

    // response.redirect(302, redirectURL);
    response.end();
  });

  return;
};

// Merchant ID
// This is the identifier for your CCAvenue merchant Account. You must send this with each request.

// merchant_id: 	2783223

// Access Code
// This is the access code for your application. You must send this with each request.

// URL:http://www.siddhisarees.com
// access_code: 	AVXZ02KH16BV44ZXVB

// URL:http://www.localhost:3000
// access_code: 	AVZI11KI38AO35IZOA

// URL:http://www.localhost:8000
// access_code: 	AVZI11KI38AO36IZOA

// Working Key
// Below are the secret keys used for encrypting each request originating from your applications. Ensure you are using the correct key while encrypting requests from different URLs registered with us.

// URL:http://www.siddhisarees.com
// Working key: 	B1127514E128AFEA52B0A60629BE2724 	    Regenerate

// URL:http://www.localhost:3000
// Working key: 	0E83944F461D014D965CB1F5C8B106D2 	    Regenerate

// URL:http://www.localhost:8000
// Working key: 	67331EE6DEB3452435E6B4B7348C00F5 	    Regenerate
