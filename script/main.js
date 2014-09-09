var log = console.log.bind(console);
(function() {
    var lang = localStorage.getItem('lang') || 'en-us';
    //TODO: http://requirejs.org/docs/api.html
    require.config({
        locale: lang,
        paths: {
            text:'../vendors/require/text',
            i18n:'../vendors/require/i18n',
            Framework7:'../vendors/framework7/framework7',
            mustache:'../vendors/mustache/mustache',
            GTPL:'../page/global.tpl.html',
            GS:'services/globalService'
        },
        shim: {
            'Framework7':{exports: 'Framework7'}
        }
    });

    //requirejs avtomatične najde router -> router.js v istem rootu kot main
    require(['Framework7','router','i18n!nls/lang','utils/appFunc'], function(Framework7,router,i18n,appFunc) {

        var app = {
            initialize: function() {
                this.bindEvents();
            },
            bindEvents: function() {
                if(appFunc.isPhonegap()) {
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                }else{
                    window.onload = this.onDeviceReady();
                }
            },
            onDeviceReady: function() {
                app.receivedEvent('deviceready');
            },
            receivedEvent: function(event) {
                switch (event) {
                    case 'deviceready':
                        app.initMainView();
                        break;
                }
            },
            initMainView:function(){
                window.$$ = Dom7;
                window.hiApp = new Framework7({
                    pushState: false,
                    popupCloseByOutside:false, //TODO: true je bolša izbira
                    animateNavBackIcon: true,
                    modalTitle: i18n.global.modal_title,
                    modalButtonOk: i18n.global.modal_button_ok,
                    modalButtonCancel: i18n.global.cancel,
                    //TODO: PREPROCESS ZA ROUTER!!!
                    preprocess:router.preprocess
                });
                //initi za spodnje menuje, vezani so globalno!
                window.mainView = hiApp.addView('#ourView', {
                    dynamicNavbar: true
                });

                window.contatcView = hiApp.addView('#contatcView', {
                    dynamicNavbar: true
                });

                window.settingView = hiApp.addView('#settingView', {
                    dynamicNavbar: true
                });
                //zaženi router
                router.init();
            }
        };

        app.initialize();

    });
})();
