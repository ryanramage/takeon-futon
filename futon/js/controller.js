define(['underscore', 'couchr', 'url'], function(_, couchr, url) {


    var controller = {
            current_couch_root : null,
            current_couch_db : null,
            current_feed : null
        },
        options,
        emitter;

    controller.init = function(opts) {
        options = opts;
        emitter = opts.emitter;
        emitter.on('db_url_change', start_changes_watcher);
    }

    controller.routes =  function() {
        return {

            //server routes
            '/url/*/_active_tasks' : controller._active_tasks,
            '/url/*/_config' : controller._config,
            '/url/*/_config/:section' : controller._config,
            '/url/*/_replicate' : controller._replicate,
            '/url/*/_replicator' : controller._replicator,

            // doc routes
            '/url/*/*/_all_docs' : controller._all_docs,
            '/url/*/*/_changes' : controller._changes,
            '/url/*/*/_security' : controller._security,
            '/url/*/*/_design/*/_info' : controller.ddoc_info,
            '/url/*/*/_design/*/_view/*'   : controller.ddoc_view,
            '/url/*/*/_design/*/_show/*/*' : controller.ddoc_show,
            '/url/*/*/_design/*/_show/*'   : controller.ddoc_show,
            '/url/*/*/_design/*/_list/*/*' : controller.ddoc_list,
            '/url/*/*/_design/*/_list/*'   : controller.ddoc_list,
            '/url/*/*/_design/*'   : controller.ddoc_doc,
            '/url/*/*/*/*' : controller.attachment,
            '/url/*/*/*' : controller.doc,
            '/url/*/*/' : controller._all_docs,
            '/url/*/*' : controller._all_docs ,
            '/url/*/' : controller.couch_root,
            '/url/*' : controller.couch_root
        }
    }


    controller.couch_root = function(couch) {
        couch = set_couch_url(couch);
        emitter.emit('couch_root', couch);
    }

    controller._active_tasks = function(couch) {
        couch = set_couch_url(couch);
        emitter.emit('_active_tasks', couch);
    }
    controller._config = function(couch, section) {
        couch = set_couch_url(couch);
        emitter.emit('_config', couch, section);
    }
    controller._replicate = function(couch) {
        couch = set_couch_url(couch);
        emitter.emit('_replicate', couch);
    }
    controller._replicator = function(couch) {
        couch = set_couch_url(couch);
        emitter.emit('_replicator', couch);
    }
    controller._all_docs = function(couch, db) {
        couch = set_couch_url(couch, db);
        emitter.emit('_all_docs', couch, db);
    }

    controller._changes = function(couch, db) {
        couch = set_couch_url(couch, db);
        emitter.emit('_changes', couch, db);
    }

    controller.db_root = function(couch, db) {
        couch = set_couch_url(couch, db);
        emitter.emit('db_root', couch, db);
    }

    controller.attachment = function(couch, db, doc, attachment) {
        couch = set_couch_url(couch, db);
        emitter.emit('attachment', couch, db, doc, attachment);
    }
    controller.doc = function(couch, db, doc) {
        couch = set_couch_url(couch, db);
        emitter.emit('doc', couch, db, doc);
    }
    controller.ddoc_doc = function(couch, db, doc) {
        couch = set_couch_url(couch, db);
        var ddoc_name = '_design/' + doc;
        emitter.emit('doc', couch, db, ddoc_name);
    }
    controller._security = function(couch, db) {
        couch = set_couch_url(couch, db);
        emitter.emit('_security', couch, db);
    }
    controller.ddoc_info = function(couch, db, ddoc) {
        couch = set_couch_url(couch, db);
        emitter.emit('ddoc_info', couch, db, ddoc);
    }
    controller.ddoc_view = function(couch, db, ddoc, view) {
        couch = set_couch_url(couch, db);
        emitter.emit('ddoc_view', couch, db, ddoc, view);
    }
    controller.ddoc_show = function(couch, db, ddoc, show) {
        couch = set_couch_url(couch, db);
        emitter.emit('ddoc_show', couch, db, ddoc, show);
    }
    controller.ddoc_show = function(couch, db, ddoc, show, doc) {
        couch = set_couch_url(couch, db);
        emitter.emit('ddoc_show', couch, db, ddoc, show, doc);
    }
    controller.ddoc_list = function(couch, db, ddoc, list) {
        couch = set_couch_url(couch, db);
        emitter.emit('ddoc_list', couch, db, ddoc, list);
    }
    controller.ddoc_list = function(couch, db, ddoc, list, view) {
        couch = set_couch_url(couch, db);
        emitter.emit('ddoc_list', couch, db, ddoc, list, view);
    }


    /**
     * Set the current couch url.
     *  - fires an event if the couch and db changes from last time
     *  - sets the current_couch_root, current_couch_db
     *
     * @param urlencoded the url encoded root of the couch
     * @param db [optional] db name
     * @return {String} a decoded url
     */
    function set_couch_url(urlencoded, db) {
        var decoded = decodeURIComponent(urlencoded);

        // a request for a local couch. resolve the full url
        if (decoded === '_couch') {
            decoded = url.resolve(window.location, './_couchdb');
        }

        if (decoded !== controller.current_couch_root && _.isString(db)) {
            emitter.emit('db_url_change', decoded, db);
        } else if (_.isString(db) && db !== controller.current_couch_db) {
            emitter.emit('db_url_change', decoded, db);
        } else if (!db) {
            emitter.emit('db_url_change', decoded, db);
        }
        controller.current_couch_root = decoded;
        controller.current_couch_db = db;
        return decoded;
    }

    /**
     * Start a change feed watcher on the specified db
     *
     * @param root The root url of the couch
     * @param db The current db. Can be null to just cancel any watchers
     */
    function start_changes_watcher(root, db) {

        // always cancel the current feed, even if no new db
        if (controller.current_feed) {
            controller.current_feed.pause();
        }
        if (!db) return;

        // give some of the other stuff breathing room.
        _.delay(function(){
            var path = url.resolve(root, '/' + db);


            controller.current_feed = couchr.changes(path);
            controller.current_feed.on('change', function(change) {
                emitter.emit('doc_change', change);
            });
        }, 100)


    }



    return controller;
});