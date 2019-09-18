Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Minkä kohteen haluat määrittää?", 
	    "data": [
			{ 
			    "title": "Isännöidyt ohjausobjektit", 
			    "descr": "Luo ja hallitse isännöityjä ohjausobjekteja. Isännöidyt ohjausobjektit ovat ensisijaisia elementtejä, joita käytetään luotaessa sovelluksia Unified Service Deskin avulla.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Työkalurivit", 
			    "descr": "Luo ja hallitse Unified Service Deskin työkalurivejä ja painikkeita. Työkalurivit sisältävät painikkeita, joissa on kuvia ja tekstiä. Painikkeita käytetään toimintojen suorittamisessa.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Toimintokutsut", 
			    "descr": "Luo ja hallitse Unified Service Deskin toimintokutsuja. Toimintokutsuja voi lisätä työkalurivien painikkeisiin, tapahtumiin, ikkunan siirtymissääntöihin ja asiakaspalvelijan komentosarjoihin.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Tapahtumat", 
			    "descr": "Luo ja hallitse tapahtumia. Tapahtumat ovat ilmoituksia, joita isännöity ohjausobjekti käynnistää osoittaakseen sovellukselle, että jotain tapahtuu.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Entiteettihaut", 
			    "descr": "Luo ja hallitse entiteettihakuja. Entiteettihaut tekevät kyselyn CRM:n WWW-palveluista ja palauttavat tietoja.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Ikkunan siirtymissäännöt", 
			    "descr": "Luo ja hallitse ikkunan siirtymissääntöjä. Ikkunan siirtymissäännöt määrittävät Unified Service Deskin eri ohjausobjektien välisen yhteydenpidon.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Istunnon rivit", 
			    "descr": "Luo ja hallitse istunnon rivejä. Istunnon rivit määrittävät Unified Service Deskin istunnon nimen ja yleiskatsauksen tiedot.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Asiakaspalvelijan komentosarjat", 
		       "descr": "Luo ja hallitse asiakaspalvelijan komentosarjan tehtäviä ja vastauksia. Asiakaspalvelijan komentosarjojen avulla asiakaspalvelijat saatat opastusta siihen, mitä heidän tulee sanoa puheluiden aikana ja mitkä ovat prosessin seuraavat vaiheet.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Komentosarjasovelmat", 
		       "descr": "Luo ja hallitse Unified Service Deskin komentosarjasovelmia. Komentosarjasovelmat ovat JavaScriptin koodikatkelmia, jotka suoritetaan Unified Service Deskin kontekstissa.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Lomakkeet", 
		       "descr": "Luo ja hallitse lomakkeita, joihin tallennetaan sääntöpohjaisen lomakkeen määritykset.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Asetukset", 
		       "descr": "Luo ja hallitse Unified Service Deskin asetuksia. Asetukset ovat nimi-arvopareja, joita komponentit voivat käyttää.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Käyttäjäasetukset", 
		       "descr": "Luo ja hallitse Unified Service Deskin käyttäjäasetuksia.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Mukauttamistiedosto", 
		       "descr": "Luo ja hallitse pakattua .zip-tiedostoa, joka sisältää Unified Service Deskin mukautetussa määrityksessä tarvittavat mukauttamistiedostot.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Määritys", 
		       "descr": "Luo ja hallitse niiden Unified Service Desk -resurssien määrityksiä, jotka voidaan liittää eri käyttäjille.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Seurannan ja diagnostiikan asetukset", 
		       "descr": "Luo ja hallitse Unified Service Deskin seurannan ja diagnostiikan asetuksia.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Liitä", 
	    "doneButton": "Valmis", 
	    "attachButtonAltText": "Liitä pakattu .zip-tiedosto, joka sisältää mukauttamistiedostot.", 
	    "doneButtonAltText": "Lataa pakattu .zip-tiedosto, joka sisältää mukauttamistiedostot.", 
	    "deleteButtonAltText": "Poista pakattu .zip-tiedosto.", 
	    "deleteAttachmentTitle": "Poista liitetty tiedosto", 
	    "fileValidationTitle": "Virheellinen tiedostotyyppi", 
	    "fileValidation": "Tiedostomuoto on virheellinen. Voit liittää ainoastaan pakatun tiedoston (.zip). Pakkaa mukautustiedostot .zip-tiedostoon ja yritä sitten liittämistä uudelleen.\r\nUnified Service Desk lataa sisällön purkamalla tiedostot .zip-tiedostosta, kun asiakasohjelma käynnistetään.", 
	    "fileLabel": "TIEDOSTO", 
	    "deleteConfirmation": "Haluatko varmasti poistaa liitetyn tiedoston?", 
	    "attachmentFailure": "Tiedoston lataaminen epäonnistui. Yritä uudelleen valitsemalla ladattava pakattu .zip-tiedosto." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Tämän valitseminen oletusarvoksi ohittaa kaikki aiemmat määritykset. Haluatko jatkaa?", 
	    "OK": "Jatka", 
	    "Cancel": "Peruuta", 
	    "title": "Haluatko asettaa tämän määrityksen oletusarvoksi?", 
	    "ErrorTitle": "Tätä määritystä ei voi asettaa oletusarvoksi.", 
	    "ErrorMessage": "Vain aktiiviset määritykset voidaan asettaa oletusarvoksi. Aktivoi tämä määritys ja yritä sitten uudelleen.", 
	    "SetDefaultErrorMessage": "Valittu määritys on jo oletusarvo.", 
	    "inactiveCloneTitle": "Tietuetta ei voi kloonata", 
	    "inactiveCloneAlert": "Passiivista määritystietuetta ei voi kloonata. Aktivoi määritystietue ja yritä uudelleen.", 
	    "cloningError": "Virhe tietueen kloonauksen aikana:", 
	    "okButton": "OK", 
	    "cloneTitle": "Kloonaa olemassa oleva määritys", 
	    "cloneMessage": "Luo uusi kopio tästä määrityksestä.\r\nAlkuperäisen määrityksen kenttäarvot ja liittyvät tietueviittaukset kloonataan.\r\nAlkuperäiseen määritykseen liittyviä käyttäjiä ei kloonata.", 
	    "cloneButton": "Klooni", 
	    "cloneCancel": "Peruuta", 
	    "copy": " - Kopioi" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Arvoja käytettävissä", 
	    "selectedValues": "Valitut arvot" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
