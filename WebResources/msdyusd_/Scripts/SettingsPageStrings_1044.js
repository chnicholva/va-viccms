Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Hvilket element vil du konfigurere?", 
	    "data": [
			{ 
			    "title": "Driftede kontroller", 
			    "descr": "Opprett og behandle driftede kontroller. Driftede kontroller er primærelementene som brukes til å bygge programmer ved hjelp av Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Verktøylinjer", 
			    "descr": "Opprett og behandle verktøylinjer og knapper for Unified Service Desk. Verktøylinjer inneholder knapper med bilder og tekst, og knappene brukes til å utføre handlinger.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Handlingskall", 
			    "descr": "Opprett og behandle handlingskall for Unified Service Desk. Handlingskall kan legges til i verktøylinjeknapper, hendelser, vindusnavigasjonsregler og agentskript.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Hendelser", 
			    "descr": "Opprett og behandle hendelser. Hendelser er varsler som en driftet kontroll utløser for å angi for programmet at noe skjer.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Enhetssøk", 
			    "descr": "Opprett og behandle enhetssøk. Enhetssøk er spørringer som returnerer data fra CRM-webtjenester.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Vindusnavigasjonsregler", 
			    "descr": "Opprett og behandle vindusnavigasjonsregler. Vindusnavigasjonsregler definerer samhandlingen mellom ulike kontroller i Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Øktlinjer", 
			    "descr": "Opprett og behandle øktlinjer. Øktlinjer definerer øktnavn og oversiktsinformasjon for økter i Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Agentskript", 
		       "descr": "Opprett og behandle oppgaver og svar for agentskript. Agentskripting gir veiledning til agenter om hva de skal si i samtaler, og informasjon om de neste trinnene i prosessen.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skriptleter", 
		       "descr": "Opprett og behandle skriptleter for Unified Service Desk. Skriptleter er JavaScript-kodesnutter som kjøres i sammenheng med Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Skjemaer", 
		       "descr": "Opprett og behandle skjemaer for lagring av forklarende skjemadefinisjoner.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Alternativer", 
		       "descr": "Opprett og behandle alternativer for Unified Service Desk. Alternativer er navn/verdi-par som kan brukes i komponenter.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Brukerinnstillinger", 
		       "descr": "Opprett og behandle brukerinnstillinger for Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Tilpassingsfil", 
		       "descr": "Opprett og administrer den komprimerte filen (.zip) som inneholder de nødvendige tilpassingsfilene for egendefinert konfigurasjon i Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurasjon", 
		       "descr": "Opprett og behandle konfigurasjoner for Unified Service Desk-aktiva som kan knyttes til forskjellige brukere.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Innstillinger for sporing av endringer og diagnose", 
		       "descr": "Opprett og behandle innstillinger for sporing av endringer og diagnose for Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Legg ved", 
	    "doneButton": "Ferdig", 
	    "attachButtonAltText": "Legg ved en komprimert fil (ZIP) som inneholder tilpassingsfilene.", 
	    "doneButtonAltText": "Last opp den komprimerte filen (ZIP) som inneholder tilpassingsfilene.", 
	    "deleteButtonAltText": "Fjern den komprimerte filen (ZIP).", 
	    "deleteAttachmentTitle": "Slett vedlagt fil", 
	    "fileValidationTitle": "Ugyldig filtype", 
	    "fileValidation": "Filformatet er ikke gyldig. Du kan bare legge ved en komprimert fil (ZIP). Komprimer tilpassingsfilene i en ZIP-fil, og prøv deretter å legge dem ved på nytt.\r\nUnified Service Desk pakker ut filer fra ZIP-filen for å laste inn innholdet når klientprogrammet startes.", 
	    "fileLabel": "FIL", 
	    "deleteConfirmation": "Er du sikker på at du vil slette den vedlagte filen?", 
	    "attachmentFailure": "Filopplasting mislyktes. Prøv igjen ved å velge en komprimert fil (ZIP) for opplasting." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Hvis du velger dette som standard, overstyres eventuelle tidligere angitte konfigurasjoner. Vil du fortsette?", 
	    "OK": "Fortsett", 
	    "Cancel": "Avbryt", 
	    "title": "Vil du angi denne konfigurasjonen som standard?", 
	    "ErrorTitle": "Denne konfigurasjonen kan ikke angis som standard.", 
	    "ErrorMessage": "Bare aktive konfigurasjoner kan angis som standard. Aktiver denne konfigurasjonen, og prøv på nytt.", 
	    "SetDefaultErrorMessage": "Den valgte konfigurasjonen er allerede standard.", 
	    "inactiveCloneTitle": "Kan ikke klone oppføring", 
	    "inactiveCloneAlert": "Du kan ikke klone en inaktiv konfigurasjonsoppføring. Aktiver konfigurasjonsoppføringen, og prøv på nytt.", 
	    "cloningError": "Det oppstod en feil under kloning av oppføring:", 
	    "okButton": "OK", 
	    "cloneTitle": "Klon eksisterende konfigurasjon", 
	    "cloneMessage": "Opprett en ny kopi av denne konfigurasjonen.\r\nFeltverdier og relaterte oppføringsreferanser fra den opprinnelige konfigurasjonen blir klonet.\r\nBrukere som er knyttet til den opprinnelige konfigurasjonen, blir ikke klonet.", 
	    "cloneButton": "Klon", 
	    "cloneCancel": "Avbryt", 
	    "copy": " – kopi" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Tilgjengelige verdier", 
	    "selectedValues": "Valgte verdier" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
