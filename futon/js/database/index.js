define([
    'jquery',
    'underscore',
    'url',
    'js/api/AllDocs',
    'hbt!js/database/all_docs_table',
    'hbt!js/database/all_docs_row'
], function ($, _, url, AllDocs, all_docs_table_t, all_docs_row_t) {
    var database = {},
        selector = '.main',
        options,
        emitter;

    database.init = function(opts) {
        options = opts;
        selector = opts.selector;
        emitter = opts.emitter;
        emitter.on('_all_docs', _all_docs);
        emitter.on('doc_change', update_doc_rows)
    }

    function _all_docs(couch, db) {
        var $selector = $(selector);
        $selector.html(all_docs_table_t());
        var path = url.resolve(couch, ['', db, '_all_docs'].join('/'));
        var all_docs = new AllDocs(path);
        var json = all_docs.fetch();

        json.on('data', function(row) {
            if (row) {
                row.row_id = _.escape(row.id);
                row.value_json = JSON.stringify(row.value);
                $selector.find('.results').append(all_docs_row_t(row));
            }
        });
        json.on('end', function () {
            console.log('end');
        });

    }


    function update_doc_rows(change) {
        var row_id = _.escape(change.id);

        $('#' + row_id).find('i')
            .addClass('icon-refresh')
            .attr('title', 'Row changed since loaded')
            .tooltip();
    }


    return database;
});