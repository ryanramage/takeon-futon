define([
    'jquery',
    'hbt!js/main_menu/main_menu',
    'lessc!js/main_menu/main_menu.less'
],
function($, main_menu_t){
    var exports = {};
    var selector = '.main'
    var options;

    exports.init = function (opts) {
        options = opts;
        selector = opts.selector;
    }

    exports.routes = function() {
       return  {
           '/' : main_menu
        }
    }


    function main_menu() {
        $(selector).html(main_menu_t());
    }


    return exports;
});