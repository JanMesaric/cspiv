define(['utils/appFunc',
        'controller/module',
        'i18n!nls/lang',
        'utils/tplManager',
        'components/geolocation',
        'components/camera'],function(appFunc,CM,i18n,TM,geo,camera){

    var postView = {

        openSendPopup: function(){
            var renderData = [];
            renderData.cancel = i18n.global.cancel;
            renderData.send = i18n.global.send;
            renderData.senTweet = i18n.index.sen_tweet;
            renderData.sendPlaceholder = i18n.index.send_placeholder;
            renderData.loadingGeo = i18n.geo.loading_geo;
            renderData.data = catReplaced; //pripeto na window v timelineView-u, to so unique predelki

            var output = TM.renderTplById('sendPopupTemplate', renderData);
            hiApp.popup($$.trim(output));

              var bindings = [
// {
//                element: '#sendWeiboBtn',
//                event: 'click',
//                handler: postView.postMsg
//            },{
//                element: 'div.message-tools .get-position',
//                event: 'click',
//                handler: geo.catchGeoInfo
//            },{
//                element: '#geoInfo',
//                event: 'click',
//                handler: geo.cleanGeo
//            },{
//                element: 'div.message-tools .image-upload',
//                event: 'click',
//                handler: camera.getPicture
//            },
//              {
//                element: '.js-section-li',
//                event: 'click',
//                handler: postView.filterBySection
//            }
            ];

            appFunc.bindEvents(bindings);
        },

        clearSendPopup: function(){
            $$('#messageText').val('');
            $$('#uploadPicPreview>img').attr('src','');
            $$('#uploadPicPreview').hide();
        },

        postMsg: function(){
            var text = $$('#messageText').val();

            if(appFunc.getCharLength(text) < 4){
                hiApp.alert(i18n.index.err_text_too_short);
                return;
            }

            var imgSrc = $$('#uploadPicPreview>img').attr('src');

            if(imgSrc.length > 4){
                camera.startUpload(imgSrc);
            }else {

                hiApp.showPreloader(i18n.index.sending);

                setTimeout(function () {
                    hiApp.hidePreloader();
                    hiApp.closeModal('.send-popup');
                    //Refresh Timeline
                }, 1300);
            }
        }
    };

    return postView;
});