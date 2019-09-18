Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Quale elemento vuoi configurare?", 
	    "data": [
			{ 
			    "title": "Controlli ospitati", 
			    "descr": "Creazione e gestione dei controlli ospitati. I controlli ospitati sono gli elementi primari per la compilazione di applicazioni tramite Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Barre degli strumenti", 
			    "descr": "Creazione e gestione delle barre degli strumenti per Unified Service Desk. Le barre degli strumenti contengono pulsanti con immagini e testo. I pulsanti vengono usati per eseguire azioni.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Inviti all'azione", 
			    "descr": "Creazione e gestione di inviti all'azione per Unified Service Desk. Gli inviti all'azione possono essere aggiunti a pulsanti della barra degli strumenti, eventi, regole di spostamento finestra e script agente.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Eventi", 
			    "descr": "Creazione e gestione di eventi. Gli eventi sono notifiche che possono essere attivate da un controllo ospitato per indicare all'applicazione ciò che si verifica.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Ricerche in entità", 
			    "descr": "Creazione e gestione di ricerche in entità. Le ricerche in entità eseguono query sui servizi Web CRM per restituire dati.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Regole di spostamento finestra", 
			    "descr": "Creazione e gestione di regole di spostamento finestra. Le regole di spostamento finestra definiscono l'interazione tra diversi controlli in Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Righe sessione", 
			    "descr": "Creazione e gestione di righe sessione. Le righe sessione definiscono il nome della sessione e le informazioni generali sulla sessione in Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Script agente", 
		       "descr": "Creazione e gestione di attività e risposte degli script agente. Gli script agente forniscono agli agenti indicazioni su ciò che devono dire durante le telefonate e indicano i passaggi successivi nel processo.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlet", 
		       "descr": "Creazione e gestione di scriptlet per Unified Service Desk. Gli scriptlet sono frammenti di codice JavaScript eseguiti nel contesto di Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Moduli", 
		       "descr": "Creazione e gestione di moduli in cui sono archiviate le definizioni di moduli dichiarative.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opzioni", 
		       "descr": "Creazione e gestione di opzioni per Unified Service Desk. Le opzioni sono coppie di nome e valore che possono essere usate dai componenti.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Impostazioni utente", 
		       "descr": "Creazione e gestione di impostazioni utente per Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "File di personalizzazione", 
		       "descr": "Crea e gestisci il file compresso (.zip) che contiene i file di personalizzazione necessari per la configurazione personalizzata in Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configurazione", 
		       "descr": "Creazione e gestione di configurazioni per risorse di Unified Service Desk che possono essere associate a utenti diversi.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Impostazioni controllo e diagnostica", 
		       "descr": "Creazione e gestione delle impostazioni controllo e diagnostica per Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Allega", 
	    "doneButton": "Operazione completata", 
	    "attachButtonAltText": "Allega un file compresso (.zip) che contiene i file di personalizzazione.", 
	    "doneButtonAltText": "Carica il file compresso (.zip) che contiene i file di personalizzazione.", 
	    "deleteButtonAltText": "Rimuovi il file compresso (.zip).", 
	    "deleteAttachmentTitle": "Elimina file allegato", 
	    "fileValidationTitle": "Tipo di file non valido", 
	    "fileValidation": "Il formato del file non è valido. Puoi allegare solo un file compresso (.zip). Comprimi i file di personalizzazione in un file .zip, quindi prova ad allegare di nuovo.\r\nUnified Service Desk estrae file dal file .zip per caricare il contenuto quando viene avviata l'applicazione client.", 
	    "fileLabel": "FILE", 
	    "deleteConfirmation": "Vuoi eliminare questo file allegato?", 
	    "attachmentFailure": "Caricamento file non riuscito. Prova di nuovo selezionando un file compresso (.zip) da caricare." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "La selezione di questa opzione come predefinita sostituisce qualsiasi configurazione precedentemente impostata. Vuoi continuare?", 
	    "OK": "Continua", 
	    "Cancel": "Annulla", 
	    "title": "Vuoi impostare questa configurazione come predefinita?", 
	    "ErrorTitle": "Impossibile impostare la configurazione come predefinita.", 
	    "ErrorMessage": "Solo le configurazioni attive possono essere impostate come predefinite. Attiva questa configurazione e riprova.", 
	    "SetDefaultErrorMessage": "La configurazione selezionata è già quella predefinita.", 
	    "inactiveCloneTitle": "Non puoi clonare il record", 
	    "inactiveCloneAlert": "Impossibile clonare un record di configurazione inattivo. Attiva il record di configurazione e riprova.", 
	    "cloningError": "Errore durante la clonazione di un record:", 
	    "okButton": "OK", 
	    "cloneTitle": "Clona configurazione esistente", 
	    "cloneMessage": "Crea una nuova copia della configurazione.\r\nI valori dei campi e i riferimenti ai record correlati della configurazione originale verranno clonati.\r\nGli utenti associati alla configurazione originale non verranno clonati.", 
	    "cloneButton": "Clona", 
	    "cloneCancel": "Annulla", 
	    "copy": " - Copia" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Valori disponibili", 
	    "selectedValues": "Valori selezionati" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
