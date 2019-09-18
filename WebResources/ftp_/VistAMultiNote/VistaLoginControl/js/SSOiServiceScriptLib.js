//SSOiServiceScriptLib.js

var ssoiWindow;
var ssoiUrl;
var samlRefreshUrl;

var _SAMLToken = null;
var _IAMSession = null;

//Start of Namespace
SSOiServices = {

    startLogin: function (ssoiUrl) {
        ssoiWindow = window.open(ssoiUrl,
			'crmssoi',
			'height=500, width=865, location=yes, resizable=yes, scrollbars=yes, status=yes, titlebar=yes, top=100, left=100',
			true
		);
        //ssoiWindow.focus();
        return;
    },

    closeSSOi: function () {
        if (ssoiWindow != null) {
            ssoiWindow.close();
        }
        _SAMLToken = null;
        _IAMSession = null;
        $('#divSamlToken').val("Logged out.");
        return;
    },

    refreshSSOi: function (samlRefreshUrl, callback) {
        $.ajax({
            url: samlRefreshUrl,
            success: function (result) {
                _SAMLToken = result.SAMLToken;
                if (result.IAMSession) {
                    _IAMSession = result.IAMSession;
                }
                else {
                    _IAMSession = "donotuse";
                }
                callback();
            },
            error: function (request, status, error) {
                _SAMLToken = null;
                _IAMSession = null;
                alert(request.responseText);
                callback();
            }
        });
    }

}