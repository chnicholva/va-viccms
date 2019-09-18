function formatTelephoneNumber(pContext) {
	if (!!pContext) {
		var changedAttribute = pContext.getEventSource();
		if (!!changedAttribute) {
			var value = changedAttribute.getValue();
			if (!!value){
				var tempValue = value.toString().replace(/[^0-9A-Za-z]/g, "").toUpperCase();
				if (tempValue.substr(0, 1) == "1") tempValue = tempValue.substr(1, 99);
				var formattedValue = (tempValue.length >= 10) ? "(" + tempValue.substr(0, 3) + ") " + tempValue.substr(3, 3) + "-" + tempValue.substr(6, 4) : tempValue.substr(0, 3) + "-" + tempValue.substr(3, 4);
				changedAttribute.setValue(formattedValue);
			}
		}
	}
}