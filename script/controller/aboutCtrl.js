define(['utils/appFunc','view/module'],function(appFunc,VM){

    var aboutCtrl = {

        init: function(){
            var html = '';
            log(App.citiesTemperatures)
            $('.city-temp').text(localStorage.getItem('currSrc'))
            App.citiesTemperatures.forEach(function(data){
                html += '<li>\
                    <a href="#" class="item-link item-content">\
                        <div class="item-media"><img style="height: 40px; background: none" src="'+data.src+'" alt=""/></div>\
                        <div class="item-inner">\
                            <div class="item-title" style="text-transform: capitalize;">'+data.name+'</div>\
                            <div class="item-after">'+data.temp+' ' + data.word +'</div>\
                        </div>\
                    </a>\
                </li>';
            })
            $('.weather-by-city').html(html);
            var bindings = [{
                element: '.back2setting',
                event: 'click',
                handler: VM.module('appView').showToolbar
            }];

            VM.module('aboutView').init({
                bindings:bindings
            });
        }

    };

    return aboutCtrl;
});