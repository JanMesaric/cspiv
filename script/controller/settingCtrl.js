define(['utils/appFunc','utils/xhr','view/module'],function(appFunc,xhr,VM){

    var settingCtrl = {

        init: function(){


            var bindings = [{
                element:'#settingView',
                event: 'show',
                handler: settingCtrl.renderSetting
            },{
                element:'.prijava-btn',
                event: 'click',
//                    handler:VM.module('commentView').commentPopup
                handler:function(){
                    log('waeafweaf')
                }
            }
            ];

            VM.module('settingView').init({
                bindings:bindings
            });

        },

        renderSetting: function(){
            if($$('#settingView .page-content')[0])
                return;
            hiApp.showIndicator();
            xhr.simpleCall({
                func:'user_login'
            },function(response) {
                if (response.err_code === 0) {
                    var user = response.data.user;
                    VM.module('settingView').renderSetting(user);


                }
            });
        }

    };

    return settingCtrl;
});