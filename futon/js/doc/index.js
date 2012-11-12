/**
 * User: ryan
 * Date: 12-11-12
 * Time: 3:50 PM
 */
define([
    'underscore',
    'couchr',
    'url',
    'ace',
    './json_format',
    'hbt!js/doc/doc_view'
], function (_, couchr, url, ace, json_format, doc_view_t) {
    var doc_view = {},
          selector = '.main',
          options,
          emitter;

    doc_view.init = function(opts) {
          options = opts;
          selector = opts.selector;
          emitter = opts.emitter;
          emitter.on('doc', show_doc);
    }

    function show_doc(couch, db, doc_id) {
        $(selector).html(doc_view_t());
        var path = url.resolve(couch, ['', db, doc_id].join('/'));
        couchr.get(path, function(err, doc) {
            if (err) return console.log(err);
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/json");
            editor.getSession().setUseWrapMode(true);
            editor.setValue(json_format(JSON.stringify(doc)), -1);
            editor.setReadOnly(true);
        });
    }






    return doc_view;
});