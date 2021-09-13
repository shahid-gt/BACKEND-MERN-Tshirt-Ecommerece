const braintree = require("braintree");

/*const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "useYourMerchantId",
  publicKey: "useYourPublicKey",
  privateKey: "useYourPrivateKey",
});*/

//after creating account 
const gateway = new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'wh532ppck84crm7p',
    publicKey:    'cpj43cnmmt9rpcky',
    privateKey:   '1cdf48dbe8114e57daa0e0a4592c499a'
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (error, response) => {
    // pass clientToken to your front-end
        if(error){
            return res.status(500).send(error);
        }
        else{
            return res.send(response);
        }
  });
};

exports.processPayment = ( req, res) => {

    var nonceFromTheClient = req.body.paymentMethodNonce ; 
    var amountFromTheClient = req.body.amount ;

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err) {
              return res.status(500).send(err);
          }
          else{
              res.send(result);
          }
      });
}