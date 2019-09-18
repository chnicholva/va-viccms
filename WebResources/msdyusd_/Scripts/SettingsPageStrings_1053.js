Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Vilket objekt vill du konfigurera?", 
	    "data": [
			{ 
			    "title": "Värdbaserade kontroller", 
			    "descr": "Skapa och hantera värdbaserade kontroller. Värdbaserade kontroller är de primära element som används för att skapa program med Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Verktygsfält", 
			    "descr": "Skapa och hantera verktygsfält och knappar för Unified Service Desk. Verktygsfält innehåller knappar med bilder och text, och knapparna används för att utföra åtgärder.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Åtgärdsanrop", 
			    "descr": "Skapa och hantera åtgärdsanrop för Unified Service Desk. Åtgärdsanrop kan läggas till för verktygsfältsknappar, händelser, fönsternavigeringsregler och handläggarskript.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Händelser", 
			    "descr": "Skapa och hantera händelser. Händelser är aviseringar som en värdbaserad kontroll utlöser för att meddela programmet om att något sker.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Entitetssökningar", 
			    "descr": "Skapa och hantera entitetssökningar. Entitetssökningar frågar CRM-webbtjänsterna och data returneras.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Fönsternavigeringsregler", 
			    "descr": "Skapa och hantera fönsternavigeringsregler. Fönsternavigeringsregler definierar interaktionen mellan olika kontroller i Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Sessionsrader", 
			    "descr": "Skapa och hantera sessionsrader. Sessionsrader definierar sessionsnamn och sessionsöversiktsinformation i Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Handläggarskript", 
		       "descr": "Skapa och hantera uppgifter och svar i handläggarskript. Handläggarskript ger handläggare vägledning om vad de ska säga i samtal och vad som är nästa steg i processen.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skriptlet", 
		       "descr": "Skapa och hantera skriptlet för Unified Service Desk. Skriptlet är kodstycken med JavaScript som körs i samband med Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulär", 
		       "descr": "Skapa och hantera formulär för lagring av deklarativa formulärdefinitioner.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Alternativ", 
		       "descr": "Skapa och hantera alternativ för Unified Service Desk. Alternativ är namnvärdepar som kan användas av komponenter.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Användarinställningar", 
		       "descr": "Skapa och hantera användarinställningar för Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Anpassningsfil", 
		       "descr": "Skapa och hantera den komprimerade filen (ZIP) som innehåller anpassningsfilerna som behövs till den anpassade konfigurationen i Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguration", 
		       "descr": "Skapa och hantera konfigurationer för resurser i Unified Service Desk som kan associeras med olika användare.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Inställningar för granskning och diagnostik", 
		       "descr": "Skapa och hantera inställningar för granskning och diagnostik för Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Bifoga", 
	    "doneButton": "Klart", 
	    "attachButtonAltText": "Bifoga en komprimerad ZIP-fil som innehåller anpassningsfilerna.", 
	    "doneButtonAltText": "Överför den komprimerade ZIP-filen som innehåller anpassningsfilerna.", 
	    "deleteButtonAltText": "Ta bort den komprimerade filen (ZIP).", 
	    "deleteAttachmentTitle": "Ta bort den bifogade filen", 
	    "fileValidationTitle": "Ogiltig FileType", 
	    "fileValidation": "Filformatet är ogiltigt. Du kan bara bifoga en komprimerad (.zip) fil. Komprimera anpassningsfilerna till en ZIP-fil och försök sedan bifoga igen. \r\nUnified Service Desk extraherar filer från ZIP-filen för att läsa in innehållet när klientprogrammet har startat.", 
	    "fileLabel": "FIL", 
	    "deleteConfirmation": "Vill du ta bort den bifogade filen?", 
	    "attachmentFailure": "Det gick inte att överföra filen. Markera en komprimerad ZIP-fil för överföring och försök igen." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Om du väljer det här som standard åsidosätts tidigare inställd konfiguration. Vill du fortsätta?", 
	    "OK": "Fortsätt", 
	    "Cancel": "Avbryt", 
	    "title": "Vill du ställa in den här konfigurationen som standard?", 
	    "ErrorTitle": "Den här konfigurationen kan inte ställas in som standard.", 
	    "ErrorMessage": "Endast aktiva konfigurationer kan ställas in som standard. Aktivera konfigurationen och försök igen.", 
	    "SetDefaultErrorMessage": "Den valda konfigurationen är redan standard.", 
	    "inactiveCloneTitle": "Det går inte att klona posten", 
	    "inactiveCloneAlert": "Du kan inte klona en inaktiv konfigurationspost. Aktivera konfigurationsposten och försök igen.", 
	    "cloningError": "Det uppstod ett fel när en post klonades:", 
	    "okButton": "OK", 
	    "cloneTitle": "Klona befintlig konfiguration", 
	    "cloneMessage": "Skapa en ny kopia av konfigurationen.\r\nFältvärden och referenser till relaterade poster i den ursprungliga konfigurationen klonas.\r\nAnvändare som är kopplade till den ursprungliga konfigurationen klonas inte.", 
	    "cloneButton": "Klona", 
	    "cloneCancel": "Avbryt", 
	    "copy": " – Kopiera" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Tillgängliga värden", 
	    "selectedValues": "Markerade värden" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
