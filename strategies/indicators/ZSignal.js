// Author: Trashed (Github) / codetrasher (Discord)
//
// Smoothed z-score algorithm
// Link: https://stackoverflow.com/questions/22583391/peak-signal-detection-in-realtime-timeseries-data
//
// Smoothed z-score algorithm is used to detect spikes in time series data.

var math = require('mathjs');

var Indicator = function(config) {

    console.log('ZSignal - Indicator - config: ', config);

    this.input = 'price';
    this.lag = config.lag;
    this.threshold = config.threshold;
    this.influence = config.influence;

    // Counter keeps track of updates
    this.counter = 0;

    this.samples = [];
    this.signals = [];
    this.filteredY = [];
    this.avgFilter = [];
    this.stdFilter = [];

    // This is the signal we want.
    this.result;
}

Indicator.prototype.update = function(price) {
    // console.log('ZSignal - update - price: ', price);
    var sample = price;

    var avg = function(array) {
        var sum = 0;
        for (var i = 0; i < array.length; i++) {
            sum += array[i]
        }
        return sum / array.length;
    };


    this.samples[this.counter] = sample;
    if (this.counter <= this.lag) {

        this.filteredY[this.counter] = sample;

        // When the counter equals lag value, calculate values to avgFilter and stdFilter
        // arrays on the .
        if (this.counter == this.lag) {

            this.avgFilter[this.counter] = avg(this.samples);
            this.stdFilter[this.counter] = math.std(this.samples);
        }

    } else {


        // console.log('\t======== samples[i] - avgFilter[i-1]: ', math.abs(this.samples[this.counter] - this.avgFilter[this.counter - 1]));
        // console.log('is larger than');
        // console.log('\t======== threshold * stdFilter[i-1]: ', this.threshold * this.stdFilter[this.counter - 1]);



        if (math.abs(this.samples[this.counter] - this.avgFilter[this.counter - 1]) >
            this.threshold * this.stdFilter[this.counter - 1]) {

            if (this.samples[this.counter] > this.avgFilter[this.counter - 1]) {
                this.result = 1;
            } else {
                this.result = -1;
            }
            this.filteredY[this.counter] = this.influence * sample + (1 - this.influence) * this.filteredY[this.counter - 1];
            this.avgFilter[this.counter] = avg(this.filteredY.slice(this.counter - this.lag, this.counter));
            this.stdFilter[this.counter] = math.std(this.filteredY.slice(this.counter - this.lag, this.counter));
        } else {
            this.result = 0;

            this.filteredY[this.counter] = sample;
            this.avgFilter[this.counter] = avg(this.filteredY.slice(this.counter - this.lag, this.counter));
            this.stdFilter[this.counter] = math.std(this.filteredY.slice(this.counter - this.lag, this.counter));
        }
    }


    // console.log('Zsignal - counter: ', this.counter);
    // console.log('Zsignal - last sample: ', this.samples[this.counter]);
    // console.log('Zsignal - last avgFilte: ', this.avgFilter[this.counter]);
    // console.log('Zsignal - last stdFilte: ', this.stdFilter[this.counter]);
    // console.log('Zsignal - last signal: ', this.result);

    this.counter++;
}

module.exports = Indicator;
