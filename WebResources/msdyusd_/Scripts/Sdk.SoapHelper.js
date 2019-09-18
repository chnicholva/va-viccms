// =====================================================================
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// =====================================================================
var Sdk = window.Sdk || { __namespace: true };
Sdk.jQ = Sdk.jQ || { __namespace: true };

(function () {

	this.execute = function (request) {
		///<summary>
		/// Executes a SOAP Request using the SOAPAction Execute
		///</summary>
		///<param name="request" type="Sdk.OrganizationRequest">
		/// Required. A request object
		///</param>
		if (!(request instanceof Sdk.OrganizationRequest)) {
			throw new Error("Sdk.jQ.execute request parameter must be an Sdk.OrganizationRequest .");
		}
		var executeXml = [
	   Sdk.getEnvelopeHeader(),
		"<s:Body>",
		 "<d:Execute>",
		request.getRequestXml(),
		 "</d:Execute>",
		"</s:Body>",
	   "</s:Envelope>"].join("");

		checkForjQuery("execute");
		var deferred = _jq.Deferred();
		var req = Sdk.getXMLHttpRequest("Execute", true);
		req.onreadystatechange = function () {
			if (this.readyState == 4) {
				this.onreadystatechange = null;
				if (this.status == 200) {
					var doc = this.responseXML;
					Sdk.setSelectionNamespaces(doc);
					deferred.resolve();//new request.getResponseType()(doc));
				}
				else {
					deferred.reject();
				}
			}
		};
		req.send(executeXml);
		req = null;
		return deferred.promise();
	};

	this.setJQueryVariable = function (jQueryReference) {
		///<summary>
		/// Sets the global jQuery variable to use
		///</summary>
		///<param name="jQueryReference" type="jQuery">
		/// A reference to the global jQuery instance
		///</param>
		if (typeof jQueryReference.support != "undefined")
		{ _jq = jQueryReference; }
		else
		{ throw new Error("The variable passed to Sdk.jQ.setJQueryVariable is not a valid global jQuery object."); }
	}

	function checkForjQuery(methodName) {
		if (typeof _jq == "undefined") {
			throw new Error("Sdk.jQ.{0} requires a specific jQuery variable set using Sdk.jQ.setJQueryVariable.");
		}
	}
	var _jq;

}).call(Sdk.jQ);

