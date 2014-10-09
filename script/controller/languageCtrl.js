define(['utils/appFunc','view/module','utils/tplManager','i18n!nls/lang'],function(appFunc,VM, TM,i18n){

    var langyageCtrl = {

        init: function(query){
            this.bindEvent();
            var data = appFunc.getCurrEditionArticles(window.appData);
            if(data == 0 || data == undefined){
                hiApp.alert('Prišlo je do napake, prosimo poizkusite znova', 'Napaka');
            }
            var renderData = langyageCtrl.renderDataFunc({
                data:data
            });
            var output = TM.renderTplById('timelineTemplate',renderData);

            $$('.language-page').html(output);

            var bindings = [{
                element:'.set-language',
                event: 'click',
                handler:VM.module('languageView').switchLanguage
            }];

            VM.module('languageView').init({
                bindings:bindings,
                query:query
            });
        },
        renderDataFunc: function(options){
            options = options || {};

            var i18next = {
                forward : i18n.timeline.forward,
                comment : i18n.timeline.comment,
                like : i18n.timeline.like

            };

            var renderData = {
                i18n:i18next,
                weibo:options.data,
                finalText:function(){
                    return appFunc.matchUrl(this.text);
                },
                image:function(){
                    var url = this.original_pic || '';

                    if(url.length > 2){
                        var thumbnail = url.replace(/large/, 'thumbnail');
                        return thumbnail;
                    }else{
                        return false;
                    }
                },
                time:function(){
                    return appFunc.timeFormat(this.created_at);
                }
            };

            return renderData;
        },
        bindEvent: function(){

            var bindings = [
//                {
//                element: '#ourView',
//                selector: '.pull-to-refresh-content',
//                event: 'refresh',
//                handler: timelineCtrl.refreshTimeline
//            },{
//                element: '#ourView',
//                selector: '.pull-to-refresh-content',
//                event: 'infinite',
//                handler: timelineCtrl.infiniteTimeline
//            },
{
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
                selector: '.language-page .item-content .click-content,' +
                    '.language-page .item-tools .click-content,' +
                    '.language-page .item-header,.language-page .detail',
                event: 'click',
                handler: function(e){
log('MEMEMME')
                        if(e.target.nodeName !== 'DIV'){
                            log('shouldnt happend')
//                return false;
                        }
                        var itemId = $$(this).parents('.item-content').data('id');
                        window.currArticleId = itemId;
                        mainView.loadPage('page/item.html?id=' + itemId);

                }
            },{
                element: '#ourView',
                selector: '.searchbar-input input',
                event: 'keyup',
                handler: debounce(function(){//ta funkcija je v main.js nakoncu
                    var val = $(this).val();
                    var arr = [];
                    var regexObj = new RegExp(val.toLowerCase());
                    hiApp.showIndicator();
                    window.appData.forEach(function(data){
                        data.articles.forEach(function(res){
                            if(res.artShow === "true" && regexObj.test(res.title.toLowerCase())){
                                arr.push(res);
                            }

                        });
                    });
                    hiApp.hideIndicator();
                    VM.module('timelineView').getTimeline(arr);
                }, 500)

            },{
                element: '#ourView',
                selector: '.searchbar-cancel',
                event: 'click',
                handler: function(){
                    VM.module('timelineView').getTimeline(appFunc.getCurrEditionArticles(window.appData));
                }
            }
            ];

            appFunc.bindEvents(bindings);
        }

    };

    return langyageCtrl;
});