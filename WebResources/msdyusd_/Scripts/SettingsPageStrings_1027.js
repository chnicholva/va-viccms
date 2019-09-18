Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Quin element voleu configurar?", 
	    "data": [
			{ 
			    "title": "Controls allotjats", 
			    "descr": "Crea i administra els controls allotjats. Els controls allotjats són els elements principals utilitzats per crear aplicacions amb Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Barres d'eines", 
			    "descr": "Crea i administra les barres d'eines i els botons per al Unified Service Desk. Les barres d'eines contenen botons amb imatges i text i els botons s'utilitzen per executar accions.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Trucades d'acció", 
			    "descr": "Crea i administra trucades d'acció per al Unified Service Desk. Les trucades d'acció es poden afegir als botons de les barres d'eines, incidències, regles de navegació de finestres i scripts d'agents.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Incidències", 
			    "descr": "Crea i administra incidències. Les incidències són notificacions que un control allotjat desencadena per indicar a l'aplicació que està passant alguna cosa.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Cerques d'entitats", 
			    "descr": "Crea i administra cerques d'entitats. Les cerques d'entitats consulten els serveis web del CRM per retornar les dades.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Regles de navegació de finestra", 
			    "descr": "Crea i administra regles de navegació de finestres. Les regles de navegació de finestres defineixen la interacció entre diversos controls a Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Línies de sessió", 
			    "descr": "Crea i administra les línies de sessió. Les línies de sessió defineixen el nom de la sessió i la informació general de la sessió al Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Script de l'agent", 
		       "descr": "Crea i administra les tasques i respostes dels scripts d'agent. Els scripts d'agent proporcionen instruccions als agents sobre què han de dir a les trucades i quins sons els passos següents del procés.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Crea i administra scriptlets per a Unified Service Desk. Els scriptlets són fragments de JavaScript que s'executen en el context del Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formularis", 
		       "descr": "Crea i administra formularis que emmagatzemen definicions de formulari declaratives.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opcions", 
		       "descr": "Crea i administra opcions per al Unified Service Desk. Les opcions són parells de nom i valor que els components fan servir.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Configuració de l'usuari", 
		       "descr": "Crea i gestiona la configuració de l'usuari per a Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Fitxer de personalització", 
		       "descr": "Crea i administra el fitxer comprimit (.zip) que conté els fitxers de personalització necessaris per a la configuració personalitzada a l'Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configuració", 
		       "descr": "Crea i administra les configuracions per als actius del Unified Service Desk que es poden associar amb diferents usuaris.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Configuració d'auditoria i diagnòstic", 
		       "descr": "Crea i gestiona la configuració d'auditoria i diagnòstic per a l'Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Adjunta", 
	    "doneButton": "Fet", 
	    "attachButtonAltText": "Adjunta un fitxer comprimit (.zip) que conté els fitxers de personalització.", 
	    "doneButtonAltText": "Carrega el fitxer comprimit (.zip) que conté els fitxers de personalització.", 
	    "deleteButtonAltText": "Suprimeix el fitxer comprimit (.zip).", 
	    "deleteAttachmentTitle": "Suprimeix el fitxer adjuntat", 
	    "fileValidationTitle": "FileType no vàlid", 
	    "fileValidation": "El format del fitxer no és vàlid. Només podeu adjuntar un fitxer comprimit (.zip). Comprimiu els vostres fitxers de personalització en un fitxer .zip i, a continuació, proveu de tornar-lo a adjuntar.\r\nUnified Service Desk extraurà el fitxer .zip per carregar el contingut quan s'iniciï l'aplicació del client.", 
	    "fileLabel": "FITXER", 
	    "deleteConfirmation": "Esteu segur que voleu suprimir el fitxer adjuntat?", 
	    "attachmentFailure": "La càrrega del fitxer ha fallat. Torneu-ho a provar seleccionant el fitxer comprimit (.zip) que voleu carregar." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Si seleccioneu aquesta opció com a valor per defecte, qualsevol configuració definida prèviament se substituirà. Voleu continuar?", 
	    "OK": "Continua", 
	    "Cancel": "Cancel·la", 
	    "title": "Voleu definir aquesta configuració com a valor per defecte?", 
	    "ErrorTitle": "Aquesta configuració no es pot definir com a valor per defecte.", 
	    "ErrorMessage": "Només les configuracions actives es poden definir com a valor per defecte. Activeu aquesta configuració i torneu-ho a provar.", 
	    "SetDefaultErrorMessage": "La configuració seleccionada ja és el valor per defecte.", 
	    "inactiveCloneTitle": "El registre no es pot clonar", 
	    "inactiveCloneAlert": "No podeu clonar un registre de configuració inactiu. Activeu el registre de configuració i torneu-ho a provar.", 
	    "cloningError": "S'ha produït un error durant la clonació d'un registre:", 
	    "okButton": "D'acord", 
	    "cloneTitle": "Clona la configuració existent", 
	    "cloneMessage": "Crea una nova còpia d'aquesta configuració.\r\nEls valors de camp i les referències de registre relacionades de la configuració original es clonaran.\r\nEl usuaris associats amb la configuració original no es clonaran.", 
	    "cloneButton": "Clona", 
	    "cloneCancel": "Cancel·la", 
	    "copy": " - Copia" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Valors disponibles", 
	    "selectedValues": "Valors seleccionats" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
