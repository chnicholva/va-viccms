Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Коју ставку желите да конфигуришете?", 
	    "data": [
			{ 
			    "title": "Хостоване контроле", 
			    "descr": "Креирајте хостоване контроле и управљајте њима. Хостоване контроле су примарни елементи који се користе за креирање апликација помоћу услуге Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Траке са алаткама", 
			    "descr": "Креирајте траке са алаткама и дугмад и управљајте њима за услугу Unified Service Desk. Траке са алаткама садрже дугмад са сликама и текстом и користе се за извршавање радњи.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Позивања акције", 
			    "descr": "Креирајте позивања акција и управљајте њима за услугу Unified Service Desk. Позивања акција је могуће додати дугмади траке са алаткама, догађајима, правилима за навигацију у прозору и скриптама агента.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Догађаји", 
			    "descr": "Креирајте догађаје и управљајте њима. Догађаји су обавештења која хостована контрола покреће како би указала апликацији на то да се нешто дешава.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Претраге ентитета", 
			    "descr": "Креирајте претраге ентитета и управљајте њима. Претраге ентитета шаљу упит CRM Веб услугама како би добиле податке.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Правила за навигацију у прозору", 
			    "descr": "Креирајте правила за навигацију у прозору и управљајте њима. Правила за навигацију у прозору дефинишу интеракцију између различитих контрола у услузи Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Редови сесије", 
			    "descr": "Креирајте редове сесије и управљајте њима. Редови сесије дефинишу име сесије и информације о прегледу сесије у услузи Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Скрипте агента", 
		       "descr": "Креирајте скрипте агента и управљајте њима. Извршавање скрипти агента пружа агентима упутства о томе шта треба да кажу у позивима и који су следећи кораци у процесу.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Мини-скрипте", 
		       "descr": "Креирајте мини-скрипте и управљајте њима за услугу Unified Service Desk. Мини-скрипте су одломци платформе JavaScript који се извршавају у контексту услуге Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Обрасци", 
		       "descr": "Креирајте обрасце у којима се складиште јасне дефиниције образаца и управљајте њима.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Опције", 
		       "descr": "Креирајте опције и управљајте њима за услугу Unified Service Desk. Опције су парови имена и вредности које могу да користе компоненте.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Корисничке поставке", 
		       "descr": "Креирајте корисничке поставке и управљајте њима за услугу Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Датотека прилагођавања", 
		       "descr": "Креирајте и користите компримовану (.zip) датотеку која садржи датотеке прилагођавања неопходне за прилагођену конфигурацију услуге Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Конфигурисање", 
		       "descr": "Креирајте конфигурације и управљајте њима за средства услуге Unified Service Desk која могу да буду повезана са различитим корисницима.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Подешавања надгледања и дијагностике", 
		       "descr": "Креирајте подешавања надгледања и дијагностике и управљајте њима за услугу Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Приложи", 
	    "doneButton": "Обављено", 
	    "attachButtonAltText": "Приложите компримовану (.zip) датотеку која садржи датотеке прилагођавања.", 
	    "doneButtonAltText": "Отпремите компримовану (.zip) датотеку која садржи датотеке прилагођавања.", 
	    "deleteButtonAltText": "Уклоните компримовану (.zip) датотеку.", 
	    "deleteAttachmentTitle": "Избришите приложену датотеку", 
	    "fileValidationTitle": "Неважећи FileType", 
	    "fileValidation": "Формат датотеке није важећи. Можете да приложите само компримовану (.zip) датотеку. Компримујте датотеке прилагођавања у .zip датотеку, а затим поново покушајте да их приложите.\r\nUnified Service Desk ће издвојити датотеке из .zip датотеке и учитати садржај када се покрене клијентска апликација.", 
	    "fileLabel": "ДАТОТЕКА", 
	    "deleteConfirmation": "Желите ли заиста да избришете приложену датотеку?", 
	    "attachmentFailure": "Отпремање датотеке није успело. Покушајте поново тако што ћете изабрати компримовану (.zip) датотеку за отпремање." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Избором ове конфигурације као подразумеване замениће се претходно подешена конфигурација. Желите ли да наставите?", 
	    "OK": "Настави", 
	    "Cancel": "Откажи", 
	    "title": "Желите ли да поставите ову конфигурацију као подразумевану?", 
	    "ErrorTitle": "Није могуће поставити ову конфигурацију као подразумевану.", 
	    "ErrorMessage": "Само активне конфигурације могу да се поставе као подразумеване. Активирајте ову конфигурацију, а затим покушајте поново.", 
	    "SetDefaultErrorMessage": "Изабрана конфигурација је већ подразумевана.", 
	    "inactiveCloneTitle": "Није могуће клонирати запис", 
	    "inactiveCloneAlert": "Не можете да клонирате неактивни запис конфигурације. Активирајте запис конфигурације и покушајте поново.", 
	    "cloningError": "Дошло је до грешке током клонирања записа:", 
	    "okButton": "У реду", 
	    "cloneTitle": "Клонирај постојећу конфигурацију", 
	    "cloneMessage": "Креирај нову копију за ову конфигурацију.\r\nВредности поља и повезане референце записа из првобитне конфигурације ће бити клонирани.\r\nКорисници повезани са првобитном конфигурацијом неће бити клонирани.", 
	    "cloneButton": "Клонирај", 
	    "cloneCancel": "Откажи", 
	    "copy": " - Копирај" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Доступне вредности", 
	    "selectedValues": "Изабране вредности" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
