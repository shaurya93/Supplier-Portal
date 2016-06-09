
/*
 * This function generates OAuth signature using following params
 * Token Key
 * Token Secret
 * Consumer Key
 * Consumer Secret
 * Account ID
 * Restlet URL
 * Timestamp
 * Nonce
 * Signature Method
 * 
 * @returns OauthHeader
 * 
 */
 
module.exports = function generate_header(type) 
 {

	/*
	 * Create OAuth object
	 */
	var oauth = OAuth({consumer:oauthData.constant.consumer,
		signature_method:oauthData.constant.header_param.signature_method});

		//alert("type:: ==> "+type);

	restletURL=getRestletURL(type);
	
	//alert('url:'+restletURL);
	//alert('method:'+oauthData.constant.header_param.HTTP_METHOD);



	var request_data = {
			url:restletURL,
			method:oauthData.constant.header_param.HTTP_METHOD,
			data: {}
	};

	var oauth_data = {
			oauth_consumer_key: oauthData.constant.consumer.public,
			oauth_nonce: oauth.getNonce(),
			oauth_signature_method: oauthData.constant.header_param.signature_method,
			oauth_timestamp: oauth.getTimeStamp(),
			oauth_version: oauthData.constant.header_param.oauth_version,
			oauth_token: oauthData.constant.token.public
	};

	/*
	 *Generating the Header 
	 */
	 var headerWithRealm = oauth.toHeader(oauth.authorize(request_data, oauthData.constant.token));

	 /*
	  * Attach Account ID to header
	  */
	 headerWithRealm.Authorization += ', realm="' + oauthData.constant.header_param.remoteAccountID+ '"';

	 var oauth_header_with_sign= headerWithRealm.Authorization;

		//alert('header:'+oauth_header_with_sign);

	 
	 return oauth_header_with_sign;
}


/*
 * This function will make an http call by passing the header data
 * 
 * @param: Data to pass to the restlet
 *  
 */

function make_http_call(type,rest_param)
{

	/*
	 * call generate_header function to get the header
	 */

	//alert("type:: ==> "+type);

	
	var oauth_header = new oAuth_sign().generate_header(type);
	//alert("oauth_header:: ==> "+oauth_header);


	/*
	 * create HTTP instance
	 */
	var xmlhttp = new XMLHttpRequest();  
	//alert("xmlhttp:: ==> "+xmlhttp);

	/*
	 * Open HTTP connection to the rest
	 */
	xmlhttp.open('POST',restletURL, false);

	xmlhttp.setRequestHeader("Authorization",oauth_header);
	xmlhttp.setRequestHeader("Content-Type","application/json");
	xmlhttp.setTimeout = 999999999999;


	xmlhttp.onreadystatechange = function () 
	{	//Call a function when the state changes.


		if (xmlhttp.readyState == 4) 
		{	
			if(xmlhttp.status=='200')
				{
					if (xmlhttp.responseText && xmlhttp.responseText != "0") 
					{
						//alert('response received == '+xmlhttp.responseText);
						//alert("xmlhttp:: ==> call successful. status code is:"+xmlhttp.status);
					}
					else 
					{
						alert('Result Not Found');
					}
				
				}
			else if(xmlhttp.status=='404')
			{
				
			}
			else if(xmlhttp.status=='401')
			{
				
			}
	
		}
		else
		{
			alert('Connection not established and data has not been sent/received from Netsuite.');
		}	
	};

	//alert('rest_param:'+rest_param);

	if(rest_param)
		{
			var jsonString=JSON.stringify(rest_param);
	
			xmlhttp.send(jsonString); 
		}
	else
		{
			xmlhttp.send(); 
		}
	
alert('xmlhttp.responseText:'+xmlhttp.responseText);
return xmlhttp.responseText;

}


/*
 * This function will make rest call using suitelet by passing the header data
 * 
 * @param: Data to pass to the restlet
 *  
 */
function make_call_by_suitelet(rest_param)
{
	/*
	 * call generate_header function to get the header
	 */

	var oauth_header = new oAuth_sign().generate_header();
	
	var headers = {
        'User-Agent': 'Suitelet_using_TBA',
        'Authorization': oauth_header,
        'Content-Type': 'application/json'
    };

    var JSON_TEXT_PAYLOAD = JSON.stringify(rest_param);

    var restResponse = nlapiRequestURL(oauthData.constant.header_param.restletURL, JSON_TEXT_PAYLOAD, headers, 'POST');

}



/*
 * This function checks the record type n give respective URL of restlet
 * 
 * @param: record type
 * @return: rest url
 * 
 * 
 */

function getRestletURL(type)
{
	
	//alert("type:: ==> "+type);

	
	var restletURL='';
	
	if(type=='Supplier')
		{
				restletURL=oauthData.constant.header_param.restletURL_supplier;
		}
	else if(type=='PurchaseOrder')
		{
				restletURL=oauthData.constant.header_param.restletURL_purchaseOrder;
		}
	else if(type=='PackingList')
		{
				restletURL=oauthData.constant.header_param.restletURL_packingList;
		}
	else if(type=='Bills')
		{
				restletURL=oauthData.constant.header_param.restletURL_bills;
		}
	
	
	//alert("restletURL:: ==> "+restletURL);

	return restletURL;


}
 

