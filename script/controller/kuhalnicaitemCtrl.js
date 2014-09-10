define(['utils/appFunc','view/module'],function(appFunc,VM){

    var kuhalnicaitemCtrl = {

        init: function(query){
            var bindings = [{
                element: '.back2home',
                event: 'click',
                handler: VM.module('appView').showToolbar
            }];

            VM.module('kuhalnicaItemView').init({
                bindings:bindings,
                query:query
            });
        }

    };

    return kuhalnicaitemCtrl;
});