(function () {

	var ns = {
		"s": "http://schemas.xmlsoap.org/soap/envelope/",
		"a": "http://schemas.microsoft.com/xrm/2011/Contracts",
		"i": "http://www.w3.org/2001/XMLSchema-instance",
		"b": "http://schemas.datacontract.org/2004/07/System.Collections.Generic",
		"c": "http://www.w3.org/2001/XMLSchema",
		"d": "http://schemas.microsoft.com/xrm/2011/Contracts/Services",
		"e": "http://schemas.microsoft.com/2003/10/Serialization/",
		"f": "http://schemas.microsoft.com/2003/10/Serialization/Arrays",
		"g": "http://schemas.microsoft.com/crm/2011/Contracts",
		"h": "http://schemas.microsoft.com/xrm/2011/Metadata",
		"j": "http://schemas.microsoft.com/xrm/2011/Metadata/Query",
		"k": "http://schemas.microsoft.com/xrm/2013/Metadata",
		"l": "http://schemas.microsoft.com/xrm/2012/Contracts"
	};
	var _clientUrl = null;

	this.Collection = function (type, list) {
		///<summary>
		/// A Collection for a specified type;
		///</summary>
		///<param name="type" type="Function" optional='false'>
		/// The function that specifies the type
		///</param>
		///<param name="list" type="Array" optional='true'>
		/// An array of items to add to the collection
		///</param>
		if (!(this instanceof Sdk.Collection)) {
			return new Sdk.Collection(type, list);
		}
		if (typeof type != "function") {
			throw new Error("Sdk.Collection type parameter is required and must be a function.")
		}
		// list parameter will be checked by the use of the addRange function when the collection is initialized
		var _type = type;
		var _typeErrorMessage = "The value being added to the Sdk.Collection is not the expected type. The expected type is " + _type.toString();
		var _objects = [];
		var _count = 0;

		this.getType = function () {
			///<summary>
			/// Gets the type defined for the collection
			///</summary>
			///<returns type="Function">
			/// The function that specifies the type
			///</returns>
			return _type;
		}
		this.add = function (item) {
			///<summary>
			/// Adds an item to the collection.
			///</summary>
			///<param name="item" type="Object">
			/// The type of item must match the type defined for the collection.
			///</param>
			if (_type == String) {
				if (typeof item == "string") {
					_objects.push(item);
					_count++;
					return;
				}
				else {
					throw new Error(_typeErrorMessage)
				}
			}
			if (_type == Number) {
				if (typeof item == "number") {
					_objects.push(item);
					_count++;
					return;
				}
				else {
					throw new Error(_typeErrorMessage)
				}
			}
			if (_type == Boolean) {
				if (typeof item == "boolean") {
					_objects.push(item);
					_count++;
					return;
				}
				else {
					throw new Error(_typeErrorMessage)
				}
			}
			else {
				if (item instanceof _type) {
					_objects.push(item);
					_count++;
					return;
				}
				else { throw new Error(_typeErrorMessage) }
			}
		};
		this.addRange = function (items) {
			///<summary>
			/// Adds an array of objects to the collection
			///</summary>
			///<param name="items" type="Array">
			/// Each item in the array must be the expected type for the collection.
			///</param>
			var errorMessage = "Sdk.Collection.addRange requires an array parameter.";
			if (items != null) {
				if (typeof items.push != "undefined")//Verify it is an array
				{
					for (var i = 0; i < items.length; i++) {
						this.add(items[i]);
					}
				}
				else {
					throw new Error(errorMessage);
				}
			}
			else {
				throw new Error(errorMessage);
			}

		};
		this.clear = function () {
			///<summary>
			/// Removes all items from the collection
			///</summary>
			_objects.length = 0;
			_count = 0;
		};
		this.contains = function (item) {
			///<summary>
			/// Returns whether an object exists within the collection.
			///</summary>
			///<param name="item" type="Object">
			///  The item must be a reference to the same object.
			///</param>
			for (var i = 0; i < _objects.length; i++) {
				if (item === _objects[i]) {
					return true;
				}
			}
			return false;
		};
		this.forEach = function (fn) {
			///<summary>
			/// Applies the action contained within a delegate function.
			///</summary>
			///<param name="fn" type="Function">
			/// Delegate function with parameters for item and index.
			///</param>
			for (var i = 0; i < _objects.length; i++) {
				fn(_objects[i], i);
			}
		};
		this.getByIndex = function (index) {
			///<summary>
			/// Gets the item in the collection at the specified index
			///</summary>
			///<param name="index" type="Number" optional="false" mayBeNull="false">
			/// The index of the item to return
			///</param>
			///<returns type="Object">
			/// The object at the specified index
			///</returns>
			if (typeof index == "number") {
				if (index >= _count) {
					throw new Error("Out of range. Sdk.Collection.getByIndex index parameter must be within the number of items in the collection.")
				}
				else {
					return _objects[index];
				}

			}
			throw new Error("Sdk.Collection.getByIndex index parameter must be a Number.")

		};
		this.remove = function (item) {
			///<summary>
			/// Removes an item from the collection
			///</summary>
			///<param name="item" type="Object" mayBeNull="false">
			/// The item must be a reference to the same object.
			///</param>
			if ((item != null) && (typeof item != "undefined")) {
				for (var i = 0; i < _objects.length; i++) {
					if (item === _objects[i]) {
						_objects.splice(i, 1);
						_count--;
						return;
					}
				}
				throw new Error(Sdk.Util.format("Item {0} not found.", [item.toString()]));
			}
			else {
				throw new Error("Sdk.Collection.remove item parameter must not be null or undefined.")
			}

		};
		this.toArray = function () {
			///<summary>
			/// Gets a copy of the array of items in the collection
			///</summary>
			///<returns type="Array">
			/// A copy of items in the collection
			///</returns>
			return _objects.slice(0);
		};
		this.getCount = function () {
			///<summary>
			/// Returns the number of items in the collection
			///</summary>
			///<returns type="Number">
			/// The number of items
			///</returns>
			return _count;
		}

		if (list != null) {
			this.addRange(list);
		}

	};
	this.Collection.__class = true;

	this.OrganizationRequest = function () {
		// All Requests must inherit from this

		var _responseType;
		var _requestXml;

		function _setValidResponseType(value) {
			if (value.prototype.type == "Sdk.OrganizationResponse" && typeof value == "function") {
				_responseType = value;
			}
			else {
				throw new Error("Sdk.OrganizationRequest ResponseType property must be a Sdk.OrganizationResponse).");
			}
		}
		function _setValidRequestXml(value) {
			if (typeof value == "string") {
				_requestXml = value;
			}
			else {
				throw new Error("Sdk.OrganizationRequest RequestXml property must be a String.");
			}
		}

		this.setRequestXml = function (xml) {
			///<summary>
			/// Sets the request XML
			///</summary>
			///<param name="xml" type="String">
			/// The request XML
			///</param>
			_setValidRequestXml(xml);
		}
		this.getRequestXml = function () {
			///<summary>
			/// Gets the request XML
			///</summary>
			///<returns type="String">
			/// The request XML
			///</returns>
			return _requestXml;
		}
		this.setResponseType = function (type) {
			///<summary>
			/// Sets the response type
			///</summary>
			///<param name="type" type="Sdk.OrganizationResponse">
			/// A class that inherits from Sdk.OrganizationResponse
			///</param>
			_setValidResponseType(type);
		}
		this.getResponseType = function () {
			///<summary>
			/// Gets the response type
			///</summary>
			///<returns type="Sdk.OrganizationResponse">
			/// A class that inherits from Sdk.OrganizationResponse
			///</returns>
			return _responseType;
		}

	}
	this.OrganizationRequest.__class = true;

	this.OrganizationResponse = function () {
		// All Responses must inherit from this
		this.type = "Sdk.OrganizationResponse";
	}
	this.OrganizationResponse.__class = true;

	this.EntityReference = function (logicalName, id, name) {
		///<summary>
		/// Identifies a record. 
		///</summary>
		///<param name="logicalName" type="String" optional="false" mayBeNull="false">
		/// The logical name of the entity
		///</param>
		///<param name="id" type="String" optional="false" mayBeNull="false">
		/// The id of the record
		///</param>
		///<param name="name" type="String" optional="true" mayBeNull="true">
		/// <para>The value of the primary attribute of the entity instance</para>
		/// <para>This property can contain a value or null. This property is not automatically populated unless the EntityReference object has been retrieved from the server.</para>
		///</param>


		if (!(this instanceof Sdk.EntityReference)) {
			return new Sdk.EntityReference(logicalName, id, name);
		}

		var _logicalName, _id, _name = null;

		function _setValidLogicalName(value) {
			if (typeof value == "string")
			{ _logicalName = value; }
			else
			{
				throw new Error("Sdk.EntityReference constructor logicalName parameter is required and must be a String.");
			}
		}
		function _setValidId(value) {
			if (value != null && Sdk.isGuidOrNull(value)) {
				_id = value;
			}
			else {
				throw new Error("Sdk.EntityReference constructor id value property is required and must be a String representation of a GUID value.");
			}

		}
		function _setValidName(value) {
			if (typeof value == "string")
			{ _name = value; }
			else
			{
				throw new Error("Sdk.EntityReference constructor name parameter must be a String.");
			}
		}

		//Set internal properties from constructor parameters
		_setValidLogicalName(logicalName);
		_setValidId(id);
		if (name != null && typeof name != "undefined") {
			_setValidName(name);
		}

		this.getType = function () {
			///<summary>
			/// Gets the logicalName representing the type of referenced entity
			///</summary>
			/// <returns type="String">
			/// The logicalName representing the type of referenced entity
			///</returns>
			return _logicalName;
		}
		this.getId = function () {
			///<summary>
			/// Gets the Id value of the referenced entity
			///</summary>
			/// <returns type="String">
			/// The Id value of the referenced entity
			///</returns>
			return _id;
		}
		this.getName = function () {
			///<summary>
			/// Gets the primary attribute value of the referenced entity
			///</summary>
			/// <returns type="String">
			/// The primary attribute value of the referenced entity
			///</returns>
			return _name;
		}
		this.setType = function (type) {
			///<summary>
			/// Sets the logicalName representing the type of referenced entity
			///</summary>
			/// <param name="type" type="String">
			/// The logicalName representing the type of  referenced entity
			///</param>
			_setValidLogicalName(type);
		}
		this.setId = function (id) {
			///<summary>
			///  Sets the Id value of the entity
			///</summary>
			/// <param name="id" type="String">
			/// The Id value of the entity
			///</param>
			_setValidId(id);
		}
		this.setName = function (name) {
			///<summary>
			///  Sets the primary attribute value of the referenced entity
			///</summary>
			/// <param name="name" type="String">
			/// The primary attribute value of the referenced entity
			///</param>
			_setValidName(name);
		}

	}
	this.EntityReference.__class = true;

	//Sdk.EntityReference END
	//--------------------------------------------------------------------
	//Sdk.EntityReferenceCollection START
	this.EntityReferenceCollection = function (entityReferences) {
		///<summary>
		/// Contains a collection of EntityReference instances.
		///</summary>
		///<param name="entityReferences" type="Sdk.Collection" optional="true">
		/// Initializes a new instance of the EntityReferenceCollection class setting the Sdk.Collection of Sdk.EntityReference objects.
		///</param>

		if (!(this instanceof Sdk.EntityReferenceCollection)) {
			return new Sdk.EntityReferenceCollection(entityReferences);
		}

		// inner property
		var _entityReferences = Sdk.Collection(Sdk.EntityReference);

		//internal setter functions
		function _setValidEntityReferences(value) {
			if (value instanceof Sdk.Collection && value.getType() == Sdk.EntityReference) {
				_entityReferences = value;
			}
			else {
				throw new Error("Sdk.EntityReferenceCollection EntityReferences property must be an Sdk.Collection of SdkEntityReference");

			}
		}
		//Set internal properties from constructor parameters
		if (typeof entityReferences != "undefined" || entityReferences != null) {
			_setValidEntityReferences(entityReferences);
		}

		//public methods
		this.getEntityReferences = function () {
			///<summary>
			/// Gets the collection of entity references
			///</summary>
			///<returns type="Sdk.Collection">The entity references</returns>
			return _entityReferences;
		};
		this.setEntityReferences = function (entityReferences) {
			///<summary>
			/// Sets the collection of entity references
			///</summary>
			///<param name="entityReferences" optional="false" mayBeNull="false" type="Sdk.Collection">The entity references</param>
			_setValidEntityReferences(entityReferences);
		}

	};
	this.EntityReferenceCollection.__class = true;

	this.isGuid = function (value) {
		///<summary>
		/// Verifies the parameter is a string formatted as a GUID
		///</summary>
		///<param name="value" type="String" optional="false" mayBeNull="false">
		/// The value to check
		///</param>
		if (typeof value == "string") {
			if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) {
				return true;
			}
			return false;
		}
		else {
			throw new Error("Sdk.Util.isGuid value parameter must be a string.");
		}
	}

	this.isGuidOrNull = function (value) {
		///<summary>
		/// Verifies the parameter is a string formatted as a GUID or null
		///</summary>
		///<param name="value" type="String" optional="false" mayBeNull="true">
		/// The value to check
		///</param>
		if (value == null || typeof value == "string") {
			if (value == null) {
				return true;
			}
			else {
				return Sdk.isGuid(value);
			}
		}
		else {
			throw new Error("Sdk.Util.isGuidOrNull value parameter must be a string or null.");
		}
	}

	this.getType = function () {
		///<summary>
		/// Gets the value type of the attribute.
		///</summary>
		///<returns type="Sdk.ValueType">
		/// The value type of the attribute.
		///</returns>
		return _type;
	}

	this.getValue = function () {
		///<summary>
		/// <para>Gets the value of the attribute.</para>
		/// <para>The type of value depends on the type of attribute</para>
		///</summary>
		///<returns type="Object">
		/// The value of the attribute.
		///</returns>
		return _value;
	}

	this.xmlEncode = function (strInput) {
		///<summary>
		/// Encodes a string of XML
		///</summary>
		///<param name="strInput" type="String" optional='false'>
		/// <para>The string of XML to be encoded</para>
		///</param>
		var c;
		var XmlEncode = '';
		if (strInput == null) {
			return null;
		}
		if (strInput == '') {
			return '';
		}
		for (var cnt = 0; cnt < strInput.length; cnt++) {
			c = strInput.charCodeAt(cnt);
			if (((c > 96) && (c < 123)) ||
			((c > 64) && (c < 91)) ||
			(c == 32) ||
			((c > 47) && (c < 58)) ||
			(c == 46) ||
			(c == 44) ||
			(c == 45) ||
			(c == 95)) {
				XmlEncode = XmlEncode + String.fromCharCode(c);
			}
			else {
				XmlEncode = XmlEncode + '&#' + c + ';';
			}
		}
		return XmlEncode;
	}

	this.isCollectionOf = function (collection, type) {
		if (collection instanceof Sdk.Collection) {
			if (typeof type == "function") {
				if (collection.getType() == type)
				{ return true; }
			}
			else {
				throw new Error("Sdk.isCollectionOf type parameter must be a Function.");
			}
		}
		else {
			throw new Error("Sdk.isCollectionOf collection parameter must be an Sdk.Collection.");
		}
		return false;
	}

	this.getEnvelopeHeader = function () {

		var _envelopeHeader = ["<s:Envelope "];
		for (var i in ns) {
			_envelopeHeader.push(" xmlns:" + i + "=\"" + ns[i] + "\"")
		}
		_envelopeHeader.push("><s:Header><a:SdkClientVersion>6.0</a:SdkClientVersion></s:Header>");
		return _envelopeHeader.join("");

	}

	this.getXMLHttpRequest = function (action, async) {
		var req = new XMLHttpRequest();
		req.open("POST", Sdk.getClientUrl() + "/XRMServices/2011/Organization.svc/web", async)
		try { req.responseType = 'msxml-document' } catch (e) { }
		req.setRequestHeader("Accept", "application/xml, text/xml, */*");
		req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/" + action);
		return req;
	}

	this.getClientUrl = function () {
		if (_clientUrl != null)
		{ return _clientUrl; }
		else
		{
			try {
				return GetGlobalContext().getClientUrl();
			}
			catch (e) {
				try {
					return Xrm.Page.context.getClientUrl();
				}
				catch (e) {
					throw new Error("Sdk.Util.getClientUrl Unable to get clientUrl. Context not available.");
				}
			}
		}
	};

	this.setSelectionNamespaces = function (doc) {
		///<summary>
		/// Sets the namespaces to be used when querying the document
		///</summary>
		///<param name="doc" type="XMLDocument" optional='false'>
		/// <para>The XML Document</para>
		///</param>
		if (typeof doc.setProperty != "undefined") {
			var namespaces = [];
			for (var i in ns) {
				namespaces.push("xmlns:" + i + "='" + ns[i] + "'");
			}
			doc.setProperty("SelectionNamespaces", namespaces.join(" "));
		}

	}

}).call(Sdk)

