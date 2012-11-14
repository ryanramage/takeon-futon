define([
    'jquery',
    'underscore',
    'url',
    'SlickGrid',
    'js/api/AllDocs',
    'hbt!js/database/all_docs_table'
], function ($, _, url, sg, AllDocs, all_docs_table_t) {
    var database = {},
        last_request = {
            couch : null,
            db : null,
            position : null
        },
        selector = '.main',
        rows = [],
        doc_id_row = {},
        slickgrid,
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
        if (!value) return '';
        return '<pre><code class="language-json">' + value + '</code></pre>';
    }

    function status_display(row, cell, stale, columnDef, dataContext) {
        var status = '';
        if (stale) {
            status = 'icon-refresh';
        }
        return '<i class="' + status +'"></i>';
    }

    function _all_docs(couch, db, position) {

        var this_request = {
            couch : couch,
            db : db,
            position : parseInt(position)
        };

        var $selector = $(selector),
            columns = [
                {

                    id : 'status',
                    field : 'stale',
                    formatter : status_display,
                    maxWidth: 20
                },
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
            path, all_docs, json, total, throttled_update;

        $selector.html(all_docs_table_t({height: $(window).height()  }));





        if (_.isEqual(last_request, this_request)) {
            slickgrid = new Slick.Grid("#grid", rows, columns, options);
            if (position && rows.length > position) {

                  _.delay(function(){
                      slickgrid.scrollRowToTop(position);
                  }, 10)

            }

        }
        else {
            rows.length = 0;
            last_request = this_request;
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
                throttled_update = _.throttle(update, 200);
            });


            throttled_update = first_update;


            json.on('data', function(row) {
                if (row) {
                    new_row(row);
                    throttled_update();
                }
            });
            json.on('end', function () {

            });
        }
        last_request = this_request;

        $('.slick-viewport').focus();

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
                last_request.position = top_row;
            }
        }, 200);


        slickgrid.onScroll.subscribe(function() {
            save_row();
        })



    }

    function new_row(row) {
        row.row_id = _.escape(row.id);
        row.value_json = JSON.stringify(row.value);
        row.doc_json = JSON.stringify(row.doc);
        row.stale = false;
        doc_id_row[row.id] = rows.length;
        rows.push(row);
    }

    function openDoc(couch, db, doc_id) {
        var route = '/url/' + encodeURIComponent(couch) + '/' + db + '/' + doc_id
        options.router.setRoute(route);
    }


    function update_doc_rows(change) {
        var row_id = _.escape(change.id);
        var row_num = doc_id_row[row_id];
        var row = rows[row_num];
        if (row) {
            rows[row].stale = true;
            slickgrid.invalidateRow(row);
        } else {
            // new around here?
            // what to do?
        }


        slickgrid.render();
    }

    return database;
});