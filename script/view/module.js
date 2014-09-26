define(['view/appView',
        'view/loginView',
        'view/settingView',
        'view/aboutView',
        'view/feedbackView',
        'view/timelineView',
        'view/itemView',
        'view/postView',
        'view/contactView',
        'view/commentView',
        'view/messageView',
        'view/languageView',
        'view/archiveView',
        'view/kuhalnicaView',
        'view/kuhalnicaItemView',
        'view/recipeView',
        'view/moviesView',
        'view/moviesItemView',
        'view/signupView'],function(appView,loginView,settingView,aboutView,feedbackView,timelineView,itemView,postView,contactView,commentView,messageView,languageView, archiveView,kuhalnicaView,kuhalnicaItemView, recipeView, moviesView,moviesItemView,signupView) {

    var module = {

        module: function(name){

            var view;

            switch (name){
                case 'appView':
                    view = appView;
                    break;
                case 'loginView':
                    view = loginView;
                    break;
                case 'settingView':
                    view = settingView;
                    break;
                case 'aboutView':
                    view = aboutView;
                    break;
                case 'feedbackView':
                    view = feedbackView;
                    break;
                case 'timelineView':
                    view = timelineView;
                    break;
                case 'itemView':
                    view = itemView;
                    break;
                case 'postView':
                    view = postView;
                    break;
                case 'contactView':
                    view = contactView;
                    break;
                case 'commentView':
                    view = commentView;
                    break;
                case 'messageView':
                    view = messageView;
                    break;
                case 'languageView':
                    view = languageView;
                    break;
                case 'archiveView':
                    view = archiveView;
                    break;
                case 'kuhalnicaView':
                    view = kuhalnicaView;
                    break;
                case 'kuhalnicaItemView':
                    view = kuhalnicaItemView;
                    break;
                case 'recipeView':
                    view = recipeView;
                    break;
                case 'moviesView':
                    view = moviesView;
                    break;
                case 'moviesItemView':
                    view = moviesItemView;
                    break;
                case 'signupView':
                    view = signupView;
                    break;
            }

            return view;
        }

    };

    return module;
});