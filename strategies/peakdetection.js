// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).
var math = require('mathjs');
var _ = require('lodash');
var log = require('../core/log');

// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
    // keep state about the current trend
    // here, on every new candle we use this
    // state object to check if we need to
    // report it.
    this.trend = {
      lastDirection: '',
      direction: 'none',
      duration: 0,
      persisted: false,
      adviced: false
    };

    this.uptrendStat = {
        avgDur: 0,
        duration: 0
    };

    this.downtrendStat = {
        avgDur: 0,
        duration: 0
    };

    console.log('peakdetection - settings: ', this.settings);

    this.requiredHistory = this.tradingAdvisor.historySize;


    this.addIndicator('zsignal', 'ZSignal', this.settings);
}

// What happens on every new candle?
strat.update = function(candle) {


}

// For debugging purposes.
strat.log = function() {
    var signal = this.indicators.zsignal.result;
    // var notZero = signal != 0 && undefined;
    // if (notZero) {
        log.debug('##### Smoothed Z-score #####');
        log.debug('\tsignal: ', signal);
        log.debug("\ttrend direction: ", this.trend.direction);
        log.debug("\ttrend duration: ", this.trend.duration);
        log.debug('\taverage up duration: ', this.uptrendStat.avgDur);
        log.debug('\taverage down duration: ', this.downtrendStat.avgDur);
        log.debug('############################\n\n');
        // log.debug("\ttrend persisted: ", this.trend.persisted);
        // log.debug('############################\n\n');
    // }
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {

    var zsignal = this.indicators.zsignal;

    if (zsignal.result == -1) {

        console.log('\n\tSignal: ', zsignal.result);

        if (this.trend.direction !== 'down') {

            // Calculate average duration for down trend.
            this.uptrendStat.avgDur = (this.uptrendStat.avgDur + this.uptrendStat.duration) / 2;

            this.trend = {
              duration: 0,
              persisted: false,
              direction: 'down',
              adviced: false
            };
        }

        this.downtrendStat.duration = this.trend.duration++;

        this.trend.persisted = this.trend.duration > 1;

        if (this.trend.persisted && !this.trend.adviced) {
            this.trend.adviced = true;
            console.log('\n\tBuy signal received.\n');
            this.advice('long');
        }

        this.advice();

    } else if (zsignal.result == 1) {

        console.log('\n\tSignal: ', zsignal.result);

        if (this.trend.direction !== 'up') {

            // Calculate average duration for down trend.
            this.downtrendStat.avgDur = (math.abs(this.downtrendStat.avgDur + this.downtrendStat.duration)) / 2;

            this.trend = {
              duration: 0,
              persisted: false,
              direction: 'up',
              adviced: false
            };
        }

        this.uptrendStat.duration = this.trend.duration++;

        this.trend.persisted = this.trend.duration > 1;
        this.trend.lastDirection = this.trend.direction;

        if (this.trend.persisted && !this.trend.adviced) {
            this.trend.adviced = true;
            console.log('\n\tSell signal received.\n');
            this.advice('short');
        }

        this.advice();
    } else {

        this.advice();

        this.trend = {
          duration: 0,
          persisted: false,
          direction: 'none',
          adviced: false
        };

    }
}

module.exports = strat;
