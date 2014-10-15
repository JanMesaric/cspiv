define(['utils/appFunc','i18n!nls/lang','utils/tplManager'],function(appFunc,i18n,TM){

    var feedbackView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);

            appFunc.hideToolbar('.views');
        },

        sendFeedback: function(){
            hiApp.showPreloader(i18n.index.sending);
            var data = {
                password: $("#krizankaMessageText").val(),
                email: $("#krizankaMailMessageText").val()
            };

            $.ajax({
                type: "POST",
                url: "http://connectsocial.si/pivar/crosswordResult.php",
                data: data,
                success: function(res){
                    hiApp.alert('Vsebina je bila uspešno sprejeta', 'Uspeh');
                    hiApp.hidePreloader();
                },
                error: function(){
                    hiApp.alert('Prišlo je do napake, prosimo poizkusite ponovno pozneje', 'Napaka');
                }
            });
        },

        i18next: function(content){
            var renderData = [];
            renderData.feedBack = i18n.setting.feed_back;
            renderData.feedBackPlaceholder = i18n.setting.feed_back_placeholder;

            var output = TM.renderTpl(content,renderData);

            return output;
        }

    };

    return feedbackView;
});