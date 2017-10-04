var HitBTC = require('hitbtc-api')
var _ = require('lodash')
var moment = require('moment')
var log = require('../core/log')
var util = require('../core/util')

var Trader = function(config) {
    _.bindAll(this);
    if (_.isObject(config)) {
        this.key = config.key;
        this.secret = config.secret;
        this.asset = config.asset.toLowerCase();
        this.currency = config.currency.toLowerCase();
        this.market = this.asset + this.currency;
    }
    this.name = 'HitBTC';

    this.hitbtc = new HitBTC({this.key, this.secret, isDemo: false});
}

// If an error is received, method waits for 10 seconds before trying again
Trader.prototype.retry = function(method, args) {
    var wait = +moment.duration(10, 'seconds');
    log.debug(this.name, 'returned an error, retrying...');

    var self = this;

    // bind callback to Trader
    _.each(args, function(arg, i) {
        if (_.isFunction(arg)) {
            args[i] = _.bind(arg, self);
        }
    });

    // run failed method again with same arguments after waiting
    setTimeout(
        function() { method.apply(self, args) },
        wait
    );
}

Trader.prototype.getPortfolio = function(callback) {
    var args = _.toArray(arguments);

    const { getMyBalance } = this.hitbtc;
    getMyBalance()
        .then(
            var portfolio = [];
            ({ balance }) => {
                console.log(`My balance is ${balance}`);
            }

            callback(err, portfolio);
        )
}
