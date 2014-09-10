define(['utils/appFunc','utils/xhr','view/module'],function(appFunc,xhr,VM){

    var kuhalnicaCtrl = {

        init: function(){

            VM.module('kuhalnicaView').init();

            this.getKuhalnicaForCurrEdition();
        },

        bindEvent: function(){

            var bindings = [{
                element: '#contatcView',
                selector: '.pull-to-refresh-content',
                event: 'refresh',
                handler: kuhalnicaCtrl.refreshTimeline
            },{
                element: '#contatcView',
                selector: '.pull-to-refresh-content',
                event: 'infinite',
                handler: kuhalnicaCtrl.infiniteTimeline
            },{
                element: '#contatcView',
                selector: '.refresh-click',
                event: 'click',
                handler: VM.module('kuhalnicaView').refreshTimelineByClick
            },{
                element: document,
                selector: 'a.open-send-popup',
                event: 'click',
                handler:VM.module('postView').openSendPopup
            },{
                element: '#contatcView',
                selector: '.kuhalnica-content .item-content .share-article',
                event: 'click',
                handler: VM.module('kuhalnicaView').shareArticle
              },{
                element: '#contatcView',
                selector: '.js-favorite',
                event: 'click',
                handler: VM.module('kuhalnicaView').addFavorite
              },{
                element: '#contatcView',
                selector: '.kuhalnica-content .item-content .click-content',
                event: 'click',
                handler: VM.module('kuhalnicaView').openKuhalnicaItemPage
            }
            ];

            appFunc.bindEvents(bindings);
        },

        getKuhalnicaForCurrEdition: function(){

            var cooking = window.appData[0].cooking.cookingArray;
            log(window.appData[0].cooking.cookingArray);
            //ustvarim prvo stran
            VM.module('kuhalnicaView').getKuhalnica(cooking);
            //ustvarim data za postView.js oz. rubrike popup

            if(appFunc.isAppDataAvailable()){
                window.appData = '';
                xhr.simpleCall({func:'pivar'}, function(data){
                    window.appData = data;
                    var articles = appFunc.getCurrEditionArticles(data);
                    //ustvarim prvo stran
                    VM.module('kuhalnicaView').getKuhalnica(articles);
                    //ustvarim data za postView.js oz. rubrike popup
                    VM.module('kuhalnicaView').createSectionListview(data);
                    log(window.appData);
                });
            }
        }

        /*refreshTimeline: function(){
            xhr.simpleCall({
                func:'refresh_timeline'
            },function(response){
                VM.module('timelineView').refreshTimeline(response.data);
            });
        },

        infiniteTimeline: function(){
            var $dom = $$(this);
            xhr.simpleCall({
                func:'more_timeline'
            },function(response){
                VM.module('timelineView').infiniteTimeline({
                    data:response.data,
                    $dom:$dom
                });
            });
        }*/
    };

    kuhalnicaCtrl.bindEvent();

    return kuhalnicaCtrl;
});