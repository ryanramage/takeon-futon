This folder contains a plugin that can be loaded.


Couchapp Futon
--------------

To add this plugin to futon running as a couchapp. Push it to the futon db as follows:

    erica push futon --is-ddoc false

Ensure that the value in ```_ddoc\plugin.json``` for main matches the AMD file that starts this plugin.



File System/HTTP plugin
-----------------------

To add this plugin to futon running form the filesystem, you will have to alter the following file

    futon/_ddoc/plugin_config.js

Simply add the following to the dependecy list:

    define([
        '../../mock_plugin/mock'
    ], function () {

Just make sure the path matches to the AMD js file that starts this plugin.


Running from the filesystem, you will have to run ```make``` in the futon dir so all depencecies can be bundled and avoid cross browser requests.

