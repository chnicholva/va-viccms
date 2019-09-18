/// <reference path="VCCM.USDHelper.js" />

if (typeof (VCCM) == "undefined") {
	VCCM = {
		__namespace : true
	};
}

VCCM.ICNCaching = {
	_stringParameterCheck: function (parameter, message) {
		///<summary>
		/// Private function used to check whether required parameters are null or undefined
		///</summary>
		///<param name="parameter" type="String">
		/// The string parameter to check;
		///</param>
		///<param name="message" type="String">
		/// The error message text to include when the error is thrown.
		///</param>
		if (typeof parameter != "string") {
			throw new Error(message);
		}
	},
	CheckICNLookupValue: function (pCachedICNLookupFieldName) {
debugger;
	    try{
	        this._stringParameterCheck(pCachedICNLookupFieldName, "VCCM.ICNCaching.CheckICNLookupValue() requires that pCachedICNLookupFieldName is a string.");
	        var attr = Xrm.Page.getAttribute(pCachedICNLookupFieldName);
	        if (!!attr) {
	            if (attr.getValue() == null || attr.getValue()[0].id == null) {
	                if (Xrm.Page.data.entity.getId() != null) {
	                    this.NotifyUSDOfMissingICN();
	                }
	                else {
	                    //wait for save, to get an ID.
	                    Xrm.Page.data.entity.addOnSave(
                            function () { setTimeout(VCCM.ICNCaching.CheckICNLookupValue(pCachedICNLookupFieldName), 2000); }
                        );
	                }
	            }
	        }
	    }
	    catch (ex) {
	        alert(ex.message);
	    }
	},
	NotifyUSDOfMissingICN: function () {
	    try{
	        if (typeof VCCM.USDHelper != undefined && typeof VCCM.USDHelper.FireUSDEvent == "function") {
	            VCCM.USDHelper.FireUSDEvent("NeedsCachedICN", ["ICN=[[MVI.ICN]+]", "logicalName=" + Xrm.Page.data.entity.getEntityName(), "recordId=" + Xrm.Page.data.entity.getId()], null);
	        }
	        else {
	            throw new Error("VCCM.ICNCaching.NotifyUSDOfMissingICN() requires that the VCCM.USDHelper library is present on the same page or form as the VCCM.ICNCaching library.");
	        }
	    }
	    catch (ex) {
	        alert(ex.message);
	    }
	}
};