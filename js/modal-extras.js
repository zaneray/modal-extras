$(function () {

    var $body = $('body'); 

    /*
    generateModalTemplate() writes the base html for the modal window
    note if you want the fade in effect add the 'fade' class in for class name
    */
    var generateModalTemplate = function (html, className) {
        var $dynamicModal = $('<div id="dynamic-modal" class="modal fade">\
            <div class="modal-dialog">\
            <div class="modal-btn-close btn-close" data-dismiss="modal"></div>\
            <div id="modal-content" class="modal-content"></div>\
            </div>\
            </div>');

        if (html) {
            $dynamicModal.find('.modal-content').html(html);
        }

        if (className) {
            $dynamicModal.addClass(className);
        }

        $dynamicModal.prependTo($body).modal();

        //need to remove it on hide to keep videos from playing other classes from perpetuating etc.
        $dynamicModal.on('hidden.bs.modal', function (e) {
            $dynamicModal.remove();
        })
    };


    //remove the modal window on key up for the escape key
    $body.on('keyup',function(e) {
        if(e.keyCode === 27) {
            $('.modal-btn-close').trigger('click');
        }

    });


    //load html to the modal window for data-toggle=modal-html
    $('[data-toggle=modal-html]').on('click', function (e) {
        e.preventDefault();
        var $this = $(this),
        contentId = $this.data('id'),
        additionalClass = $this.data('class') || '',
        html = $('#' + contentId).clone();

        generateModalTemplate(html, additionalClass);
    });

    
    /* Load content into modal via ajax
    Specifying data-id will just load the contents of a div on the AJAX request page otherwise the whole resulting HTML will load.
    */
    $('[data-toggle=modal-ajax]').on('click', function (e) {
        e.preventDefault();
        var $this = $(this),
        pageURL = $this.attr('href'),
        additionalClass = $this.data('class') || '',
        contentId = $this.data('id');

        if(contentId !== undefined) {
            pageURL = pageURL + ' #' + contentId;
        }


        generateModalTemplate('', 'modal-ajax modal-loading ' + additionalClass);    

        var $modalContent = $('#modal-content')

        
        $modalContent.load(pageURL, function (response, status, xhr) {
            $('#dynamic-modal').removeClass('modal-loading');
            if ( status == "error" ) {
                alert('there was an error loading the URL');
                removeModal();

            }

        });
        
    });

    //load an image to the modal window for data-toggle=modal-image
    $('[data-toggle=modal-image]').on('click', function (e) {
        e.preventDefault();
        var $this = $(this),
        imgSrc = $this.attr('href'),
        imgTitle = $this.attr('title') || '',
        additionalClass = $this.data('class') || '',
        imgHTML = $('<img class="modal-image" id="modal-image" />').attr({ src: imgSrc, alt: imgTitle });

        imgHTML.load(function () {
            $('#dynamic-modal').removeClass('modal-loading');
        });

        generateModalTemplate(imgHTML, 'modal-image-wrapper modal-loading ' + additionalClass);
    });

    //load an video to the modal window for data-toggle=modal-video
    $('[data-toggle=modal-video]').on('click', function (e) {
        e.preventDefault();
        var $this = $(this),
        videoSource = $this.data('source'),
        videoKey = $this.data('key'),
        additionalClass = $this.data('class') || '',
        videoHTML, embedURL;

        switch (videoSource.toLowerCase()) {
            case 'vimeo':
            embedURL = 'https://player.vimeo.com/video/' + videoKey + '?autoplay=1&title=0&byline=0&portrait=0';
            break;
            case 'youtube':
            embedURL = 'https://www.youtube.com/embed/' + videoKey + '?rel=0&amp;showinfo=0&autoplay=1';
            break;
            default:
            alert("The video source " + videoSource + " is not valid");
        }

        videoHTML = '<div class="modal-video-wrapper">\
        <iframe src="' + embedURL + '" class="modal-video-iframe" width="720" height="405" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\
        </div>';

        generateModalTemplate(videoHTML, 'modal-video ' + additionalClass);
    });
});
