define(['utils/appFunc','utils/tplManager','i18n!nls/lang'],function(appFunc,TM,i18n){

    var timelineView = {

        init: function(){
            appFunc.showToolbar('.views');

            $$('#ourView .pull-to-refresh-layer').show();

            hiApp.showIndicator();
        },

        getTimeline: function(data){
            var renderData = this.renderDataFunc({
                data:data
            });
            var output = TM.renderTplById('timelineTemplate',renderData);
            $$('#ourView').find('.time-line-content').html(output);

            hiApp.hideIndicator();

            //Unlock scroll loading status
            var ptrContent = $$('#ourView').find('.pull-to-refresh-content');
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
            $$('#ourView').find('.item-header .detail .create-time').each(function(){
                var nowTime = appFunc.timeFormat($$(this).data('time'));
                $$(this).html(nowTime);
            });
        },

        refreshTimeline: function(data){
            // Find newest msg id in ptrContent;

            this.refreshItemTime();

            var newestId = $$('#ourView').find('.time-line-content .item-content'). eq(0).data('id');

            setTimeout(function () {

                $$('#ourView .refresh-click').find('i').removeClass('ios7-reloading');

                if(parseInt(newestId) === 48) {
                    timelineView.showLoadResult(i18n.index.nothing_loaded);
                    hiApp.pullToRefreshDone();
                    return false;
                }

                var length = data.length;

                var renderData = timelineView.renderDataFunc({
                    data:data
                });

                var output;

                if(length >= 15){
                    output = TM.renderTplById('timelineTemplate',renderData);
                    $$('#ourView').find('.time-line-content').html(output);
                }else if(length > 0){
                    output = TM.renderTplById('timelineTemplate',renderData);
                    $$('#ourView').find('.time-line-content').prepend(output);
                }else{
                    timelineView.showLoadResult(i18n.index.nothing_loaded);
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
            var items = $this.find('.time-line-content .item-content');
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
                var output = TM.renderTplById('timelineTemplate', renderData);

                setTimeout(function(){
                    $this.data('scrollLoading','unloading');
                    $$('#ourView').find('.time-line-content').append(output);

                    hiApp.hideIndicator();
                },1500);

            }
        },

        refreshTimelineByClick: function(){
            setTimeout(function(){
                $$('#ourView .refresh-click ').find('i').addClass('ios7-reloading');
            },350);

            $$('#ourView .pull-to-refresh-content').scrollTop(0,300);

            hiApp.pullToRefreshTrigger('#ourview');
        },

        showLoadResult: function(text){
            setTimeout(function(){
                $$('#ourView .load-result').html(text).css('opacity','1').transition(1000);

                setTimeout(function(){
                    $$('#ourView .load-result').css('opacity','0').transition(1000);
                },2100);
            },400);
        },

        openItemPage: function(e){
            if(e.target.nodeName !== 'DIV'){
                return false;
            }
            var itemId = $$(this).parents('.item-content').data('id');
            mainView.loadPage('page/item.html?id=' + itemId);
        },
        shareArticle: function(){
            var itemTitle = $$(this).parents('.item-content').data('title');
            //var itemTitleDesc = $$(this).parents('.item-content').data('titleDesc');
            window.plugins.socialsharing.share('Prebiram članek z naslovom • ' + itemTitle + ' • ' + 'Preberi več v mobilni aplikaciji Pivar - glasilo skupine Laško!', null, null, 'http://www.lasko.eu/pivar')
        },
        createSectionListview: function(data){
            var html = '', arr = [];
            data.forEach(function(editions){
                editions.articles.forEach(function(edition){
                    if(edition.artShow === "true"){
                        var fin = edition.cat.replace(new RegExp("-", "g"),' ')
                        arr.push(fin);
                    }
                })
            });
            var uniques = appFunc.uniquify(arr);
            window.htmlOriginal = uniques;
            if(uniques && uniques > 0){
                html += '<ul>'
                uniques.forEach(function(section){

                    html += '<li>'+section+'</li>'

                });
                html += '</ul>';
            } else {
                html = '<p>Kategorije niso na voljo</p>'
            }
            window.html = html;
            $$('.rubrike-page ul').html(html);
        }

    };

    return timelineView;
});