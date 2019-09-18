Type.registerNamespace("USD.Resources");
(function () {
    USD.Resources.SettingsPage =
	{
	    "headertitle": "Unified Service Desk",
	    "headerdesc": "Which item would you like to configure?",
	    "data": [
			{
			    "title": "Hosted Controls",
			    "descr": "Create and manage hosted controls. Hosted Controls are the primary elements used for building applications using Unified Service Desk.",
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			},
			{
			    "title": "Toolbars",
			    "descr": "Create and manage toolbars and buttons for Unified Service Desk. Toolbars contain buttons with images and text, and buttons are used to execute actions.",
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			},
			{
			    "title": "Action Calls",
			    "descr": "Create and manage action calls for Unified Service Desk. Action calls can be added to toolbar buttons, events, window navigation rules, and agent scripts.",
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			},
			{
			    "title": "Events",
			    "descr": "Create and manage events. Events are notifications that a hosted control triggers to indicate to the application that something is occurring.",
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			},
			{
			    "title": "Entity Searches",
			    "descr": "Create and manage entity searches. Entity searches query the CRM web services to return data.",
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			},
			{
			    "title": "Window Navigation Rules",
			    "descr": "Create and manage window navigation rules. Window navigation rules define the interaction among various controls in Unified Service Desk.",
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			},
			{
			    "title": "Session Lines",
			    "descr": "Create and manage session lines. Session lines define session name and session overview information in Unified Service Desk.",
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			},
		   {
		       "title": "Agent Scripts",
		       "descr": "Create and manage agent script tasks and answers. Agent scripting provides guidance to agents about what they should say on calls and what the next steps are in the process.",
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   },
		   {
		       "title": "Scriptlets",
		       "descr": "Create and manage scriptlets for Unified Service Desk. Scriptlets are snippets of JavaScript that are executed in the context of Unified Service Desk.",
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   },
		   {
		       "title": "Forms",
		       "descr": "Create and manage forms that store declarative form definitions.",
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   },
		   {
		       "title": "Options",
		       "descr": "Create and manage options for Unified Service Desk. Options are name value pairs that can be used by components.",
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   },
		   {
		       "title": "User Settings",
		       "descr": "Create and manage user settings for Unified Service Desk.",
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   },

		   {
		       "title": "Customization File",
		       "descr": "Create and manage the compressed (.zip) file that contains the customization files required for custom configuration in Unified Service Desk.",
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   },

		   {
		       "title": "Configuration",
		       "descr": "Create and manage configurations for Unified Service Desk assets that can be associated with different users.",
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   },

		   {
		       "title": "Audit &amp; Diagnostics Settings",
		       "descr": "Create and manage Audit &amp; Diagnostics Settings for Unified Service Desk.",
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   }

	    ]
	};
    //Resource strings for customizationFiles entity FileUpload control
    USD.Resources.CustomizationFilesPage =
	{
	    "attachButton": "Attach",
	    "doneButton": "Done",
	    "attachButtonAltText": "Attach a compressed (.zip) file that contains the customization files.",
	    "doneButtonAltText": "Upload the compressed (.zip) file that contains the customization files.",
	    "deleteButtonAltText": "Remove the compressed (.zip) file.",
	    "deleteAttachmentTitle": "Delete attached file",
	    "fileValidationTitle": "Invalid FileType",
	    "fileValidation": "The file format isn't valid. You can only attach a compressed (.zip) file. Compress your customization files into a .zip file, and then try attaching again.\r\nUnified Service Desk will extract files from the .zip file to load the contents when the client application is started.",
	    "fileLabel": "FILE",
	    "deleteConfirmation": "Are you sure you want to delete the attached file?",
	    "attachmentFailure": "File upload failed. Try again by selecting a compressed (.zip) file to upload."
	};
    USD.Resources.ConfigurationPage =
	{
	    "IsDefaultNotification": "Selecting this as the default will override any previously set configuration. Do you want to continue?",
	    "OK": "Continue",
	    "Cancel": "Cancel",
	    "title": "Do you want to set this configuration as the default?",
	    "ErrorTitle": "This configuration can't be set as the default.",
	    "ErrorMessage": "Only active configurations can be set as the default. Activate this configuration, and then try again.",
	    "SetDefaultErrorMessage": "The selected configuration is already the default.",
	    "inactiveCloneTitle": "Can't clone record",
	    "inactiveCloneAlert": "You can't clone an inactive configuration record. Activate the configuration record, and try again.",
	    "cloningError": "There was an error during cloning a record:",
	    "okButton": "OK",
	    "cloneTitle": "Clone Existing Configuration",
	    "cloneMessage": "Create a new copy of this configuration.\r\nField values and related record references from the original configuration will be cloned.\r\nUsers associated with the original configuration won't be cloned.",
	    "cloneButton": "Clone",
	    "cloneCancel": "Cancel",
	    "copy": " - Copy"
	};
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings
    USD.Resources.AuditAndDiagnosticsSettingPage =
	{
	    "availableValues": "Available Values",
	    "selectedValues": "Selected Values"
	};
})();
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() };