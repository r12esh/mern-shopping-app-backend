const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "useYourMerchantId",
  publicKey: "useYourPublicKey",
  privateKey: "useYourPrivateKey",
});

const getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    // pass clientToken to your front-end
    if (err) {
      res.status(500).json(err);
    } else {
      res.send(response);
    }
  });
};
const processPayment = (req, res) => {
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.status.json(err);
      } else {
        res.json(result);
      }
    }
  );
};

module.exports = {
  getToken,
  processPayment,
};
