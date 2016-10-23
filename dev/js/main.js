(function(app, $) {
    app.calcBack = function(c) {
        $('#c' + c + '-params').removeClass('hidden');
        $('#c' + c + '-results').addClass('hidden');
    };

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
                        msg += ' igual o mayor que ' + app.numbersWithCommas(obj.lowLimit, 2);
                        if (obj.highLimit) {
                            msg += ' e';
                        }
                    }
                    if (obj.highLimit) {
                        msg += '  igual o menor que ' + app.numbersWithCommas(obj.highLimit, 2);
                    }
                    msg += '.';
                } else {
                    // Checks if value is out of bounds.
                    if ((obj.lowLimit != null && obj.value < obj.lowLimit) ||
                        (obj.highLimit != null && obj.value > obj.highLimit)) {
                        msg += 'Este campo debe contener un n&uacute;mero ';
                        if (obj.lowLimit != null && obj.highLimit != null) {
                            msg += 'entre ' + app.numbersWithCommas(obj.lowLimit, 2) + ' y ' +
                                app.numbersWithCommas(obj.highLimit, 2) + '.';
                        } else if (obj.lowLimit != null && obj.highLimit == null) {
                            msg += 'igual o mayor que ' + app.numbersWithCommas(obj.lowLimit, 2);
                        } else if (obj.lowLimit == null && obj.highLimit != null) {
                            msg += 'igual o menor que ' + app.numbersWithCommas(obj.highLimit, 2);
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
        var totalSaved = 0;
        var interestEarned = 0;
        var balance = 0;
        var interest = 0;
        var crMsg = '';
        var rsMsg = '';
        var p2Msg = '';
        var p3Msg = '';
        var tblContent = '';
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
            lowLimit: 1,
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
            balance = cini.value;
            tblContent += '<tr><td class="text-xs-center">0</td><td></td><td></td><td class="text-xs-right">' +
                app.numbersWithCommas(cini.value, 2)+ '</td></tr>';

            // Calculates the rows of the result table and the final balance.
            for (var i = 0; i < freq.value * durac.value; i++) {
                var p = i + 1;
                var a = aper.value;
                interest = balance * (int.value / (100 * freq.value));
                interestEarned += interest;
                if (mextra.value == p) {
                    a += aextra.value;
                }
                balance += a + interest;
                tblContent += '<tr><td class="text-xs-center">' + p +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(a, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(interest, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(balance, 2) + '</td></tr>';
            }

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

            p3Msg += 'A continuaci&oacute;n la proyecci&oacute;n de sus aportes e intereses:';

            // Writes results to DOM.
            $('#c1-criteria-list').html(crMsg);
            $('#c1-results-p2').html(p2Msg);
            $('#c1-result-list').html(rsMsg);
            $('#c1-results-p3').html(p3Msg);
            $('#c1-tbody').html(tblContent);

            $('#c1-params').addClass('hidden');
            $('#c1-results').removeClass('hidden');
            $('html,body').scrollTop(0);
        }
    };

    app.c2 = function() {
        var interestEarned = 0;
        var balance = 0;
        var interest = 0;
        var crMsg = '';
        var rsMsg = '';
        var p2Msg = '';
        var p3Msg = '';
        var tblContent = '';
        var validationFailed = false;

        var goal = {
            value: isNaN(parseFloat(document.getElementById('c2-f1').value))
                ? null
                : parseFloat(Math.round(parseFloat(document.getElementById('c2-f1').value) * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0.01,
            highLimit: null,
            target: '#c2-f1'
        };
        var cini = {
            value: isNaN(parseFloat(document.getElementById('c2-f2').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c2-f2').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: goal.value,
            target: '#c2-f2'
        };
        var freq = {
            value: parseFloat(document.getElementById('c2-f3').value),
            required: true,
            type: 'number',
            lowLimit: null,
            highLimit: null,
            target: '#c2-f3'
        };
        var durac = {
            value: isNaN(parseFloat(document.getElementById('c2-f4').value))
                ? null
                : parseFloat(document.getElementById('c2-f4').value),
            required: true,
            type: 'number',
            lowLimit: 1,
            highLimit: null,
            target: '#c2-f4'
        };
        var int = {
            value: isNaN(parseFloat(document.getElementById('c2-f5').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c2-f5').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: 100,
            target: '#c2-f5'
        };

        // Performs validation for each form field.
        if (!app.validate(goal)) {
            validationFailed = true;
        }

        if (!app.validate(cini)) {
            validationFailed = true;
        }

        if (!app.validate(durac)) {
            validationFailed = true;
        }

        if (!app.validate(int)) {
            validationFailed = true;
        }

        // Calculates only if the validation did not fail.
        if (!validationFailed) {
            fv = app.financialFuncs.fv(int.value / (100 * freq.value), durac.value * freq.value, 0, cini.value);
            result = -1 * app.financialFuncs.pmt(int.value / (100 * freq.value), durac.value * freq.value, 0, goal.value + fv);
            balance = cini.value;
            tblContent += '<tr><td class="text-xs-center">0</td><td></td><td></td><td class="text-xs-right">' +
                app.numbersWithCommas(cini.value, 2)+ '</td></tr>';

            // Calculates the rows of the result table and the final balance.
            for (var i = 0; i < freq.value * durac.value; i++) {
                var p = i + 1;
                var a = result;
                interest = balance * (int.value / (100 * freq.value));
                interestEarned += interest;
                balance += a + interest;
                tblContent += '<tr><td class="text-xs-center">' + p +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(a, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(interest, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(balance, 2) + '</td></tr>';
            }

            crMsg += '<li>Meta de ahorro de <strong>$' + app.numbersWithCommas(goal.value, 2) +
                '</strong></li>';
            crMsg += '<li>Cantidad inicial de <strong>$' + app.numbersWithCommas(cini.value, 2) +
                '</strong></li>';
            crMsg += '<li>Mediante aportes <strong>' + app.getPeriodText(freq.value)[2].toLowerCase() +
                '</strong> durante <strong>' + app.numbersWithCommas(durac.value * freq.value) + '</strong> ' +
                app.getPeriodText(freq.value)[3].toLowerCase() + '</li>';
            crMsg += '<li>Recibiendo una tasa de inter&eacute;s anual del <strong>' + int.value.toFixed(2) +
                '%</strong></li>';

            p2Msg += 'Usted tendr&aacute; que realizar aportes ' + app.getPeriodText(freq.value)[2].toLowerCase() +
                ' de <strong>$' + app.numbersWithCommas(result, 2) + '</strong>.';

            p3Msg += 'A continuaci&oacute;n la proyecci&oacute;n de sus aportes e intereses:';

            // Writes results to DOM.
            $('#c2-criteria-list').html(crMsg);
            $('#c2-results-p2').html(p2Msg);
            $('#c2-results-p3').html(p3Msg);
            $('#c2-tbody').html(tblContent);

            $('#c2-params').addClass('hidden');
            $('#c2-results').removeClass('hidden');
            $('html,body').scrollTop(0);
        }
    };

    app.c3 = function() {
        var balance = 0;
        var interest = 0;
        var periods = 0;
        var endLoop = false;
        var crMsg = '';
        var rsMsg = '';
        var p2Msg = '';
        var p3Msg = '';
        var tblContent = '';
        var validationFailed = false;

        var goal = {
            value: isNaN(parseFloat(document.getElementById('c3-f1').value))
                ? null
                : parseFloat(Math.round(parseFloat(document.getElementById('c3-f1').value) * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0.01,
            highLimit: null,
            target: '#c3-f1'
        };
        var cini = {
            value: isNaN(parseFloat(document.getElementById('c3-f2').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c3-f2').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: goal.value,
            target: '#c3-f2'
        };
        var aper = {
            value: isNaN(parseFloat(document.getElementById('c3-f3').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c3-f3').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0.01,
            highLimit: goal.value - cini.value,
            target: '#c3-f3'
        };
        var freq = {
            value: parseFloat(document.getElementById('c3-f4').value),
            required: true,
            type: 'number',
            lowLimit: null,
            highLimit: null,
            target: '#c3-f4'
        };
        var int = {
            value: isNaN(parseFloat(document.getElementById('c3-f5').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c3-f5').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: 100,
            target: '#c3-f5'
        };

        // Performs validation for each form field.
        if (!app.validate(goal)) {
            validationFailed = true;
        }

        if (!app.validate(cini)) {
            validationFailed = true;
        }

        if (!app.validate(aper)) {
            validationFailed = true;
        }

        if (!app.validate(freq)) {
            validationFailed = true;
        }

        if (!app.validate(int)) {
            validationFailed = true;
        }

        // Calculates only if the validation did not fail.
        if (!validationFailed) {
            balance = cini.value;
            tblContent += '<tr><td class="text-xs-center">0</td><td></td><td></td><td class="text-xs-right">' +
                app.numbersWithCommas(cini.value, 2)+ '</td></tr>';

            // Calculates the rows of the result table and the final balance.
            for (var i = 0; i < 1000000; i++) {
                var p = i + 1;
                var a = aper.value;
                interest = balance * (int.value / (100 * freq.value));
                periods++;
                balance += a + interest;

                tblContent += '<tr><td class="text-xs-center">' + p +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(a, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(interest, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(balance, 2) + '</td></tr>';

                if (balance > goal.value) {
                    break;
                }
            }

            crMsg += '<li>Meta de ahorro de <strong>$' + app.numbersWithCommas(goal.value, 2) +
                '</strong></li>';
            crMsg += '<li>Cantidad inicial de <strong>$' + app.numbersWithCommas(cini.value, 2) +
                '</strong></li>';
            crMsg += '<li>Mediante aportes <strong>' + app.getPeriodText(freq.value)[2].toLowerCase() +
                '</strong> de <strong>$' + app.numbersWithCommas(aper.value, 2) + '</strong>.';
            crMsg += '<li>Recibiendo una tasa de inter&eacute;s anual del <strong>' + int.value.toFixed(2) +
                '%</strong></li>';

            p2Msg += 'Usted tendr&aacute; que realizar <strong>' +  app.numbersWithCommas(periods) +
                '</strong> aportes ' + app.getPeriodText(freq.value)[2].toLowerCase() +
                '.  La meta la alcanzar&aacute; en <strong>' + app.numbersWithCommas(periods / freq.value, 2) +
                '</strong> a&ntilde;os.';

            p3Msg += 'A continuaci&oacute;n la proyecci&oacute;n de sus aportes e intereses:';

            // Writes results to DOM.
            $('#c3-criteria-list').html(crMsg);
            $('#c3-results-p2').html(p2Msg);
            $('#c3-results-p3').html(p3Msg);
            $('#c3-tbody').html(tblContent);

            $('#c3-params').addClass('hidden');
            $('#c3-results').removeClass('hidden');
            $('html,body').scrollTop(0);
        }
    };

    app.c4 = function() {
        var balance = 0;
        var interest = 0;
        var capital = 0;
        var interestPaid = 0;
        var crMsg = '';
        var rsMsg = '';
        var p2Msg = '';
        var p3Msg = '';
        var tblContent = '';
        var validationFailed = false;
        var loanPmt = 0;
        var totalPaid = 0;
        var intPaid = 0;
        var nterm = 0;

        var freq = 12;
        var loanAm = {
            value: isNaN(parseFloat(document.getElementById('c4-f1').value))
                ? null
                : parseFloat(Math.round(parseFloat(document.getElementById('c4-f1').value) * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: null,
            target: '#c4-f1'
        };
        var int = {
            value: isNaN(parseFloat(document.getElementById('c4-f2').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c4-f2').value * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: 100,
            target: '#c4-f2'
        };
        var durac = {
            value: isNaN(parseFloat(document.getElementById('c4-f3').value))
                ? null
                : parseFloat(document.getElementById('c4-f3').value),
            required: true,
            type: 'number',
            lowLimit: 1,
            highLimit: null,
            target: '#c4-f3'
        };
        var aextrainit = {
            value: isNaN(parseFloat(document.getElementById('c4-f4').value))
                ? 0
                : parseFloat(Math.round(document.getElementById('c4-f4').value * 100) / 100),
            required: false,
            type: 'number',
            lowLimit: 0,
            highLimit: null,
            target: '#c4-f4'
        };
        var aextra = {
            value: isNaN(parseFloat(document.getElementById('c4-f5').value))
                ? null
                : parseFloat(Math.round(document.getElementById('c4-f5').value * 100) / 100),
            required: false,
            type: 'number',
            lowLimit: 0,
            highLimit: null,
            target: '#c4-f5'
        };
        var mextra = {
            value: isNaN(parseInt(document.getElementById('c4-f6').value))
                ? null
                : parseInt(document.getElementById('c4-f6').value),
            required: aextra.value != null,
            requiredMsg: 'Si va a hacer un ahorro extraordinario, debe ingresar el n&uacute;mero del ' +
            'mes en que lo realizar&aacute;.',
            type: 'number',
            lowLimit: 1,
            highLimit: durac.value * freq,
            target: '#c4-f6'
        };

        // Performs validation for each form field.
        if (!app.validate(loanAm)) {
            validationFailed = true;
        }

        if (!app.validate(int)) {
            validationFailed = true;
        }

        if (!app.validate(durac)) {
            validationFailed = true;
        }

        if (!app.validate(aextrainit)) {
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
            loanPmt = -1 * app.financialFuncs.pmt(int.value /(100 * freq), durac.value * freq, loanAm.value);
            totalPaid = durac.value * freq * loanPmt;
            intPaid = totalPaid - loanAm.value;
            balance = loanAm.value;

            tblContent += '<tr><td class="text-xs-center">0</td><td></td><td><td></td></td><td></td>' +
                '<td class="text-xs-right">' + app.numbersWithCommas(loanAm.value, 2)+ '</td></tr>';

            // Calculates the rows of the result table and the final balance.
            for (var i = 0; i < freq * durac.value; i++) {
                var p = i + 1;
                var a = aextrainit.value;
                var pmt = loanPmt;
                var endLoop = false;
                nterm++;
                interest = balance * (int.value / (100 * freq));
                interestPaid += interest;
                if (mextra.value == p) {
                    a += aextra.value;
                }
                if (balance + interest < pmt + a) {
                    if (balance + interest < pmt) {
                        pmt = balance + interest;
                        a = 0;
                    } else {
                        a = balance + interest - pmt;
                    }
                    endLoop = true;
                }
                capital = pmt + a - interest;
                balance -= capital;
                tblContent += '<tr><td class="text-xs-center">' + p +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(pmt, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(a, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(interest, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(capital, 2) +
                    '</td><td class="text-xs-right">' + app.numbersWithCommas(balance, 2) + '</td></tr>';
                if (endLoop) {
                    break;
                }
            }

            crMsg += '<li>Monto del pr&eacute;stamo de <strong>$' + app.numbersWithCommas(loanAm.value, 2) +
                '</strong></li>';
            crMsg += '<li>Con tasa de inter&eacute;s anual del <strong>' + int.value.toFixed(2) + '%</strong></li>';
            crMsg += '<li>Durante <strong>' + app.numbersWithCommas(durac.value) + '</strong> a&ntilde;os</li>';
            p2Msg += 'Usted tendr&aacute; que pagar una letra mensual de <strong>$' +
                app.numbersWithCommas(loanPmt, 2) + '</strong>.  Durante la vida del pr&eacute;stamo, usted' +
                ' realizar&aacute; pagos por un total de <strong>$' + app.numbersWithCommas(totalPaid, 2) +
                '</strong>, correspondientes a <strong>$'+ app.numbersWithCommas(intPaid, 2) + '</strong> de intereses' +
                ' y <strong>$' + app.numbersWithCommas(loanAm.value, 2) + '</strong> de capital.';

            if (aextrainit.value != 0) {
                p3Msg += 'Si usted realiza pagos adicionales de <strong>$' + app.numbersWithCommas(aextrainit.value, 2) +
                    '</strong> mensuales';
                if (aextra.value) {
                    p3Msg += ' y un pago extraordinario de <strong>$' + app.numbersWithCommas(aextra.value, 2) +
                            '</strong> en el mes <strong>' + app.numbersWithCommas(mextra.value) + '</strong>, ';
                } else {
                    p3Msg += ', ';
                }
                p3Msg += 'el pr&eacute;stamo quedar&aacute; cancelado en <strong>' + app.numbersWithCommas(nterm) +
                        '</strong> meses, ahorrando <strong>' + app.numbersWithCommas(freq * durac.value - nterm) +
                        '</strong> meses y <strong>$' + app.numbersWithCommas(intPaid - interestPaid, 2) +
                        '</strong> en intereses.'
            } else if (aextra.value) {
                p3Msg += 'Si usted realiza un pago extraordinario de <strong>$' + app.numbersWithCommas(aextra.value, 2) +
                    '</strong> en el mes <strong>' + app.numbersWithCommas(mextra.value) + '</strong>, ';
                p3Msg += 'el pr&eacute;stamo quedar&eacute; cancelado en <strong>' + app.numbersWithCommas(nterm) +
                    '</strong> meses, ahorrando <strong>' + app.numbersWithCommas(freq * durac.value - nterm) +
                    '</strong> meses y <strong>$' + app.numbersWithCommas(intPaid - interestPaid, 2) +
                    '</strong> en intereses.'
            }

            // Writes results to DOM.
            $('#c4-criteria-list').html(crMsg);
            $('#c4-results-p2').html(p2Msg);
            $('#c4-result-list').html(rsMsg);
            $('#c4-results-p3').html(p3Msg);
            $('#c4-tbody').html(tblContent);

            $('#c4-params').addClass('hidden');
            $('#c4-results').removeClass('hidden');
            $('html,body').scrollTop(0);
        }
    };

    app.c5 = function() {


    };

    app.c6 = function() {
        var crMsg = '';
        var rsMsg = '';
        var p2Msg = '';
        var validationFailed = false;
        var intRate = null;
        var loanAm = {
            value: isNaN(parseFloat(document.getElementById('c6-f1').value))
                ? null
                : parseFloat(Math.round(parseFloat(document.getElementById('c6-f1').value) * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: 0,
            highLimit: null,
            target: '#c6-f1'
        };
        var durac = {
            value: isNaN(parseFloat(document.getElementById('c6-f2').value))
                ? null
                : parseFloat(document.getElementById('c6-f2').value),
            required: true,
            type: 'number',
            lowLimit: 1,
            highLimit: null,
            target: '#c6-f2'
        };
        var pmt = {
            value: isNaN(parseFloat(document.getElementById('c6-f3').value))
                ? null
                : parseFloat(Math.round(parseFloat(document.getElementById('c6-f3').value) * 100) / 100),
            required: true,
            type: 'number',
            lowLimit: loanAm.value / (12 * durac.value),
            highLimit: -1 * app.financialFuncs.pmt(100 /(100 * 12), durac.value * 12, loanAm.value),
            target: '#c6-f3'
        };

        // Performs validation for each form field.
        if (!app.validate(loanAm)) {
            validationFailed = true;
        }

        if (!app.validate(durac)) {
            validationFailed = true;
        }

        if (!app.validate(pmt)) {
            validationFailed = true;
        }

        // Calculates only if the validation did not fail.
        if (!validationFailed) {
            intRate =  app.financialFuncs.rate(durac.value * 12, -pmt.value, loanAm.value);
            if (intRate) {
                crMsg += '<li>Monto del pr&eacute;stamo de <strong>$' + app.numbersWithCommas(loanAm.value, 2) +
                    '</strong></li>';
                crMsg += '<li>Con una letra mensual de <strong>$' + app.numbersWithCommas(pmt.value, 2) +
                    '</strong></li>';
                crMsg += '<li>Durante <strong>' + app.numbersWithCommas(durac.value) + '</strong> a&ntilde;os</li>';
                p2Msg += 'Tiene una tasa de inter&eacute;s real de <strong>' +
                    app.numbersWithCommas(intRate * 12 * 100, 2) + '%</strong>.';
            } else {
                console.log('no result found');
            }

            // Writes results to DOM.
            $('#c6-criteria-list').html(crMsg);
            $('#c6-results-p2').html(p2Msg);

            $('#c6-params').addClass('hidden');
            $('#c6-results').removeClass('hidden');
            $('html,body').scrollTop(0);
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
        $('.result-card').addClass('hidden');
        $('.params-card').removeClass('hidden');
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

        // Initializes the tooltips.
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });

        // Listens for changes in mdb material selects.
        $('#c1-f3').change(function() {
            var periodText = app.getPeriodText(document.getElementById('c1-f3').value);
            $('label[for="c1-f7"]').html(periodText[0]);
            $('#c1-f7-h').html('(Opcional) ' + periodText[1]);
            console.log(periodText[4]);
            $('#c1-th-1').html(periodText[4]);
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