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

    this.hitbtc = new HitBTC({key: this.key, secret: this.secret, isDemo: false});
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

    this.hitbtc.getMyBalance()
        .then(function(balance) {
            var portfolio = [];
            console.log(`My balance is ${balance}`);

            callback(err, portfolio);
        })
}


Trader.getCapabilities = function () {

    // TODO: Add currency/asset pairs

    return {
        name: 'HitBTC',
        slug: 'hitbtc',
        currencies: ['ETH', 'BTC', 'USD', 'EUR'],
        assets: [
            'PPT', 'DGD', 'SBD', 'AMB', 'UET', 'BET', 'BMC', 'AMP', 'PQT', 'REP', 'ETH', 'ICX', 'RVT', 'GNO', 'BAS', 'MTH', 'CRS', 'DASH', 'ZEC', 'HPC', 'TIME', 'WINGS', 'YOYOW', 'ADX', 'ICN', 'AIR', 'EBET', 'MNE', 'SC', 'AVT', 'XTZ', 'WEALTH', 'XAUR', 'OPT', 'GUP', 'PLBT', '8BT', 'OAX', 'STX', 'NEO', 'NET', 'NXT', 'ARDR', 'PLU', 'DOGE', 'BCC', 'PTOY', 'HVN', 'CND', 'PPC', 'MCAP', 'FUEL', 'GAME', 'NTO', 'CFI', 'QCN', 'LUN', 'EDG', 'AE', 'BOS', 'PBKX', 'ICO', 'IXT', 'NXC', 'MYB', 'DCT', 'ZRX', 'STEEM', 'XEM', 'SWT', 'SUR', 'ANT', 'TKR', 'FCN', 'IML', 'MAID', 'WMGO', 'DENT', 'MSP', 'RLC', 'DSH', 'IGNIS', 'WTT', 'EMC', 'OMG', 'XRP', 'BUS', '1ST', 'PING', 'EOS', 'TNT', 'SNC', 'PIX', 'VERI', 'KC', 'QAU', 'TIX', 'LSK', 'CVC', 'XDNCO', 'PLR', 'LAT', 'FUN', 'XVG', 'MIPS', 'TRST', 'BQX', 'EMGO', 'QTUM', 'SAN', 'MANA', 'PAY', 'PRG', 'MPK', 'IND', 'COSS', 'SKIN', 'XMR', 'DDF', 'ICOS', 'EVX', 'AEON', 'NDC', 'BNT', 'ECAT', 'SNGLS', 'GRPH', 'FYN', 'ROOTS', 'DNT', 'WAVES', 'LTC', 'PRO', 'POE', 'ETC', 'DCN', 'TKN', 'LRC', 'HRB', 'CDT', 'DGB', 'SNT', 'DLT', 'CAT', 'FYP', 'BTC', 'RKC', 'DICE', 'SNM', 'MRV', 'ZRC', 'TAAS', 'STRAT', 'CSNO', 'XLC', 'XDN', 'ORME', 'BCN', 'TFL'
        ],
        maxTradesAge: 60,
        maxHistoryFetch: null,
        markets: [
            { pair: ['USD', 'CFI'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'CFI'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'CFI'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'CFI'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'LTC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'LTC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'LTC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'LTC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'FYN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'FYN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'FYN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'FYN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'HPC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'HPC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'HPC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'HPC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'ETC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ETC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ETC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ETC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DGB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DGB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DGB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DGB'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PING'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PING'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PING'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PING'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'YOYOW'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'YOYOW'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'YOYOW'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'YOYOW'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DASH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DASH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DASH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DASH'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'IXT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'IXT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'IXT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'IXT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'AVT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'AVT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'AVT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'AVT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'XAUR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'XAUR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XAUR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XAUR'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DENT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DENT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DENT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DENT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'SAN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SAN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SAN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SAN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'AIR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'AIR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'AIR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'AIR'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'PLR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PLR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PLR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'PLR'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'XLC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XLC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'XLC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XLC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'ARDR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ARDR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ARDR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ARDR'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DOGE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DOGE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DOGE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DOGE'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MCAP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MCAP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MCAP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MCAP'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'ZRC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ZRC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ZRC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ZRC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'STEEM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'STEEM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'STEEM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'STEEM'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'CND'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'CND'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'CND'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'CND'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'BCC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'BCC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BCC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BCC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'ICX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ICX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ICX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ICX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'GRPH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'GRPH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'GRPH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'GRPH'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'AE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'AE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'AE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'AE'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'ORME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ORME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ORME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ORME'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'FUEL'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'FUEL'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'FUEL'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'FUEL'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'TAAS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'TAAS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TAAS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'TAAS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MIPS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MIPS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MIPS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MIPS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MYB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MYB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MYB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MYB'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'SKIN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SKIN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SKIN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SKIN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PPT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PPT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PPT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PPT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'XEM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XEM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XEM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XEM'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'CDT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'CDT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'CDT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'CDT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'LSK'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'LSK'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'LSK'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'LSK'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'TIME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'TIME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'TIME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TIME'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'SNC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SNC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SNC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SNC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'SC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MSP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MSP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MSP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MSP'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'BTC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BTC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BTC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'OMG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'OMG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'OMG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'OMG'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'XDN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XDN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XDN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XDN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DCN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PAY'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PAY'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PAY'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PAY'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DNT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MNE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MNE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MNE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MNE'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'TKN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TKN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'TKN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'TKN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'AMB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'AMB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'AMB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'AMB'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'ZEC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ZEC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ZEC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ZEC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'TIX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'TIX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'TIX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TIX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'BET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'BET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BET'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'SBD'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'SBD'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SBD'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SBD'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'DICE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DICE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DICE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'DICE'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'LRC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'LRC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'LRC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'LRC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'SNGLS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SNGLS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SNGLS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SNGLS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'XMR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XMR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XMR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XMR'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'EBET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'EBET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'EBET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'EBET'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'REP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'REP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'REP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'REP'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'QCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'QCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'QCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'QCN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'ECAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ECAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ECAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ECAT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'XTZ'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XTZ'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XTZ'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XTZ'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'PTOY'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'PTOY'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PTOY'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PTOY'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'HRB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'HRB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'HRB'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'HRB'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', '8BT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', '8BT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', '8BT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', '8BT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'BQX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'BQX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'BQX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BQX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'ICOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ICOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ICOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ICOS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'EOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'EOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'EOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'EOS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'POE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'POE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'POE'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'POE'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PRG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PRG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PRG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PRG'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'TNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'TNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'TNT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'STRAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'STRAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'STRAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'STRAT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'IML'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'IML'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'IML'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'IML'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'RKC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'RKC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'RKC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'RKC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'FYP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'FYP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'FYP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'FYP'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'QAU'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'QAU'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'QAU'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'QAU'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'WEALTH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'WEALTH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'WEALTH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'WEALTH'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'EMC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'EMC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'EMC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'EMC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'FCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'FCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'FCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'FCN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'SNM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SNM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SNM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'SNM'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'BNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'BNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BNT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'ZRX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ZRX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ZRX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ZRX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'GAME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'GAME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'GAME'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'GAME'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'EDG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'EDG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'EDG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'EDG'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'OAX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'OAX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'OAX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'OAX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'NEO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'NEO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'NEO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'NEO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'IND'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'IND'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'IND'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'IND'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'WTT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'WTT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'WTT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'WTT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PIX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PIX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PIX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PIX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'MRV'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'MRV'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MRV'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MRV'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'QTUM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'QTUM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'QTUM'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'QTUM'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PRO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PRO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PRO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PRO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'STX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'STX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'STX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'STX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'UET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'UET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'UET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'UET'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'CAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'CAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'CAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'CAT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'ROOTS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ROOTS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ROOTS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ROOTS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'OPT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'OPT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'OPT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'OPT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'XRP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XRP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XRP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XRP'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'LUN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'LUN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'LUN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'LUN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PBKX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PBKX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PBKX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PBKX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'XDNCO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XDNCO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XDNCO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XDNCO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'GUP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'GUP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'GUP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'GUP'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'SNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'SNT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SNT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'SUR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'SUR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SUR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SUR'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'WAVES'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'WAVES'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'WAVES'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'WAVES'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'ICN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ICN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'ICN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ICN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'CVC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'CVC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'CVC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'CVC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'XVG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'XVG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'XVG'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'XVG'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'BCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'BCN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'BCN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', '1ST'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', '1ST'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', '1ST'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', '1ST'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MPK'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MPK'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MPK'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MPK'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'LAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'LAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'LAT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'LAT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'BMC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BMC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BMC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'BMC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'CRS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'CRS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'CRS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'CRS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'DCT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'DCT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DCT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DCT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'TRST'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'TRST'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TRST'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'TRST'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'SWT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'SWT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'SWT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'SWT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MANA'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MANA'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MANA'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MANA'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'IGNIS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'IGNIS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'IGNIS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'IGNIS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'KC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'KC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'KC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'KC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DDF'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DDF'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DDF'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DDF'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MTH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MTH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MTH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MTH'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'EMGO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'EMGO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'EMGO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'EMGO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'BUS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BUS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BUS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'BUS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'WMGO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'WMGO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'WMGO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'WMGO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'NET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'NET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'NET'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'NET'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'NXT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'NXT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'NXT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'NXT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'DGD'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DGD'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DGD'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'DGD'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'AMP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'AMP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'AMP'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'AMP'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'NXC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'NXC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'NXC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'NXC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'RLC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'RLC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'RLC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'RLC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'ETH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ETH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ETH'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'MAID'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'MAID'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'MAID'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'MAID'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'WINGS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'WINGS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'WINGS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'WINGS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PLU'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PLU'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PLU'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PLU'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'HVN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'HVN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'HVN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'HVN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'CSNO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'CSNO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'CSNO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'CSNO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'NTO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'NTO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'NTO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'NTO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'TFL'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'TFL'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TFL'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'TFL'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'ADX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ADX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ADX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ADX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'DSH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'DSH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DSH'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DSH'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'TKR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'TKR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'TKR'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'TKR'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'VERI'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'VERI'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'VERI'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'VERI'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'ANT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ANT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ANT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ANT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'NDC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'NDC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'NDC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'NDC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'PPC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PPC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PPC'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'PPC'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PQT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PQT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PQT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PQT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'EVX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'EVX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'EVX'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'EVX'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'BOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'BOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BOS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'BOS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'ICO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'ICO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'ICO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'ICO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'AEON'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'AEON'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'AEON'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'AEON'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'RVT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'RVT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'RVT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'RVT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['USD', 'COSS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'COSS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'COSS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'COSS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['ETH', 'FUN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'FUN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'FUN'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'FUN'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['EUR', 'BAS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['BTC', 'BAS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'BAS'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'BAS'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'GNO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'GNO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'GNO'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'GNO'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'PLBT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'PLBT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'PLBT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'PLBT'], minimalOrder: { amount: 0, unit: 'currency' } },

            { pair: ['BTC', 'DLT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['USD', 'DLT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['ETH', 'DLT'], minimalOrder: { amount: 0, unit: 'currency' } },
            { pair: ['EUR', 'DLT'], minimalOrder: { amount: 0, unit: 'currency' } }
        ],
        requires: ['key', 'secret'],
        fetchTimeSpan: 60,
        tid: 'tid',
        tradable: true
    };
}

module.exports = Trader;
