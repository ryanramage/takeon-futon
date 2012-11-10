define([
    'jquery',
    'couchr',
    'hbt!js/main_menu/main_menu',
    'lessc!js/main_menu/main_menu.less'
],
function($, couchr, main_menu_t){
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
        local_couch(function(err, welcome){
            if (err) return;
            console.log(welcome);
        });
    }


    function local_couch(cb) {
        // swap for couchr. couchr is adding a query param that couch does not like
        $.getJSON('_couchdb', function(data) {
            cb(null, data);
        })
    }



    return exports;
});