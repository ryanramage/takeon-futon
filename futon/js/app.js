define('js/app',[
    'jquery',
    'underscore',
    'events',
    'director',
    'pouchdb',
    'url',
    'js/main_menu/index',
    'lessc!css/main.less'
],
function($, _,  events, director, pouchdb, url, main_menu){
    var exports = {},
        emitter = new events.EventEmitter(),

        // blend the known module routes together.
        routes = _.extend({}, main_menu.routes()),
        router = director.Router(routes),

        opts = {
            selector : '.main',
            emitter : emitter,
            router : router
        },
        settings_pouchdb;


    // This is where you will put things you can do before the dom is loaded.
    exports.init = function(callback) {

        // make a settings pouch available to platforms that support it
        Pouch('idb://settings', function(err, db) {
            if (!err) {
                settings_pouchdb = db;
                opts.settings_pouchdb = settings_pouchdb;
            }
            // init the known modules with the options
            _.invoke([main_menu], 'init', opts);
            callback(null);
        });

    }


    // This that occur after the dom has loaded.
    exports.on_dom_ready = function() {

        // start the app on the /, which is the main, menu
        router.init('/');
    }

    // for modules we dont know about
    exports.getOptions = function() {
        return opts;
    }

    return exports;
});