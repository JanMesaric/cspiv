define(['utils/appFunc',
        'i18n!nls/lang',
        'components/networkStatus'],function(appFunc,i18n,networkStatus) {

    //var apiServerHost = window.location.href;

    var xhr = {

        search: function(code, array){
            for (var i=0;i< array.length; i++){
                if (array[i].code === code) {
                    return array[i];
                }
            }
            return false;
        },

        getRequestURL: function(options){
            //var host = apiServerHost || window.location.host;
            //var port = options.port || window.location.port;
            var query = options.query || {};
            var func = options.func || '';

            var apiServer = 'api/' + func + '.json' +
                (appFunc.isEmpty(query) ? '' : '?');

            var name;
            for (name in query) {
                apiServer += name + '=' + query[name] + '&';
            }

            return apiServer.replace(/&$/gi, '');
        },
        fetchComments: function(options, callback){
            var url = options.url;
            $.ajax({
                url: url,
                cache: false,
                method: 'get',
                dataType: 'json',
                success: callback,
                error: function(){
                    log('error')
                }
            })
        },
        fetchWholeContent: function(options, callback){
            options = options || {};
            options.data = options.data ? options.data : '';

            //If you access your server api ,please user `post` method.
            options.method = options.method || 'GET';

            this.checkIfOnline();

            $$ = Dom7;
            $$.ajax({
                //url: xhr.getRequestURL(options) ,
                url: 'api/pivar.json',
                method: options.method,
                dataType: 'json',
                data: options.data,
                success:function(data){
                    log(data);
                    alert(data);
                    data = data ? JSON.parse(data) : '';

                    var codes = [
                        {code:10000, message:'Your session is invalid, please login again',path:'/'},
                        {code:10001, message:'Unknown error,please login again',path:'tpl/login.html'},
                        {code:20001, message:'User name or password does not match',path:'/'}
                    ];
                    //preverim če je error code kot v codes in če je preusmerim na path
                    var codeLevel = xhr.search(data.err_code,codes);

                    if(!codeLevel){

                        (typeof(callback) === 'function') ? callback(data) : '';

                    }else{
                        hiApp.alert(codeLevel.message,function(){
                            if(codeLevel.path !== '/')
                                mainView.loadPage(codeLevel.path);

                            hiApp.hideIndicator();
                            hiApp.hidePreloader();
                        });
                    }
                }
            });
        },
        checkIfOnline: function(){
            if(appFunc.isPhonegap()){
                //Check network connection
                var network = networkStatus.checkConnection();
                if(network === 'NoNetwork'){

                    hiApp.alert(i18n.error.no_network,function(){
                        hiApp.hideIndicator();
                        hiApp.hidePreloader();
                    });

                    return false;
                }
            }
        },
        simpleCall: function(options,callback){
            options = options || {};
            options.data = options.data ? options.data : '';
log(options)

            //If you access your server api ,please user `post` method.
            options.method = options.method || 'GET';
            //options.method = options.method || 'POST';
            log( xhr.getRequestURL(options))
            this.checkIfOnline();
            $$ = Dom7;
            $$.ajax({
                //url: 'api/pivar.json' ,
                url: options.special ? options.special : xhr.getRequestURL(options),
                method: options.method,
                data: options.data,
                success:function(data){
                    data = data ? JSON.parse(data) : '';

                    var codes = [
                        {code:10000, message:'Your session is invalid, please login again',path:'/'},
                        {code:10001, message:'Unknown error,please login again',path:'tpl/login.html'},
                        {code:20001, message:'User name or password does not match',path:'/'}
                    ];
                    //preverim če je error code kot v codes in če je preusmerim na path
                    var codeLevel = xhr.search(data.err_code,codes);

                    if(!codeLevel){

                        (typeof(callback) === 'function') ? callback(data) : '';

                    }else{
                        hiApp.alert(codeLevel.message,function(){
                            if(codeLevel.path !== '/')
                                mainView.loadPage(codeLevel.path);

                            hiApp.hideIndicator();
                            hiApp.hidePreloader();
                        });
                    }
                }
            });

        }

    };

    return xhr;
});
