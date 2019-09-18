Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Кой елемент желаете да конфигурирате?", 
	    "data": [
			{ 
			    "title": "Хоствани контроли", 
			    "descr": "Създавайте и управлявайте хоствани контроли. Хостваните контроли са основните използвани елементи за компилиране на приложения с помощта на Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Ленти с инструменти", 
			    "descr": "Създавайте и управлявайте ленти с инструменти и бутони за Unified Service Desk. Лентите с инструменти съдържат бутони с изображения и текст, а бутоните се използват за изпълнение на действия.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Извиквания на действия", 
			    "descr": "Създавайте и управлявайте извиквания на действия за Unified Service Desk. Извикванията на действия може да се добавят към бутоните в лентите с инструменти, събитията, правилата за навигация в прозорци и скриптовете на агенти.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Събития", 
			    "descr": "Създавайте и управлявайте събития. Събитията са известия, които хостваната контрола активира, за да посочи на приложението, че нещо се случва.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Търсения за обекти", 
			    "descr": "Създавайте и управлявайте търсения за обекти. Търсенията за обекти изпращат заявки към уеб услугите в CRM за връщане на данни.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Правила за навигация в прозорците", 
			    "descr": "Създавайте и управлявайте правила за навигация в прозорците. Правилата за навигация в прозорците дефинират взаимодействието между различни контроли в Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Редове от сесия", 
			    "descr": "Създавайте и управлявайте редове от сесия. Редовете от сесия дефинират името на сесията и информацията в общия преглед на сесията в Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Скриптове на агент", 
		       "descr": "Създавайте и управлявайте задачи и отговори в скриптове на агент. Скриптовете на агент дават насоки на агентите за това, което трябва да казват по време на обаждания, както и за следващите стъпки в процеса.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Скриптлети", 
		       "descr": "Създавайте и управлявайте скриптлети за Unified Service Desk. Скриптлетите са откъси от JavaScript, които се изпълняват в контекста на Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Формуляри", 
		       "descr": "Създавайте и управлявайте формуляри, които съхраняват дефинициите за декларативен формуляр.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Опции", 
		       "descr": "Създавайте и управлявайте опции за Unified Service Desk. Опциите са двойки стойности на имена, които може да се използват от компонентите.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Потребителски настройки", 
		       "descr": "Създавайте и управлявайте потребителски настройки за Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Файл за персонализиране", 
		       "descr": "Създайте и управлявайте компресирания (.zip) файл, който съдържа необходимите файлове за персонализиране за конфигурацията по избор в Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Конфигурация", 
		       "descr": "Създавайте и управлявайте конфигурации за активите на Unified Service Desk, които може да се свързват с различни потребители.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Настройки за проверка и диагностика", 
		       "descr": "Създайте и управлявайте настройките за проверка и диагностика за Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Прикачване", 
	    "doneButton": "Готово", 
	    "attachButtonAltText": "Прикачете компресиран (.zip) файл, който съдържа файловете за персонализиране.", 
	    "doneButtonAltText": "Качете компресирания (.zip) файл, който съдържа файловете за персонализиране.", 
	    "deleteButtonAltText": "Премахнете компресирания (.zip) файл.", 
	    "deleteAttachmentTitle": "Изтриване на прикачен файл", 
	    "fileValidationTitle": "Невалиден FileType", 
	    "fileValidation": "Форматът на файла е невалиден. Можете да прикачвате само компресиран (.zip) файл. Компресирайте файловете за персонализация в .zip файл и след това опитайте да прикачите отново.\r\nUnified Service Desk ще извлече файловете от .zip файла, за да зареди съдържанието при стартиране на клиентското приложение.", 
	    "fileLabel": "ФАЙЛ", 
	    "deleteConfirmation": "Наистина ли искате да изтриете прикачения файл?", 
	    "attachmentFailure": "Неуспешно качване на файл. Опитайте отново, като изберете компресиран (.zip) файл за качване." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "С избора на тази конфигурация като конфигурация по подразбиране всички предишно зададени конфигурации ще бъдат заместени. Искате ли да продължите?", 
	    "OK": "Продължи", 
	    "Cancel": "Отказ", 
	    "title": "Желаете ли да зададете това като конфигурация по подразбиране?", 
	    "ErrorTitle": "Тази конфигурация не може да бъде зададена като конфигурация по подразбиране.", 
	    "ErrorMessage": "Само активните конфигурации могат да се задават като конфигурации по подразбиране. Активирайте тази конфигурация и след това опитайте отново.", 
	    "SetDefaultErrorMessage": "Избраната конфигурация вече е по подразбиране.", 
	    "inactiveCloneTitle": "Записът не може да бъде клониран", 
	    "inactiveCloneAlert": "Не може да се клонира неактивен запис на конфигурация. Активирайте записа на конфигурацията и опитайте отново.", 
	    "cloningError": "Възникна грешка при клонирането на запис:", 
	    "okButton": "ОК", 
	    "cloneTitle": "Клониране на съществуваща конфигурация", 
	    "cloneMessage": "Създайте ново копие на тази конфигурация.\r\nСтойностите на полета и свързаните справки за записи от оригиналната конфигурация ще бъдат клонирани.\r\nСвързаните потребители с оригиналната конфигурация няма да бъдат клонирани.", 
	    "cloneButton": "Клониране", 
	    "cloneCancel": "Отказ", 
	    "copy": " – Копие" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Налични стойности", 
	    "selectedValues": "Избрани стойности" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
