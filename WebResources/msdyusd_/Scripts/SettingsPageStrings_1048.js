Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Ce element doriți să configurați?", 
	    "data": [
			{ 
			    "title": "Controale găzduite", 
			    "descr": "Creați și gestionați controale găzduite. Controalele găzduite sunt elementele principale utilizate pentru construirea de aplicații folosind Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Bare de instrumente", 
			    "descr": "Creați și gestionați bare de instrumente și butoane pentru Unified Service Desk. Barele de instrumente conțin butoane cu imagini și text, iar butoanele sunt utilizate pentru a executa acțiuni.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Apeluri de acțiuni", 
			    "descr": "Creați și gestionați apeluri de acțiuni pentru Unified Service Desk. Apelurile de acțiuni se pot adăuga la butoane de pe bara de instrumente, la evenimente, la reguli de navigare în ferestre și la scripturi pentru agenți.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Evenimente", 
			    "descr": "Creați și gestionați evenimente. Evenimentele sunt notificări pe care le declanșează un control găzduit pentru a spune aplicației că se întâmplă ceva.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Căutări de entități", 
			    "descr": "Creați și gestionați căutări de entități. Acestea interoghează serviciile web CRM pentru a returna date.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Reguli de navigare fereastră", 
			    "descr": "Creați și gestionați reguli de navigare fereastră. Acestea definesc interacțiunea dintre diverse controale din Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Linii de sesiune", 
			    "descr": "Creați și gestionați linii de sesiune. Liniile de sesiune definesc numele sesiunii și informațiile de prezentare generală a sesiunii în Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Scripturi de agent", 
		       "descr": "Creați și gestionați activități și răspunsuri din scripturile de agent. Scriptarea de agent oferă îndrumări pentru agenți despre ceea ce ar trebui să spună în cadrul apelurilor sau care sunt următoarele etape ale procesului.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Instanțe Scriptlet", 
		       "descr": "Creați și gestionați scriptleturi pentru Unified Service Desk. Scriptleturile sunt fragmente JavaScript executate în contextul Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulare", 
		       "descr": "Creați și gestionați formulare care stochează definiții ale formularelor declarative.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opțiuni", 
		       "descr": "Creați și gestionați opțiuni pentru Unified Service Desk. Opțiunile sunt perechi de valori de nume care pot fi utilizate de componente.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Setări utilizator", 
		       "descr": "Creați și gestionați setările de utilizator pentru Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Fișier de particularizare", 
		       "descr": "Creați și gestionați fișierul comprimat (.zip) care conține fișierele de particularizare necesare pentru configurare particularizată în Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configurație", 
		       "descr": "Creați și gestionați configurații pentru bunurile Unified Service Desk care pot fi asociate cu diverși utilizatori.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Setări de auditare și diagnosticare", 
		       "descr": "Creați și gestionați setările de auditare și diagnosticare pentru Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Atașare", 
	    "doneButton": "Terminat", 
	    "attachButtonAltText": "Atașați un fișier comprimat (.zip) conține fișierele de particularizare.", 
	    "doneButtonAltText": "Încărcați fișierul comprimat (.zip) care conține fișierele de particularizare.", 
	    "deleteButtonAltText": "Eliminați fișierul (.zip) comprimat.", 
	    "deleteAttachmentTitle": "Ștergeți fișierul atașat", 
	    "fileValidationTitle": "Tip de fișier nevalid", 
	    "fileValidation": "Formatul de fișier nu este valid. Puteți atașa doar un fișier comprimat (.zip). Comprimați fișierele de particularizare într-un fișier .zip, apoi încercați din nou să atașați.\r\nUnified Service Desk va extrage fișierele din fișierul .zip pentru a încărca conținutul la pornirea aplicației client.", 
	    "fileLabel": "FIȘIER", 
	    "deleteConfirmation": "Sigur ștergeți fișierul atașat?", 
	    "attachmentFailure": "Încărcarea fișierului nu a reușit. Încercați din nou selectând un fișier comprimat (.zip) de încărcat." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Selectarea acestei opțiuni drept implicită va înlocui orice configurație setată anterior. Continuați?", 
	    "OK": "Continuare", 
	    "Cancel": "Anulați", 
	    "title": "Setați această configurație ca implicită?", 
	    "ErrorTitle": "Această configurație nu poate fi setată ca implicită.", 
	    "ErrorMessage": "Numai configurațiile active pot fi setate ca implicite. Activați această configurație și încercați din nou.", 
	    "SetDefaultErrorMessage": "Configurația selectată este deja implicită.", 
	    "inactiveCloneTitle": "Nu se poate clona înregistrarea", 
	    "inactiveCloneAlert": "Nu aveți posibilitatea să clonați o înregistrare de configurație inactivă. Activați înregistrarea de configurație și încercați din nou.", 
	    "cloningError": "A apărut o eroare la clonarea unei înregistrări:", 
	    "okButton": "OK", 
	    "cloneTitle": "Clonare​ configurație existentă", 
	    "cloneMessage": "Creați o copie nouă a acestei configurații.\r\nValorile de câmp și referințele la înregistrările asociate din configurația originală vor fi clonate.\r\nUtilizatorii asociați cu configurația originală nu vor fi clonați.", 
	    "cloneButton": "Clonare", 
	    "cloneCancel": "Anulați", 
	    "copy": " - Copiere" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Valori disponibile", 
	    "selectedValues": "Valori selectate" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
