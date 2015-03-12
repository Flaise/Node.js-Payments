Settings are specified as follows:


/settings/index.json
{
    // if truthy, payments are processed for real instead of on test servers
    "productionMode": boolean,
    
    // the port the HTTP server listens on - defaults to 8080
    "port": int
}

/settings/paypal.json
{
    "production": {
    },
    "sandbox": {
    }
}

/settings/braintree.json
{
    "production": {
    },
    "sandbox": {
    }
}
