define([], function() {
    var CONFIG = null;

    var globalService = {
        //dobim nazaj userje, če je že log-inan;; sessionID in user data
        init: function(){
            if (!CONFIG) {
                CONFIG = {};
                CONFIG.currentUser = {};
                if (localStorage.getItem('sid')) {
                    CONFIG.currentUser.sid = localStorage.getItem('sid');
                }
                if(localStorage.getItem('user')){
                    CONFIG.currentUser = JSON.parse(localStorage.getItem('user'));
                }
            }
        },

        getCurrentUser: function(){
            return CONFIG.currentUser;
        },

        getSid: function(){
            var m = $$.parseUrlQuery(window.location.href || '');
            return m.sid || localStorage.getItem('sid');
        },

        setCurrentUser: function(sid,user){
            CONFIG.currentUser = user;
            localStorage.setItem('user',JSON.stringify(user));
            localStorage.setItem('sid',sid);
        },

        removeCurrentUser: function(){
            CONFIG.currentUser = {};
            localStorage.removeItem('user');
            localStorage.removeItem('sid');
        },

        //je user log-inan?
        isLogin: function(){
            return (CONFIG.currentUser && localStorage.getItem('sid'));
        }


    };

    globalService.init();

    return globalService;
});