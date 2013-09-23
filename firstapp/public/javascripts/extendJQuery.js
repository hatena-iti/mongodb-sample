/* Copyright 2013 Intelligent Technology Inc.
 *
 * Released under the MIT license
 * See http://opensource.org/licenses/mit-license.php for full text.
 */

'use strict';

jQuery.extend({
    "escapeHTML" : function (str) {
    	return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  	},
  	"unescapeHTML" : function () {
	    return str.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
	}
});
