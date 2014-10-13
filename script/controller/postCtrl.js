define(['utils/appFunc',
        'utils/xhr',
        'view/module',
        'i18n!nls/lang',
        'controller/timelineCtrl'],function(appFunc,xhr,VM,i18n,CT){

    var postCtrl = {

        bindEvent: function(){
            var bindings = [{
                element: '.send-popup',
                event: 'open',
                handler: VM.module('postView').clearSendPopup
            },{
                element: document,
                selector: '#uploadPicPreview>img',
                event: 'click',
                handler: postCtrl.clearChosenImage
            },{
                element: document,
                selector: '.js-section-li',
                event: 'click',
                handler: postCtrl.filterBySection
            },{
                element: document,
                selector: '.open-favorites',
                event: 'click',
                handler: postCtrl.filterByFavorites
            },{
                element: document,
                selector: '.modal-overlay-visible',
                event: 'click',
                handler: function(){
                    hiApp.closeModal('.send-popup')
                }
            }];

            appFunc.bindEvents(bindings);
        },

        clearChosenImage: function(){
            hiApp.confirm(i18n.camera.confirm_clear_image,function(){
                $$('#uploadPicPreview>img').attr('src','');
                $$('#uploadPicPreview').hide();

                localStorage.removeItem('imageUrl');
            });
        },
        filterBySection: function(e){
            e.preventDefault();
            var cat = $$(this).find('.item-title').text().replace(new RegExp(" ", "g"),'-');
            CT.refreshTimeline(cat);
            hiApp.closeModal('.send-popup');
        },
        filterByFavorites: function(e){
            e.preventDefault();
            CT.refreshTimelineForFavorites();
            hiApp.closeModal('.send-popup');
        }
    };

    postCtrl.bindEvent();

    return postCtrl
});