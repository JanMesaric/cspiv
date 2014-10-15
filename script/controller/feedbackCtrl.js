define(['utils/appFunc','view/module'],function(appFunc,VM){

    var feedBackCtrl = {

        init:function(){
            var bindings = [{
                element: '.back2setting',
                event: 'click',
                handler: VM.module('appView').showToolbar
            },{
                element: '.send-feedback',
                event: 'click',
                handler: feedBackCtrl.sendFeedback
            }
                ,{
                    element:'#contatcView .feedback-page .send-crossword',
                    event: 'click',
                    handler:feedBackCtrl.sendCrossword
                }

            ];
            VM.module('feedbackView').init({
                bindings:bindings
            });
        },

        sendFeedback: function(){
            VM.module('feedbackView').sendFeedback();
        },
        sendCrossword: function() {
            window.plugin.email.open({
                to:      [''],
                cc:      [''],
                bcc:     [''],
                subject: 'Pivarjeva križanka',
                body:    'Križanko najdete na spodnji povezavi: <br /><br /> <a target="_blank" href="http://connectsocial.si/pivar/krizanka.pdf">Pivarjeva Križanka - Interno glasilo Skupine Laško</a>',
                isHtml:   true
            });
        }

    };

    return feedBackCtrl;
});