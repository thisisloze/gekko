var HitBTC = require('hitbtc-api');
var _ = require('lodash');
var moment = require('moment');
var log = require('../core/log');
var util = require('../core/util');

var Trader = function(config) {
    _.bindAll(this);
    if (_.isObject(config)) {
        this.key = config.key;
        this.secret = config.secret;
        this.asset = config.asset.toLowerCase();
        this.currency = config.currency.toLowerCase();
    }
    this.startIndex = 0;
    this.name = 'HitBTC';
    this.pair = this.asset + this.currency;
    this.hitbtc = new HitBTC.default({key: this.key, secret: this.secret, isDemo: false});
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

    var set = function(balance) {
        var portfolio = [];
        _.each(balance.balance, function(amount, asset) {

            portfolio.push({name: asset, amount: parseFloat((amount.cash))});
        });

        console.log("hitbtc portfolio: ", portfolio);
        callback(null, portfolio);
    }.bind(this);

    this.hitbtc.getMyBalance()
        .then(set)
        .catch(function(err) {
            console.log("hitbtc getPortfolio error: ", err);
        });
}

Trader.prototype.getTicker = function(callback) {

    this.hitbtc.getTicker(this.pair)
        .then(function(data) {
            console.log("hitbtc getTicker data: ", data);
            callback(null, data);
        })
        .catch(function(err) {
            console.log("hitbtc error: ", err);
        });
}

Trader.prototype.getFee = function(callback) {
    callback(false, 0.001);
}

Trader.prototype.buy = function(amount, price, callback) {
    var args = _.toArray(arguments);

    var process = function(result) {
        console.log("hitbtc buy result: ", result);

        // callback(null, );
    }.bind(this);

    //Decrease amount by 1% to avoid trying to buy more than balance allows.
    amount -= amount / 100;

    amount *= 100000000;
    amount = Math.floor(amount);
    amount /= 100000000;

    // prevent:
    // 'Ensure that there are no more than 2 decimal places.'
    price *= 100;
    price = Math.floor(price);
    price /= 100;

    var params = {
        symbol: this.pair,
        side: buy,
        price: price,
        quantity: amount,
        type: market
    };

    this.hitbtc.placeOrder(params)
        .then(process);
}

Trader.prototype.sell = function(amount, price, callback) {
    console.log("hitbtc sell");
}

Trader.prototype.getOrder = function(id, callback) {

}

Trader.prototype.checkOrder = function(order, callback) {

}

Trader.prototype.cancelOrder = function (order, callback) {

}

Trader.prototype.getTrades = function(since, callback, descending) {
    var args = _.toArray(arguments);

    var firstFetch = !!since;

    var process = function(data) {

        var trades = _.map(data.trades, function(trade) {
            return {
                tid: trade.tid,
                date: moment.utc(trade.date).unix(),
                price: +trade.price,
                amount: +trade.amount
            }
        });

        callback(null, trades.reverse());
    }.bind(this);


    console.log("since: ", since);
    // console.log("time now: ", new Date());

    var symbol = this.pair;
    // if (since) {
    //     this.startIndex += 1000
    // }

    // var params = {
    //     from: range.from.unix(),
    //     // till: range.to.unix(),
    //     by: 'ts',
    //     start_index: this.startIndex,
    //     max_results: 1000,
    //     format_item: 'object'
    // };

    this.hitbtc.getRecentTrades(symbol, {max_results: 1000, format_item: 'object'})
        .then(process)
        .catch(function(err) {
            console.log("hitbtc recentTrades error: ", err);
            if(err)
              return this.retry(this.getTrades, args);
        });
}

