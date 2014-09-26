define(['utils/appFunc','view/module', 'utils/tplManager', 'controller/timelineCtrl'],function(appFunc,VM, TM, CT){

    var itemCtrl = {

        init: function(){
            //TODO: to je treba še porihtat
            appFunc.hideToolbar('.views');
            log('moviesCtrl')
            hiApp.showIndicator();
            itemCtrl.fetchMoviesData();

            var bindings = [
                {
                    element: document,
                    selector: '.js-open-edition',
                    event: 'click',
                    handler: itemCtrl.openEdition
                }, {
                    element: document,
                    selector: '.back2contact',
                    event: 'click',
                    handler: function(){

                        appFunc.showToolbar('.views');
                    }
                },
                {
                    element: document,
                    selector: '.movies-listview li',
                    event: 'click',
                    handler: function(e){
                        //appFunc.showToolbar('.views');
                        var url = $$(this).find('a').attr('href');
                        var fin = url.split("=")[1];
                        var arr = [];
                        window.moviesData.forEach(function(data){
                            if(data.id == fin){
                                arr.push(data);
                            }
                        });
                        if(arr.length == 1){
                            hiApp.showIndicator();
                            setTimeout(function(){
                                var data = arr[0];
                                $$('.movies-item-content').append('<img src="'+data.imgSrc+'" class="movie-image-placeholder" />' +
                                    '<ul>' +
                                    '<li>'+data.title+'</li>' +
                                    '<li>'+data.cast+'</li>' +
                                    '<li>'+data.country+'</li>' +
                                    '<li>'+data.genre+'</li>' +
                                    '<li>'+data.url+'</li>' +
                                    '<li>'+data.title+'</li>' +
                                    '<li>'+data.originalTitle+'</li>' +
                                    '<li>'+data.description+'</li>' +
                                    '</ul>')
                                hiApp.hideIndicator();
                            }, 100);
                        }

                    }
                }
            ];

            appFunc.bindEvents(bindings);

        },
        fetchMoviesData: function(){
            $.ajax({
                type: "GET",
                url: "http://www.kolosej.si/spored/xml/2.0/",
                dataType: "xml",
                success: function(data){
                    var obj = {}, arr = [];
                    var movie = $(data).find('movie').each(function(){
                        var title = $(this).find('title').text(),
                            originalTitle = $(this).find('original_title').text(),
                            genre = $(this).find('genre').text(),
                            director = $(this).find('director').text(),
                            cast = $(this).find('cast').text(),
                            imgSrc = $(this).find('poster').text(),
                            url = $(this).find('url').text(),
                            length = $(this).find('duration').text(),
                            description = $(this).find('plot_outline').text(),
                            country = $(this).find('country').text(),
                            id = Math.random() * 100;

                        obj = {
                            title: title,
                            originalTitle: originalTitle,
                            genre: genre,
                            director: director,
                            cast: cast,
                            imgSrc: imgSrc,
                            url: url,
                            length: length,
                            description: description,
                            country:country,
                            id: id
                        };
                        arr.push(obj);
                    });
                    window.moviesData = arr;
                    VM.module('moviesView').renderMoviesListview(arr);
                }
            });
        }


    };

    return itemCtrl;
});