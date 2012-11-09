define('js/app',[
    'jquery',
    'underscore',
    'async',
    'url',
    'lessc!css/main.less'
],
function($, _, async,  url){
    var exports = {};



    /**
     * This is where you will put things you can do before the dom is loaded.
     */
    exports.init = function(callback) {

    }

    /**
     * This that occur after the dom has loaded.
     */
    exports.on_dom_ready = function(){


    }


    return exports;
});