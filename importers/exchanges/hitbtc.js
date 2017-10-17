var HitBTC = require("hitbtc-api");
var util = require('../../core/util.js');
var _ = require('lodash');
var moment = require('moment');
var log = require('../../core/log');

var config = util.getConfig();

var dirs = util.dirs();

var Fetcher = require(dirs.exchanges + 'hitbtc');


// Get trades
Fetcher.prototype.getTrades = function(next, callback) {
    var args = _.toArray(arguments);
    var process = function(result) {


        result = _.map(result.trades, function(trade) {
          return {
              tid: trade.tid,
              date: moment.utc(trade.date).unix(),
              price: +trade.price,
              amount: +trade.amount
          };
        });

        console.log("hitbtc fetch trades: ", result);
        console.log("trades.length: ", result.length)
        callback(result.reverse());
    }.bind(this);

    var symbol = this.pair;
    // console.log("iterator: ", iterator);
    console.log("hitbtc importer symbol: ", symbol);

    var params = {
        from: next.valueOf(),   // this has to be in millisecond to get it right
        // till: range.to.unix(),
        by: 'ts',
        start_index: 0,
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

// var iterator = false;
var from = false;
var end = false;
var done = false;

var lastId = false;
var prevLastId = false;

var nextTimestamp;


var fetcher = new Fetcher(config.watch);

var fetch = () => {
    // log.info(
    //     config.watch.currency,
    //     config.watch.asset,
    //     'Requesting data from',
    //     iterator.from.format('YYYY-MM-DD HH:mm:ss') + ',',
    //     'to',
    //     iterator.to.format('YYYY-MM-DD HH:mm:ss')
    // );
    //
    // if (util.gekkoEnv === 'child-process') {
    //     let msg = ['Requesting data from',
    //     iterator.from.format('YYYY-MM-DD HH:mm:ss') + ',',
    //     'to',
    //     iterator.to.format('YYYY-MM-DD HH:mm:ss')].join('');
    //   process.send({type: 'log', log: msg});
    // }


    if (nextTimestamp) {
        setTimeout(() => {
            fetcher.getTrades(nextTimestamp, handleFetch);
        }, 500);
    } else {
        console.log("firstFetch!");
        // lastTimestamp = iterator.from.unix;
        // iterator.lastIndex += 1000;
        fetcher.getTrades(from, handleFetch);
    }
}

var handleFetch = trades => {

    // console.log("trades: ", trades);

    var last = moment.unix(_.first(trades).date);
    console.log("LAST: ", last);
    lastId = _.first(trades).tid;
    console.log("LAST ID: ", lastId);
    console.log("PREVIOUS ID: ", prevLastId);

    if (last < from) {
        console.log("Skipping...");
        log.debug("Skipping data, they are before from date", last.format());
        return fetch();
    }

    if (last > end || lastId === prevLastId) {

        console.log("DOOOOONE");

        var endUnix = end.unix();
        trades = _.filter(
            trades,
            t => t.date <= endUnix
        )

        console.log("finishing trades: ", trades);

        fetcher.emit('done');
    }
    prevLastId = lastId;
    nextTimestamp = last;
    fetcher.emit('trades', trades);

}

module.exports = function (daterange) {

  from = daterange.from.clone();
  end = daterange.to.clone();

  return {
    bus: fetcher,
    fetch: fetch
  }
}
