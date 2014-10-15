define(['GS','i18n!nls/lang'],function(GS,i18n){

    var ft;

    var fileTransfer = {

        startUpload: function(fileUrl){
            alert(fileUrl);

            if(!App.alreadyRunning){
                App.alreadyRunning = true;
                $.ajax({
                    type: "POST",
                    url: "http://connectsocial.si/pivar/uploadRecipe.php",
                    data: {
                        credits: 'izpostavljen recept',
                        title: $("#messageTitle").val(),
                        descLong: $(".message-input-text").val()
    //                    email: $("#yourEmail").val(),
    //                    timeSum: $("#preparingTime").val() + $("#cookingTime").val(),
    //                    descLong: $("#recipe").val(),
    //                    difficulty: App.recipeDifficulty,
    //                    timeCreating: $("#preparingTime").val(),
    //                    timeCooking: $("#cookingTime").val(),
    //                    ingredientsTitle: 'Sestavine:',
    //                    ingredients: 'tu so sestavine, ki jih potrebujemo',
                    },
                    success: function(){
                        App.alreadyRunning = false;
                    },
                    error: function(){
                    }
                });

                var text = '<div id="progress" class="progress"><span class="progress-bar"></span></div>';
                hiApp.modal({
                    title: i18n.camera.image_uploading + ' <span class="percent"></span>',
                    text: text,
                    buttons: [{
                        text: i18n.global.cancel,
                        onClick: fileTransfer.abortUpload
                    }]
                });

                var uri = encodeURI("http://connectsocial.si/pivar/imageUpload.php");
//                function win() {
//                    alert('win 2')
//                    App.alreadyRunning = false;
//                }
//                function fail() {
//                    alert('fail 2')
//                }
                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=fileUrl.substr(fileUrl.lastIndexOf('/')+1);
                options.mimeType="text/plain";

                var headers={'headerParam':'headerValue'};

                options.headers = headers;

                var ft = new FileTransfer();
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                    } else {
                        loadingStatus.increment();
                    }
                };
                ft.upload(fileUrl, uri, fileTransfer.uploadSuccess, fail, options);
                function fail(error) {
                    //alert("An error has occurred: Code = " + error.code);
                    ft.upload(fileUrl, uri, fileTransfer.uploadSuccess, fileTransfer.uploadFail, options);
                }
                ft.onprogress = fileTransfer.onprogress;

    //            var uploadServer = encodeURI("http://connectsocial.si/pivar/imageUpload.php");

                //Upload progress

                //hiApp.alert('Recept uspešno poslan!');

                /* global FileUploadOptions */
    //            var options = new FileUploadOptions();
    //            options.fileKey = 'upfile';
    //            options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
    //            options.mimeType = 'image/jpeg';
    //            options.params = {};
    //            ft = new FileTransfer();
    //            ft.upload(fileUrl, encodeURI(uploadServer), fileTransfer.uploadSuccess , fileTransfer.uploadFail , options);

            }
        },

        uploadSuccess: function (r) {
            hiApp.closeModal('.modal');

            navigator.camera.cleanup();

            var response = r.response ? JSON.parse(r.response) : '';
            App.alreadyRunning = false;

        },

        uploadFail: function (error) {
            hiApp.closeModal('.modal');

            /* global FileTransferError */
            var errText;
            switch (error.code){
                case FileTransferError.FILE_NOT_FOUND_ERR:
                    errText = i18n.camera.file_not_found_err;
                    break;
                case FileTransferError.INVALID_URL_ERR:
                    errText = i18n.camera.invalid_url_err;
                    break;
                case FileTransferError.CONNECTION_ERR:
                    errText = i18n.camera.connection_err;
                    break;
                case FileTransferError.ABORT_ERR:
                    errText = i18n.camera.abort_err;
                    break;
                case FileTransferError.NOT_MODIFIED_ERR:
                    errText = i18n.camera.not_modified_err;
                    break;
            }

            //hiApp.alert(errText);
        },

        onprogress: function(progressEvent){
            if (progressEvent.lengthComputable) {
                var percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                $$('#progress').parents('.modal-inner').find('.modal-title .percent').html(percent + '%');
                $$('#progress').find('.progress-bar').css('width',percent + '%');
            }
        },

        abortUpload: function(){
            ft.abort();
        }
    };

    return fileTransfer;
});