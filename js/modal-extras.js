$(function () {
  var   $body = $('body'),
    $bodyInner,
    $modalTrigger,
    $target,
    href,
    html,
    contentId,
    additionalClass,
    imgTitle,
    imgHTML,
    videoSrc,
    videoKey;

  /*
  generateModalTemplate() writes the base html for the modal window
  note if you want the fade in effect add the 'fade' class in for class name
  */
  window.generateModalTemplate = function (html, className, bodyInner) {
    var $dynamicModal = $('<div\
                  id="dynamic-modal"\
                  class="modal fade"\
                  role="dialog"\
                  aria-modal="true"\
                  tabindex="-1"\
                  style="display: none;">\
            <div class="modal-dialog" role="document">\
            <div id="modal-content" class="modal-content"></div>\
            <button class="modal-btn-close btn-close" data-dismiss="modal" aria-label="Close Modal"></button>\
            </div>\
            </div>');

    if (html) {
      $dynamicModal.find('.modal-content').html(html);
    }

    if (className) {
      $dynamicModal.addClass(className);
    }

    // Prepend dynamic modal HTML to the body
    $dynamicModal.prependTo($body).modal();

    // Hide everything except the modal from assistive technology
    if( bodyInner != null) {
      $bodyInner.attr('aria-hidden', 'true');
    }

    // Tie in to the modal close event in bootstrap JS
    $(document).on('hidden.bs.modal', "#dynamic-modal", function (e) {

      // Remove modal HTML to keep videos from playing other classes from perpetuating etc.
      $("#dynamic-modal").remove();

      // Remove contents from dynamic modal element
      $dynamicModal = '';

      // Make the content visible to assistive technology again
      if (bodyInner != null) {
        $bodyInner.attr('aria-hidden', 'false');
      }

      // Set focus back to triggering element for accessibility
      // TODO need to find a more elegant solution for resetting focus when there is no calling element.
      if($modalTrigger) {
        $modalTrigger.focus();
      }
    })
  };

  // Escape key triggers closing the modal
  $body.on('keyup', function (e) {
    if (e.keyCode === 27) {
      $('.modal-btn-close').trigger('click');
    }
  });

  // Load html to the modal window for data-toggle=modal-html
  $body.on('click', '[data-toggle=modal-html]', function (e) {
    e.preventDefault();
    $modalTrigger = $(this);
    $target = $('#' + $modalTrigger.attr('data-id'));
    href = $modalTrigger.attr('href');
    contentId = $modalTrigger.data('id');
    additionalClass = $modalTrigger.data('class') || '';
    html = $('#' + contentId).clone();

    if ($modalTrigger.attr('data-hide')) {
      $bodyInner = $('#' + $modalTrigger.data('hide'));
    }

    generateModalTemplate(html, additionalClass, $bodyInner);
  });

  /*
      Load content into a modal via ajax. Specifying data-id
      will just load the contents of a div on the AJAX request
      page. Otherwise the whole resulting HTML will load.
  */
  $body.on('click', '[data-toggle=modal-ajax]', function (e) {
    e.preventDefault();
    $modalTrigger = $(this);
    href = $modalTrigger.attr('href');
    additionalClass = $modalTrigger.data('class') || '';
    contentId = $modalTrigger.data('id');

    if ($modalTrigger.attr('data-hide')) {
      $bodyInner = $('#' + $modalTrigger.data('hide'));
    }

    if (contentId !== undefined) {
      href = href + ' #' + contentId;
    }

    generateModalTemplate('', 'modal-ajax modal-loading ' + additionalClass, $bodyInner);
    $('#modal-content').load(href, function (response, status, xhr) {
      $('#dynamic-modal').removeClass('modal-loading');
      if (status == "error") {
        alert('there was an error loading the URL');
        $("#dynamic-modal").remove();
      }
    });
  });

  // Load an image to the modal window for data-toggle="modal-image"
  $body.on('click', '[data-toggle=modal-image]', function (e) {
    e.preventDefault();
    $modalTrigger = $(this);
    href = $modalTrigger.attr('href');
    imgTitle = $modalTrigger.attr('title') || '';
    additionalClass = $modalTrigger.data('class') || '';
    imgHTML = $('<img class="modal-image" id="modal-image" />').attr({src: href, alt: imgTitle});

    imgHTML.load(function () {
      $('#dynamic-modal').removeClass('modal-loading');
    });

    if ($modalTrigger.attr('data-hide')) {
      $bodyInner = $('#' + $modalTrigger.data('hide'));
    }

    generateModalTemplate(imgHTML, 'modal-image-wrapper modal-loading ' + additionalClass, $bodyInner);

    //check if the data-media-type is set to instagram and append content accordingly
    if ($modalTrigger.attr('data-instagram')) {
      var userphoto = $modalTrigger.attr('data-userphoto'),
        username = $modalTrigger.attr('data-username'),
        imageLocation = $modalTrigger.attr('data-location'),
        imageLikes = $modalTrigger.attr('data-likes'),
        imageCaption = $modalTrigger.attr('data-caption'),
        imageLink = $modalTrigger.attr('data-link');

      instagramDataHTML = "<div class='modal-image-instagram-container'><div class='user-section'><img src='" + userphoto + "' class='instagram-userphoto' /><div class='user-info'><span class='username'>" + username + "</span><span class='location'>" + imageLocation + "</span></div><a href=" + imageLink + " class='btn btn-sm btn-instagram' target='_blank'>Follow</a></div><span class='image-likes'>" + imageLikes + "</span><span class='image-caption'>" + imageCaption + "</span></div>";

      $('#dynamic-modal').find('.modal-content').append(instagramDataHTML);

    }
    //Check if there is an image caption or image link, and update the imgHTML appropriately
    else if ($modalTrigger.attr('data-caption')) {
      var caption = $modalTrigger.attr('data-caption'),
        captionHTML = "<div class='modal-image-caption-wrapper'><span class='modal-image-caption'>" + caption + "</span></div>";

      $('#dynamic-modal').find('.modal-content').append(captionHTML);
    }

    if ($(this).attr('data-link')) {
      var link = $(this).attr('data-link'),
          linkHTML = "<a href='" + link + "' class='modal-image-link' target='_blank'></a>";

      imgHTML.wrap(linkHTML);
    }

    // Check if the modal-gallery option has been set, and setup the gallery with all appropriate images
    if ($modalTrigger.attr('data-gallery')) {
      var galleryName = $modalTrigger.attr('data-gallery'),
        $galleryElements = $('[data-gallery=' + galleryName + ']'),
        galleryElementCount = $galleryElements.length - 1,
        galleryImageArray = [],
        galleryCaptionArray = [],
        galleryLinkArray = [],
        currentImageLink = $modalTrigger.attr('href');

      // Build an array of all images in the gallery
      $galleryElements.each(function () {
        var $thisImage = $(this),
            imageLink = $thisImage.attr('href'),
            imageCaption = $thisImage.attr('data-caption'),
            imageLinkURL = $thisImage.attr('data-link');

        galleryImageArray.push(imageLink);
        galleryCaptionArray.push(imageCaption);
        galleryLinkArray.push(imageLinkURL);
      });

      //Determine which spot you are in the gallery array
      galleryImageNumber = galleryImageArray.indexOf(currentImageLink);

      //Append the gallery arrows to the dynamic-modal container
      $('#dynamic-modal').append("<span class='global-arrow prev-arrow'></span><span class='global-arrow next-arrow'></span>");

      //define function to change gallery image
      var goToNextImage = function (direction) {
        var $modalImage = $('.modal-image'),
          currentImageSrc = $modalImage.attr('src'),
          currentImageIndex = galleryImageArray.indexOf(currentImageSrc);

        if (direction == 'next') {
          var nextImageIndex = currentImageIndex + 1;

          if (nextImageIndex > galleryElementCount) {
            nextImageIndex = 0;
          }
        } else {
          var nextImageIndex = currentImageIndex - 1;

          if (nextImageIndex < 0) {
            nextImageIndex = galleryElementCount;
          }
        }

        var nextImageSrc = galleryImageArray[nextImageIndex],
          nextImageCaption = galleryCaptionArray[nextImageIndex],
          nextImageLink = galleryLinkArray[nextImageIndex];

        //check if next image has caption and/or link, and switch content accordingly
        if (nextImageCaption != undefined) {
          if ($('.modal-image-caption-wrapper').length > 0) {
            $('.modal-image-caption').text(nextImageCaption);
          } else {
            var captionHTML = "<div class='modal-image-caption-wrapper'><span class='modal-image-caption'>" + nextImageCaption + "</span></div>";
            $('#dynamic-modal').find('.modal-content').append(captionHTML);
          }
        } else {
          if ($('.modal-image-caption-wrapper').length > 0) {
            $('.modal-image-caption-wrapper').remove();
          }
        }

        if (nextImageLink != undefined) {
          if ($('.modal-image-link').length > 0) {
            $('.modal-image-link').attr('href', nextImageLink);
          } else {
            var linkHTML = "<a href='" + nextImageLink + "' class='modal-image-link' target='_blank'></a>";

            $('.modal-image').wrap(linkHTML);
          }
        } else {
          if ($('.modal-image-link').length > 0) {
            var $modalImgHTML = $('.modal-image-link').contents();

            $('.modal-image-link').replaceWith($modalImgHTML);
          }
        }

        $modalImage.attr('src', nextImageSrc);
      };

      //Bind click event to arrows to cycle through image gallery array

      $body.on('click', '#dynamic-modal .next-arrow', function () {
        goToNextImage('next');
      });
      $body.on('click', '#dynamic-modal .prev-arrow', function () {
        goToNextImage('prev');
      });


      //Bind Swipe event
      $('.modal-content').swipe({
        swipeLeft: function () {
          goToNextImage('next');
        },
        swipeRight: function () {
          goToNextImage('prev');
        }
      });

    }
  });

  //load an video to the modal window for data-toggle=modal-video
  $body.on('click', '[data-toggle=modal-video]', function (e) {
    e.preventDefault();
    $modalTrigger = $(this);
    videoSrc = $modalTrigger.data('source');
    videoKey = $modalTrigger.data('key');
    additionalClass = $modalTrigger.data('class') || '';

    if ($modalTrigger.attr('data-hide')) {
      $bodyInner = $('#' + $modalTrigger.data('hide'));
    }

    var videoHTML, embedURL;

    switch (videoSrc.toLowerCase()) {
      case 'vimeo':
        embedURL = 'https://player.vimeo.com/video/' + videoKey + '?autoplay=1&title=0&byline=0&portrait=0';
        break;
      case 'youtube':
        embedURL = 'https://www.youtube.com/embed/' + videoKey + '?rel=0&amp;showinfo=0&autoplay=1';
        break;
      default:
        alert("The video source " + videoSrc + " is not valid");
    }

    videoHTML = '<div class="modal-video-wrapper">\
        <iframe src="' + embedURL + '" class="modal-video-iframe" width="720" height="405" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\
        </div>';

    generateModalTemplate(videoHTML, 'modal-video ' + additionalClass, $bodyInner);
  });
});
