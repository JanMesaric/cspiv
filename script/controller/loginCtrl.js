define(['utils/appFunc','utils/xhr','view/module','GS','i18n!nls/lang'],function(appFunc,xhr,VM,GS,i18n){

    var loginCtrl = {

        init: function(){

            var bindings = [
                {
                element: '.back2home',
                event: 'click',
                handler: VM.module('appView').showToolbar
            },
            {
                element: '.login-submit',
                event: 'click',
                handler: loginCtrl.loginSubmit
            },{
                element: '.copyright a',
                event: 'click',
                handler: function(){
                    mainView.loadPage('page/signup.html');
                }
            }];

            VM.module('loginView').init({
                bindings:bindings
            });
        },
/**/
        loginSubmit: function(){
            var loginName = $$('input.login-name-js').val();
            var password = $$('input.login-password-js').val();
            if(loginName === '' || password === ''){
                hiApp.alert(i18n.login.err_empty_input);
//            }else if(!appFunc.isEmail(loginName)){
//                hiApp.alert(i18n.login.err_illegal_email);
            }else{
                hiApp.showPreloader(i18n.login.login);

                $.ajax({
                    url: "http://connectsocial.si/drupaltest/ajax/login.php",
                    type: "post",
                    dataType: "json",
                    data: {"username":loginName,"password":password},
                    success: function(data){
                        if(!data.user){
                            //napačni vhodni podatki
                            log('napačni login podatki');
                            log(hiApp)
                            $$('.login-input-content').find('input').css('border', '1px solid red');
                            $$('.multi-language').css('color', 'red').text('Podatki za prijavo se ne ujemajo z zapisi v bazi.')
                            hiApp.alert('Uporabnik ne obstaja, prosimo preverite uporabniško ime in geslo.', 'Napaka');
                            hiApp.hidePreloader();
                            return false;
                        }
                        GS.setCurrentUser(password,data.user);
                        log('happen')
                        hiApp.hidePreloader();
                        log('happen2')
//                        mainView.loadPage('index.html');
                        mainView.goBack();
                        settingView.goBack();
                        appFunc.showToolbar('.views');
                        $('.signupee-hidden').css('display', 'block');
                        $('.prijava-btn').css('display', 'none');
                        log('happen3')
                        hiApp.alert('Prijava uspešna.', 'Uspeh');

                    },
                    error: function(e,p,m){
                        hiApp.alert("Preverite vnešeno uporabniško ime in geslo ter poizkusite znova!", "Napaka");
                        hiApp.hidePreloader();
                        console.log(e)
                        console.log(p)
                        console.log(m)
                    }
                });
            }
        }

    };

    return loginCtrl;
});