takeon-futon
============

My take on futon.next. A very simplified couch project that should be easy to jump in and develop for.


Goals
-----

 - Easy to develop
 - Must run in three diffrent contexts
   - Direct from filesystem against CORS enabled couchdbs
   - From a simple HTTP server (couch or other) to a couch on the same host, or a CORS enabled couch
   - As a couchapp
 - Fast! This the UI must be snappy as this is one of the prime ways of interacting with couchdb.


Features
--------

 - Fast _all_docs and views using json streaming and a virtual rendering grid
 - Back button support for between doc and list view.
 - Live JSON editor
 - Initial plugin system
 - Minimal externally loadable plugin example
 - Use with a local or remote couchdb
 - CouchDB API compliant urls



Requirements:
--------------

 1. (Optional) [erica](https://github.com/ryanramage/erica)
 2. (Optional) [jamjs](http://jamjs.org/docs) This is used in the make command to minimize the build.


Getting Started
---------------


### Served as HTTP to CORS couch

This is the best way to develop futon. Just save your file and reload the browser. You will need a CORS enabled couch to test against though.
Either build the couchdb 1.3 release branch, or use [rcouch](https://github.com/refuge/rcouch). Rcouch is pretty easy to start with.

Running futon:

    git clone https://github.com/Futon/takeon-futon
    cd takeon-futon
    python  -m SimpleHTTPServer

And visit  ```http://localhost:8000/futon```

(Optional - jamjs required)
If you want to minimize everything to almost one resource (less, css, javascript) do the following:

    make

And visit  ```http://localhost:8000/futon```

### Served from the Filesystem

[jamjs](http://jamjs.org/docs) is currently required for the make command in this mode.

    git clone https://github.com/Futon/takeon-futon
    cd takeon-futon/futon
    make
    open the takeon-futon/futon/index.html file in a browser

Currently there are some issues with the filesystem and cross domain requests blocking loading .less files. That is why a ```make``` is required.


### As a couchapp

[erica](https://github.com/ryanramage/erica) is required to load it as a couchapp.

     git clone https://github.com/Futon/takeon-futon
     cd takeon-futon/futon
     erica push futon

See it as a couchapp on ```http://localhost:5984/futon/_design/futon/_rewrite/```

(Optional - jamjs required )
If you want to minimize everything to almost one resource (less, css, javascript) do the following:

    make
    erica push futon




Bad Joke
----

For fun, the name could be pronounced 'Tachyon' Futon
