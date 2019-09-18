Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Welches Element möchten Sie konfigurieren?", 
	    "data": [
			{ 
			    "title": "Gehostete Steuerelemente", 
			    "descr": "Erstellen und verwalten Sie gehostete Steuerelemente. Gehostete Steuerelemente sind die Hauptelemente beim Erstellen von Anwendungen mit Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Symbolleisten", 
			    "descr": "Erstellen und verwalten Sie Symbolleisten und Schaltflächen für Unified Service Desk. Symbolleisten enthalten Schaltflächen mit Bildern und Text. Die Schaltflächen werden verwendet, um Aktionen durchzuführen.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Handlungsaufforderungen", 
			    "descr": "Erstellen und verwalten Sie Handlungsaufforderungen für Unified Service Desk. Handlungsaufforderungen können zu Symbolleisten, Schaltflächen, Ereignissen, Fensternavigationsregeln und Agent-Skripten hinzugefügt werden.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Ereignisse", 
			    "descr": "Erstellen und verwalten Sie Ereignisse. Ereignisse sind Benachrichtigungen, die ein gehostetes Steuerelement auslöst, um anzuzeigen, dass etwas geschieht.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Entitätssuchvorgänge", 
			    "descr": "Erstellen und verwalten Sie Entitätssuchvorgänge. Mit Entitätssuchvorgängen werden die CRM-Webdienste abgefragt und geben Daten zurück.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Fensternavigationsregeln", 
			    "descr": "Erstellen und verwalten Sie Fensternavigationsregeln. Fensternavigationsregeln definieren die Interaktion zwischen verschiedenen Steuerelementen in Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Sitzungszeilen", 
			    "descr": "Erstellen und verwalten Sie Sitzungszeilen. Sitzungszeilen definieren den Sitzungsnamen und die Sitzungsübersichtsinformationen in Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Agent-Skripte", 
		       "descr": "Erstellen und verwalten Sie Agent-Skript-Aufgaben und -Antworten. Agentskripting bietet Anweisungen für Agenten dazu, was sie bei Anrufen sagen sollten und welche die nächsten Schritte im Prozess sind.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Erstellen und verwalten Sie Scriptlets für Unified Service Desk. Scriptlets sind Ausschnitte von JavaScript, die im Kontext von Unified Service Desk ausgeführt werden.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulare", 
		       "descr": "Erstellen und verwalten Sie Formulare, in denen deklarative Formulardefinitionen gespeichert sind.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Optionen", 
		       "descr": "Erstellen und verwalten Sie Optionen für Unified Service Desk. Optionen sind Name-Wert-Paare, die von Komponenten verwendet werden können.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Benutzereinstellungen", 
		       "descr": "Erstellen und verwalten Sie Benutzereinstellungen für Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Anpassungsdatei", 
		       "descr": "Erstellen und verwalten Sie die komprimierte Datei (ZIP-Datei) mit den Anpassungsdateien, die für die benutzerdefinierte Konfiguration in Unified Service Desk benötigt werden.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguration", 
		       "descr": "Erstellen und verwalten Sie Konfigurationen für Unified Service Desk-Objekte, die verschiedenen Benutzern zugeordnet werden können.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Überwachungs- und Diagnoseeinstellungen", 
		       "descr": "Erstellen und verwalten Sie die Überwachungs- und Diagnoseeinstellungen für Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Anfügen", 
	    "doneButton": "Fertig", 
	    "attachButtonAltText": "Fügen Sie eine komprimierte Datei (ZIP-Datei) an, die die Anpassungsdateien enthält.", 
	    "doneButtonAltText": "Laden Sie die komprimierte Datei (ZIP-Datei) hoch, die die Anpassungsdateien enthält.", 
	    "deleteButtonAltText": "Entfernen Sie die komprimierte Datei (ZIP-Datei).", 
	    "deleteAttachmentTitle": "Angefügte Datei löschen", 
	    "fileValidationTitle": "Ungültiger Dateityp", 
	    "fileValidation": "Das Dateiformat ist ungültig. Angefügt werden können nur komprimierte Dateien im ZIP-Format. Komprimieren Sie Ihre Anpassungsdateien in einer ZIP-Datei, und wiederholen Sie anschließend den Anfügevorgang.\r\nUnified Service Desk extrahiert die Dateien aus der ZIP-Datei, um den Inhalt beim Starten der Clientanwendung zu laden.", 
	    "fileLabel": "DATEI", 
	    "deleteConfirmation": "Möchten Sie die angefügte Datei wirklich löschen?", 
	    "attachmentFailure": "Fehler beim Hochladen der Datei. Wiederholen Sie den Vorgang mit einer komprimierten Datei (ZIP-Datei)." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Wenn Sie diese Konfiguration als Standard auswählen, wird jegliche zuvor festgelegte Konfiguration überschrieben. Möchten Sie den Vorgang fortsetzen?", 
	    "OK": "Weiter", 
	    "Cancel": "Abbrechen", 
	    "title": "Möchten Sie diese Konfiguration als Standard festlegen?", 
	    "ErrorTitle": "Diese Konfiguration kann nicht als Standard festgelegt werden.", 
	    "ErrorMessage": "Nur aktive Konfigurationen können als Standard festgelegt werden. Wiederholen Sie den Vorgang, nachdem Sie die Konfiguration aktiviert haben.", 
	    "SetDefaultErrorMessage": "Die ausgewählte Konfiguration ist bereits als Standardkonfiguration festgelegt.", 
	    "inactiveCloneTitle": "Klonen des Datensatzes nicht möglich", 
	    "inactiveCloneAlert": "Inaktive Konfigurationsdatensätze können nicht geklont werden. Aktivieren Sie den Konfigurationsdatensatz, und wiederholen Sie anschließend den Vorgang.", 
	    "cloningError": "Fehler beim Klonen eines Datensatzes:", 
	    "okButton": "OK", 
	    "cloneTitle": "Vorhandene Konfiguration klonen", 
	    "cloneMessage": "Erstellen Sie eine neue Kopie dieser Konfiguration.\r\nFeldwerte und zugehörige Datensatzverweise aus der ursprünglichen Konfiguration werden geklont.\r\nBenutzer, die der ursprünglichen Konfiguration zugeordnet sind, werden nicht geklont.", 
	    "cloneButton": "Klonen", 
	    "cloneCancel": "Abbrechen", 
	    "copy": " – Kopie" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Verfügbare Werte", 
	    "selectedValues": "Ausgewählte Werte" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
