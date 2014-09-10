define(['utils/appFunc','utils/xhr','view/module'],function(appFunc,xhr,VM){

    var timelineCtrl = {

        init: function(){

            VM.module('timelineView').init();

            this.getTimelineForCurrEdition();
        },

        bindEvent: function(){

            var bindings = [{
                element: '#ourView',
                selector: '.pull-to-refresh-content',
                event: 'refresh',
                handler: timelineCtrl.refreshTimeline
            },{
                element: '#ourView',
                selector: '.pull-to-refresh-content',
                event: 'infinite',
                handler: timelineCtrl.infiniteTimeline
            },{
                element: '#ourView',
                selector: '.refresh-click',
                event: 'click',
                handler: VM.module('timelineView').refreshTimelineByClick
            },{
                element: document,
                selector: 'a.open-send-popup',
                event: 'click',
                handler:VM.module('postView').openSendPopup
            },{
                element: '#ourView',
                selector: '.time-line-content .item-content .share-article',
                event: 'click',
                handler: VM.module('timelineView').shareArticle
              },{
                element: '#ourView',
                selector: '.js-favorite',
                event: 'click',
                handler: VM.module('timelineView').addFavorite
              },{
                element: '#ourView',
                selector: '.time-line-content .item-content .click-content',
                event: 'click',
                handler: VM.module('timelineView').openItemPage
            }
            ];

            appFunc.bindEvents(bindings);
        },

        getTimelineForCurrEdition: function(){
            log('succ')
            if(appFunc.isAppDataAvailable()){
                window.appData = '';
                xhr.simpleCall({func:'pivar'}, function(data){
                    window.appData = data;
                    var articles = appFunc.getCurrEditionArticles(data);
                    //ustvarim prvo stran
                    VM.module('timelineView').getTimeline(articles);
                    //ustvarim data za postView.js oz. rubrike popup
                    VM.module('timelineView').createSectionListview(data);
                    log(window.appData);
                });
            }
        },

        refreshTimeline: function(cat){
            var cat = cat || 'Nazaj-na-številko';
            VM.module('timelineView').refreshTimeline(appFunc.getAllArticles(window.appData), cat);
            log('orly')

        },
        openEdition: function(id){
            localStorage.setItem('currEdition', id);
//            if(!id){
//                hiApp.alert('Prišlo je do napake, poizkusite znova.','Napaka');
//            }
            VM.module('timelineView').openEdition(id);
            //hiApp.openPanel('#ourView')
        }
        /*
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

    timelineCtrl.bindEvent();

    return timelineCtrl;
});