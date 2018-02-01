

//var convnetjs = require('convnetjs')
// var z = require('zero-fill')
// var stats = require('stats-lite')
// var n = require('numbro')
var math = require('mathjs')
// const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
var _ = require('lodash');

const deepqlearn = require('convnetjs/build/deepqlearn');

var log = require('../core/log.js');

// the below line is for calculating the last mean vs the now mean.
var oldmean = 0
getOption = function () {

}


// let's create our own method
var method = {};

// Settings for indicators
var adxSettings = {
    optInTimePeriod: 14
};

var rsiSettings = adxSettings;


// prepare everything our method needs
var brain = undefined;
method.init = function() {
    this.requiredHistory = this.tradingAdvisor.historySize;
    log.debug('requiredHistory: ', this.requiredHistory);

    // Add indicators
    this.addTalibIndicator('myadx', 'adx', adxSettings);
    this.addTalibIndicator('myrsi', 'rsi', rsiSettings);

    // Define Q-learning state size
    // state = [closePrice, prevClosePrice, ADX, RSI] => 4
    this.stateSize = 4;


    // Create the 'brain' for Q-learning
    if (brain == undefined) {
        //brain = deepqlearn.Brain(this.stateSize, 3) // (4, 3)
    }
}



// what happens on every new candle?
var States = [];
var prevClosePrice = 0;
method.update = function(candle) {

    console.log('\tcandle: ', candle);

    // Get indicators values
    var adx = this.talibIndicators.myadx.result;
    var rsi = this.talibIndicators.myrsi.result;

    console.log('\tadx: ', adx);
    console.log('\trsi: ', rsi);

    // Create a state array and push values to it.
    var state = [];
    state.push(candle.close);
    if (prevClosePrice == 0) {
        prevClosePrice = candle.close;
        state.push(prevClosePrice);
    } else {
        state.push(prevClosePrice);
    }
    //state.push(prevClosePrice - candle.close);
    state.push(normalize(adx.outReal, 0, 100));
    state.push(normalize(rsi.outReal, 0, 100));
    console.log("state: ", state);

    // TODO: Handle Q-learning algo


    States.push(state);
    console.log("States: ", States);

    prevClosePrice = candle.close;

}


method.log = function() {
    // log.debug("prediction count:", predictioncount);
}



method.handleposition  = function(){

}

method.check = function() {

}

// Normalize values to range 0..1
var normalize = function(x, min, max) {
    return (x - min) / (max - min);
}

module.exports = method;
