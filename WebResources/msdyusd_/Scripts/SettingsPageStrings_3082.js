Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "¿Qué elemento desea configurar?", 
	    "data": [
			{ 
			    "title": "Controles hospedados", 
			    "descr": "Cree y administre controles hospedados. Los controles hospedados son los elementos primarios usados para crear aplicaciones con Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Barras de herramientas", 
			    "descr": "Cree y administre barras de herramientas y botones para Unified Service Desk. Las barras de herramientas contienen botones con imágenes y texto, y los botones se usan para ejecutar acciones.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Llamadas a la acción", 
			    "descr": "Cree y administre llamadas a la acción para Unified Service Desk. Las llamadas a la acción se pueden agregar a los botones de la barra de herramientas, los eventos, las reglas de navegación de ventanas y los scripts de agente.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Eventos", 
			    "descr": "Cree y administre eventos. Los eventos son notificaciones que un control hospedado desencadena para indicar a la aplicación que está ocurriendo algo.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Búsquedas de entidades", 
			    "descr": "Cree y administre búsquedas de entidades. Las búsquedas de entidades consultan los servicios web de CRM para devolver datos.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Reglas de navegación de ventanas", 
			    "descr": "Cree y administre reglas de navegación de ventanas. Las reglas de navegación de ventanas definen la interacción entre varios controles de Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Líneas de sesión", 
			    "descr": "Cree y administre líneas de sesión. Las líneas de sesión definen el nombre y la información general de sesión de Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Scripts de agente", 
		       "descr": "Cree y administre tareas de script de agente y respuestas. Los scripts de agente proporcionan instrucciones a los agentes acerca de lo que deben decir en las llamadas y detallan los siguientes pasos del proceso.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Cree y administre scriptlets para Unified Service Desk. Los scriptlets son fragmentos de JavaScript que se ejecutan en el contexto de Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formularios", 
		       "descr": "Cree y administre formularios que almacenan definiciones de formularios declarativas.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opciones", 
		       "descr": "Cree y administre opciones para Unified Service Desk. Las opciones son pares de valores de nombres que pueden usar los componentes.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Configuración de usuarios", 
		       "descr": "Cree y administre la configuración de usuario para Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Archivo de personalización", 
		       "descr": "Cree y administre el archivo comprimido (.zip) que contiene los archivos de personalización necesarios para la configuración personalizada en Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configuración", 
		       "descr": "Cree y administre la configuración de los activos de Unified Service Desk que se pueden asociar a diferentes usuarios.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Configuración de diagnóstico y auditoría", 
		       "descr": "Cree y administre la configuración de diagnóstico y auditoría para Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Adjuntar", 
	    "doneButton": "Listo", 
	    "attachButtonAltText": "Adjunte un archivo comprimido (.zip) que contenga los archivos de personalización.", 
	    "doneButtonAltText": "Cargue el archivo comprimido (.zip) que contiene los archivos de personalización.", 
	    "deleteButtonAltText": "Quite el archivo comprimido (.zip).", 
	    "deleteAttachmentTitle": "Eliminar archivo adjunto", 
	    "fileValidationTitle": "FileType no válido", 
	    "fileValidation": "El formato de archivo no es válido. Solo puede adjuntar un archivo comprimido (.zip). Comprima los archivos de personalización en un archivo .zip y, a continuación, intente adjuntarlos de nuevo.\r\nUnified Service Desk extraerá los archivos del archivo .zip para cargar el contenido cuando se inicie la aplicación cliente.", 
	    "fileLabel": "ARCHIVO", 
	    "deleteConfirmation": "¿Está seguro de que desea eliminar el archivo adjunto?", 
	    "attachmentFailure": "No se pudo cargar el archivo. Inténtelo de nuevo seleccionando un archivo comprimido (.zip) para cargar." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Si selecciona esto como valor predeterminado, se reemplazará cualquier configuración establecida anteriormente. ¿Desea continuar?", 
	    "OK": "Continuar", 
	    "Cancel": "Cancelar", 
	    "title": "¿Desea establecer esta configuración como la predeterminada?", 
	    "ErrorTitle": "Esta configuración no se puede establecer como la predeterminada.", 
	    "ErrorMessage": "Solo se pueden establecer configuraciones activas como predeterminadas. Active esta configuración y, a continuación, inténtelo de nuevo.", 
	    "SetDefaultErrorMessage": "La configuración seleccionada ya es la predeterminada.", 
	    "inactiveCloneTitle": "No se puede clonar el registro", 
	    "inactiveCloneAlert": "No puede clonar un registro de configuración inactivo. Active el registro de configuración e inténtelo de nuevo.", 
	    "cloningError": "Error durante la clonación de un registro:", 
	    "okButton": "Aceptar", 
	    "cloneTitle": "Clonar configuración existente", 
	    "cloneMessage": "Cree una nueva copia de esta configuración.\r\nLos valores de campo y las referencias del registro relacionado de la configuración original se clonarán.\r\nLos usuarios asociados con la configuración original no se clonarán.", 
	    "cloneButton": "Clonar", 
	    "cloneCancel": "Cancelar", 
	    "copy": " - Copiar" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Valores disponibles", 
	    "selectedValues": "Valores seleccionados" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
