define([
    'underscore',
    'couchr',
    'async',
    'url',
    'filesize',
    'hbt!js/server/db_list'
], function (_, couchr, async, url, filesize, db_list_t) {
    var server = {},
    selector = '.main',
    options,
    emitter;

    server.init = function(opts) {
        options = opts;
        selector = opts.selector;
        emitter = opts.emitter;
        emitter.on('couch_root', list_dbs);
    }


    function list_dbs(couch) {
        var path = url.resolve(couch,  '_all_dbs');

        couchr.get(path, function(err, dbs){
            if (err) return console.log(err);
            var db_view = _.map(dbs, function(db){
               return {
                   db : db,
                   couch : couch,
                   url : '#/url/' + encodeURIComponent(couch) + '/' + db + '/_all_docs'
               }
            });
            $(selector).html(db_list_t(db_view));

            async.forEach(db_view, function(info, cb){
                get_db_details(info, function(err, details){
                    if (err) return;
                    var $row = $('#' + info.db);

                    $row.find('.size').html(filesize(details.disk_size));
                    $row.find('.docs').html(details.doc_count);
                    $row.find('.seq').html(details.update_seq);
                })
            }, function(err){});


        })
    }

    function get_db_details(info, callback) {
        var path = url.resolve(info.couch,  info.db);
        couchr.get(path, callback);
    }



    return server;
});