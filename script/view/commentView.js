define(['utils/appFunc','i18n!nls/lang','utils/tplManager'],function(appFunc,i18n,TM){

    var commentView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);
        },

        commentPopup: function(params){
            var renderData = [];
            renderData.cancel = i18n.global.cancel;
            renderData.comment = i18n.timeline.comment;
            renderData.send = i18n.global.send;

            if(params.name){
                renderData.title = i18n.comment.reply_comment;
                renderData.placeholder = i18n.comment.reply + '@' + params.name + ':';
            }else {
                renderData.title = i18n.timeline.comment;
                renderData.placeholder = i18n.comment.placeholder;
            }

            var output = TM.renderTplById('commentPopupTemplate', renderData);
            hiApp.popup($$.trim(output));

            var bindings = [{
                element:'#commentBtn',
                event: 'click',
                handler: commentView.sendComment
            }];

            appFunc.bindEvents(bindings);
        },

        sendComment: function(){
            var text = $$('#commentText').val();

            if(appFunc.getCharLength(text) < 4){
                hiApp.alert(i18n.index.err_text_too_short);
                return false;
            }

            hiApp.showPreloader(i18n.comment.commenting);

            var data = {
                "username": "admin", //TODO: to more bit aktivno
                "password": "bjforall",
                "articleId": window.currArticleId, //odvisen od article
                "articleEdition": localStorage.getItem('currEdition'), //odvisen od id
                "body": $('#commentText').val()
            };
            $.ajax({
                url: "http://connectsocial.si/drupaltest/ajax/createTopic.php",
                type: "post",
                dataType: "json",
                data: data,
                success: function(res){
                    $('#commentContent').prepend('<li class="comment-item">\
                        <div class="comment-detail">\
                            <div class="name">'+data.username+'</div>\
                            <div class="text">'+data.body+'</div>\
                            <div class="time">pred 1 sekundo</div>\
                        </div>\
                    </li>');
                    hiApp.hidePreloader();
                    hiApp.closeModal('.comment-popup');

                },
                error: function(e,p,m){
                    myApp.alert('Prišlo je do napake pri prenosu sporočila, poizkusite ponovno!', 'Napaka');
                }
            });
        },

        render: function(params){
                var filteredParams = appFunc.returnCurrentArticleComments(params)
                var comments = [];
                comments.push(params);
                var arr = {
                    "comments": filteredParams
                };
                var output = TM.renderTplById('commentsTemplate',arr);
                $$('#commentContent').html(output);

                var bindings = [{
                    element:'#commentContent .comment-item',
                    event: 'click',
                    handler: commentView.createActionSheet
                }];

                appFunc.bindEvents(bindings);


        },

        createActionSheet: function(){
            var replyName = $$(this).find('.comment-detail .name').html();
            var buttons1 = [
                {
                    text: i18n.comment.reply_comment,
                    bold: true,
                    onClick:function(){
                        commentView.commentPopup({name:replyName});
                    }
                },
                {
                    text: i18n.comment.copy_comment ,
                    bold: true
                }
            ];
            var buttons2 = [
                {
                    text: i18n.global.cancel,
                    color: 'red'
                }
            ];

            var groups = [buttons1, buttons2];
            hiApp.actions(groups);
        }

    };

    return commentView;
});