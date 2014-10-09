define(['utils/appFunc',
        'controller/module',
        'i18n!nls/lang',
        'utils/tplManager',
        'components/geolocation',
        'components/camera'],function(appFunc,CM,i18n,TM,geo,camera){

    var recipeView = {

        openRecipeSendPopup: function(){
            var renderData = [];
            renderData.cancel = i18n.global.cancel;
            renderData.send = i18n.global.send;
            renderData.senTweet = i18n.index.sen_tweet;
            renderData.sendPlaceholder = i18n.index.send_placeholder;
            renderData.loadingGeo = i18n.geo.loading_geo;
            renderData.data = catReplaced; //pripeto na window v timelineView-u, to so unique predelki

            var output = TM.renderTplById('sendRecipeTemplate', renderData);
            hiApp.popup($$.trim(output));

              var bindings = [
{
                element: '#sendWeiboBtn1',
                event: 'click',
                handler: recipeView.postMsg
            },{
                element: 'div.message-tools .get-position',
                event: 'click',
                handler: geo.catchGeoInfo
            },{
                element: '#geoInfo',
                event: 'click',
                handler: geo.cleanGeo
            },{
                element: 'div.message-tools .image-upload',
                event: 'click',
                handler: camera.getPicture
            },
              {
                element: '.js-section-li',
                event: 'click',
                handler: recipeView.filterBySection
            }
            ];

            appFunc.bindEvents(bindings);
        },

        clearRecipeSendPopup: function(){
            $$('#messageText').val('');
            $$('#uploadPicPreview>img').attr('src','');
            $$('#uploadPicPreview').hide();
        },

        postMsg: function(){
            var text = $$('#messageText').val();
            var title = $$('#messageTitle').val();

            alert(text);
            alert(title);

            if(appFunc.getCharLength(text) < 4){
                hiApp.alert('ups, tekst je prekratek...');
                return;
            }else{
                //fileTransfer.startUpload(text);
                hiApp.alert('Recept uspešno poslan!');

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

    return recipeView;
});