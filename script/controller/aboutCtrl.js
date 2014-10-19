define(['utils/appFunc','view/module'],function(appFunc,VM){

    var aboutCtrl = {

        init: function(){
            var html = '';
            log(App.citiesTemperatures)
            $('.city-text').text(localStorage.getItem('currentCity'))
            $('.city-temp2').text(JSON.parse(localStorage.getItem('currWeather')).temp)
            $('.city-weather').text(JSON.parse(localStorage.getItem('currWeather')).name)
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

            var daystemp = JSON.parse(localStorage.getItem('weatherForecast'));
            var dnevi = ["Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota", "Nedelja"],
                t = new Date(),
                today = t.getDay()-1,
                stevec = 0;
            if(today == -1){ today = 6; }


            var dayswind = JSON.parse(localStorage.getItem('weatherWind')),
                dayssrc = JSON.parse(localStorage.getItem('currSrc')),
                src;
            for(var i=0; i<5; i++){
                switch (dayssrc[i]){
                    case 'sky is clear':
                    case 'Sky is Clear':
                        src = 'style/img/weatherIcons/1.png';
                        break;
                    case 'few clouds':
                        src = 'style/img/weatherIcons/2.png';
                        break;
                    case 'scattered clouds':
                        src = 'style/img/weatherIcons/2.png';
                        break;
                    case 'broken clouds':
                        src = 'style/img/weatherIcons/2.png';
                        break;
                    case 'overcast clouds':
                        src = 'style/img/weatherIcons/2.png';
                        break;
                    //konec oblakov

                    //Atmosphere
                    case 'mist':
                    case 'smoke':
                    case 'haze':
                    case 'Sand/Dust Whirls':
                    case 'Fog':
                        src = 'style/img/weatherIcons/4.png';
                        break;
                    //snow
                    case 'light snow':
                    case 'snow':
                    case 'heavy snow':
                    case 'sleet':
                    case 'shower snow':
                        src = 'style/img/weatherIcons/6.png';
                        break;
                    //rain1
                    case 'light rain':
                    case 'moderate rain':
                    case 'heavy intensity rain':
                    case 'very heavy rain':
                    case 'extreme rain':
                        src = 'style/img/weatherIcons/5.png';
                        break;
                    //rain2
                    case 'freezing rain':
                    case 'light intensity shower rain':
                    case 'shower rain':
                    case 'heavy intensity shower rain':
                        src = 'style/img/weatherIcons/5.png';
                        break;
                    //drizzle
                    case 'light intensity drizzle':
                    case 'drizzle':
                    case 'heavy intensity drizzle':
                    case 'light intensity drizzle rain':
                    case 'drizzle rain':
                    case 'heavy intensity drizzle rain':
                    case 'shower drizzle':
                        src = 'style/img/weatherIcons/5.png';
                        break;
                    //thunderstorm
                    case 'thunderstorm with light rain':
                    case 'thunderstorm with rain':
                    case 'thunderstorm with heavy rain':
                    case 'light thunderstorm':
                    case 'thunderstorm':
                    case 'heavy thunderstorm':
                    case 'ragged thunderstorm':
                    case 'thunderstorm with light drizzle':
                    case 'thunderstorm with drizzle':
                    case 'thunderstorm with heavy drizzle':
                        src = 'style/img/weatherIcons/5.png';
                        break;
                }

                var dan = $('.daysInner')[i];
                if((today+stevec) > 6) {today = 0; stevec = 0;}
                $("ul").find(dan).html('<img class="daysImg" style="height:40px; background-color:white; float:left; margin-top:-12px;" src="'+ src +'" /><span class="daysName">' + dnevi[today + stevec] + ': </span><span class="daysTemp"> ' + Math.round(daystemp[i]) + '°</span><br />');
                stevec++
            }

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