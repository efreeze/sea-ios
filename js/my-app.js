var $$ = Dom7;

// Initialize your app
var myApp = new Framework7({init:false, material: true});

// Export selectors engine

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

myApp.onPageInit('index', function (page) {
    reload_captcha();
    $$('#check-polis').on('click', function (e) {
        var serial = $$('[name=serial]').val(),
            number = $$('[name=number]').val(),
            code = $$('[name=code]').val(),
            JSID = $$('[name=JSID]').val();
        if ([serial, number, code, JSID].filter(function(val) {return val != ''}).length === 4) {
            myApp.showIndicator();
            $$.ajax({
                method: 'POST',
                url: 'https://kbm-osago.ru/engine/check_policy',
                dataType: 'json',
                data: 'seriya=' + serial + '&osago=' + number + '&captcha=' + code + '&JSID=' + JSID,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                success: function(data, code, result) {
                    myApp.hideIndicator();
                    showOsago(data);
                    reload_captcha();
                },
                error: function(e) {
                    myApp.hideIndicator();
                    myApp.alert('Указаны неверные данные', '');
                }
            });
        } else {
            myApp.alert('Необходимо заполнить все поля!', '');
        }
    });
});
myApp.onPageInit('mulct', function (page) {
    $$('[name=mulct_sts]').val(window.localStorage.sts);
    $$('[name=mulct_vu]').val(window.localStorage.vu);
    $$('#check-mulct').on('click', function (e) {
        var sts = $$('[name=mulct_sts]').val(),
            vu = $$('[name=mulct_vu]').val();
        window.localStorage.sts = sts;
        window.localStorage.vu = vu;
        myApp.showIndicator();
        $$.ajax({
            method: 'POST',
            url: 'http://onlinegibdd.ru/dir/modules/soap/find_bill.php',
            // contentType: 'application/x-www-form-urlencoded',
            // dataType: 'json',
            data: 'used_auto_cdi=' + sts + '&used_voditel_number=' + vu + '&used_user_mail=&user_id=',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function(data, code, result) {
                myApp.hideIndicator();
                if (data.trim() == 'NoBill') {
                    myApp.alert('Неоплаченных штрафов не найдено!', 'Штрафы ГИБДД');
                } else {
                    myApp.alert('Есть штрафы!', 'Штрафы ГИБДД');
                }
            },
            error: function(e) {
                myApp.hideIndicator();
                myApp.alert('Указаны неверные данные', '');
            }
        });
    });
});
myApp.onPageInit('osago-fiz', function (page) {
    var calendarDefault = myApp.calendar({
        input: '[name=birtdate]',
    });
    reload_kbmcaptcha();
    $$('[name=firstname]').val(window.localStorage.firstname);
    $$('[name=lastname]').val(window.localStorage.lastname);
    $$('[name=patronymic]').val(window.localStorage.patronymic);
    $$('[name=birtdate]').val(window.localStorage.birtdate);
    $$('[name=serial]').val(window.localStorage.fiz_serial);
    $$('[name=number]').val(window.localStorage.fiz_number);
    $$('#check-kbm').on('click', function (e) {
        var firstname = $$('[name=firstname]').val(),
            lastname = $$('[name=lastname]').val(),
            patronymic = $$('[name=patronymic]').val(),
            birtdate = $$('[name=birtdate]').val(),
            serial = $$('[name=serial]').val(),
            number = $$('[name=number]').val(),
            code = $$('[name=code]').val(),
            JSID = $$('[name=JSID]').val(),
            data = {
                'vu_fio': [firstname, lastname, patronymic].join(' '),
                'vu_bdate': birtdate,
                'vu_num': [serial, number].join(' '),
                'skolko': 'lim',
                'datequery': new Date().toISOString().substring(0, 10),
                'kbmcaptcha': code,
                'JSID': JSID,
            };
        window.localStorage.firstname = firstname;
        window.localStorage.lastname = lastname;
        window.localStorage.patronymic = patronymic;
        window.localStorage.birtdate = birtdate;
        window.localStorage.fiz_serial = serial;
        window.localStorage.fiz_number = number;
        if ([firstname, lastname, patronymic, birtdate, serial, number, code].filter(function(val) {return val != ''}).length === 7) {
            myApp.showIndicator();
            $$.ajax({
                method: 'POST',
                url: 'https://kbm-osago.ru/engine/kbm',
                dataType: 'json',
                data: data,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: function(data, code, result) {
                    myApp.hideIndicator();
                    reload_kbmcaptcha();
                    if (data.errorMessage) {
                        myApp.alert(data.errorMessage, '');
                    } else {
                        myApp.alert(data.kbmValue, '');
                    }
                },
                error: function(e) {
                    myApp.hideIndicator();
                    myApp.alert('Указаны неверные данные', '');
                }
            });
        } else {
            myApp.alert('Необходимо заполнить все поля!', '');
        }
    });
});
myApp.onPageInit('osago-ur', function (page) {
    var calendarDefault = myApp.calendar({
        input: '[name=birtdate]',
    });
    reload_kbmcaptcha();
    $$('[name=inn]').val(window.localStorage.inn);
    $$('[name=vin]').val(window.localStorage.vin);
    $$('[name=number]').val(window.localStorage.ur_number);
    $$('#check-kbm').on('click', function (e) {
        var inn = $$('[name=inn]').val(),
            vin = $$('[name=vin]').val(),
            number = $$('[name=number]').val(),
            code = $$('[name=code]').val(),
            JSID = $$('[name=JSID]').val(),
            data = {
                'pf': 'company',
                'inn': inn,
                'vin': vin,
                'skolko': 'unlim',
                'datequery': new Date().toISOString().substring(0, 10),
                'kbmcaptcha': code,
                'JSID': JSID,
            };

        if ([inn, vin, number, code].filter(function(val) {return val != ''}).length === 4) {
            myApp.showIndicator();
            window.localStorage.inn = inn;
            window.localStorage.vin = vin;
            window.localStorage.ur_number = number;
            $$.ajax({
                method: 'POST',
                url: 'https://kbm-osago.ru/engine/kbm',
                dataType: 'json',
                data: data,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: function(data, code, result) {
                    myApp.hideIndicator();
                    reload_kbmcaptcha();
                    if (data.errorMessage) {
                        myApp.alert(data.errorMessage, '');
                    } else {
                        myApp.alert(data.kbmValue, '');
                    }
                },
                error: function(e) {
                    myApp.hideIndicator();
                    myApp.alert('Указаны неверные данные', '');
                }
            });
        } else {
            myApp.alert('Необходимо заполнить все поля!', '');
        }
    });
});
myApp.onPageInit('my', function (page) {
    var polices = JSON.parse(window.localStorage.getItem('polices'));
    if (!polices) {
        polices = [];
    }
    if (polices.length > 0) {
        polices.map(function(val, idx) {
            var endDate = val.policyEndDate.split('.'),
                days = datesDiff(new Date(endDate[2], endDate[1] - 1, endDate[0]), new Date(), 'days'),
                days_left = 'Действителен еще ';
            if (days < 0) {
                days *= -1;
                days_left = 'Не действителен ';
            }
            days_left += days + ' ' + declOfNum(days, ['день', 'дня', 'дней'])
            var item = '' +
                '<li id="item-' + idx + '" data-idx="' + idx + '">' +
                '   <a class="item-content item-link my-polis">' +
                '       <div class="item-media"><img src="img/i-osago.png" width="44"></div>' +
                '       <div class="item-inner">' +
                '           <div class="item-title-row">' +
                '               <div class="item-title">' + val.insCompanyName + ' (' + val.bsoSeries +' ' + val.bsoNumber + ')</div>' +
                '           </div>' +
                '           <div class="item-subtitle">' + days_left + '</div>' +
                '       </div>' +
                '   </a>' +
                '</li>';
            $$('#my-list').append(item);
        });
    }

    $$('.my-polis').on('click', function (e) {
        var idx = $$(this).parents('li').data('idx');
        showOsago(polices[idx], true, idx);
    });
});
function datesDiff(date1, date2, interval) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date1 - date2;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day);
        case "hours"  : return Math.floor(timediff / hour);
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}
function reload_captcha() {
    myApp.showIndicator();
    $$.ajax({
        method: 'POST',
        url: 'https://kbm-osago.ru/engine/check_policy_captcha',
        dataType: 'json',
        data: 'JSID=',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        },
        success: function(data, code, result) {
            $$('#dkbm-captcha').attr('src','data:image/png;base64,' + data.image)
            $$('[name=JSID]').val(data.JSID);
            myApp.hideIndicator();
        },
        error: function(e) {
            myApp.hideIndicator();
            myApp.alert('Указаны неверные данные', '');
        }
    });
}
function reload_kbmcaptcha() {
    myApp.showIndicator();
    $$.ajax({
        method: 'POST',
        url: 'https://kbm-osago.ru/engine/kbmcaptcha',
        dataType: 'json',
        data: 'JSID=',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        },
        success: function(data, code, result) {
            $$('#dkbm-captcha').attr('src','data:image/png;base64,' + data.image)
            $$('[name=JSID]').val(data.JSID);
            myApp.hideIndicator();
        },
        error: function(e) {
            myApp.hideIndicator();
            myApp.alert('Указаны неверные данные', '');
        }
    });
}
function showOsago(data, no_button, idx) {
    if (data.errorMessage) {
        myApp.alert(data.errorMessage, '');
    } else {
        var html =
            '<div class="pages">' +
            '   <div data-page="dynamic-pages" class="page">' +
            '       <div class="navbar">' +
            '           <div class="navbar-inner">' +
            '               <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i></a></div>' +
            '               <div class="center sliding">Полис ОСАГО</div>';
        if (no_button) {
            html += '               <div class="right"><a href="#" id="del-osago" class="back link" data-idx="' + idx + '">Удалить</a></div>';
        }
        html += '           </div>' +
            '       </div>' +
            '       <div class="page-content">';
        if (!no_button) {
            html += '           <a href="#" id="add-osago" class="floating-button color-red"><i class="icon icon-plus"></i></a>';
        }
        html += '           <div class="content-block-title">Общая информация</div>' +
            '           <div class="list-block">' +
            '               <ul>' +
            '                   <li class="item-content">' +
            '                       <div class="item-inner">' +
            '                           <div class="item-title">' + data.insCompanyName +'</div>' +
            '                           <div class="item-after">' + data.bsoSeries +' ' + data.bsoNumber +'</div>' +
            '                       </div>' +
            '                   </li>' +
            '                   <li class="item-content">' +
            '                       <div class="item-inner">' +
            '                           <div class="item-title">' + data.bsoStatusName +'</div>' +
            '                       </div>' +
            '                   </li>' +
            '                   <li class="item-content">' +
            '                       <div class="item-inner">' +
            '                           <div class="item-title">Дата выдачи</div>' +
            '                           <div class="item-after">' + data.policyCreateDate +'</div>' +
            '                       </div>' +
            '                   </li>' +
            '               </ul>' +
            '           </div>' +
            '           <div class="content-block-title">Действителен</div>' +
            '           <div class="list-block">' +
            '               <ul>' +
            '                   <li class="item-content">' +
            '                       <div class="item-inner">' +
            '                           <div class="item-title">С</div>' +
            '                           <div class="item-after">' + data.policyBeginDate +'</div>' +
            '                       </div>' +
            '                   </li>' +
            '                   <li class="item-content">' +
            '                       <div class="item-inner">' +
            '                           <div class="item-title">По</div>' +
            '                           <div class="item-after">' + data.policyEndDate +'</div>' +
            '                       </div>' +
            '                   </li>' +
            '               </ul>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>';
        mainView.router.loadContent(html);
        $$('#add-osago').on('click', function() {
            if (myApp.confirm('Добавить в "Мои полисы"?', '', function() {
                var polices = JSON.parse(window.localStorage.getItem('polices'));
                if (!polices) {
                    polices = [];
                }
                if (polices.indexOf(data) < 0) {
                    polices.push(data);
                    window.localStorage.setItem('polices', JSON.stringify(polices));
                }
            }));
        });
        $$('#del-osago').on('click', function() {
            var polices = JSON.parse(window.localStorage.getItem('polices'));
            if (!polices) {
                polices = [];
            }
            if (polices.indexOf(data) < 0) {
                polices.splice($$(this).data('idx'), 1);
                $$(('#item-' + idx)).remove();
                window.localStorage.setItem('polices', JSON.stringify(polices));
            }
        });
    }
    return;
}

function onBackKey(e) {
    e.preventDefault();
    mainView.router.back();
}

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKey, false);
    myApp.init();
}
