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
                selector: '.time-line-content .item-content .click-content',
                event: 'click',
                handler: VM.module('timelineView').openItemPage
            },{
                element: '#ourView',
                selector: '.time-line-content .item-content .share-article',
                event: 'click',
                handler: VM.module('timelineView').shareArticle
              }
            ];

            appFunc.bindEvents(bindings);
        },

        getTimelineForCurrEdition: function(){
            if(appFunc.isAppData()){
                window.appData = '';
                xhr.simpleCall({func:'pivar'}, function(data){
                    window.appData = data;
                    var articles = appFunc.getCurrEditionArticles(data);
                    VM.module('timelineView').getTimeline(articles);

                    VM.module('timelineView').createSectionListview(data);
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

    timelineCtrl.bindEvent();

    return timelineCtrl;
});