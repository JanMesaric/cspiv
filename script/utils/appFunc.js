define(['i18n!nls/lang'],function(i18n){

    var $$ = Dom7;

    var appFunc = {

        isPhonegap: function() {
            return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
        },

        isEmail: function(str){
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            return reg.test(str);
        },

        getPageNameInUrl: function(url){
            url = url || '';
            var arr = url.split('.');
            return arr[0];
        },

        isEmpty: function(obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        hideToolbar: function(viewContainer) {
            $$(viewContainer).addClass('hidden-toolbar');
            return true;
        },

        showToolbar: function(viewContainer) {
            var vc = $$(viewContainer);
            vc.addClass('hiding-toolbar').removeClass('hidden-toolbar');
            $$('.toolbar').transitionEnd(function () {
                vc.removeClass('hiding-toolbar');
            });
        },

        timeFormat: function(ms){

            ms = ms * 1000;

            var d_second,d_minutes, d_hours, d_days;
            var timeNow = new Date().getTime();
            var d = (timeNow - ms)/1000;
            d_days = Math.round(d / (24*60*60));
            d_hours = Math.round(d / (60*60));
            d_minutes = Math.round(d / 60);
            d_second = Math.round(d);
            if (d_days > 0 && d_days < 2) {
                return d_days + i18n.global.day_ago;
            } else if (d_days <= 0 && d_hours > 0) {
                return d_hours + i18n.global.hour_ago;
            } else if (d_hours <= 0 && d_minutes > 0) {
                return d_minutes + i18n.global.minute_ago;
            } else if (d_minutes <= 0 && d_second >= 0) {
                return i18n.global.just_now;
            } else {
                var s = new Date();
                s.setTime(ms);
                return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' '+ f(s.getHours()) + ':'+ f(s.getMinutes()));
            }

            function f(n){
                if(n < 10)
                    return '0' + n;
                else
                    return n;
            }
        },

        getCharLength: function(str){
            var iLength = 0;
            for(var i = 0;i<str.length;i++)
            {
                if(str.charCodeAt(i) >255)
                {
                    iLength += 2;
                }
                else
                {
                    iLength += 1;
                }
            }
            return iLength;
        },

        matchUrl: function(string){
            var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

            string = string.replace(reg,function(a){
                if(a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1){
                    return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
                }
                else
                {
                    return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
                }
            });
            return string;
        },

        bindEvents: function(bindings) {
            for (var i in bindings) {
                if(bindings[i].selector) {
                    $$(bindings[i].element)
                        .on(bindings[i].event,bindings[i].selector , bindings[i].handler);
                }else{
                    $$(bindings[i].element)
                        .on(bindings[i].event, bindings[i].handler);
                }
            }
        },

        isAppDataAvailable: function(){
            return !window.appData || window.appData == "";
        },

        getCurrEdition: function(){
            //TODO
            return localStorage.getItem('currEdition');
        },

        getCurrEditionArticles: function(data){
            var arr = [], emp = data[this.getCurrEdition()].articles;
            emp.forEach(function(e){
                if(e.artShow === "true"){
                    arr.push(e);
                }
            });
            return arr;
        },

        getAllArticles: function(data){
            var arr = [];
            data.forEach(function(editions){
                editions.articles.forEach(function(edition){
                    if(edition.artShow === "true"){
                        arr.push(edition);
                    }
                });
            });
            return arr;
        },

        uniquify: function(array){
            return array.filter(function(el, index, arr) {
                return index == arr.indexOf(el);
            });
        },
        removeObjFromArray: function(arr, id, edition){
            var i = 0, len = arr.length;
            for(;i<len;i++){
                if(arr[i] != undefined){
                    if(arr[i].id == id && arr[i].edition == edition){
                        arr.splice(i,1);
                    }
                }
            };
            return arr;
        },
        toggleFavorite: function(id, edition, reference){
            var obj = {
                id: id,
                edition: edition
                },
                text = '',
                end = '';
            var oldObj = JSON.parse(localStorage.getItem('favoriteObj'));
            if(!appFunc.isAlreadyFav(id, edition)){
                oldObj.push(obj);
                end = JSON.stringify(oldObj);
                text = 'Shranjeno'
                //$$('.item-tools').find('.js-favorite').css('color', '#4fb950');
            } else {
                end = JSON.stringify(this.removeObjFromArray(oldObj, id, edition));
                text = 'Shrani';
                //$$('.item-tools').find('.js-favorite').css('color', '#909090');

            }
            $$(reference).find('span').text(text);
            $$('.js-favorite').find('span').text(text);
            localStorage.setItem('favoriteObj', end);
        },
        isAlreadyFav: function(id, edition){
            var data = JSON.parse(localStorage.getItem('favoriteObj')),
                isfav = false;
            if(data){
                data.forEach(function(data){
                    if(data.id == id && data.edition == edition){
                        log(data.id + ' ' + data.edition + ' || ' + id + ' ' + edition)
                        isfav = true;
                    }
                });
            }
            return isfav;
        },

        openView: function(fromContainer, toContainer){
            $$(fromContainer).hide();
            $$(toContainer).show();

        },
        returnCurrentArticleComments: function(params){
            var arr = [];
            params.comments.forEach(function(data){
                if(data.articleId == window.currArticleId && data.editionId == localStorage.getItem('currEdition')){
                    arr.push(data);
                }
            });
            return arr;
        },
        calculateSince: function(datetime){
            var tTime=new Date(datetime*1000);
            var cTime=new Date();
            var sinceMin=Math.round((cTime-tTime)/60000);

            if(sinceMin==0)
            {
                var sinceSec=Math.round((cTime-tTime)/1000);
                if(sinceSec<10)
                    var since='pred manj kot 10 sekundami';
                else if(sinceSec<20)
                    var since='pred manj kot 20 sekundami';
                else
                    var since='pred pol minute';
            }
            else if(sinceMin==1)
            {
                var sinceSec=Math.round((cTime-tTime)/1000);
                if(sinceSec==30)
                    var since='pred pol minute';
                else if(sinceSec<60)
                    var since='pred manj kot minuto';
                else
                    var since='pred 1 minuto';
            }
            else if(sinceMin<45)
                var since='pred '+sinceMin+' minutami';
            else if(sinceMin>44 && sinceMin<60)
                var since='pred 1 uro';
            else if(sinceMin<1440){
                var sinceHr=Math.round(sinceMin/60);
                if(sinceHr==1)
                    var since='pred 1 uro';
                else
                    var since='pred '+sinceHr+' urami';
            }
            else if(sinceMin>1439 && sinceMin<2880)
                var since='pred 1 dnevom';
            else
            {
                var sinceDay=Math.round(sinceMin/1440);
                var since=sinceDay+' dnevi';
            }

            return since
        }

    };

    return appFunc;
});