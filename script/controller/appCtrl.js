define(['utils/appFunc','view/module', 'utils/xhr'],function(appFunc,VM, xhr){
    //TO JE MAIN APP CONTROLLER, KI SE GA PROŽI DIREKT IZ ROUTERJA
    var appCtrl = {

        i18next: function(viewName,content){
            //vzemi view in ga populati s contentom in vrni output
            var output = VM.module(viewName).i18next(content);
            return output;
        },

        bindEven: function(){
            var bindings = [{
                element:document,
                selector:'div.item-content>img',
                //selector:'img',
                event: 'click',
                handler: VM.module('appView').photoBrowser
            }];

            appFunc.bindEvents(bindings);
        },
        showToolbar: function(){
            appFunc.showToolbar('.views');
        }
    };

    appCtrl.bindEven();
    return appCtrl;
});