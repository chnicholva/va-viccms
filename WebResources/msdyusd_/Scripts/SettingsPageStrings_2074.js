Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Koju stavku želite da konfigurišete?", 
	    "data": [
			{ 
			    "title": "Hostovane kontrole", 
			    "descr": "Kreirajte hostovane kontrole i upravljajte njima. Hostovane kontrole su primarni elementi koji se koriste za kreiranje aplikacija pomoću usluge Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Trake sa alatkama", 
			    "descr": "Kreirajte trake sa alatkama i dugmad i upravljajte njima za uslugu Unified Service Desk. Trake sa alatkama sadrže dugmad sa slikama i tekstom i koriste se za izvršavanje radnji.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Pozivanja akcije", 
			    "descr": "Kreirajte pozivanja akcija i upravljajte njima za uslugu Unified Service Desk. Pozivanja akcija je moguće dodati dugmadi trake sa alatkama, događajima, pravilima za navigaciju u prozoru i skriptama agenta.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Događaji", 
			    "descr": "Kreirajte događaje i upravljajte njima. Događaji su obaveštenja koja hostovana kontrola pokreće kako bi ukazala aplikaciji na to da se nešto dešava.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Pretrage entiteta", 
			    "descr": "Kreirajte pretrage entiteta i upravljajte njima. Pretrage entiteta šalju upit CRM Veb uslugama kako bi dobile podatke.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Pravila za navigaciju u prozoru", 
			    "descr": "Kreirajte pravila za navigaciju u prozoru i upravljajte njima. Pravila za navigaciju u prozoru definišu interakciju između različitih kontrola u usluzi Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Redovi sesije", 
			    "descr": "Kreirajte redove sesije i upravljajte njima. Redovi sesije definišu ime sesije i informacije o pregledu sesije u usluzi Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Skripte agenta", 
		       "descr": "Kreirajte skripte agenta i upravljajte njima. Izvršavanje skripti agenta pruža agentima uputstva o tome šta treba da kažu u pozivima i koji su sledeći koraci u procesu.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Mini-skripte", 
		       "descr": "Kreirajte mini-skripte i upravljajte njima za uslugu Unified Service Desk. Mini-skripte su odlomci platforme JavaScript koji se izvršavaju u kontekstu usluge Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Obrasci", 
		       "descr": "Kreirajte obrasce u kojima se skladište jasne definicije obrazaca i upravljajte njima.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opcije", 
		       "descr": "Kreirajte opcije i upravljajte njima za uslugu Unified Service Desk. Opcije su parovi imena i vrednosti koje mogu da koriste komponente.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Korisničke postavke", 
		       "descr": "Kreirajte korisničke postavke i upravljajte njima za uslugu Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Datoteka prilagođavanja", 
		       "descr": "Kreirajte i koristite komprimovanu (.zip) datoteku koja sadrži datoteke prilagođavanja neophodne za prilagođenu konfiguraciju usluge Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurisanje", 
		       "descr": "Kreirajte konfiguracije i upravljajte njima za sredstva usluge Unified Service Desk koja mogu da budu povezana sa različitim korisnicima.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Podešavanja nadgledanja i dijagnostike", 
		       "descr": "Kreirajte podešavanja nadgledanja i dijagnostike i upravljajte njima za uslugu Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Priloži", 
	    "doneButton": "Obavljeno", 
	    "attachButtonAltText": "Priložite komprimovanu (.zip) datoteku koja sadrži datoteke prilagođavanja.", 
	    "doneButtonAltText": "Otpremite komprimovanu (.zip) datoteku koja sadrži datoteke prilagođavanja.", 
	    "deleteButtonAltText": "Uklonite komprimovanu (.zip) datoteku.", 
	    "deleteAttachmentTitle": "Izbrišite priloženu datoteku", 
	    "fileValidationTitle": "Nevažeći FileType", 
	    "fileValidation": "Format datoteke nije važeći. Možete da priložite samo komprimovanu (.zip) datoteku. Komprimujte datoteke prilagođavanja u .zip datoteku, a zatim ponovo pokušajte da ih priložite.\r\nUnified Service Desk će izdvojiti datoteke iz .zip datoteke i učitati sadržaj kada se pokrene klijentska aplikacija.", 
	    "fileLabel": "DATOTEKA", 
	    "deleteConfirmation": "Želite li zaista da izbrišete priloženu datoteku?", 
	    "attachmentFailure": "Otpremanje datoteke nije uspelo. Pokušajte ponovo tako što ćete izabrati komprimovanu (.zip) datoteku za otpremanje." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Izborom ove konfiguracije kao podrazumevane zameniće se prethodno podešena konfiguracija. Želite li da nastavite?", 
	    "OK": "Nastavi", 
	    "Cancel": "Otkaži", 
	    "title": "Želite li da postavite ovu konfiguraciju kao podrazumevanu?", 
	    "ErrorTitle": "Nije moguće postaviti ovu konfiguraciju kao podrazumevanu.", 
	    "ErrorMessage": "Samo aktivne konfiguracije mogu da se postave kao podrazumevane. Aktivirajte ovu konfiguraciju, a zatim pokušajte ponovo.", 
	    "SetDefaultErrorMessage": "Izabrana konfiguracija je već podrazumevana.", 
	    "inactiveCloneTitle": "Nije moguće klonirati zapis", 
	    "inactiveCloneAlert": "Ne možete da klonirate neaktivni zapis konfiguracije. Aktivirajte zapis konfiguracije i pokušajte ponovo.", 
	    "cloningError": "Došlo je do greške tokom kloniranja zapisa:", 
	    "okButton": "U redu", 
	    "cloneTitle": "Kloniraj postojeću konfiguraciju", 
	    "cloneMessage": "Kreiraj novu kopiju za ovu konfiguraciju.\r\nVrednosti polja i povezane reference zapisa iz prvobitne konfiguracije će biti klonirani.\r\nKorisnici povezani sa prvobitnom konfiguracijom neće biti klonirani.", 
	    "cloneButton": "Kloniraj", 
	    "cloneCancel": "Otkaži", 
	    "copy": "- Kopiraj" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Dostupne vrednosti", 
	    "selectedValues": "Izabrane vrednosti" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
