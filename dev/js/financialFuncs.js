(function(app, $) {
    app.financialFuncs = {
        rate: function(nper, pmt, pv, fv, type, guess) {
            // Sets default values for missing parameters
            fv = typeof fv !== 'undefined' ? fv : 0;
            type = typeof type !== 'undefined' ? type : 0;
            guess = typeof guess !== 'undefined' ? guess : 0.1;

            // Sets the limits for possible rate values to any
            // number between 0% and 100%
            var lowLimit = 0;
            var highLimit = 1;

            // Defines a tolerance of up to +/- 0.00005% of pmt, to accept
            // the solution as valid.
            var tolerance = Math.abs(0.00000005 * pmt);

            // Tries at most 40 times to find a solution within the tolerance.
            for (var i = 0; i < 60; i++) {
                // Resets the balance to the original pv.
                var balance = pv;

                // Calculates the balance at the end of the loan, based
                // on loan conditions.
                for (var j = 0; j < nper; j++ ) {
                    if (type == 0) {
                        // Interests applied before payment
                        balance = balance * (1 + guess) + pmt;
                    } else {
                        // Payments applied before insterests
                        balance = (balance + pmt) * (1 + guess);
                    }
                }

                // Returns the guess if balance is within tolerance.  If not, adjusts
                // the limits and start with a new guess.
                if (Math.abs(balance + fv) < tolerance) {
                    return guess;
                } else if (balance + fv > 0) {
                    // Sets a new highLimit knowing that
                    // the current guess was too big.
                    highLimit = guess;
                } else  {
                    // Sets a new lowLimit knowing that
                    // the current guess was too small.
                    lowLimit = guess;
                }

                // Calculates the new guess.
                guess = (highLimit + lowLimit) / 2;
            }

            // Returns null if no acceptable result was found.
            return null;
        },
        pmt: function(rate, nper, pv, fv, type) {
            // Sets default values for missing parameters
            fv = typeof fv !== 'undefined' ? fv : 0;
            type = typeof type !== 'undefined' ? type : 0;

            var q = Math.pow(1 + rate, nper);

            return -(rate * (fv + (q * pv))) / ((-1 + q) * (1 + rate * type));
        },
        fv: function(rate, nper, pmt, pv, type) {
            // Sets default values for missing parameters
            pv = typeof pv !== 'undefined' ? pv : 0;
            type = typeof type !== 'undefined' ? type : 0;

            return -pv * Math.pow((1 + rate), nper);
        }
    }
})(window.app = window.app || {}, jQuery);
