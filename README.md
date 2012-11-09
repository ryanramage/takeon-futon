takeon-futon
============

My take on futon.next. A very simplified couch project that should be easy to jump in and develop for.

Requirements:
--------------

 1. [erica](https://github.com/ryanramage/erica)
 2. (Optional) [jamjs](http://jamjs.org/docs) This is used in the make command to minimize the build.


Getting Started
---------------


     git clone https://github.com/Futon/takeon-futon
     cd futon
     erica push futon

See it as a couchapp on ```http://localhost:5984/futon/_design/futon/_rewrite/```


(Optional)
If you want to minimize everything to almost one resource (less, css, javascript) do the following:

    make
    erica push futon




You can also run it standalone against cors enabled couchdbs as follows

    git clone https://github.com/Futon/takeon-futon
    cd futon
    python  -m SimpleHTTPServer

And visit  ```http://localhost:8000/```

