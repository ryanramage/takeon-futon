define('js/app',[
    'jquery',
    'underscore',
    'events',
    'director',
    'url',
    'js/controller',
    'js/main_menu/index',
    'js/database/index',
    'lessc!css/main.less'
],
function($, _,  events, director,  url, controller, main_menu, database){
    var exports = {},
        emitter = new events.EventEmitter(),

        // blend the known module routes together.
        routes = _.extend({}, controller.routes(), main_menu.routes()),
        router = director.Router(routes),

        opts = {
            selector : '.main',
            emitter : emitter,
            router : router
        },
        settings_pouchdb;


    // This is where you will put things you can do before the dom is loaded.
    exports.init = function(callback) {

        // init the known modules with the options
        _.invoke([main_menu, controller, database], 'init', opts);
        callback(null);


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