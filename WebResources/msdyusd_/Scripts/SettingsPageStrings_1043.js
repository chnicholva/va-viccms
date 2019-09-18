Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Welk item wilt u configureren?", 
	    "data": [
			{ 
			    "title": "Gehoste besturingselementen", 
			    "descr": "Gehoste besturingselementen maken en beheren. Gehoste besturingselementen zijn de primaire elementen waarmee toepassingen worden gemaakt via Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Werkbalken", 
			    "descr": "Werkbalken en knoppen voor Unified Service Desk maken en beheren. Werkbalken bevatten knoppen met afbeeldingen en tekst, en knoppen worden gebruikt om acties uit te voeren.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Actieoproepen", 
			    "descr": "Actieoproepen voor Unified Service Desk maken en beheren. Actieoproepen kunnen worden toegevoegd aan werkbalkknoppen, gebeurtenissen, vensternavigatieregels en agentscripts.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Gebeurtenissen", 
			    "descr": "Gebeurtenissen maken en beheren. Gebeurtenissen zijn meldingen die door een gehost besturingselement worden geactiveerd om aan de toepassing aan te geven dat er iets gebeurt.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Entiteitzoekacties", 
			    "descr": "Entiteitzoekacties maken en beheren. Met entiteitzoekacties worden de CRM-webservices gevraagd gegevens te retourneren.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Vensternavigatieregels", 
			    "descr": "Vensternavigatieregels maken en bewerken. Met vensternavigatieregels wordt de interactie gedefinieerd tussen verschillende besturingselementen in Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Sessieregels", 
			    "descr": "Sessieregels maken en beheren. Met sessieregels worden de sessienaam en sessieoverzichtgegevens gedefinieerd in Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Agentscripts", 
		       "descr": "Taken en antwoorden voor agentscripts maken en beheren. Agentscripts helpen agents door aan te geven wat ze moeten zeggen tijdens oproepen en wat de vervolgstappen zijn.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptjes", 
		       "descr": "Scriptjes voor Unified Service Desk maken en beheren. Scriptjes zijn JavaScript-fragmenten die in de context van Unified Service Desk worden uitgevoerd.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulieren", 
		       "descr": "Formulieren maken en beheren waarmee declaratieve formulierdefinities worden opgeslagen.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opties", 
		       "descr": "Opties voor Unified Service Desk maken en beheren. Opties zijn paren van een naam en een waarde die door onderdelen kunnen worden gebruikt.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Gebruikersinstellingen", 
		       "descr": "Gebruikersinstellingen voor Unified Service Desk maken en beheren.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Aanpassingsbestand", 
		       "descr": "Maak en beheer het gecomprimeerde bestand (.zip) dat de aanpassingsbestanden bevat die zijn vereist voor aangepaste configuratie in Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configuratie", 
		       "descr": "Configuraties voor Unified Service Desk-activa maken en beheren die aan verschillende gebruikers kunnen worden gekoppeld.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Controle- en diagnose-instellingen", 
		       "descr": "Maak en beheer controle- en diagnose-instellingen voor Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Bijvoegen", 
	    "doneButton": "Gereed", 
	    "attachButtonAltText": "Voeg een gecomprimeerd bestand (.zip) bij dat de aanpassingsbestanden bevat.", 
	    "doneButtonAltText": "Upload het gecomprimeerde bestand (.zip) dat de aanpassingsbestanden bevat.", 
	    "deleteButtonAltText": "Verwijder het gecomprimeerde bestand (.zip).", 
	    "deleteAttachmentTitle": "Bijgevoegd bestand verwijderen", 
	    "fileValidationTitle": "Ongeldig bestandstype", 
	    "fileValidation": "De bestandsindeling is niet geldig. U kunt alleen een gecomprimeerd bestand (.zip) bijvoegen. Comprimeer uw aanpassingsbestanden in een ZIP-bestand.\r\nUnified Service Desk extraheert bestanden uit het ZIP-bestand om de inhoud te laden wanneer de clienttoepassing wordt gestart.", 
	    "fileLabel": "BESTAND", 
	    "deleteConfirmation": "Weet u zeker dat u het bijgevoegde dit bestand wilt verwijderen?", 
	    "attachmentFailure": "Uploaden van bestand mislukt. Probeer het opnieuw door een gecomprimeerd bestand (.zip) te selecteren om te uploaden." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Als dit als standaardconfiguratie wordt geselecteerd, wordt een eventueel eerder ingestelde configuratie genegeerd. Wilt u doorgaan?", 
	    "OK": "Doorgaan", 
	    "Cancel": "Annuleren", 
	    "title": "Wilt u deze configuratie instellen als standaardconfiguratie?", 
	    "ErrorTitle": "Deze configuratie kan niet worden ingesteld als de standaardconfiguratie.", 
	    "ErrorMessage": "Alleen actieve configuraties kunnen worden ingesteld als de standaardconfiguratie. Activeer deze configuratie en probeer het vervolgens opnieuw.", 
	    "SetDefaultErrorMessage": "De geselecteerd configuratie is al de standaardconfiguratie.", 
	    "inactiveCloneTitle": "Kan record niet klonen", 
	    "inactiveCloneAlert": "U kunt een inactieve configuratierecord niet klonen. Activeer de configuratierecord en probeer het opnieuw.", 
	    "cloningError": "Er is een fout opgetreden tijdens het klonen van een record:", 
	    "okButton": "OK", 
	    "cloneTitle": "Bestaande configuratie​​ klonen", 
	    "cloneMessage": "Maak een nieuwe kopie van deze configuratie.\r\nVeldwaarden en gerelateerde recordreferenties van de oorspronkelijke configuratie worden gekloond.\r\nGebruikers die aan de oorspronkelijke configuratie zijn gekoppeld worden niet gekloond.", 
	    "cloneButton": "Klonen", 
	    "cloneCancel": "Annuleren", 
	    "copy": " - Kopiëren" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Beschikbare waarden", 
	    "selectedValues": "Geselecteerde waarden" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
