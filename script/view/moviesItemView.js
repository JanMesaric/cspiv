define(['utils/appFunc','i18n!nls/lang','utils/tplManager'],function(appFunc,i18n,TM){

    var itemView = {

        init: function(params){
            appFunc.hideToolbar('.views');
            appFunc.bindEvents(params.bindings);
            //this.createArchiveSlides();
            log('eeeeeeeeeeeeee')
            log(params)
            log($$(params.target).parent('a'))
            setTimeout(function(){
                log($$('.movies-item-content').length)
            }, 100);
            this.getItem(0);
        },
        createArchiveSlides: function(){
            log('create')
        },
        getItem: function(id){
            log('create')
            var $this = $$('.time-line-content .item-content[data-id="'+ id +'"]');

            var item = [];
            item.id = $this.data('id');
            item.nickname = $this.find('.item-header .detail .nickname').html();
            item.avatar = $this.find('.item-header .avatar>img').data('avatarid');
            item.time = appFunc.timeFormat($this.find('.item-header .detail .create-time').data('time'));
            item.text = $this.find('.item-subtitle').html();
            item.content = $this.find('.item-content').html();
            item.author = $this.find('.item-author').html();
            item.rubrika = $this.find('.item-rubrika').html();



            if($this.find('.item-image img')[0])
                item.image = $this.find('.item-image img').attr('src');

            var output = TM.renderTplById('moviesItem',window.moviesData[0]);
            $$('.movies-item-content').html(output);
        },
        openItemPage: function(e){
            if(e.target.nodeName !== 'DIV'){
                log('shouldnt happend')
//                return false;
            }
            log('noooo')
            this.getItem(0);
            var itemId = $$(this).parents('.item-content').data('id');
            window.currArticleId = itemId;
            mainView.loadPage('page/item.html?id=' + itemId);
        },
        i18next: function(content){

            var renderData = {};
            renderData.back = i18n.global.back;
            renderData.title = 'Kino';
            renderData.comment = i18n.timeline.comment;
            renderData.forward = i18n.timeline.forward;

            var output = TM.renderTpl(content, renderData);

            return output;
        }

    };

    return itemView;
});