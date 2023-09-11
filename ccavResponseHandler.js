var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    qs = require('querystring');
const cheerio = require('cheerio');
const Cart = require("./models/userCartSchema.js");
const Product = require('./models/productSchema.js');
const Order = require('./models/orderSchema.js');
const { default: axios } = require('axios');
const User = require('./models/userSchema.js');



exports.postRes = function (request,response){
    var ccavEncResponse='',
	ccavResponse='',	
	workingKey = '0E83944F461D014D965CB1F5C8B106D2',	//Put in the 32-Bit key shared by CCAvenues.
	ccavPOST = '';
	last_obj=''
        request.on('data', async function  (data) {
	    ccavEncResponse += data;

	    ccavPOST =  qs.parse(ccavEncResponse);
	    var encryption = ccavPOST.encResp;
	    ccavResponse = ccav.decrypt(encryption,workingKey);
		// console.log(qs.parse(ccavResponse))

		last_obj=qs.parse(ccavResponse)
		
		// console.log(last_obj)
		if(last_obj.order_status==="Aborted"){

			response.status(200).redirect("http://localhost:3000/payment/result/?data=" + encodeURIComponent(JSON.stringify(last_obj)));

		}else if(last_obj.order_status==="Success"){

			const User_Details=await User.findOne({_id:last_obj.merchant_param5})
			User_Details.shipping_address=last_obj.delivery_address
			User_Details.billing_zip=last_obj.billing_zip
			User_Details.shipping_zip=last_obj.delivery_zip
			User_Details.billing_phone=last_obj.billing_tel
			User_Details.shipping_phone=last_obj.delivery_tel
			User_Details.billing_state=last_obj.billing_state
			User_Details.billing_city=last_obj.billing_city
			User_Details.shipping_state=last_obj.delivery_state
			User_Details.shipping_city=last_obj.delivery_city
			await User_Details.save()
			if(last_obj.merchant_param1==="cart"){
				const cart = await Cart.findOne({ user_id: last_obj.merchant_param5 });
				const productIds = cart?.products?.map((item) => item.product_id);
const productx=await Product.find({_id:{ $in: productIds } })

const new_cart={
  _id:cart._id,
  user_id:cart.user_id,
  products:productx
}
new_cart.products=productx
const modifiedProducts = productx.map(product => {
	const { product_price,product_discount,wash_care,product_country_of_origin,product_Work,product_Fabric,_id,product_occasion,product_name,product_sku,product_img,product_highlight,product_style,product_color,product_size,product_shipping_details,product_description, ...rest } = product; // Destructure _id and get the rest of the fields
	return { product_id: _id, product_price,product_discount,wash_care,product_country_of_origin,product_Work,product_Fabric,product_occasion,product_name,product_sku,product_img,product_highlight,product_style,product_color,product_size,product_shipping_details,product_description}; // Create a new object with product_id and the rest of the fields
  });
  const modifiedProducts2 = modifiedProducts.map(product => {
	return {
		user_id: last_obj.merchant_param5,
		order_id: last_obj.order_id,
		billing_address:last_obj.billing_address,
		shipping_address:last_obj.delivery_address,
		billing_zip:last_obj.billing_zip,
		shipping_zip:last_obj.delivery_zip,
		billing_phone:last_obj.billing_phone,
		shipping_phone:last_obj.delivery_phone,
		billing_state:last_obj.billing_state,
		billing_city:last_obj.billing_city,
		delivery_state:last_obj.delivery_state,
		shipping_city:last_obj.delivery_city,
		shipping_name:last_obj.delivery_name,
		billing_name:last_obj.billing_name,
		...product
	  };
  });
 
  await axios.post('http://localhost:8000/api/order', 
     modifiedProducts2
  , {
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json'
    }
  });

			}else{
				const productx=await Product.find({_id:last_obj.merchant_param2 })
const modifiedProducts = productx.map(product => {
	const { product_price,product_discount,wash_care,product_country_of_origin,product_Work,product_Fabric,_id,product_occasion,product_name,product_sku,product_img,product_highlight,product_style,product_color,product_size,product_shipping_details,product_description, ...rest } = product; // Destructure _id and get the rest of the fields
	return { product_id: _id, product_price,product_discount,wash_care,product_country_of_origin,product_Work,product_Fabric,product_occasion,product_name,product_sku,product_img,product_highlight,product_style,product_color,product_size,product_shipping_details,product_description}; // Create a new object with product_id and the rest of the fields
  });
  const modifiedProducts2 = modifiedProducts.map(product => {
	return {
	  user_id: last_obj.merchant_param5,
	  order_id: last_obj.order_id,
	  billing_address:last_obj.billing_address,
	  shipping_address:last_obj.delivery_address,
	  billing_zip:last_obj.billing_zip,
	  shipping_zip:last_obj.delivery_zip,
	  billing_phone:last_obj.billing_phone,
	  shipping_phone:last_obj.delivery_phone,
	  billing_state:last_obj.billing_state,
	  billing_city:last_obj.billing_city,
	  delivery_state:last_obj.delivery_state,
	  shipping_city:last_obj.delivery_city,
	  shipping_name:last_obj.delivery_name,
	  billing_name:last_obj.billing_name,
	  ...product
	};
  });

// const convertedData = modifiedProducts2?.map(item => {
// 	return {
// 		...item,
// 		product_id: item?.product_id?.replace('new ObjectId("', '').replace('")', '')
// 	};
//   });

const convertedData = modifiedProducts2?.map(item => {
	return {
	  ...item,
	  product_id: item.product_id.toString()  // Convert ObjectId to string
	};
  });

  const value=await Order.insertMany(convertedData)
console.log("Order",value)
			}
			response.status(200).redirect("http://localhost:3000/payment/result/?data=" + encodeURIComponent(JSON.stringify(last_obj)));

		}
		else if(last_obj.order_status==="Invalid"){
			request.on('end', function () {
	    var pData = '';
	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'	
	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
	    pData = pData + '</td></tr></table>'
            htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
            response.writeHeader(200, {"Content-Type": "text/html"});

		

	    response.write(htmlcode);
	    response.end();
	}); 	
			// response.status(200).redirect("http://localhost:3000/payment/result/?data=" + encodeURIComponent(JSON.stringify(last_obj)));

			
			// response.status(200).send(last_obj)

		}else{
			response.status(200).redirect("http://localhost:3000/payment/result/?data=" + encodeURIComponent(JSON.stringify(last_obj)));

		}
		
	});
		// console.log("helow",request.on)




		
	


	// request.on('end', function () {
	//     var pData = '';
	//     pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'	
	//     pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
	//     pData = pData.replace(/&/gi,'</td></tr><tr><td>')
	//     pData = pData + '</td></tr></table>'
    //         htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
    //         response.writeHeader(200, {"Content-Type": "text/html"});

		

	//     response.write(htmlcode);
	//     response.end();
	// }); 	
};

//kamlesh
