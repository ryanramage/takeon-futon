(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('underscore'), require('JSONStream'));
    } else if (typeof define === 'function' && define.amd) {
        define(['underscore', 'JSONStream'], factory);
    }
}(this, function (_, JSONStream) {


    var AllDocs =  function(config) {
        this.settings = {};
        if (!config) throw new Exception('Please provide a _all_docs url');
        if (_.isString(config)) {
            this.settings.url = config
        }
        if (_.isObject(config)) {
            if (!config.url) throw new Exception('Please provide a _all_docs url, eg { url : "url"  } ');
            this.settings = _.defaults(config, {
                limit : 301,
                descending : false,
                startkey : null,
                startkey_docid : null,
                skip : 0
            });
        }
    };

    AllDocs.prototype.fetch = function() {
        abortCurrentRequest();
        this.xhr = new XMLHttpRequest();
        this.xhr.open("GET", this.settings.url, true);
        var stream = new JSONStream.XHRStream(this.xhr);
        var json = JSONStream.parse(['rows', /./]);
        stream.pipe(json);
        return json;
    }


    function abortCurrentRequest() {
        if (this.xhr) {
            try {
                this.xhr.abort();
            } catch(e){}
        }
    }


    return AllDocs;

}));

