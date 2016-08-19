(function(app, $) {
    app.interestRateCalculator = function() {
        var nper = parseFloat(document.getElementById('loan-period').value * 12);
        var pmt = parseFloat(document.getElementById('monthly-payment').value);
        var pv = parseFloat(document.getElementById('loan-amount').value);
        var result =  app.financialFuncs.rate(nper, -pmt, pv);

        if (result) {
            console.log(result * 12);
        }

    };

    $(document).ready(function() {
        // Initializes mdb sideNav.
        $(".button-collapse").sideNav();
    });
})(window.app = window.app || {}, jQuery);