var HitBTC = require("hitbtc-api");
var util = require('../../core/util.js');
var _ = require('lodash');
var moment = require('moment');
var log = require('../../core/log');

var config = util.getConfig();

var dirs = util.dirs();

var Fetcher = require(dirs.exchanges + 'hitbtc');

var batchSize = 60 * 2; // 2 hours
var overlapSize = 10; // 10 minutes

// Helper methods
// function joinCurrencies(a, b) {
//     return a + b;
// }

// Get trades
Fetcher.prototype.getTrades = function(range, callback) {
    var args = _.toArray(arguments);
    var process = function(result) {

        // console.log("hitbtc fetch result: ", result);

        trades = _.map(result.trades, function(trade) {
          return {
              tid: trade.tid,
              date: moment.utc(trade.date).unix(),
              price: +trade.price,
              amount: +trade.amount
          };
        });

        callback(trades.reverse());
    }.bind(this);

    var symbol = this.pair;
    console.log("range: ", range);
    console.log("hitbtc importer symbol: ", symbol);
    var params = {
        from: range.from.unix(),
        till: range.to.unix(),
        by: 'ts',
        start_index: this.startIndex,
        max_results: 1000,
        format_item: 'object'
    };
    // this.startIndex += 1000;
    console.log("hitbtc import params: ", params);

    this.hitbtc.getTrades(symbol, params)
        .then(process)
        .catch(function(err) {
            console.error("hitbtc fetch error: ", err);
            return this.retry(this.getTrades, args);
        });
}

util.makeEventEmitter(Fetcher);

var iterator = false;
var end = false;
var done = false;

var fetcher = new Fetcher(config.watch);

var fetch = () => {
    log.info(
        config.watch.currency,
        config.watch.asset,
        'Requesting data from',
        iterator.from.format('YYYY-MM-DD HH:mm:ss') + ',',
        'to',
        iterator.to.format('YYYY-MM-DD HH:mm:ss')
    );

    if (util.gekkoEnv === 'child-process') {
        let msg = ['Requesting data from',
        iterator.from.format('YYYY-MM-DD HH:mm:ss') + ',',
        'to',
        iterator.to.format('YYYY-MM-DD HH:mm:ss')].join('');
      process.send({type: 'log', log: msg});
    }
    fetcher.getTrades(iterator, handleFetch);
}

var handleFetch = trades => {

    console.log("hitbtc handleFetch trades: ", trades);

    iterator.from.add(batchSize, 'minutes').subtract(overlapSize, 'minutes');
    iterator.to.add(batchSize, 'minutes').subtract(overlapSize, 'minutes');

    if(!_.size(trades)) {
      // fix https://github.com/askmike/gekko/issues/952
      if(iterator.to.clone().add(batchSize * 4, 'minutes') > end) {
        fetcher.emit('done');
      }

      return fetcher.emit('trades', []);
    }

    var last = moment.unix(_.last(trades).date);

    if(last > end) {
      fetcher.emit('done');

      var endUnix = end.unix();
      trades = _.filter(
        trades,
        t => t.date <= endUnix
      );
    }

    fetcher.emit('trades', trades);
}

module.exports = function (daterange) {
  iterator = {
    from: daterange.from.clone(),
    to: daterange.from.clone().add(batchSize, 'minutes')
  }
  end = daterange.to.clone();

  return {
    bus: fetcher,
    fetch: fetch
  }
}
