define(['utils/appFunc','utils/xhr','view/module'],function(appFunc,xhr,VM){

    var commentCtrl = {

        init: function(){
//            log('napiši komentar')
//            var data = {
//                "username": "admin",
//                "password": "bjforall",
//                "articleId": "0", //odvisen od article
//                "articleEdition": "2", //odvisen od id
//                "body": "this is madafakin body 3"
//            }
//
//            $.ajax({
//                url: "http://connectsocial.si/drupaltest/ajax/createTopic.php",
//                type: "post",
//                dataType: "json",
//                data: data,
//                success: function(data){
//                    console.log(data)
//
//                    //TODO: če hočeš da je anonimen samo ne dodat usernama pa passa!
//                    //TODO: ko dobiš response naredi animacijo novega teksta
//                },
//                error: function(e,p,m){
//                    myApp.alert('Prišlo je do napake pri prenosu sporočila, poizkusite ponovno!', 'Napaka');
//                }
//            });
            var bindings = [{
                element:'.item-comment-btn',
                event: 'click',
                handler:VM.module('commentView').commentPopup
            }];

            VM.module('commentView').init({
                bindings:bindings
            });

            this.getComments();
        },

        getComments: function(){
            xhr.fetchComments({
                url: 'http://connectsocial.si/drupaltest/rest2/mobile_comments.json'
            }, function (response) {
                log(response)
                var arr = [];
                response.forEach(function(data){
                    var obj = {
                        articleId: data.node_title.split('=')[0],
                        editionId: data.node_title.split('=')[1],
                        name: data.node_comment_statistics_last_comment_name,
                        text: data.Body,
                        rtime: appFunc.calculateSince(data.node_changed)
                    }
                    arr.push(obj);
                });
                VM.module('commentView').render({
                    comments: arr
                });

            });
        }

    };

    return commentCtrl;
});