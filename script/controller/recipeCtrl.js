define(['utils/appFunc',
        'utils/xhr',
        'view/module',
        'i18n!nls/lang',
        'controller/kuhalnicaCtrl'],function(appFunc,xhr,VM,i18n,CT){

    var recipeCtrl = {

        bindEvent: function(){

            var bindings = [{
                element: '.send-recipe popup',
                event: 'open',
                handler: VM.module('recipeView').clearRecipeSendPopup
            },{
                element: document,
                selector: '#uploadPicPreview>img',
                event: 'click',
                handler: recipeCtrl.clearChosenImage
            },{
                element: document,
                selector: '.js-section-li',
                event: 'click',
                handler: recipeCtrl.filterBySection
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
        }
    };

    recipeCtrl.bindEvent();

    return recipeCtrl
});