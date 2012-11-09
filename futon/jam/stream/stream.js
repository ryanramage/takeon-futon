define('stream',['events'], function(events) {

    /** start of node shim **/
    //var util = require('util');
    // ^^^^^^^^^ replaced with below
    var util = {};
    var Object_create = Object.create || function (prototype, properties) {
        // from es5-shim
        var object;
        if (prototype === null) {
            object = { '__proto__' : null };
        }
        else {
            if (typeof prototype !== 'object') {
                throw new TypeError(
                    'typeof prototype[' + (typeof prototype) + '] != \'object\''
                );
            }
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            object.__proto__ = prototype;
        }
        if (typeof properties !== 'undefined' && Object.defineProperties) {
            Object.defineProperties(object, properties);
        }
        return object;
    };

    util.inherits = function(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object_create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
    /**   End of node shim **/


    function Stream() {
      events.EventEmitter.call(this);
    }
    util.inherits(Stream, events.EventEmitter);

    // Backwards-compat with node 0.4.x
    Stream.Stream = Stream;

    Stream.prototype.pipe = function(dest, options) {
      var source = this;

      function ondata(chunk) {
        if (dest.writable) {
          if (false === dest.write(chunk) && source.pause) {
            source.pause();
          }
        }
      }

      source.on('data', ondata);

      function ondrain() {
        if (source.readable && source.resume) {
          source.resume();
        }
      }

      dest.on('drain', ondrain);

      // If the 'end' option is not supplied, dest.end() will be called when
      // source gets the 'end' or 'close' events.  Only dest.end() once, and
      // only when all sources have ended.
      if (!dest._isStdio && (!options || options.end !== false)) {
        dest._pipeCount = dest._pipeCount || 0;
        dest._pipeCount++;

        source.on('end', onend);
        source.on('close', onclose);
      }

      var didOnEnd = false;
      function onend() {
        if (didOnEnd) return;
        didOnEnd = true;

        dest._pipeCount--;

        // remove the listeners
        cleanup();

        if (dest._pipeCount > 0) {
          // waiting for other incoming streams to end.
          return;
        }

        dest.end();
      }


      function onclose() {
        if (didOnEnd) return;
        didOnEnd = true;

        dest._pipeCount--;

        // remove the listeners
        cleanup();

        if (dest._pipeCount > 0) {
          // waiting for other incoming streams to end.
          return;
        }

        dest.destroy();
      }

      // don't leave dangling pipes when there are errors.
      function onerror(er) {
        cleanup();
        if (this.listeners('error').length === 0) {
          throw er; // Unhandled stream error in pipe.
        }
      }

      source.on('error', onerror);
      dest.on('error', onerror);

      // remove all the event listeners that were added.
      function cleanup() {
        source.removeListener('data', ondata);
        dest.removeListener('drain', ondrain);

        source.removeListener('end', onend);
        source.removeListener('close', onclose);

        source.removeListener('error', onerror);
        dest.removeListener('error', onerror);

        source.removeListener('end', cleanup);
        source.removeListener('close', cleanup);

        dest.removeListener('end', cleanup);
        dest.removeListener('close', cleanup);
      }

      source.on('end', cleanup);
      source.on('close', cleanup);

      dest.on('end', cleanup);
      dest.on('close', cleanup);

      dest.emit('pipe', source);

      // Allow for unix-like usage: A.pipe(B).pipe(C)
      return dest;
    };

    return Stream;
});