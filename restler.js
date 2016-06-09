var rest = require('restler');

rest.get('https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?script=172&deploy=1').on('complete', function(result) {
  if (result instanceof Error) {
    console.log('Error:', result.message);
    this.retry(5000); // try again after 5 sec 
  } else {
    console.log(result);
  }
});


rest.post('https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?script=172&deploy=1', {
	account: "TSTDRV1024523",
    email: "palasha.porwal@cognizant.com",
    password: "Cognizant@123",
    role: "3",
  data: {
    'event': 'edit'
  //  'sound[file]': rest.file('doug-e-fresh_the-show.mp3', null, 321567, null, 'audio/mpeg')
  }
}).on('complete', function(data) {
  console.log("in logsss");
});

