Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Quel élément souhaitez-vous configurer ?", 
	    "data": [
			{ 
			    "title": "Contrôles hébergés", 
			    "descr": "Créez et gérez des contrôles hébergés. Les contrôles hébergés constituent des éléments principaux utilisés pour la génération d'applications à l'aide d'Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Barres d'outils", 
			    "descr": "Créez et gérez des barres d'outils et des boutons pour Unified Service Desk. Les barres d'outils contiennent des boutons avec des images et du texte. Ces boutons permettent d'exécuter des actions.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Appels à l'action", 
			    "descr": "Créez et gérez des appels à l'action pour Unified Service Desk. Les appels à l'action peuvent être ajoutés aux boutons de la barre d'outils, aux événements, aux règles de navigation dans la fenêtre et aux scripts de l'agent.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Événements", 
			    "descr": "Créez et gérez des événements. Les événements sont des notifications qu'un contrôle hébergé déclenche pour indiquer à l'application qu'une modification se produit.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Recherches d'entités", 
			    "descr": "Créez et gérez des recherches d'entités. Les recherches d'entités interrogent les services Web CRM pour renvoyer des données.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Règles de navigation dans la fenêtre", 
			    "descr": "Créez et gérez des règles de navigation dans la fenêtre. Les règles de navigation dans la fenêtre définissent l'interaction parmi différents contrôles dans Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Lignes de session", 
			    "descr": "Créez et gérez des lignes de session. Les lignes de session définissent des informations de nom de session et de vue d'ensemble de la session dans Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Scripts de l'agent", 
		       "descr": "Créez et gérez des réponses et des tâches de script d'agent. La génération de scripts d'agent donne des instructions aux agents quant à ce qu'ils doivent dire lors des appels et ce qu'ils doivent faire par la suite.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Créez et gérez des scriptlets pour Unified Service Desk. Les scriptlets sont des extraits de code JavaScript qui sont exécutés dans le cadre d'Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulaires", 
		       "descr": "Créez et gérez des formulaires qui stockent des définitions de formulaires déclaratifs.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Options", 
		       "descr": "Créez et gérez des options pour Unified Service Desk. Les options représentent des paires nom-valeur pouvant être utilisées par composants.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Paramètres utilisateur", 
		       "descr": "Créez et gérez des paramètres utilisateur pour Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Fichier de personnalisation", 
		       "descr": "Créez et gérez le fichier compressé (.zip) contenant les fichiers de personnalisation nécessaires pour la configuration personnalisée dans Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configuration", 
		       "descr": "Créez et gérez des configurations pour des biens Unified Service Desk pouvant être associés à différents utilisateurs.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Paramètres d'audit et de diagnostics", 
		       "descr": "Créez et gérez les paramètres d'audit et de diagnostics pour Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Joindre", 
	    "doneButton": "Terminé(e)", 
	    "attachButtonAltText": "Joignez un fichier compressé (.zip) contenant les fichiers de personnalisation.", 
	    "doneButtonAltText": "Téléchargez le fichier compressé (.zip) contenant les fichiers de personnalisation.", 
	    "deleteButtonAltText": "Supprimez le fichier compressé (.zip).", 
	    "deleteAttachmentTitle": "Supprimer le fichier joint", 
	    "fileValidationTitle": "Type de fichier non valide", 
	    "fileValidation": "Le format de fichier n'est pas valide. Vous pouvez joindre uniquement un fichier compressé (.zip). Compressez vos fichiers de personnalisation dans un fichier .zip, puis recommencez l'opération.\r\nUnified Service Desk extraira les fichiers du fichier .zip pour charger le contenu au démarrage de l'application cliente.", 
	    "fileLabel": "FICHIER", 
	    "deleteConfirmation": "Êtes-vous sûr de vouloir supprimer le fichier joint ?", 
	    "attachmentFailure": "Échec du téléchargement du fichier. Réessayez en sélectionnant un fichier compressé (.zip) à télécharger." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "La sélection de cette configuration comme valeur par défaut remplacera toute configuration précédemment définie. Voulez-vous continuer ?", 
	    "OK": "Continuer", 
	    "Cancel": "Annuler", 
	    "title": "Voulez-vous définir cette configuration comme valeur par défaut ?", 
	    "ErrorTitle": "Cette configuration ne peut pas être définie comme valeur par défaut.", 
	    "ErrorMessage": "Seules les configurations actives peuvent être définies comme valeur par défaut. Activez cette configuration, puis réessayez.", 
	    "SetDefaultErrorMessage": "La configuration sélectionnée est déjà définie comme valeur par défaut.", 
	    "inactiveCloneTitle": "Impossible de cloner l'enregistrement", 
	    "inactiveCloneAlert": "Vous ne pouvez pas cloner un enregistrement de configuration inactif. Activez l'enregistrement de configuration, puis réessayez.", 
	    "cloningError": "Une erreur s'est produite durant le clonage d'un enregistrement :", 
	    "okButton": "OK", 
	    "cloneTitle": "Cloner la configuration existante", 
	    "cloneMessage": "Créez une copie de cette configuration.\r\nLes valeurs de champ et les références d'enregistrement associées de la configuration d'origine seront clonées.\r\nLes utilisateurs associés à la configuration d'origine ne seront pas clonés.", 
	    "cloneButton": "Cloner", 
	    "cloneCancel": "Annuler", 
	    "copy": " - Copier" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Valeurs disponibles", 
	    "selectedValues": "Valeurs sélectionnées" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
