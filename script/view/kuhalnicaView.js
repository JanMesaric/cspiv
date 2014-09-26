define(['utils/appFunc','utils/tplManager','i18n!nls/lang'],function(appFunc,TM,i18n){

    var kuhalnicaView = {

        init: function(){
            appFunc.hideToolbar('.views');

            $$('#kuhalnicaView .pull-to-refresh-layer').show();

            hiApp.showIndicator();
        },

        getKuhalnica: function(data){
            var arr = [];
            data.forEach(function(data){
                if(appFunc.isAlreadyFav(data.id,data.idEdition)){
                    data.isfavorited = true;
                }
                arr.push(data);
            });
            var renderData = this.renderDataFunc({
                data:arr
            });
            var output = TM.renderTplById('kuhalnicaTemplate',renderData);
            $$('#kuhalnicaView').find('.kuhalnica-content').html(output);

            hiApp.hideIndicator();

            //Unlock scroll loading status
            var ptrContent = $$('#kuhalnicaView').find('.pull-to-refresh-content');
            ptrContent.data('scrollLoading','unloading');
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

        refreshItemTime:function(){
            $$('#kuhalnicaView').find('.item-header .detail .create-time').each(function(){
                var nowTime = appFunc.timeFormat($$(this).data('time'));
                $$(this).html(nowTime);
            });
        },

        refreshTimeline: function(data){
            // Find newest msg id in ptrContent;

            this.refreshItemTime();

            var newestId = $$('#kuhalnicaView').find('.kuhalnica-content .item-content'). eq(0).data('id');

            setTimeout(function () {

                $$('#kuhalnicaView .refresh-click').find('i').removeClass('ios7-reloading');

                if(parseInt(newestId) === 48) {
                    kuhalnicaView.showLoadResult(i18n.index.nothing_loaded);
                    hiApp.pullToRefreshDone();
                    return false;
                }

                var length = data.length;

                var renderData = kuhalnicaView.renderDataFunc({
                    data:data
                });

                var output;

                if(length >= 15){
                    output = TM.renderTplById('kuhalnicaTemplate',renderData);
                    $$('#kuhalnicaView').find('.kuhalnica-content').html(output);
                }else if(length > 0){
                    output = TM.renderTplById('kuhalnicaTemplate',renderData);
                    $$('#kuhalnicaView').find('.kuhalnica-content').prepend(output);
                }else{
                    kuhalnicaView.showLoadResult(i18n.index.nothing_loaded);
                }

                hiApp.pullToRefreshDone();

            },1500);
        },

        infiniteTimeline: function(options){
            options = options || {};

            hiApp.showIndicator();

            var $this = options.$dom;
            var status = $this.data('scrollLoading');
            if (status === 'loading') return;

            $this.data('scrollLoading','loading');

            var timeLimes = options.data;
            var items = $this.find('.kuhalnica-content .item-content');
            var length = items.length;
            var lastId = items.eq(length - 1).data('id');
            if(parseInt(lastId) === 24){

                //I can't hide indicator by javascript, why?
                hiApp.detachInfiniteScroll($this);
                hiApp.hideIndicator();
            }else{
                var renderData = this.renderDataFunc({
                    data: timeLimes
                });
                var output = TM.renderTplById('kuhalnicaTemplate', renderData);

                setTimeout(function(){
                    $this.data('scrollLoading','unloading');
                    $$('#kuhalnicaView').find('.kuhalnica-content').append(output);

                    hiApp.hideIndicator();
                },1500);

            }
        },

        refreshTimelineByClick: function(){
            setTimeout(function(){
                $$('#ourView .refresh-click ').find('i').addClass('ios7-reloading');
            },350);

            $$('#kuhalnicaView .pull-to-refresh-content').scrollTop(0,300);

            hiApp.pullToRefreshTrigger('#ourview');
        },

        showLoadResult: function(text){
            setTimeout(function(){
                $$('#kuhalnicaView .load-result').html(text).css('opacity','1').transition(1000);

                setTimeout(function(){
                    $$('#kuhalnicaView .load-result').css('opacity','0').transition(1000);
                },2100);
            },400);
        },

        openKuhalnicaItemPage: function(e){
            if(e.target.nodeName !== 'DIV'){
                return false;
            }
            var itemId = $$(this).parents('.item-content').data('id');
            contatcView.loadPage('page/itemKuhalnica.html?id=' + itemId);
        },
        shareArticle: function(){
            var itemTitle = $$(this).parents('.item-content').data('title');
            //var itemTitleDesc = $$(this).parents('.item-content').data('titleDesc');
            window.plugins.socialsharing.share('Prebiram članek z naslovom • ' + itemTitle + ' • ' + 'Preberi več v mobilni aplikaciji Pivar - glasilo skupine Laško!', null, null, 'http://www.lasko.eu/pivar')
        },
        createSectionListview: function(data){
            if(!window.htmlOriginal){
                var arr = [];
                data.forEach(function(editions){
                    editions.articles.forEach(function(edition){
                        if(edition.artShow === "true"){
                            var fin = edition.cat.replace(new RegExp("-", "g"),' ');
                            arr.push(fin);
                        }
                    });
                });
                var uniques = appFunc.uniquify(arr);
                arr = [];
                uniques.forEach(function(fin){
                    arr.push({name: fin});
                })
                window.htmlOriginal = arr;
            }
        },

        addFavorite: function(){
            if(!localStorage.getItem('favoriteObj')){
                localStorage.setItem('favoriteObj', JSON.stringify([]));
            }
            var id = $$(this).data('id'),
                edition = $$(this).data('edition');
                appFunc.toggleFavorite(id, edition,this);
//                obj = {
//                    id: id,
//                    edition: edition
//                }
//                var oldObj = JSON.parse(localStorage.getItem('favoriteObj'));
//                if(!appFunc.isAlreadyFav(id, edition)){
//                    oldObj.push(obj);
//                } else {
//                    return false;
//                }
//                localStorage.setItem('favoriteObj', JSON.stringify(oldObj));
            //hiApp.alert('Članek je shranjen med priljubljene', 'Uspešno shranjeno');


        },
        i18next: function(content){
            var renderData = [];
            renderData.back = i18n.global.back;
            renderData.title = i18n.item.title;
            renderData.comment = i18n.timeline.comment;
            renderData.forward = i18n.timeline.forward;

            var output = TM.renderTpl(content,renderData);

            return output;
        }

    };

    return kuhalnicaView;
});