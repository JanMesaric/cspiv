define(['GS','controller/module'],function(GS,CM) {

    var router = {

        init: function() {
            $$(document).on('pageBeforeInit', function (e) {
                var page = e.detail.page;
                router.pageBeforeInit(page);
            });
            $('head').append('<link rel="stylesheet" href="http://connectsocial.si/pivar/additional-styles-new.css" type="text/css" />');
            $$(document).on('pageAfterAnimation', function (e) {
                var page = e.detail.page;
                router.pageAfterAnimation(page);
            });
            /*$$(document).on('show', function(e){
                    var id = $$(e.target).attr('id');
                    if(GS.isLogin()){
                        log('yeyeye')
                        $('.setting-page').html('<li>\
                            <a href="page/language.html?from=setting" class="item-link">\
                            <div class="item-content">\
                                <div class="item-media language">\
                                    <i class="icon ios7-world-outline"></i>\
                                </div>\
                                <div class="item-inner">\
                                    <div class="item-title">Iskfdsafasdfsdanje</div>\
                                </div>\
                            </div>\
                            </a>\
                        </li>')
                    }
            })*/

            mainView.loadPage('index.html',false);
            //remove 'hidden-navbar' class
            $$('div.views').removeClass('hidden-navbar');
            setTimeout(function(){
                $$('.city-text').text(localStorage.getItem('currentCity'));
            },6000);
            setTimeout(function(){
                $$('.city-text').text(localStorage.getItem('currentCity'));
            },5000);
            setTimeout(function(){
                $$('.city-text').text(localStorage.getItem('currentCity'));
            },4000);
            setTimeout(function(){
                $$('.city-text').text(localStorage.getItem('currentCity'));
            },3000);
            setTimeout(function(){
                $$('.city-text').text(localStorage.getItem('currentCity'));
            },2000);
            setTimeout(function(){
                $$('.city-text').text(localStorage.getItem('currentCity'));
            },1000);

            $$('.tab-link').on('click', function(){
                $('.city-text').text(localStorage.getItem('currentCity'));
                setTimeout(function(){
                    $('.city-text').text(localStorage.getItem('currentCity'));
                    if(localStorage.getItem('user')){
                        $$('.signupee-hidden').css('display', 'block');
                        $$('.signupee-name').text(JSON.parse(localStorage.getItem('user')).name.trunc(15));
                        $$('.signupee-date').html(timeConverter(JSON.parse(localStorage.getItem('user')).login));
                    }
                },100)
            })
            $$('.city-text').text(localStorage.getItem('currentCity'));
            $$('.city-text').text(window.cities.awsm)


        },

        pageAfterAnimation: function(page){
            var name = page.name;
            var from = page.from;
            var swipeBack = page.swipeBack;

            //če sem prišel iz mainpaga potem skrij spodnji menu, a se to sploh dogaja kle? ker če zbrišeš ni razlike
            if(name === 'ourView' || name === 'contatcView' || name === 'setting' ){
                if(from === 'left' && swipeBack){
                    CM.module('appCtrl').showToolbar();

                }
            }
        },

        pageBeforeInit: function(page) {
            $$('.city-text').text(localStorage.getItem('currentCity'));
            //initiam vse controllerje!
            var name = page.name;
            var query = page.query;
            var from = page.from;
            //OURVIEW SE PROŽI NA ZAČETKU!!! torej še preden se nalowda glavni page gre to čez in se sprožijo trije controllerji
log(name)
            switch (name) {
                case 'login':
                    if(from === 'left') return;
                    CM.module('loginCtrl').init();
                    break;
                case 'ourView':
                    if(from === 'left') return;
                    CM.module('timelineCtrl').init();
                    CM.module('contactCtrl').init();
                    CM.module('settingCtrl').init();

                    $$('.tab-link').on('click', function(){

                        $('.city-text').text(localStorage.getItem('currentCity'));
                    setTimeout(function(){
                            $('.city-text').text(localStorage.getItem('currentCity'));
                            if(localStorage.getItem('user')){
                                $$('.signupee-hidden').css('display', 'block');
                                $$('.signupee-name').text(JSON.parse(localStorage.getItem('user')).name.trunc(15));
                                $$('.signupee-date').html(timeConverter(JSON.parse(localStorage.getItem('user')).login));
                            }
                    },100)
                    })
                    $$('.city-text').text(localStorage.getItem('currentCity'));
                    $$('.city-text').text(window.cities.awsm)



                    break;
                case 'about':
                    CM.module('aboutCtrl').init();
                    break;
                case 'feedback':
                    CM.module('feedbackCtrl').init();
                    break;
                case 'item':
                    CM.module('itemCtrl').init(query);
                    CM.module('commentCtrl').init();
                    break;
                case 'message':
                    CM.module('messageCtrl').init(query);
                    break;
                case 'language':
                    CM.module('languageCtrl').init(query);
                    break;
                case 'archive':
                    CM.module('archiveCtrl').init();
                    break;
                case 'kuhalnicaView':
                    CM.module('kuhalnicaCtrl').init(query);
                    break;
                case 'itemKuhalnica':
                    CM.module('kuhalnicaitemCtrl').init(query);
                    break;
                case 'movies':
                    CM.module('moviesCtrl').init();
                    break;
                case 'moviesItem':
                    CM.module('moviesItemCtrl').init();
                    break;
                case 'signup':
                    CM.module('signupCtrl').init();
                    break;
            }
        },

        preprocess: function(content,url){
            //TO JE CONTENT IZ INDEX.HTML
            $$('.city-text').text(localStorage.getItem('currentCity'));
            if(!url) return false;

            url = url.split('?')[0] ;

            var viewName;

            switch (url) {
                case 'index.html':
                    viewName = 'appView';
                    break;
                case 'page/login.html':
                    viewName = 'loginView';
                    break;
                case 'page/about.html':
                    viewName = 'aboutView';
                    break;
                case 'page/feedback.html':
                    viewName = 'feedbackView';
                    break;
                case 'page/item.html':
                    viewName = 'itemView';
                    break;
                case 'page/message.html':
                    viewName = 'messageView';
                    break;
                case 'page/language.html':
                    viewName = 'languageView';
                    break;
                case 'page/archive.html':
                    viewName = 'archiveView';
                    break;
                case 'page/movies.html':
                    viewName = 'moviesView';
                    break;
                case 'page/moviesItem.html':
                    viewName = 'moviesItemView';
                    break;
                case 'page/kuhalnica.html':
                    viewName = 'kuhalnicaView';
                    break;
                case 'page/itemKuhalnica.html':
                    viewName = 'kuhalnicaItemView';
                    break;
                case 'page/signup.html':
                    viewName = 'signupView';
                    break;
                default :
                    return content;
            }

            //dobim url, primerjam poti in pišem kateri view želim za katerega odpret in to feedam v i18next
            //http://www.idangero.us/framework7/docs/init-app.html#.VA3FOvmSww0 za preprocess AJAX callback
            //module vrne vse metode viewa in ctrl-jev
            var output = CM.module('appCtrl').i18next(viewName,content);
            //ta output je procesiran html
            return output;

        }

    };

    return router;
});