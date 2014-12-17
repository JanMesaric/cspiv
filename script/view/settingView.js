define(['utils/appFunc','utils/tplManager','GS','i18n!nls/lang'],function(appFunc,TM,GS,i18n){

    /* global $CONFIG */

    var settingView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);

        },

        renderSetting: function(user){
            var renderData = [];
            renderData.avatarUrl = user.avatarUrl;
            renderData.nickName = user.nickName;
            renderData.points = user.points;

            //i18n
            renderData.i18nNickName = i18n.setting.nickname;
            renderData.i18nPoints = i18n.setting.points;
            renderData.feedBack = i18n.setting.feed_back;
            renderData.checkUpdate = i18n.setting.check_update;
            renderData.about = i18n.setting.about;
            renderData.language = i18n.global.language;
            renderData.loginOut = i18n.setting.login_out;

            var output = TM.renderTplById('settingTemplate', renderData);
            $$('#settingView .page[data-page="setting"]').html(output);

            var bindings = [{
                element: '.logout-button',
                event: 'click',
                handler: settingView.logOut
            },{
                element: '#settingView .update-button',
                event: 'click',
                handler: settingView.checkVersion
            },{
                element:'#settingView .kontaktiraj-urednistvo',
                event: 'click',
                handler: settingView.emailUrednistvo
            },{
                element:'.prijava-btn',
                event: 'click',
//                    handler:VM.module('commentView').commentPopup
                handler: settingView.login
            }
            ];

            appFunc.bindEvents(bindings);

            hiApp.hideIndicator();
        },
        login: function(){
            log('bb');
            window.settingView.loadPage('page/login.html');
        },
        logOut: function(){
            hiApp.confirm('Ste prepričani da se želite izpisati?',function(){
                GS.removeCurrentUser();
                $('.signupee-hidden').css('display', 'none');
                $('.prijava-btn').css('display', 'block');
                $('.signupee-name').text('niste prijavljeni');
                $('.signupee-date').text('/');

            });
        },
        emailUrednistvo: function(){
            window.plugin.email.open({
                to:      ['pivar@pivo-lasko.si'],
                cc:      [''],
                bcc:     [''],
                subject: 'Kontakt uredništva internega glasila Pivar',
                body:    '',
                isHtml:   true
            });
        },
        checkVersion: function(){
            var version = $CONFIG.version;
            var releaseTime = $CONFIG.release_time;
            hiApp.alert(i18n.setting.current_version + ' V' + version + '<br/>[ ' + releaseTime + ' ]');
        }

    };

    return settingView;
});