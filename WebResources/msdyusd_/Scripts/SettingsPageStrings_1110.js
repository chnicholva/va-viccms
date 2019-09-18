Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Que elemento desexa configurar?", 
	    "data": [
			{ 
			    "title": "Controis aloxados", 
			    "descr": "Cree e xestione controis aloxados. Os controis aloxados son os elementos primarios utilizados para crear aplicacións mediante Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Barras de ferramentas", 
			    "descr": "Cree e xestione barras de ferramentas e botóns para Unified Service Desk. As barras de ferramentas conteñen botóns con imaxes e texto, e os botóns utilízanse para executar accións.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Chamadas de acción", 
			    "descr": "Cree e xestione chamadas de acción para Unified Service Desk. As chamadas de acción poden engadirse a botóns de barras de ferramentas, eventos, regras de navegación de ventás e scripts de axentes.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Eventos", 
			    "descr": "Cree e xestione eventos. Os eventos son notificacións que desencadea un control aloxado para indicarlle á aplicación que algo está a ocorrer.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Buscas de entidades", 
			    "descr": "Cree e xestione buscas de entidades. As buscas de entidade consultan os servizos web de CRM para devolver datos.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Regras de navegación da ventá", 
			    "descr": "Cree e xestione regras de navegación de ventás. As regras de navegación de ventás definen a interacción entre varios controis en Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Liñas de sesión", 
			    "descr": "Cree e xestione liñas de sesión. As liñas de sesión definen o nome da sesión e a información de visión xeral da sesión en Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Scripts de axente", 
		       "descr": "Cree e xestione tarefas e respostas de script de axente. Os scripts de axente fornecen instrucións aos axentes sobre o que deben dicir nas chamadas e cales son os seguintes pasos do proceso.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Cree e xestione scriptlets para Unified Service Desk. Os scriptlets son fragmentos de JavaScript que se executan no contexto de Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formularios", 
		       "descr": "Cree e xestione formularios que almacenen definicións de formularios declarativas.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opcións", 
		       "descr": "Cree e xestione opcións para Unified Service Desk. As opcións son pares de nome e valor que poden ser usadas polos compoñentes.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Configuración de usuario", 
		       "descr": "Cree e xestione a configuración do usuario para Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Ficheiro de personalización", 
		       "descr": "Cree e xestione o ficheiro comprimido (.zip) que contén os ficheiros de personalización necesarios para a configuración personalizada en Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configuración", 
		       "descr": "Cree e xestione configuracións para recursos de Unified Service Desk que se poidan asociar a usuarios diferentes.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Configuración de auditoría e diagnósticos", 
		       "descr": "Cree e xestione a configuración de auditoría e diagnósticos de Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Anexar", 
	    "doneButton": "Feito", 
	    "attachButtonAltText": "Anexe un ficheiro comprimido (.zip) que contén os ficheiros de personalización.", 
	    "doneButtonAltText": "Cargue o ficheiro comprimido (.zip) que contén os ficheiros de personalización.", 
	    "deleteButtonAltText": "Elimine o ficheiro comprimido (.zip).", 
	    "deleteAttachmentTitle": "Eliminar ficheiro anexado", 
	    "fileValidationTitle": "Tipo de ficheiro non válido", 
	    "fileValidation": "Este formato de ficheiro non é válido. Só pode anexar un ficheiro (.zip) comprimido. Comprima os seus ficheiros de personalización nun ficheiro .zip e tente anexalo de novo.\r\nUnified Service Desk extraerá os ficheiros do .zip para cargar os contidos cando se inicie a aplicación do cliente.", 
	    "fileLabel": "FICHEIRO", 
	    "deleteConfirmation": "Está seguro de que quere eliminar o ficheiro anexado?", 
	    "attachmentFailure": "Non se puido cargar o ficheiro. Ténteo de novo mediante a selección do ficheiro comprimido (.zip) que quere cargar." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Ao seleccionar esta opción como predefinida, anularase calquera configuración establecida anteriormente. Quere continuar?", 
	    "OK": "Continuar", 
	    "Cancel": "Cancelar", 
	    "title": "Quere establecer esta configuración como a predefinida?", 
	    "ErrorTitle": "Esta configuración non se pode establecer como predefinida.", 
	    "ErrorMessage": "Só se poden establecer como predefinidas as configuracións activas. Active esta configuración e ténteo de novo.", 
	    "SetDefaultErrorMessage": "A configuración seleccionada xa é a predefinida.", 
	    "inactiveCloneTitle": "Non se pode clonar o rexistro", 
	    "inactiveCloneAlert": "Non pode clonar un rexistro de configuración inactivo. Active o rexistro de configuración e ténteo de novo.", 
	    "cloningError": "Produciuse un erro ao clonar un rexistro:", 
	    "okButton": "Aceptar", 
	    "cloneTitle": "Clonar configuración existente", 
	    "cloneMessage": "Cree unha copia nova desta configuración.\r\nClonaranse os valores do campo e as referencias do rexistro relacionadas.\r\nNon se clonarán os usuarios asociados á configuración orixinal.", 
	    "cloneButton": "Clonar", 
	    "cloneCancel": "Cancelar", 
	    "copy": " - Copiar" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Valores dispoñibles", 
	    "selectedValues": "Valores seleccionados" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
