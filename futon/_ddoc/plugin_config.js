

define([
    '../../mock_plugin/mock'
], function () {
    console.log('fs plugins loaded');
    return Array.prototype.slice.call(arguments);
});