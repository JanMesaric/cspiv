define(['utils/appFunc','utils/xhr','view/module'],function(appFunc,xhr,VM){

    var timelineCtrl = {

        init: function(){

            VM.module('timelineView').init();
            setTimeout(function(){$('.page-content').scrollTop(44);},100);
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
                selector: '.time-line-content .item-content .share-article, #itemContent .share-article',
                event: 'click',
                handler: VM.module('timelineView').shareArticle
              },
              {
                element: '#ourView',
                selector: '#itemContent .big-letters-controller',
                event: 'click',
                handler: VM.module('timelineView').bigLetters
                },
              {
                element: '#ourView',
                selector: '.js-favorite',
                event: 'click',
                handler: VM.module('timelineView').addFavorite
              },{
                element: '#ourView',
                selector: '.time-line-content .item-content .click-content,' +
                        '.time-line-content .item-tools .click-content,' +
                        '.time-line-content .item-header,.time-line-content .detail',
                event: 'click',
                handler: VM.module('timelineView').openItemPage
            },
                {
                    element:'.prijava-btn',
                    event: 'click',
//                    handler:VM.module('commentView').commentPopup
                    handler:function(){
                        log('waeafweaf')
                    }
                },
                {
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
                    $('.page-content').scrollTop(44);
                }
            }
            ];

            appFunc.bindEvents(bindings);
        },

        getTimelineForCurrEdition: function(){
            if(appFunc.isAppDataAvailable()){
                window.appData = '';
                xhr.simpleCall({func:'pivar', special:'http://connectsocial.si/pivar/pivar.php'}, function(data){
                    log(JSON.parse(data))
                    window.appData = JSON.parse(data);


                        localStorage.setItem('currEdition', window.appData.length - 1);

                    var dw = window.appData[localStorage.getItem('currEdition')].info;
                    log(dw)

                    $('.current-edition-js').text('Št:'+dw.number + ' ' + dw.dddate.replace(new RegExp(' ', 'g'),''))
                    var articles = appFunc.getCurrEditionArticles(window.appData);
                    //ustvarim prvo stran
                    VM.module('timelineView').getTimeline(articles);
                    //ustvarim data za postView.js oz. rubrike popup
                    VM.module('timelineView').createSectionListview(window.appData);
                    log(window.appData);
                });
            }
        },

        refreshTimeline: function(cat){
            var cat = cat || 'Nazaj-na-trenutno-številko';
            VM.module('timelineView').refreshTimeline(appFunc.getAllArticles(window.appData), cat);
            log('refreshing timeline')
        },
        refreshTimelineForFavorites: function(){
            var data = appFunc.getAllArticles(window.appData),
                fav = JSON.parse(localStorage.getItem('favoriteObj')),
                arr = [];
            if(!fav){
                hiApp.alert('Trenutno nimate dodanih priljubljenih člankov.', 'Napaka');
                return false;
            }
            data.forEach(function(res){
                fav.forEach(function(favs){
                    if(res.idEdition == favs.edition && res.id == favs.id){
                        arr.push(res);
                    }
                });
            });
            log(arr)
            VM.module('timelineView').refreshTimeline(arr, 'favorites');
        },
        openEdition: function(id){
            localStorage.setItem('currEdition', id);
            VM.module('timelineView').openEdition();
            hiApp.openPanel('#ourView');
            mainView.goBack();
            appFunc.showToolbar('.views');
            var len = window.appData.length + id;
            log(id);

            log(id);
            var data = window.appData[id].info;
            log(data.number)
            $$('.current-edition-js').text('Št:' + data.number + ', ' + data.dddate.replace(new RegExp(' ', 'g'),''));

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