define(['utils/appFunc','view/module', 'utils/tplManager', 'controller/timelineCtrl'],function(appFunc,VM, TM, CT){

    var itemCtrl = {

        init: function(){
            //TODO: to je treba še porihtat
            appFunc.hideToolbar('.views');
            log('moviesItemCtrl')
//            hiApp.showIndicator();
//            itemCtrl.fetchMoviesData();
            var bindings = [
                {
                    element: document,
                    selector: '.js-open-edition',
                    event: 'click',
                    handler: itemCtrl.openEdition
                }, {
                    element: document,
                    selector: '.back2contact',
                    event: 'click',
                    handler: function(){
                        appFunc.showToolbar('.views');
                    }
                }
            ];

            appFunc.bindEvents(bindings);


        }


    };

    return itemCtrl;
});