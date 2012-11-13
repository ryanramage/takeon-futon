define(['underscore'], function (_) {
    var plugin = {},
        selector = '.main',
        options,
        emitter;

    console.log('mock plugin loaded');

    plugin.init = function(opts) {
        options = opts;
        selector = opts.selector;
        emitter = opts.emitter;
        console.log('plugin initialized');

    }
    return plugin;
});