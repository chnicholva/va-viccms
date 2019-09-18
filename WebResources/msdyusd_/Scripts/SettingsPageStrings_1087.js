Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Қандай элементті конфигурациялау керек?", 
	    "data": [
			{ 
			    "title": "Орналастырылған басқарулар", 
			    "descr": "Орналастырылған басқару элементтерін жасау және басқару. Басқару элементтері Unified Service Desk пайдаланып, бағдарламаларды жасау үшін пайдаланылатын негізгі элемент болып табылады.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Құралдар тақтасы", 
			    "descr": "Unified Service Desk үшін құралдар тақталары мен түймешіктерді жасау және басқару. Құралдар тақталары суреттер мен мәтін бар түймешіктерге ие. Осы түймешіктер әрекеттерді орындау үшін пайдаланылады.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Әрекет қоңыраулары", 
			    "descr": "Unified Service Desk үшін әрекет шақыруларын жасау және басқару. Әрекет шақыруларын құралдар тақтасы түймешіктеріне, оқиғаларға, терезенің шарлау ережелеріне және агент сценарийлеріне қосуға болады.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Оқиғалар", 
			    "descr": "Оқиғаларды жасау және басқару. Оқиғалар - бұл бағдарламада мәселе пайда болғанын көрсететін орналастырылған басқару триггерлер хабарландырулары.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Нысан іздеулері", 
			    "descr": "Нысан іздеулерін жасау және басқару. Нысан іздеулері CRM веб-қызметтерінен деректерді қайтаруды сұрайды.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Терезені шарлау ережелері", 
			    "descr": "Терезенің шарлау ережелерін жасау және басқару. Терезенің шарлау ережелері Unified Service Desk қызметіндегі әртүрлі басқару элементтері арасындағы өзара байланысты анықтайды.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Сеанс жолдары", 
			    "descr": "СЕанс жолдарын жасау және басқару. Сеанс жолдары Unified Service Desk қызметінде сеанс атауы мен сеансты шолу ақпаратын анықтайды.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Агент сценарийлері", 
		       "descr": "Агент сценарийі тапсырмалары мен жауаптарын жасау және басқару. Агент сценарийі агенттерге олар қоңырауға қалай жауап беруі керектігі және процестегі келесі қадам туралы нұсқаулықты береді.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Скриплеттер", 
		       "descr": "Unified Service Desk қызметінің скриплеттерін жасау және басқару. Скриплеттер Unified Service Desk қызметінің мазмұнында орындалатын JavaScript қысқа мәліметтер.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Пішіндер", 
		       "descr": "Сипаттамалар пішінінің анықтамаларын сақтайтын пішіндерді жасау және басқару.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Параметрлер", 
		       "descr": "Unified Service Desk қызметі үшін параметрлерді жасау және басқару. Параметрлер - бұл құрамдастармен пайдалануға болатын атау мәнінің жұптары.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Пайдаланушы параметрлері", 
		       "descr": "Unified Service Desk қызметі үшін пайдаланушы параметрлерін жасау және басқару.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Теңшеу файлы", 
		       "descr": "Unified Service Desk бағдарламасында өзгертпелі конфигурациялау үшін қажетті теңшеу файлдарын қамтитын қысылған (.zip) файлды жасаңыз және басқарыңыз.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Конфигурация", 
		       "descr": "Әртүрлі пайдаланушылармен байланыстыруға болатын Unified Service Desk негізгі құралдары үшін конфигурацияларды жасау және басқару.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Тексеру және диагностикалау параметрлері", 
		       "descr": "Unified Service Desk бағдарламасына арналған тексеру және диагностикалау параметрлерін жасаңыз және басқарыңыз.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Тіркеу", 
	    "doneButton": "Дайын", 
	    "attachButtonAltText": "Теңшеу файлдарын қамтитын қысылған (.zip) файлды тіркеу.", 
	    "doneButtonAltText": "Теңшеу файлдарын қамтитын қысылған (.zip) файлды кері жүктеу.", 
	    "deleteButtonAltText": "Қысылған (.zip) файлды жою.", 
	    "deleteAttachmentTitle": "Тіркелген файлды жою", 
	    "fileValidationTitle": "Файл түрі жарамды емес", 
	    "fileValidation": "Файл пішімі жарамды емес. Тек қысылған (.zip) файлды тіркеуге болады. Реттеу файлдарын .zip файлына салып, тіркеу әрекетін қайталаңыз.\r\nUnified Service Desk бағдарламасы клиенттік бағдарлама іске қосылған кезде, мазмұндарды жүктеу үшін файлдарды .zip файлынан шығарып алады.", 
	    "fileLabel": "ФАЙЛ", 
	    "deleteConfirmation": "Тіркелген файлды шынымен жою керек пе?", 
	    "attachmentFailure": "Файл кері жүктелмеді. Қысылған (.zip) файлды таңдап, кері жүктеу әрекетін қайталаңыз." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Егер осы конфигурация әдепкі ретінде таңдалса, алдын орнатылған конфигурация қайта жазылады. Жалғастыру керек пе?", 
	    "OK": "Жалғастыру", 
	    "Cancel": "Бас тарту", 
	    "title": "Осы конфигурацияны әдепкі ретінде орнату керек пе?", 
	    "ErrorTitle": "Бұл конфигурацияны әдепкі ретінде орнату мүмкін емес.", 
	    "ErrorMessage": "Тек белсенді конфигурацияны әдепкі ретінде орнатуға болады. Оны белсендіріп, әрекетті қайталаңыз.", 
	    "SetDefaultErrorMessage": "Таңдалған конфигурация әдепкі ретінде орнатылып қойылған.", 
	    "inactiveCloneTitle": "Жазбаны көшіру мүмкін емес", 
	    "inactiveCloneAlert": "Белсенді емес конфигурация жазбасын көшіруге болмайды. Оны белсендіріп, әрекетті қайталаңыз.", 
	    "cloningError": "Жазбаны көшіру кезінде қате орын алды:", 
	    "okButton": "ОК", 
	    "cloneTitle": "Бұрыннан бар конфигурацияны көшіру", 
	    "cloneMessage": "Осы конфигурацияның жаңа көшірмесін жасау.\r\nБастапқы конфигурациядағы өріс мәндері мен қатысты жазба сілтемелері көшіріледі.\r\nБастапқы конфигурацияға байланыстырылған пайдаланушылар көшірілмейді.", 
	    "cloneButton": "Көшіру", 
	    "cloneCancel": "Бас тарту", 
	    "copy": " - Көшіру" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Қолжетімді мәндер", 
	    "selectedValues": "Таңдалған мәндер" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
