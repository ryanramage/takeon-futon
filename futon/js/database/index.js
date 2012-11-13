define([
    'jquery',
    'underscore',
    'url',
    'SlickGrid',
    'js/api/AllDocs',
    'hbt!js/database/all_docs_table'
], function ($, _, url, sg, AllDocs, all_docs_table_t) {
    var database = {},
        selector = '.main',
        options,
        emitter;

    database.init = function(opts) {
        options = opts;
        selector = opts.selector;
        emitter = opts.emitter;
        emitter.on('_all_docs', _all_docs);
        emitter.on('doc_change', update_doc_rows);

    }

    function json_display(row, cell, value, columnDef, dataContext) {
        return '<pre><code class="language-json">' + value + '</code></pre>';
    }


    function _all_docs(couch, db, position) {
        var $selector = $(selector),
            rows = [],
            columns = [
                {
                    name : 'Key',
                    field : 'key',
                    id : 'key'
                },
                {
                    name : 'ID',
                    field : 'id',
                    id : 'id'
                },
                {
                    name : 'Value',
                    field : 'value_json',
                    id : 'value_json',
                    formatter : json_display,
                    width: 120
                }
            ],options = {
                enableCellNavigation: false,
                enableColumnReorder: false,
                enableCellNavigation: true,
                forceFitColumns : true,
                rowHeight: 32
            },
            path, all_docs, json, slickgrid, total, throttled_update;

        $selector.html(all_docs_table_t({height: $(window).height()  }));
        slickgrid = new Slick.Grid("#grid", rows, columns, options);


        path = url.resolve(couch, ['', db, '_all_docs'].join('/'));
        all_docs = new AllDocs(path);
        json = all_docs.fetch();
        total = 0;

        var update = function(){
            slickgrid.updateRowCount();
            slickgrid.render();
            if (position && rows.length > position) {

                _.delay(function(){
                    slickgrid.scrollRowToTop(position);
                }, 10)

            }
        };

        var first_update = _.once(function(){
            update();
            throttled_update = _.throttle(update, 600);
        });


        throttled_update = first_update;


        json.on('data', function(row) {
            if (row) {
                row.total = total++;
                row.row_id = _.escape(row.id);
                row.value_json = JSON.stringify(row.value);
                rows.push(row);
                throttled_update();
            }
        });
        json.on('end', function () {

        });

        slickgrid.onClick.subscribe(function (e) {
          var cell = slickgrid.getCellFromEvent(e);
          var doc_id = rows[cell.row].id;
          openDoc(couch, db, doc_id);
          e.stopPropagation();

        });

        // would be nice to have a preview doc here.
        slickgrid.onMouseEnter.subscribe(function (e) {
          var cell = slickgrid.getCellFromEvent(e);


        });


        var save_row = _.debounce(function() {
            var viewport = slickgrid.getViewport();
            var top_row = viewport.top;
            if (_.isFunction(history.replaceState)) {
                var state = '#/url/' + encodeURIComponent(couch) + '/' + db + '/_all_docs/' + top_row;
                history.replaceState({}, top_row, state);
            }
        }, 200);


        slickgrid.onScroll.subscribe(function() {
            save_row();
        })



    }


    function openDoc(couch, db, doc_id) {
        var route = '/url/' + encodeURIComponent(couch) + '/' + db + '/' + doc_id
        options.router.setRoute(route);
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