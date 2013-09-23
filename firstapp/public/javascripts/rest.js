/* Copyright 2013 Intelligent Technology Inc.
 *
 * Released under the MIT license
 * See http://opensource.org/licenses/mit-license.php for full text.
 */

'use strict';

jQuery.postJSON = function() {
    switch (arguments.length) {
        case 1:
            return jQuery.post(arguments[0], "json");
            break;
        case 2:
            return jQuery.post(arguments[0], arguments[1], "json");
            break;
        case 3:
            return jQuery.post(arguments[0], arguments[1], arguments[2], "json");
            break;
        default:
            alert("jQuery.postJSON:引数の個数が不正");
            break;
    }
};

jQuery.extend({
    "putJSON" : function () {
        var params = [arguments[0]];  // [url, data, success, error]
        switch(arguments.length) {
            case 1:
                params.push(null, null, null);
                break;

            case 2:
                if(typeof arguments[1] == 'function') {
                    params.push(null, arguments[1], null);
                } else if(typeof arguments[1] == 'string' || typeof arguments[1] == 'object') {
                    params.push(arguments[1], null);
                }
                break;

            case 3:
                if(typeof arguments[1] == 'function') {
                    params.push(null, arguments[1], arguments[2]);
                } else if(typeof arguments[1] == 'string' || typeof arguments[1] == 'object') {
                    params.push(arguments[1], arguments[2], null);
                }
                break;

            case 4:
                params = arguments;
                break;

            default:
                alert('jQuery.putJSON: 引数の個数が不正');
                break;
        }

        return $.ajax({
            "url" : params[0],
            "data" : params[1],
            "success" : params[2] || function() {},
            "type" : "PUT",
            "cache" : false,
            "error" : params[3] || function() {},
            "dataType" : "json"
        });
    },

    "deleteJSON" : function () {
        var params = [arguments[0]];  // [url, data, success, error]
        switch(arguments.length) {
            case 1:
                params.push(null, null, null);
                break;

            case 2:
                if(typeof arguments[1] == 'function') {
                    params.push(null, arguments[1], null);
                } else if(typeof arguments[1] == 'string' || typeof arguments[1] == 'object') {
                    params.push(arguments[1], null);
                }
                break;

            case 3:
                if(typeof arguments[1] == 'function') {
                    params.push(null, arguments[1], arguments[2]);
                } else if(typeof arguments[1] == 'string' || typeof arguments[1] == 'object') {
                    params.push(arguments[1], arguments[2], null);
                }
                break;

            case 4:
                params = arguments;
                break;

            default:
                alert('jQuery.putJSON: 引数の個数が不正');
                break;
        }

        return $.ajax({
            "url" : params[0],
            "data" : params[1],
            "success" : params[2] || function() {},
            "type" : "DELETE",
            "cache" : false,
            "error" : params[3] || function() {},
            "dataType" : "json"
        });
    }
});