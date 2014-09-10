define(['utils/appFunc','view/module', 'utils/tplManager', 'controller/timelineCtrl'],function(appFunc,VM, TM, CT){

    var itemCtrl = {

        init: function(){
            var output = '',
                data = window.appData,
                i = data.length - 1;
            for(;i>=0;i--){
                output += '<div class="swiper-slide js-open-edition" data-id="'+i+'" style="background-image: url('+data[i].info.imgPDF+');"></div>'
            };
            $$('.js-edition-info-placeholder').html('<div style="text-align:center;">' + window.appData[window.appData.length - 1].info.number +'<br />'+ window.appData[window.appData.length - 1].info.date + '</div>');
            $$('.swiper-wrapper').html(output);

            var featuredSwiper = $('.featured').swiper({
                slidesPerView:'auto',
                centeredSlides: true,
                initialSlide:window.appData.length - 1,
                tdFlow: {
                    rotate : 10,
                    stretch :10,
                    depth: 100
                },
                onSlideChangeEnd: function(){
                    $$('.js-edition-info-placeholder').html('<div style="text-align:center;">' +window.appData[featuredSwiper.activeIndex].info.number +'<br />'+ window.appData[featuredSwiper.activeIndex].info.date + '</div>');
                }
            })

            var bindings = [
                {
                    element: document,
                    selector: '.js-open-edition',
                    event: 'click',
                    handler: itemCtrl.openEdition
                }
            ];

            appFunc.bindEvents(bindings);

        },
        openEdition: function(){
            CT.openEdition($$(this).data('id'));
        }

    };

    return itemCtrl;
});