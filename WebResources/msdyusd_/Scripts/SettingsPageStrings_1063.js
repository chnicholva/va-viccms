Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Kurį elementą norite konfigūruoti?", 
	    "data": [
			{ 
			    "title": "Nuomojami valdikliai", 
			    "descr": "Kurkite ir tvarkykite nuomojamus valdiklius. Nuomojami valdikliai yra pagrindiniai elementai, naudojami taikomosioms programoms kurti naudojant „Unified Service Desk“.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Įrankių juostos", 
			    "descr": "Kurkite ir tvarkykite įrankių juostas ir mygtukus, skirtus „Unified Service Desk“. Įrankių juostose yra mygtukų su vaizdais ir tekstu. Mygtukai naudojami veiksmams atlikti.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Veiksmų iškvietimai", 
			    "descr": "Kurkite ir tvarkykite veiksmų iškvietimus, skirtus „Unified Service Desk“. Veiksmų iškvietimus galima pridėti prie įrankių juostos mygtukų, įvykių, lango naršymo taisyklių ir agentų scenarijų.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Įvykiai", 
			    "descr": "Kurkite ir tvarkykite įvykius. Įvykiai yra informaciniai pranešimai, kuriuos nuomojamas valdiklis aktyvina, nurodydamas taikomajai programai, kad kažkas vyksta.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Objekto ieškos", 
			    "descr": "Kurkite ir tvarkykite objekto ieškas. Objekto ieškos naudojamos norint gauti duomenų iš CRM žiniatinklio tarnybų.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Lango naršymo taisyklės", 
			    "descr": "Kurkite ir tvarkykite lango naršymo taisykles. Lango naršymo taisyklėmis apibrėžiama įvairių „Unified Service Desk“ valdiklių sąveika.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Seanso eilutės", 
			    "descr": "Kurkite ir tvarkykite seanso eilutes. Seanso eilutėmis nurodomas seanso pavadinimas ir seanso apžvalgos informacija „Unified Service Desk“.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Agento scenarijai", 
		       "descr": "Kurkite ir tvarkykite agento scenarijų užduotis ir atsakymus. Agento scenarijuose pateikiami nurodymai agentams, ką jie turi sakyti per pokalbius telefonu ir kokie yra tolesni veiksmai.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scenarijaus programėlės", 
		       "descr": "Kurkite ir tvarkykite scenarijaus programėles, skirtas „Unified Service Desk“. Scenarijaus programėlės yra „JavaScript“ fragmentai, vykdomi „Unified Service Desk“ kontekste.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formos", 
		       "descr": "Kurkite ir tvarkykite formas, kuriose saugomi deklaratyvūs formų aprašai.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Parinktys", 
		       "descr": "Kurkite ir tvarkykite parinktis, skirtas „Unified Service Desk“. Parinktys yra pavadinimo ir reikšmės poros, kurias gali naudoti komponentai.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Vartotojo parametrai", 
		       "descr": "Kurkite ir tvarkykite „Unified Service Desk“ vartotojo parametrus.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Tinkinimo failas", 
		       "descr": "Kurkite ir tvarkykite suglaudintą (.zip) failą, kuriame yra tinkinimo failų, reikalingų pasirinktinei konfigūracijai „Unified Service Desk“.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigūracija", 
		       "descr": "Kurkite ir tvarkykite „Unified Service Desk“ išteklių, kuriuos galima susieti su skirtingais vartotojais, konfigūracijas.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Audito ir diagnostikos parametrai", 
		       "descr": "Kurkite ir tvarkykite audito ir diagnostikos parametrus, skirtus „Unified Service Desk“.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Pridėti", 
	    "doneButton": "Atlikta", 
	    "attachButtonAltText": "Pridėkite suglaudintą (.zip) failą, kuriame yra tinkinimo failų.", 
	    "doneButtonAltText": "Nusiųskite suglaudintą (.zip) failą, kuriame yra tinkinimo failų.", 
	    "deleteButtonAltText": "Pašalinkite suglaudintą (.zip) failą.", 
	    "deleteAttachmentTitle": "Naikinti pridėtą failą", 
	    "fileValidationTitle": "Netinkamas FileType", 
	    "fileValidation": "Failo formatas neleistinas. Galite pridėti tik suglaudintą („.zip“) failą. Suglaudinkite tinkinimo failus į „.zip“ failą, tada bandykite pridėti dar kartą.\r\n„Unified Service Desk“ išskleis failus iš „.zip“ failo, kad įkeltų turinį, kai kliento programa paleidžiama.", 
	    "fileLabel": "FAILAS", 
	    "deleteConfirmation": "Ar tikrai norite panaikinti pridėtą failą?", 
	    "attachmentFailure": "Failo nusiųsti nepavyko. Bandykite dar kartą pasirinkę suglaudintą (.zip) failą, kurį norite nusiųsti." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Pasirinkus tai kaip numatytąją vertę bus perrašytos visos anksčiau nustatytos konfigūracijos. Ar norite tęsti?", 
	    "OK": "Tęsti", 
	    "Cancel": "Atšaukti", 
	    "title": "Ar norite nustatyti šią konfigūraciją kaip numatytąją?", 
	    "ErrorTitle": "Ši konfigūracija negali būti nustatyta kaip numatytoji.", 
	    "ErrorMessage": "Tik aktyviosios konfigūracijos gali būti nustatytos kaip numatytosios. Suaktyvinkite šią konfigūraciją, o tada bandykite dar kartą.", 
	    "SetDefaultErrorMessage": "Pasirinkta konfigūracija jau yra numatytoji.", 
	    "inactiveCloneTitle": "Įrašo klonuoti negalima", 
	    "inactiveCloneAlert": "Negalite klonuoti neaktyviojo konfigūracijos įrašo. Suaktyvinkite konfigūracijos įrašą ir bandykite dar kartą.", 
	    "cloningError": "Klonuojant įrašą įvyko klaida:", 
	    "okButton": "Gerai", 
	    "cloneTitle": "Klonuoti esamą konfigūraciją", 
	    "cloneMessage": "Sukurkite naują šios konfigūracijos kopiją.\r\nBus klonuotos laukų reikšmės ir susijusių įrašų nuorodos iš pradinės konfigūracijos.\r\nSu pradine konfigūracija susieti vartotojai klonuoti nebus.", 
	    "cloneButton": "Klonuoti", 
	    "cloneCancel": "Atšaukti", 
	    "copy": " – Kopijuoti" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Galimos reikšmės", 
	    "selectedValues": "Pasirinktos reikšmės" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
