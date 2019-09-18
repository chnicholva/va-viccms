$(document).bind("mobileinit", function () {
    $.mobile.page.prototype.options.keepNative = "*:not('.mocaControls')";
});