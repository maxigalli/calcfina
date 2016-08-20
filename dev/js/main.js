(function(app, $) {
    app.c1 = function() {
        var cini = parseFloat(document.getElementById('c1-f1').value);
        var aper = parseFloat(document.getElementById('c1-f2').value);
        var freq = parseFloat(document.getElementById('c1-f3').value);
        var durac = parseFloat(document.getElementById('c1-f4').value);
        var int = parseFloat(document.getElementById('c1-f5').value);
        var aextra = parseFloat(document.getElementById('c1-f6').value);
        var mextra = parseFloat(document.getElementById('c1-f7').value);

        totalSaved = cini + durac * freq * aper + aextra;
        interestEarned = 0;
        balance = cini;

        for (var i = 0; i < freq * durac; i++) {
            interest = balance * (int / (100 * freq));
            interestEarned += interest;
            if (mextra == i + 1) {
                balance += interest + aper + aextra;
            } else {
                balance += interest + aper;
            }
        }

        console.log(cini);
        console.log(aper);
        console.log(freq);
        console.log(durac);
        console.log(int);
        console.log(aextra);
        console.log(mextra);
        console.log(totalSaved);
        console.log(interestEarned);
        console.log(balance);
    };

    app.c2 = function() {
        var goal = parseFloat(document.getElementById('c2-f1').value);
        var cini = parseFloat(document.getElementById('c2-f2').value);
        var freq = parseFloat(document.getElementById('c2-f3').value);
        var durac = parseFloat(document.getElementById('c2-f4').value);
        var int = parseFloat(document.getElementById('c2-f5').value);

        fv = app.financialFuncs.fv(int/(100 * freq), durac * freq, 0, cini);
        result = app.financialFuncs.pmt(int/(100 * freq), durac * freq, 0, goal + fv);

        console.log(goal);
        console.log(cini);
        console.log(freq);
        console.log(durac);
        console.log(int);
        console.log(result);
    };

    app.c3 = function() {


    };

    app.c4 = function() {
        var loanAm = parseFloat(document.getElementById('c4-f1').value);
        var int = parseFloat(document.getElementById('c4-f2').value);
        var durac = parseFloat(document.getElementById('c4-f3').value);
        var freq = 12;

        loanPmt = -1 * app.financialFuncs.pmt(int/(100 * freq), durac * freq, loanAm);
        totalPaid = durac * freq * loanPmt;
        intPaid = totalPaid - loanAm;


        console.log(loanAm);
        console.log(int);
        console.log(durac);
        console.log(loanPmt);
        console.log(totalPaid);
        console.log(intPaid);
    };

    app.c5 = function() {


    };

    app.c6 = function() {
        var nper = parseFloat(document.getElementById('c6-f2').value * 12);
        var pmt = parseFloat(document.getElementById('c6-f3').value);
        var pv = parseFloat(document.getElementById('c6-f1').value);
        var result =  app.financialFuncs.rate(nper, -pmt, pv);

        if (result) {
            console.log(result * 12);
        } else {
            console.log('no result found');
        }
    };

    app.c7 = function() {


    };

    app.c8 = function() {


    };

    app.c9 = function() {


    };

    app.c10 = function() {


    };

    app.showCalc = function(calc) {
        $('.calc-container').addClass('hidden');
        $(calc).removeClass('hidden');
    };

    app.getCalcFromUrl = function() {
        var url = location.href;
        var regexS = '[\\?&]' + 'c' + '=([^&#]*)';
        var regex = new RegExp(regexS);
        var results = regex.exec(url);

        return results == null ? null : results[1];
    };

    $(document).ready(function() {
        // Initializes mdb sideNav.
        $(".button-collapse").sideNav();

        // Material Select Initialization
        $('.mdb-select').material_select();

        // Shows the require calc, if present in query string.  If not
        // present, shows home page.
        var qs = '#' + app.getCalcFromUrl();
        if (!qs) {
            app.showCalc('#c0');
        } else {
            app.showCalc(qs);
        }
    });
})(window.app = window.app || {}, jQuery);