(function(app, $) {
    app.getPeriodText = function(per) {
        if (per == 360) {
            return ['En el D&iacute;a',
                'N&uacute;mero del d&iacute;a en el que se realiza el ahorro extraordinario.',
                'Diarios', 'D&iacute;as', 'D&iacute;a'];
        } else if (per == 52) {
            return ['En la Semana', 'N&uacute;mero de la semana en la que se realiza el ahorro extraordinario.',
                'Semanales', 'Semanas', 'Semana'];
        } else if (per == 26) {
            return ['En la Bisemana', 'N&uacute;mero de la bisemana en la que se realiza el ahorro extraordinario.',
                'Bisemanales', 'Bisemanas', 'Bisemana'];
        } else if (per == 24) {
            return ['En la Quincena', 'N&uacute;mero de la quincena en la que se realiza el ahorro extraordinario.',
                'Quincenales', 'Quincenas', 'Quincena'];
        } else if (per == 12) {
            return ['En el Mes', 'N&uacute;mero del mes en el que se realiza el ahorro extraordinario.',
                'Mensuales', 'Meses', 'Mes'];
        } else if (per == 6) {
            return ['En el Bimestre', 'N&uacute;mero del bimestre en el que se realiza el ahorro extraordinario.',
                'Bimestrales', 'Bimestres', 'Bimestre'];
        } else if (per == 3) {
            return ['En el Cuatrimestre',
                'N&uacute;mero del cuatrimestre en el que se realiza el ahorro extraordinario.',
                'Cuatrimestrales', 'Cuatrimestres', 'Cuatrimestre'];
        } else if (per == 2) {
            return ['En el Semestre',
                'N&uacute;mero del semestre en el que se realiza el ahorro extraordinario.',
                'Semestrales', 'Semestres', 'Semestre'];
        } else if (per == 1) {
            return ['En el A&ntilde;o',
                'N&uacute;mero del a&ntildeo en el que se realiza el ahorro extraordinario.',
                'Anuales', 'A&ntilde;os', 'A&ntilde;o'];
        }
    };

    app.numbersWithCommas = function(x, d) {
        d = typeof d !== 'undefined' ? d : 0;
        x = x.toFixed(d);
        var parts = x.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    app.validate = function(obj){
        var msg = '';
        // Checks if required value is null.
        if (obj.required && obj.value == null) {
            if (obj.requiredMsg) {
                msg = obj.requiredMsg;
            } else {
                msg += 'Este campo es obligatorio.  Por favor ingrese un valor.'
            }
        } else if (obj.value != null) {
            if (obj.type == 'number') {
                // Checks if value is not numeric.
                if (isNaN(obj.value) || !isFinite(obj.value)) {
                    msg += 'Este campo debe contener un valor num&eacute;rico';
                    if (obj.lowLimit) {
                        msg += ' igual o mayor que ' + obj.lowLimit;
                        if (obj.highLimit) {
                            msg += ' e';
                        }
                    }
                    if (obj.highLimit) {
                        msg += '  igual o menor que ' + obj.highLimit;
                    }
                    msg += '.';
                } else {
                    // Checks if value is out of bounds.
                    if ((obj.lowLimit != null && obj.value < obj.lowLimit) ||
                        (obj.highLimit != null && obj.value > obj.highLimit)) {
                        msg += 'Este campo debe contener un n&uacute;mero ';
                        if (obj.lowLimit != null && obj.highLimit != null) {
                            msg += 'entre ' + obj.lowLimit + ' y ' + obj.highLimit + '.';
                        } else if (obj.lowLimit != null && obj.highLimit == null) {
                            msg += 'igual o mayor que ' + obj.lowLimit;
                        } else if (obj.lowLimit == null && obj.highLimit != null) {
                            msg += 'igual o menor que ' + obj.highLimit;
                        }
                    }
                }
            }
        }

        // Writes validation message to DOM.
        if (msg != '') {
            $(obj.target).addClass('error');
            $(obj.target + '-v').html(msg);
            $(obj.target + '-v').removeClass('hidden');
            $(obj.target + '-h').addClass('hidden');

            return false;
        } else {
            $(obj.target).removeClass('error');
            $(obj.target + '-v').html('');
            $(obj.target + '-v').addClass('hidden');
            $(obj.target + '-h').removeClass('hidden');

            return true;
        }
    };

    app.c1 = function() {
        var validationFailed = false;
        var cini = {
            value: isNaN(parseFloat(document.getElementById('c1-f1').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c1-f1').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: null,
            target: '#c1-f1'
        };
        var aper = {
            value: isNaN(parseFloat(document.getElementById('c1-f2').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c1-f2').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: null,
            target: '#c1-f2'
        };
        var freq = {
            value: parseFloat(document.getElementById('c1-f3').value),
            required: true,
            type: 'number',
            lowLimit: null,
            highLimit: null,
            target: '#c1-f3'
        };
        var durac = {
            value: isNaN(parseFloat(document.getElementById('c1-f4').value))
                ? null
                : parseFloat(document.getElementById('c1-f4').value),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: null,
            target: '#c1-f4'
        };
        var int = {
            value: isNaN(parseFloat(document.getElementById('c1-f5').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c1-f5').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: 100,
            target: '#c1-f5'
        };
        var aextra = {
            value: isNaN(parseFloat(document.getElementById('c1-f6').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c1-f6').value * 100) / 100),
            required: false,
            type: 'number',
            lowLimit: 1,
            highLimit: null,
            target: '#c1-f6'
        };
        var mextra = {
            value: isNaN(parseInt(document.getElementById('c1-f7').value))
                ? null
                : parseInt(document.getElementById('c1-f7').value),
            required: aextra.value != null,
            requiredMsg: 'Si va a hacer un ahorro extraordinario, debe ingresar el n&uacute;mero del ' +
                'per&iacute;odo en que lo realizar&aacute;.',
            type: 'number',
            lowLimit: 1,
            highLimit: durac.value * freq.value,
            target: '#c1-f7'
        };

        // Performs validation for each form field.
        if (!app.validate(cini)) {
            validationFailed = true;
        }

        if (!app.validate(aper)) {
            validationFailed = true;
        }

        if (!app.validate(durac)) {
            validationFailed = true;
        }

        if (!app.validate(int)) {
            validationFailed = true;
        }

        if (!app.validate(aextra)) {
            validationFailed = true;
        }

        if (!app.validate(mextra)) {
            validationFailed = true;
        }

        // Calculates only if the validation did not fail.
        if (!validationFailed) {
            totalSaved = cini.value + durac.value * freq.value * aper.value + aextra.value;
            interestEarned = 0;
            balance = cini.value;

            for (var i = 0; i < freq.value * durac.value; i++) {
                interest = balance * (int.value / (100 * freq.value));
                interestEarned += interest;
                if (mextra.value == i + 1) {
                    balance += interest + aper.value + aextra.value;
                } else {
                    balance += interest + aper.value;
                }
            }

            // Generates results.
            var crMsg = '';
            var rsMsg = '';
            var p2Msg = '';
            var p3Msg = '';

            crMsg += '<li>Cantidad inicial de <strong>$' + app.numbersWithCommas(cini.value, 2) +
                '</strong></li>';
            crMsg += '<li>Aportes ' + app.getPeriodText(freq.value)[2].toLowerCase() +
                ' de <strong>$' + app.numbersWithCommas(aper.value, 2) + '</strong></li>';
            crMsg += '<li>Durante <strong>' + app.numbersWithCommas(durac.value * freq.value) + ' ' +
                app.getPeriodText(freq.value)[3].toLowerCase() + '</strong></li>';
            crMsg += '<li>Con tasa de inter&eacute;s anual del <strong>' + int.value.toFixed(2) + '%</strong></li>';
            if (aextra.value != null) {
                crMsg += '<li>Con un aporte extraordinario de <strong>$' + app.numbersWithCommas(aextra.value, 2) +
                    '</strong> en ' + app.getPeriodText(freq.value)[4].toLowerCase() + ' <strong>' +
                    mextra.value   + '</strong></li>';
            }

            p2Msg += 'Usted tendr&aacute;, al completar el &uacute;ltimo aporte, un balance de <strong>$' +
                app.numbersWithCommas(balance, 2) + '</strong>, desglosados as&iacute;:</li>';

            rsMsg += '<li>Cantidad inicial de <strong>$' + app.numbersWithCommas(cini.value, 2) + '</strong></li>';
            rsMsg += '<li>Aportes per&iacute;odicos por un total de <strong>$'
                + app.numbersWithCommas(durac.value * freq.value * aper.value, 2) + '</strong></li>';
            if (aextra.value != null) {
                rsMsg += '<li>Aporte extraordinario de <strong>$' +
                    app.numbersWithCommas(aextra.value, 2) + '</strong></li>';
            }
            rsMsg += '<li>Intereses ganados por un total de <strong>$' +
                app. numbersWithCommas(interestEarned, 2) + '</strong></li>';

            p3Msg += 'A continuaci&oacute;n el detalle de sus aportes e intereses:'

            // Writes results to DOM.
            $('#c1-criteria-list').html(crMsg);
            $('#c1-results-p2').html(p2Msg);
            $('#c1-result-list').html(rsMsg);
            $('#c1-results-p3').html(p3Msg);

            $('#c1-params').addClass('hidden');
            $('#c1-results').removeClass('hidden');

            console.log(cini.value);
            console.log(aper.value);
            console.log(freq.value);
            console.log(durac.value);
            console.log(int.value);
            console.log(aextra.value);
            console.log(mextra.value);
            console.log(totalSaved);
            console.log(interestEarned);
            console.log(balance);
        }

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

        // Initializes mdb material select.
        $('.mdb-select').material_select();

        // Listens for changes in mdb material selects.
        $('#c1-f3').change(function() {
            var periodText = app.getPeriodText(document.getElementById('c1-f3').value);
            $('label[for="c1-f7"]').html(periodText[0]);
            $('#c1-f7-h').html('(Opcional) ' + periodText[1]);
        });

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