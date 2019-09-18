Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Koju stavku želite konfigurirati?", 
	    "data": [
			{ 
			    "title": "Hostirane kontrole", 
			    "descr": "Izradite i upravljajte hostiranim kontrolama. Hostirane kontrole su primarni elementi koji se koriste za izgradnju aplikacija pomoću modula Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Alatne trake", 
			    "descr": "Izradite i upravljajte alatnim trakama i gumbima za modul Unified Service Desk. Alatne trake sadrže gumbe sa slikama i tekstom, a gumbi se koriste za izvršavanje radnji.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Pozivi na akciju", 
			    "descr": "Izradite i upravljajte pozivima na akciju za modul Unified Service Desk. Pozivi na akciju mogu se dodati gumbima alatne trake, događajima, pravilima navigacije u prozoru i skriptama agenata.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Događaji", 
			    "descr": "Izradite i upravljajte događajima. Događaji su obavijesti koje okidači hostirane kontrole mogu pokrenuti kako bi aplikaciji dojavili da se nešto događa.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Pretraživanja entiteta", 
			    "descr": "Izradite i upravljajte pretraživanjima entiteta. Pretraživanja entiteta šalju upite web-servisima CRM-a za vraćanje podataka.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Pravila navigacije u prozoru", 
			    "descr": "Izradite i upravljajte pravilima navigacije u prozoru. Pravila navigacije u prozoru određuju interakciju u različitim kontrolama u modulu Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Retci sesije", 
			    "descr": "Izradite i upravljajte linijama sesije. Linije sesije određuju naziv sesije i pregled podataka sesije u modulu Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Skripte agenta", 
		       "descr": "Izradite i upravljajte zadacima i odgovorima agentskih skripti. Skriptiranje agenata nudi smjernice vezano uz to što moraju reći na telefonskom pozivu i koji su sljedeći koraci u postupku.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Miniskripte", 
		       "descr": "Izradite i upravljajte miniskriptama za modul Unified Service Desk. Miniskripte su isječci programskih jezika JavaScript koji se izvršavaju u kontekstu modula Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Obrasci", 
		       "descr": "Izradite i upravljajte obrascima koji pohranjuju definicije deklaracijskih obrazaca.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Mogućnosti", 
		       "descr": "Izradite i upravljajte opcijama za modul Unified Service Desk. Opcije su parovi vrijednosti naziva, a mogu ih koristiti komponente.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Korisničke postavke", 
		       "descr": "Stvorite i upravljajte korisničkim postavkama za modul Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Datoteka za prilagođavanje", 
		       "descr": "Stvorite i upravljajte komprimiranom (.zip) datotekom koja sadrži datoteke za prilagođavanje za prilagođenu konfiguraciju u aplikaciji Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguracija", 
		       "descr": "Izradite i upravljajte konfiguracijama za sredstva modula Unified Service Desk koja se povezuju s različitim korisnicima.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Postavke nadzora i dijagnostike", 
		       "descr": "Stvorite i upravljajte postavkama nadzora i dijagnostike za Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Priloži", 
	    "doneButton": "Gotovo", 
	    "attachButtonAltText": "Priložite komprimiranu (.zip) datoteka koja sadrži datoteke za prilagođavanje.", 
	    "doneButtonAltText": "Prenesite komprimiranu (.zip) datoteka koja sadrži datoteke za prilagođavanje.", 
	    "deleteButtonAltText": "Uklonite komprimiranu (.zip) datoteku.", 
	    "deleteAttachmentTitle": "Izbriši priloženu datoteku", 
	    "fileValidationTitle": "Nevaljani objekt FileType", 
	    "fileValidation": "Format datoteke nije valjan. Priložiti možete samo komprimiranu (.zip) datoteku. Komprimirajte datoteke za prilagođavanje u .zip datoteku pa ih pokušajte ponovno priložiti.\r\nUnified Service Desk izvući će datoteke iz .zip datoteke kako bi učitala sadržaje nakon pokretanja klijentske aplikacije.", 
	    "fileLabel": "DATOTEKA", 
	    "deleteConfirmation": "Jeste li sigurni da želite izbrisati priloženu datoteku?", 
	    "attachmentFailure": "Prijenos datoteke nije uspio. Pokušajte ponovno odabirući komprimiranu (.zip) datoteku za prijenos." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Odabirom ove konfiguracije kao zadane zamijenit će se prethodno postavljena konfiguracija. Želite li nastaviti?", 
	    "OK": "Nastavi", 
	    "Cancel": "Odustani", 
	    "title": "Želite li postaviti ovu konfiguraciju kao zadanu?", 
	    "ErrorTitle": "Ta konfiguracija ne može se postaviti kao zadana.", 
	    "ErrorMessage": "Samo se aktivne konfiguracije mogu postaviti kao zadane. Aktivirajte ovu konfiguraciju pa pokušajte ponovno.", 
	    "SetDefaultErrorMessage": "Odabrana konfiguracija već je postavljena kao zadana.", 
	    "inactiveCloneTitle": "Nije moguće klonirati zapis", 
	    "inactiveCloneAlert": "Ne možete klonirati neaktivni zapis konfiguracije. Aktivirajte zapis konfiguracije i pokušajte ponovno.", 
	    "cloningError": "Pojavila se pogreška tijekom kloniranja zapisa:", 
	    "okButton": "U redu", 
	    "cloneTitle": "Kloniranje postojeće konfiguracije", 
	    "cloneMessage": "Stvorite novu kopiju ove konfiguracije.\r\nPolja vrijednosti i povezane reference zapisa iz izvorne konfiguracije klonirat će se.\r\nKorisnici pridruženi izvornoj konfiguraciji neće se klonirati.", 
	    "cloneButton": "Kloniraj", 
	    "cloneCancel": "Odustani", 
	    "copy": " – Kopiraj" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Dostupne vrijednosti", 
	    "selectedValues": "Odabrane vrijednosti" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
