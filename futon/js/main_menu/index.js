define([
    'jquery',
    'couchr',
    'hbt!js/main_menu/main_menu',
    'hbt!js/main_menu/known_couch',
    'lessc!js/main_menu/main_menu.less'
],
function($, couchr, main_menu_t, known_couch_t){
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
        var found_couches = {};

        $(selector).html(main_menu_t());

        $(selector).find('form').on('submit', function(){
            var url = $('#couch_url').val();

            // Maybe we should test it?
            url = encodeURIComponent(url);

            options.router.setRoute('/url/' + url);
            return false;
        })

        local_couch(function(err, welcome){
            if (err) return;

            welcome.encoded_url = encodeURIComponent(welcome.url);
            if (!found_couches[welcome.encoded_url]) {
                $('.known_couch').append(known_couch_t(welcome));
                found_couches[welcome.encoded_url] = true;
            }
        });
    }


    // Try and find some local couch roots.
    function local_couch(cb) {
        // swap for couchr. couchr is adding a query param that couch does not like
        ///$.getJSON('_couchdb', function(data) {
        ///    data.url = '_couchdb';
        //    cb(null, data);
        //})
        couchr.get('/', function(err, data){
            if (!err && data.couchdb) {
                data.url = window.location.protocol + '//' + window.location.host;
                cb(null, data);
            }

        })
        couchr.get('http://127.0.0.1:5984', function(err, data){
            if (!err && data.couchdb) {
                data.url = 'http://127.0.0.1:5984';
                cb(null, data);
            }

        })
    }



    return exports;
});