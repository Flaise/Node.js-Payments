Settings are specified as follows:


/settings/index.json
{
    // if truthy, payments are processed for real instead of on test servers
    "productionMode": <boolean>,
    
    // the port the HTTP server listens on - defaults to 8080
    "port": <int>
}

/settings/paypal.json
{
    "production": {
        "mode": "live",
        "client_id": <string>,
        "client_secret": <string>
    },
    "sandbox": {
        "mode": "sandbox",
        "client_id": <string>,
        "client_secret": <string>,
        "test_cards": {
            "VISA": {
                "number": <string>,
                "expiration": <string>
            },
            "AMEX": {
                "number": <string>,
                "expiration": <string>
            }
        }
    }
}

/settings/braintree.js
module.exports = {
    "production": {
        "environment": 
        "merchantId": <string>,
        "publicKey": <string>,
        "privateKey": <string>
    },
    "sandbox": {
        "environment": require("braintree").Environment.Sandbox,
        "merchantId": <string>,
        "publicKey": <string>,
        "privateKey": <string>,
        "testCard": {
            "number": "4111111111111111",
            "expiration": "05/12"
        }
    }
}
