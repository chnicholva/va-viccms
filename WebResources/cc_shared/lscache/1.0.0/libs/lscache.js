!function(a,b){"function"==typeof define&&define.amd?define([],b):"undefined"!=typeof module&&module.exports?module.exports=b():a.lscache=b()}(this,function(){function a(){var a="__lscachetest__",c=a;if(void 0!==n)return n;try{if(!localStorage)return!1}catch(a){return!1}try{h(a,c),i(a),n=!0}catch(a){n=!(!b(a)||!localStorage.length)}return n}function b(a){return!!(a&&"QUOTA_EXCEEDED_ERR"===a.name||"NS_ERROR_DOM_QUOTA_REACHED"===a.name||"QuotaExceededError"===a.name)}function c(){return void 0===o&&(o=null!=window.JSON),o}function d(a){return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")}function e(a){return a+q}function f(){return Math.floor((new Date).getTime()/s)}function g(a){return localStorage.getItem(p+u+a)}function h(a,b){localStorage.removeItem(p+u+a),localStorage.setItem(p+u+a,b)}function i(a){localStorage.removeItem(p+u+a)}function j(a){for(var b=new RegExp("^"+p+d(u)+"(.*)"),c=localStorage.length-1;c>=0;--c){var f=localStorage.key(c);f=f&&f.match(b),f=f&&f[1],f&&f.indexOf(q)<0&&a(f,e(f))}}function k(a){var b=e(a);i(a),i(b)}function l(a){var b=e(a),c=g(b);if(c){var d=parseInt(c,r);if(f()>=d)return i(a),i(b),!0}}function m(a,b){v&&"console"in window&&"function"==typeof window.console.warn&&(window.console.warn("lscache - "+a),b&&window.console.warn("lscache - The error was: "+b.message))}var n,o,p="lscache-",q="-cacheexpiration",r=10,s=6e4,t=Math.floor(864e13/s),u="",v=!1,w={set:function(d,l,n){if(a()&&c()){try{l=JSON.stringify(l)}catch(a){return}try{h(d,l)}catch(a){if(!b(a))return void m("Could not add item with key '"+d+"'",a);var o,p=[];j(function(a,b){var c=g(b);c=c?parseInt(c,r):t,p.push({key:a,size:(g(a)||"").length,expiration:c})}),p.sort(function(a,b){return b.expiration-a.expiration});for(var q=(l||"").length;p.length&&q>0;)o=p.pop(),m("Cache is full, removing item with key '"+d+"'"),k(o.key),q-=o.size;try{h(d,l)}catch(a){return void m("Could not add item with key '"+d+"', perhaps it's too big?",a)}}n?h(e(d),(f()+n).toString(r)):i(e(d))}},get:function(b){if(!a())return null;if(l(b))return null;var d=g(b);if(!d||!c())return d;try{return JSON.parse(d)}catch(a){return d}},remove:function(b){a()&&k(b)},supported:function(){return a()},flush:function(){a()&&j(function(a){k(a)})},flushExpired:function(){a()&&j(function(a){l(a)})},setBucket:function(a){u=a},resetBucket:function(){u=""},enableWarnings:function(a){v=a}};return w});