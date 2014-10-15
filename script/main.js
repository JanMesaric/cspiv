var log = console.log.bind(console);
String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return this.length>n ? this.substr(0,n-1)+'...' : this;
    };
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp*1000);
    var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '.' + month + ' ' + year;
    return time;
}
var cities = {}
cities.cities = [
    {
        name: 'ljubljana',
        lon: 14.5031,
        lat: 46.0513,
        region: 1
    },
    {
        name: 'maribor',
        lon: 15.64667,
        lat: 46.554722,
        region: 2
    },
    {
        name: 'lasko',
        lon: 15.2332,
        lat: 46.1688,
        region: 3
    },
    {
        name: 'kranj',
        lon: 14.35561,
        lat: 46.238869,
        region: 4
    },
    {
        name: 'koper',
        lon: 13.72944,
        lat: 45.54694,
        region: 5
    },
    {
        name: 'novo mesto',
        lon: 15.16886,
        lat: 45.80397,
        region: 6
    },
    {
        name: 'murska sobota',
        lon: 16.162,
        lat: 46.6611,
        region: 7
    },
    {
        name: 'nova gorica',
        lon: 13.6503,
        lat: 45.9598,
        region: 8
    }
];

var App = {
    getGeolocation: function(){
        alert('geolocation fired')
        navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.geolocationError, {enableHighAccuracy: true, timeout: 10000});
    },
    geolocationSuccess: function(position){
        alert('geolocation succ')
        App.currentPos = {
            lon: position.coords.longitude,
            lat: position.coords.latitude
        };
        alert(position.coords.longitude + ' ' + position.coords.latitude);
        //alert(App.currentPos.lon + ' ' + App.currentPos.lat) //do kle
        var cityBounds = [],
            cities = window.cities.cities;
        for(var i = 0, len = cities.length; i < len; i++){
            var negLon = Math.abs(cities[i].lon - App.currentPos.lon);
            var negLat = Math.abs(cities[i].lat - App.currentPos.lat);
            // console.log(negLon)
            var obj = {
                comparator: Math.sqrt(negLon^2+negLat^2), //za testirat sqrt(a^2+b^2)
                name: cities[i].name
            };
            cityBounds.push(obj);
        }
        alert('122');
        var final = [],
            first = cityBounds[0].comparator,
            newcomparator,
            nameof;
        for(var i = 1, len = cityBounds.length; i < len; i++){
            if(newcomparator == undefined){
                if(cityBounds[i].comparator < first){
                    final.push(cityBounds[i]);
                    newcomparator = cityBounds[i].comparator
                }else{
                    final.push(cityBounds[0]);
                    newcomparator = cityBounds[0].comparator
                }
            }
            if(cityBounds[i].comparator < newcomparator){
                final.push(cityBounds[i])
            }
            if(i == 7){
                nameof = final.pop().name
            }

        };
       alert(nameof);
        //alert('Začenjam z iskanjem podatkov vremena'); //do kle
        localStorage.setItem('currentCity', nameof);

        /* get forecast */
        App.myTimer = setInterval(function(){
            $.ajax({
                timeout: 5000,
                url:"http://api.openweathermap.org/data/2.5/forecast?q="+localStorage.getItem('currentCity')+",si&units=metric",
                dataType: 'jsonp',
                async: true,
                success:function(json){

                    var day0temp = json.list[0].main.temp;
                    var day1temp = json.list[9].main.temp;
                    var day2temp = json.list[17].main.temp;
                    var day3temp = json.list[25].main.temp;
                    var day4temp = json.list[33].main.temp;
                    var daystemp = [day0temp, day1temp, day2temp, day3temp, day4temp];

                    var day0wind = json.list[0].wind.speed;
                    var day1wind = json.list[9].wind.speed;
                    var day2wind = json.list[17].wind.speed;
                    var day3wind = json.list[25].wind.speed;
                    var day4wind = json.list[33].wind.speed;

                    var day0src = json.list[0].weather[0].description;
                    var day1src = json.list[9].weather[0].description;
                    var day2src = json.list[17].weather[0].description;
                    var day3src = json.list[25].weather[0].description;
                    var day4src = json.list[33].weather[0].description;

                    var dayssrc = [day0src, day1src, day2src, day3src, day4src];
                    var dayswind = [day0wind, day1wind, day2wind, day3wind, day4wind];

                    var crsrc = JSON.stringify(dayssrc)
                    localStorage.setItem('currSrc', crsrc);
                    localStorage.setItem('weatherWind', '['+dayswind+']');
                    localStorage.setItem('weatherForecast', '['+daystemp+']');
                    // self.setWeather();
                    App.Vent.trigger("weatherUpdate");

                },
                error:function(){
                    //console.log('Weather does not work!');
                }
            });

            /* curr weather */
            $.ajax({
                timeout: 5000,
                url:"http://api.openweathermap.org/data/2.5/weather?q="+localStorage.getItem('currentCity')+",si&units=metric",
                dataType: 'jsonp',
                async: true,
                success:function(json){


                    var name = '',
                        day0 = json.weather[0].description,
                        src = '',
                        srcmain = '';

                    switch (day0){
                        case 'sky is clear':
                        case 'Sky is Clear':
                            name = 'sončno';
                            src = 'style/img/weatherIcons/7.png';
                            srcmain = 'style/img/weatherIcons/blck/1.png';
                            break;
                        case 'few clouds':
                        case 'proximity shower rain':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        case 'scattered clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        case 'broken clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        case 'overcast clouds':
                            name = 'oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        //konec oblakov

                        //Atmosphere
                        case 'mist':
                        case 'smoke':
                        case 'haze':
                        case 'Sand/Dust Whirls':
                        case 'Fog':
                            name = 'oblačno';
                            src = 'style/img/weatherIcons/10.png';
                            srcmain = 'style/img/weatherIcons/blck/4.png';
                            break;
                        //snow
                        case 'light snow':
                        case 'snow':
                        case 'heavy snow':
                        case 'sleet':
                        case 'shower snow':
                            name = 'snežne padavine';
                            src = 'style/img/weatherIcons/12.png';
                            srcmain = 'style/img/weatherIcons/blck/6.png';
                            break;
                        //rain1
                        case 'light rain':
                        case 'moderate rain':
                        case 'heavy intensity rain':
                        case 'very heavy rain':
                        case 'extreme rain':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/9.png';
                            srcmain = 'style/img/weatherIcons/blck/3.png';
                            break;
                        //rain2
                        case 'freezing rain':
                        case 'light intensity shower rain':
                        case 'shower rain':
                        case 'heavy intensity shower rain':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/9.png';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
                            break;
                        //drizzle
                        case 'light intensity drizzle':
                        case 'drizzle':
                        case 'heavy intensity drizzle':
                        case 'light intensity drizzle rain':
                        case 'drizzle rain':
                        case 'heavy intensity drizzle rain':
                        case 'shower drizzle':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/11.png';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
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
                            name = 'nevihta';
                            src = 'style/img/weatherIcons/11.png';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
                            break;
                    }

                    var currWeather = {
                        name: name,
                        src: src,
                        srcmain: srcmain,
                        temp: Math.round(json.main.temp),
                        wind: json.wind.speed
                    };

                    localStorage.setItem('currWeather', JSON.stringify(currWeather));
                    App.Vent.trigger("currWeatherUpdate");
                    // self.setCurrWeather();
                },
                error:function(){

                    //console.log('Weather does not work!');
                }
            });
        }, 10000); //na 30 sekund dobi weather
    },
    geolocationError: function(){
        alert('geolocation err')

        hiApp.alert('Pri iskanju mesta je prišlo do napake, preverite svoje GPS nastavitev.', 'Napaka ');
        function alertDismissed(){}
        localStorage.setItem('currentCity', 'lasko');
        $("#currCity").text('Laško<');
        var url = "http://api.openweathermap.org/data/2.5/forecast?q=lasko,si&units=metric";
        App.myTimer = setInterval(function(){
            $.ajax({
                timeout: 5000,
                url:url,
                dataType: 'jsonp',
                async: true,
                success:function(json){
                    var day0temp = json.list[0].main.temp;
                    var day1temp = json.list[9].main.temp;
                    var day2temp = json.list[17].main.temp;
                    var day3temp = json.list[25].main.temp;
                    var day4temp = json.list[33].main.temp;
                    var daystemp = [day0temp, day1temp, day2temp, day3temp, day4temp];

                    var day0wind = json.list[0].wind.speed;
                    var day1wind = json.list[9].wind.speed;
                    var day2wind = json.list[17].wind.speed;
                    var day3wind = json.list[25].wind.speed;
                    var day4wind = json.list[33].wind.speed;

                    var day0src = json.list[0].weather[0].description;
                    var day1src = json.list[9].weather[0].description;
                    var day2src = json.list[17].weather[0].description;
                    var day3src = json.list[25].weather[0].description;
                    var day4src = json.list[33].weather[0].description;

                    var dayssrc = [day0src, day1src, day2src, day3src, day4src];
                    var dayswind = [day0wind, day1wind, day2wind, day3wind, day4wind];

                    var crsrc = JSON.stringify(dayssrc)
                    localStorage.setItem('currSrc', crsrc);
                    localStorage.setItem('weatherWind', '['+dayswind+']');
                    localStorage.setItem('weatherForecast', '['+daystemp+']');
                    // self.setWeather();
                    App.Vent.trigger("weatherUpdate");
                },
                error:function(){
                    //console.log('Weather does not work!');
                }
            });

            /* curr weather */
            $.ajax({
                timeout: 5000,
                url:"http://api.openweathermap.org/data/2.5/weather?q=lasko,si&units=metric",
                dataType: 'jsonp',
                async: true,
                success:function(json){
                    var name = '',
                        day0 = json.weather[0].description,
                        src = '',
                        srcmain = '';
                    switch (day0){
                        case 'sky is clear':
                        case 'Sky is Clear':
                            name = 'sončno';
                            src = 'style/img/weatherIcons/7.png';
                            srcmain = 'style/img/weatherIcons/blck/1.png';
                            break;
                        case 'few clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        case 'scattered clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        case 'broken clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        case 'overcast clouds':
                            name = 'oblačno';
                            src = 'style/img/weatherIcons/8.png';
                            srcmain = 'style/img/weatherIcons/blck/2.png';
                            break;
                        //konec oblakov

                        //Atmosphere
                        case 'mist':
                        case 'smoke':
                        case 'haze':
                        case 'Sand/Dust Whirls':
                        case 'Fog':
                            name = 'oblačno';
                            src = 'style/img/weatherIcons/10.png';
                            srcmain = 'style/img/weatherIcons/blck/4.png';
                            break;
                        //snow
                        case 'light snow':
                        case 'snow':
                        case 'heavy snow':
                        case 'sleet':
                        case 'shower snow':
                            name = 'snežne padavine';
                            src = 'style/img/weatherIcons/12.png';
                            srcmain = 'style/img/weatherIcons/blck/6.png';
                            break;
                        //rain1
                        case 'light rain':
                        case 'moderate rain':
                        case 'heavy intensity rain':
                        case 'very heavy rain':
                        case 'extreme rain':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/9.png';
                            srcmain = 'style/img/weatherIcons/blck/3.png';
                            break;
                        //rain2
                        case 'freezing rain':
                        case 'light intensity shower rain':
                        case 'shower rain':
                        case 'heavy intensity shower rain':
                            name = 'deževno';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
                            break;
                        //drizzle
                        case 'light intensity drizzle':
                        case 'drizzle':
                        case 'heavy intensity drizzle':
                        case 'light intensity drizzle rain':
                        case 'drizzle rain':
                        case 'heavy intensity drizzle rain':
                        case 'shower drizzle':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/11.png';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
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
                            name = 'nevihta';
                            src = 'style/img/weatherIcons/11.png';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
                            break;
                    }
                    var currWeather = {
                        name: name,
                        src: src,
                        srcmain: srcmain,
                        temp: Math.round(json.main.temp),
                        wind: json.wind.speed
                    };

                    localStorage.setItem('currWeather', JSON.stringify(currWeather));
                    App.Vent.trigger("currWeatherUpdate");
                    // self.setCurrWeather();
                },
                error:function(){
                    //console.log('Weather does not work!');
                }
            });
        }, 10000);
    },
    /*podatki za vreme*/
    cities: function(){
        var cities = ['ljubljana', 'kranj', 'novo&mesto', 'koper', 'maribor', 'murska&sobota', 'nova&gorica'];
        App.citiesTemperatures = [];

        function citiess(){
            for(var i = 0; i<8; i++){
                ajaxReq(i);
            }
        }
        citiess();
        setTimeout(function(){
            if(App.citiesTemperatures.length < 7){
                citiess();
            }
        }, 10000);
        function ajaxReq(i){
            var currCity = cities[i], src, name;
            $.ajax({
                timeout: 5000,
                url:"http://api.openweathermap.org/data/2.5/forecast?q="+ cities[i] +",si&units=metric",
                dataType: 'jsonp',
                async: true,
                success:function(json){

                    switch (json.list[0].weather[0].description){
                        case 'sky is clear':
                        case 'Sky is Clear':
                            name = 'sončno';
                            src = 'style/img/weatherIcons/1.png';
                            srcmain = 'style/img/weatherIcons/1.png';
                            break;
                        case 'few clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/2.png';
                            srcmain = 'style/img/weatherIcons/2.png';
                            break;
                        case 'scattered clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/2.png';
                            srcmain = 'style/img/weatherIcons/2.png';
                            break;
                        case 'broken clouds':
                            name = 'delno oblačno';
                            src = 'style/img/weatherIcons/2.png';
                            srcmain = 'style/img/weatherIcons/2.png';
                            break;
                        case 'overcast clouds':
                            name = 'oblačno';
                            src = 'style/img/weatherIcons/2.png';
                            srcmain = 'style/img/weatherIcons/2.png';
                            break;
                        //konec oblakov

                        //Atmosphere
                        case 'mist':
                        case 'smoke':
                        case 'haze':
                        case 'Sand/Dust Whirls':
                        case 'Fog':
                            name = 'oblačno';
                            src = 'style/img/weatherIcons/4.png';
                            srcmain = 'style/img/weatherIcons/4.png';
                            break;
                        //snow
                        case 'light snow':
                        case 'snow':
                        case 'heavy snow':
                        case 'sleet':
                        case 'shower snow':
                            name = 'snežne padavine';
                            src = 'style/img/weatherIcons/6.png';
                            srcmain = 'style/img/weatherIcons/6.png';
                            break;
                        //rain1
                        case 'light rain':
                        case 'moderate rain':
                        case 'heavy intensity rain':
                        case 'very heavy rain':
                        case 'extreme rain':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/3.png';
                            srcmain = 'style/img/weatherIcons/3.png';
                            break;
                        //rain2
                        case 'freezing rain':
                        case 'light intensity shower rain':
                        case 'shower rain':
                        case 'heavy intensity shower rain':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/5.png';
                            srcmain = 'style/img/weatherIcons/5.png';
                            break;
                        //drizzle
                        case 'light intensity drizzle':
                        case 'drizzle':
                        case 'heavy intensity drizzle':
                        case 'light intensity drizzle rain':
                        case 'drizzle rain':
                        case 'heavy intensity drizzle rain':
                        case 'shower drizzle':
                            name = 'deževno';
                            src = 'style/img/weatherIcons/5.png';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
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
                            name = 'nevihta';
                            src = 'style/img/weatherIcons/5.png';
                            srcmain = 'style/img/weatherIcons/blck/5.png';
                            break;
                    }
                    var obj = {
                        name: currCity.replace('&', ' '),
                        class: currCity.replace('&', '-'),
                        temp: Math.round(json.list[0].main.temp) + '°',
                        wind: Math.round(json.list[0].wind.speed),
                        src: src,
                        word: name
                    };
                    App.citiesTemperatures.push(obj);
                },
                error:function(){}
            });
        }
    }
};
(function() {
    var lang = localStorage.getItem('lang') || 'en-us';
    //TODO: http://requirejs.org/docs/api.html
    require.config({
        locale: lang,
        paths: {
            text:'../vendors/require/text',
            i18n:'../vendors/require/i18n',
            Framework7:'../vendors/framework7/framework7',
            swiper:'../vendors/idangero/idangerous.swiper-2.0.min',
            swiper3d:'../vendors/framework7/idangerous.swiper.3dflow-2.0',
            mustache:'../vendors/mustache/mustache',
            GTPL:'../page/global.tpl.html',
            GS:'services/globalService'
        },
        shim: {
            'Framework7':{exports: 'Framework7'}
        }
    });

    //requirejs avtomatične najde router -> router.js v istem rootu kot main
    require(['Framework7','router','i18n!nls/lang','utils/appFunc'], function(Framework7,router,i18n,appFunc) {

        var app = {
            initialize: function() {
                this.bindEvents();
            },
            bindEvents: function() {
                if(appFunc.isPhonegap()) {
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                }else{
                    window.onload = this.onDeviceReady();
                }
            },
            onDeviceReady: function() {
                app.receivedEvent('deviceready');
            },
            receivedEvent: function(event) {
                switch (event) {
                    case 'deviceready':
                        app.initMainView();
                        App.getGeolocation();
                        App.cities();
                        break;

                }
            },
            initMainView:function(){
                window.$$ = Dom7;
                window.hiApp = new Framework7({
                    pushState: false,
                    popupCloseByOutside:false, //TODO: true je bolša izbira
                    animateNavBackIcon: true,
                    modalTitle: i18n.global.modal_title,
                    modalButtonOk: i18n.global.modal_button_ok,
                    modalButtonCancel: i18n.global.cancel,
                    //TODO: PREPROCESS ZA ROUTER!!!
                    preprocess:router.preprocess
                });

                //initi za spodnje menuje, vezani so globalno!
                window.mainView = hiApp.addView('#ourView', {
                    dynamicNavbar: true,
                    domCache:true
                });

                window.contatcView = hiApp.addView('#contatcView', {
                    dynamicNavbar: true,
                    domCache:true
                });

                window.settingView = hiApp.addView('#settingView', {
                    dynamicNavbar: true,
                    domCache:true
                }); /**/


                if(!localStorage.getItem('currEdition')){
                    localStorage.setItem('currEdition', 3);
                }
                //zaženi router
                router.init();
            }
        };
        app.initialize();
    });
})();
function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}