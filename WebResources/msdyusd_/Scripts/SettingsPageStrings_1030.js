Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Hvilket element vil du konfigurere?", 
	    "data": [
			{ 
			    "title": "Tilknyttede kontrolelementer", 
			    "descr": "Opret og administrer tilknyttede kontrolelementer. Tilknyttede kontrolelementer er de primære elementer, der bruges til at bygge programmer ved hjælp af Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Værktøjslinjer", 
			    "descr": "Opret og administrer værktøjslinjer og knapper til Unified Service Desk. Værktøjslinjer indeholder knapper med billeder og tekst, og knapperne bruges til at udføre handlinger.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Handlingsopkald", 
			    "descr": "Opret og administrer handlingsopkald til Unified Service Desk. Handlingsopkald kan føjes til værktøjslinjeknapper, hændelser, regler for vinduesnavigation og Helpdesk-medarbejderscripts.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Hændelser", 
			    "descr": "Opret og administrer hændelser. Hændelser er meddelelser, som et tilknyttet kontrolelement udløser for at fortælle programmet, at der sker noget.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Objektsøgninger", 
			    "descr": "Opret og administrer objektsøgninger. Objektsøgninger forespørger CRM-webtjenesterne om at returnere data.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Regler for vinduesnavigation", 
			    "descr": "Opret og administrer regler for vinduesnavigation. Regler for vinduesnavigation definerer interaktionen blandt forskellige kontrolelementer i Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Sessionslinjer", 
			    "descr": "Opret og administrer sessionslinjer. Sessionslinjer definerer oplysninger om sessionsnavne og sessionsoversigter i Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Helpdesk-medarbejderscripts", 
		       "descr": "Opret og administrer opgaver og svar for Helpdesk-medarbejderscripts. Helpdesk-medarbejderscripting giver vejledning til Helpdesk-medarbejderne om, hvad de skal sige i opkald, og hvad der er de næste trin i processen.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Opret og administrer scriptlets til Unified Service Desk. Scriptlets er JavaScript-kodestykker, der udføres i forbindelse med Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formularer", 
		       "descr": "Opret og administrer formularer, der gemmer beskrivende formulardefinitioner.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Indstillinger", 
		       "descr": "Opret og administrer indstillinger for Unified Service Desk. Indstillinger er navneværdipar, der kan bruges af komponenter.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Brugerindstillinger", 
		       "descr": "Opret og administrer brugerindstillinger for Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Tilpasningsfil", 
		       "descr": "Opret og administrer den komprimerede fil (.zip-fil), der indeholder de krævede tilpasningsfiler til brugerdefineret konfiguration i Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguration", 
		       "descr": "Opret og administrer konfigurationer for Unified Service Desk-aktiver, der kan tilknyttes forskellige brugere.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Indstillinger for overvågning og diagnose", 
		       "descr": "Opret og administrer indstillinger overvågning og diagnose for Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Vedhæft", 
	    "doneButton": "Udført", 
	    "attachButtonAltText": "Vedhæft en komprimeret fil (.zip-fil), der indeholder tilpasningsfilerne.", 
	    "doneButtonAltText": "Overfør den komprimerede fil (.zip-fil), der indeholder tilpasningsfilerne.", 
	    "deleteButtonAltText": "Fjern den komprimerede fil (.zip-fil).", 
	    "deleteAttachmentTitle": "Slet vedhæftet fil", 
	    "fileValidationTitle": "Ugyldig filtype", 
	    "fileValidation": "Filformatet er ikke gyldigt. Du kan kun vedhæfte en komprimeret fil (.zip). Komprimer dine tilpasningsfiler til en .zip-fil, og prøv derefter at vedhæfte igen.\r\nUnified Service Desk pakker filer ud fra .zip-filen for at indlæse indholdet, når klientprogrammet er startet.", 
	    "fileLabel": "FIL", 
	    "deleteConfirmation": "Er du sikker på, at du vil slette den vedhæftede fil?", 
	    "attachmentFailure": "Filoverførsel mislykkedes. Prøv igen ved at vælge en komprimeret fil (.zip-fil), der skal overføres." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Hvis denne indstilling vælges som standard, tilsidesættes tidligere konfigurationer. Vil du fortsætte?", 
	    "OK": "Fortsæt", 
	    "Cancel": "Annuller", 
	    "title": "Vil du indstille denne konfiguration som standard?", 
	    "ErrorTitle": "Denne konfiguration kan ikke indstilles som standard.", 
	    "ErrorMessage": "Kun aktive konfigurationer kan indstilles som standard. Aktivér denne konfiguration, og prøv derefter igen.", 
	    "SetDefaultErrorMessage": "Den valgte konfiguration er allerede standard.", 
	    "inactiveCloneTitle": "Posten kan ikke klones", 
	    "inactiveCloneAlert": "Du kan ikke klone en inaktiv konfigurationspost. Aktivér konfigurationsposten, og prøv derefter igen.", 
	    "cloningError": "Der opstod en fejl under kloning af en post:", 
	    "okButton": "OK", 
	    "cloneTitle": "Klon eksisterende konfiguration", 
	    "cloneMessage": "Opret en ny kopi af denne konfiguration.\r\nFeltværdier og relaterede postreferencer fra den oprindelige konfiguration klones.\r\nBrugere, der er tilknyttet den oprindelige konfiguration, klones ikke.", 
	    "cloneButton": "Klon", 
	    "cloneCancel": "Annuller", 
	    "copy": " - Kopiér" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Tilgængelige værdier", 
	    "selectedValues": "Valgte værdier" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