Sdk.EntityReference.prototype.toXml = function () {
	///<summary>
	///  Returns a serialized entity reference where the root element is &lt;a:EntityReference&gt;
	///</summary>
	/// <returns type="String" />
	var rv = [];
	rv.push("<a:EntityReference>");
	rv.push(this.toValueXml());
	rv.push("</a:EntityReference>")
	return rv.join("");
}

Sdk.EntityReferenceCollection.prototype.toValueXml = function () {
	///<summary>
	///  Returns the values of serialized entity reference collection as XML nodes
	///</summary>
	/// <returns type="String" />
	var rv = [];
	this.getEntityReferences().forEach(function (er, i) {
		rv.push(er.toXml());
	});
	return rv.join("");
}

Sdk.EntityReference.prototype.toValueXml = function () {
	///<summary>
	///  Returns the values of serialized entity reference as XML nodes
	///</summary>
	/// <returns type="String" />
	var rv = [];
	rv.push("<a:Id>" + this.getId() + "</a:Id>");
	rv.push("<a:LogicalName>" + this.getType() + "</a:LogicalName>");
	if (this.getName() == null) {
		rv.push("<a:Name i:nil=\"true\" />");
	}
	else {
		rv.push("<a:Name>" + this.getName() + "</a:Name>")
	}
	return rv.join("");
}
