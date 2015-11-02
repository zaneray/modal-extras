# Modal Extras

View the demo here:  http://zaneray.github.io/modal-extras/

This script extends the standard Boostrap modal to support things like ajax loading, video players and images. We choose to delete a dynamically created modal window HTML in most cases unless you use the standard inline Bootstrap Modal functionality. 


## Included Files
Included you will find a demo index.html with examples you will also find the compiled CSS file as well as less files that build the compiled file. 

### Compiling the CSS 
Make sure you have less installed globally `npm install less -g`. Then navigate to the directory command line and run a `lessc modal-extras.less ../css/modal-extras.css` to compile a new CSS file. 


## Modal HTML
    <a href="#" data-toggle="modal-html" data-id="id-1234">Open HTML modal by ID</a>
Specify a `data-toggle` attribute of `modal-html` and the link will grab HTML from somewhere on the page. Typically in a hidden div. 


## Modal Images
    <a href="http://www.zaneray.com/proto/images/flatheadsunset.jpg" data-toggle="modal-image">Open horizontal Image Modal </a>
Specify a `data-toggle` attribute of `modal-image` to load the image in the `href` of an anchor link in a modal window. 

## Modal Videos
    <a href="https://vimeo.com/74980365" data-key="74980365" data-source="Vimeo" data-toggle="modal-video">Open Vimeo Video</a>
Specify a `data-toggle` of `modal-video` to dynamically load the video. It is *required* to specify a `data-key` as well as a `data-source` which at the moment only includes Youtube and Vimeo. It is recommended to make the href a link to the URL of the video for Accessbility reasons. 


## Modal AJAX

### Default
    <a href="includes/ajax.html" data-toggle="modal-ajax">Open Ajax Modal</a>
By default you can specify a URL and all of that URL will be loaded to the page. Specify `data-toggle` of `modal-ajax` and the script will grab the URL in the href. This works fine for snippets of HTML but in demo you can see that it loads all of the image from /includes/ajax.html including the header and footer. 

### Load a Page with Optional Selector
    <a href="includes/ajax.html" data-toggle="modal-ajax" data-id="wrapper">Open Ajax Modal id="content"</a>
Optionally you can specify an id and the script will load the whole page and display the results specified in the `data-id` selector. 


## Additional Classes
    <a href="http://www.zaneray.com/proto/images/flatheadsunset.jpg" data-toggle="modal-image" data-class="my-additional-class">Open Image with Custom Class </a>
Optionally if you need to override the styling of a modal window you can always specify a custom class with `data-class` attribute. 

## Closing the Modal Window
Pressing escape will close the Modal window for all dynamically created modal windows not including standard inline Bootstrap Modals. 