Trader.getCapabilities = function () {

    return {
        name: 'HitBTC',
        slug: 'hitbtc',
        currencies: ['ETH', 'BTC', 'USD', 'EUR'],
        assets: [
            'PPT', 'DGD', 'SBD', 'AMB', 'UET', 'BET', 'BMC', 'AMP', 'PQT', 'REP', 'ETH', 'ICX', 'RVT', 'GNO', 'BAS', 'MTH', 'CRS', 'DASH', 'ZEC', 'HPC', 'TIME', 'WINGS', 'YOYOW', 'ADX', 'ICN', 'AIR', 'EBET', 'MNE', 'SC', 'AVT', 'XTZ', 'WEALTH', 'XAUR', 'OPT', 'GUP', 'PLBT', '8BT', 'OAX', 'STX', 'NEO', 'NET', 'NXT', 'ARDR', 'PLU', 'DOGE', 'BCC', 'PTOY', 'HVN', 'CND', 'PPC', 'MCAP', 'FUEL', 'GAME', 'NTO', 'CFI', 'QCN', 'LUN', 'EDG', 'AE', 'BOS', 'PBKX', 'ICO', 'IXT', 'NXC', 'MYB', 'DCT', 'ZRX', 'STEEM', 'XEM', 'SWT', 'SUR', 'ANT', 'TKR', 'FCN', 'IML', 'MAID', 'WMGO', 'DENT', 'MSP', 'RLC', 'DSH', 'IGNIS', 'WTT', 'EMC', 'OMG', 'XRP', 'BUS', '1ST', 'PING', 'EOS', 'TNT', 'SNC', 'PIX', 'VERI', 'KC', 'QAU', 'TIX', 'LSK', 'CVC', 'XDNCO', 'PLR', 'LAT', 'FUN', 'XVG', 'MIPS', 'TRST', 'BQX', 'EMGO', 'QTUM', 'SAN', 'MANA', 'PAY', 'PRG', 'MPK', 'IND', 'COSS', 'SKIN', 'XMR', 'DDF', 'ICOS', 'EVX', 'AEON', 'NDC', 'BNT', 'ECAT', 'SNGLS', 'GRPH', 'FYN', 'ROOTS', 'DNT', 'WAVES', 'LTC', 'PRO', 'POE', 'ETC', 'DCN', 'TKN', 'LRC', 'HRB', 'CDT', 'DGB', 'SNT', 'DLT', 'CAT', 'FYP', 'BTC', 'RKC', 'DICE', 'SNM', 'MRV', 'ZRC', 'TAAS', 'STRAT', 'CSNO', 'XLC', 'XDN', 'ORME', 'BCN', 'TFL'
        ],
        markets: [
            { pair: ['ETH', 'CFI'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'CFI'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['EUR', 'LTC'], minimalOrder: { amount: 0.1, unit: 'currency' } },
            { pair: ['BTC', 'LTC'], minimalOrder: { amount: 0.1, unit: 'currency' } },
            { pair: ['USD', 'LTC'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['ETH', 'FYN'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'HPC'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'ETC'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'ETC'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', 'ETC'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'DGB'], minimalOrder: { amount: 100, unit: 'currency' } },
            { pair: ['USD', 'DGB'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['ETH', 'DGB'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['BTC', 'PING'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'YOYOW'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['BTC', 'DASH'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'DASH'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', 'DASH'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'IXT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'AVT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'XAUR'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['ETH', 'XAUR'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'DENT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'SAN'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'AIR'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['USD', 'AIR'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['ETH', 'AIR'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['ETH', 'PLR'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'XLC'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'ARDR'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'DOGE'], minimalOrder: { amount: 1000, unit: 'currency' } },
            { pair: ['USD', 'DOGE'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'MCAP'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'ZRC'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['EUR', 'STEEM'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['BTC', 'STEEM'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'CND'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'CND'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'CND'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'BCC'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'BCC'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'BCC'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', 'ICX'], minimalOrder: { amount: 100, unit: 'currency' } },
            { pair: ['ETH', 'ICX'], minimalOrder: { amount: 100, unit: 'currency' } },
            { pair: ['BTC', 'ICX'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['BTC', 'GRPH'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'AE'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'ORME'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['BTC', 'FUEL'], minimalOrder: { amount: 0.1, unit: 'currency' } },
            { pair: ['USD', 'FUEL'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['ETH', 'FUEL'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['BTC', 'TAAS'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['ETH', 'TAAS'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'MIPS'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['ETH', 'MYB'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'SKIN'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['ETH', 'PPT'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['BTC', 'XEM'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['USD', 'XEM'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['USD', 'CDT'], minimalOrder: { amount: 0.1, unit: 'currency' } },
            { pair: ['ETH', 'CDT'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['BTC', 'CDT'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['EUR', 'LSK'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['BTC', 'LSK'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'TIME'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', 'TIME'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'SNC'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'SNC'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'SNC'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'SC'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['ETH', 'MSP'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', 'BTC'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'BTC'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['EUR', 'BTC'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'OMG'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'XDN'], minimalOrder: { amount: 100, unit: 'currency' } },
            { pair: ['USD', 'XDN'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'DCN'], minimalOrder: { amount: 10000, unit: 'currency' } },
            { pair: ['USD', 'DCN'], minimalOrder: { amount: 1000, unit: 'currency' } },
            { pair: ['ETH', 'DCN'], minimalOrder: { amount: 10000, unit: 'currency' } },

            { pair: ['ETH', 'PAY'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'DNT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'MNE'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'TKN'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'AMB'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['USD', 'AMB'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['ETH', 'AMB'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['ETH', 'ZEC'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'ZEC'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'ZEC'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['ETH', 'TIX'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'BET'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'SBD'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['ETH', 'DICE'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'DICE'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['ETH', 'LRC'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['BTC', 'LRC'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'SNGLS'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'XMR'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['USD', 'XMR'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', 'XMR'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'EBET'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'REP'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'QCN'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'ECAT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'XTZ'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'XTZ'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'XTZ'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'PTOY'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', 'PTOY'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'HRB'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', '8BT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'BQX'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', 'ICOS'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'ICOS'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'ICOS'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'EOS'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'EOS'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'EOS'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'POE'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['BTC', 'POE'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'PRG'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'PRG'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'PRG'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'TNT'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'TNT'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'TNT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'STRAT'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'STRAT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['ETH', 'IML'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'RKC'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['BTC', 'FYP'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'QAU'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', 'QAU'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'WEALTH'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'EMC'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'FCN'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'SNM'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'BNT'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'BNT'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'BNT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'ZRX'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'ZRX'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'ZRX'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'GAME'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'EDG'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'OAX'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'OAX'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'OAX'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'NEO'], minimalOrder: { amount: 0.1, unit: 'currency' } },
            { pair: ['USD', 'NEO'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'NEO'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['ETH', 'IND'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['BTC', 'WTT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'PIX'], minimalOrder: { amount: 100, unit: 'currency' } },
            { pair: ['ETH', 'PIX'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['ETH', 'MRV'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'QTUM'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'PRO'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'STX'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'STX'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'STX'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'UET'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'CAT'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'CAT'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'CAT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'ROOTS'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'OPT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'XRP'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'LUN'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['ETH', 'PBKX'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'XDNCO'], minimalOrder: { amount: 100000, unit: 'currency' } },

            { pair: ['BTC', 'GUP'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['ETH', 'SNT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'SUR'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'WAVES'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'ICN'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['USD', 'CVC'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'XVG'], minimalOrder: { amount: 1000, unit: 'currency' } },
            { pair: ['USD', 'XVG'], minimalOrder: { amount: 1000, unit: 'currency' } },
            { pair: ['ETH', 'XVG'], minimalOrder: { amount: 1000, unit: 'currency' } },

            { pair: ['USD', 'BCN'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['BTC', 'BCN'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['BTC', '1ST'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', '1ST'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', 'MPK'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'LAT'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['USD', 'BMC'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'BMC'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'BMC'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['USD', 'CRS'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'DCT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'TRST'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'SWT'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['ETH', 'SWT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', 'MANA'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'IGNIS'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'DDF'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'MTH'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['ETH', 'MTH'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'EMGO'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'EMGO'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'BUS'], minimalOrder: { amount: 0.0001, unit: 'currency' } },

            { pair: ['BTC', 'WMGO'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['USD', 'WMGO'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['ETH', 'NET'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'NXT'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['USD', 'NXT'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'DGD'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'AMP'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['BTC', 'NXC'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'RLC'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'ETH'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'ETH'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['EUR', 'ETH'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'MAID'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['USD', 'MAID'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'WINGS'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'PLU'], minimalOrder: { amount: 1, unit: 'currency' } },
            { pair: ['ETH', 'PLU'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'HVN'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['ETH', 'HVN'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'CSNO'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'NTO'], minimalOrder: { amount: 100, unit: 'currency' } },

            { pair: ['BTC', 'TFL'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['ETH', 'ADX'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'DSH'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['ETH', 'TKR'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'VERI'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['USD', 'VERI'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['ETH', 'VERI'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'ANT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['ETH', 'NDC'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', 'PPC'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'PPC'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['USD', 'PQT'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['USD', 'EVX'], minimalOrder: { amount: 0.01, unit: 'currency' } },
            { pair: ['BTC', 'EVX'], minimalOrder: { amount: 0.1, unit: 'currency' } },
            { pair: ['ETH', 'EVX'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['BTC', 'BOS'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'ICO'], minimalOrder: { amount: 10, unit: 'currency' } },

            { pair: ['BTC', 'AEON'], minimalOrder: { amount: 0.1, unit: 'currency' } },

            { pair: ['BTC', 'RVT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['ETH', 'COSS'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['ETH', 'FUN'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['BTC', 'FUN'], minimalOrder: { amount: 10, unit: 'currency' } },
            { pair: ['USD', 'FUN'], minimalOrder: { amount: 1, unit: 'currency' } },

            { pair: ['ETH', 'BAS'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'GNO'], minimalOrder: { amount: 0.001, unit: 'currency' } },
            { pair: ['ETH', 'GNO'], minimalOrder: { amount: 0.01, unit: 'currency' } },

            { pair: ['BTC', 'PLBT'], minimalOrder: { amount: 0.001, unit: 'currency' } },

            { pair: ['BTC', 'DLT'], minimalOrder: { amount: 0.001, unit: 'currency' } }
        ],
        requires: ['key', 'secret'],
        providesHistory: 'date',
        providesFullHistory: true,
        tid: 'tid',
        tradable: true
    };
}

module.exports = Trader;
