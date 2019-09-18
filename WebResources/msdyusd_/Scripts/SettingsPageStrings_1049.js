Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Какой элемент следует настроить?", 
	    "data": [
			{ 
			    "title": "Размещенные элементы управления", 
			    "descr": "Создание размещенных элементов управления и управление ими. Размещенные элементы управления – это основные компоненты, используемые при создании приложений с помощью Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Панели инструментов", 
			    "descr": "Создание панелей инструментов и кнопок для Unified Service Desk и управление ими. Панели инструментов содержат кнопки с изображениями и текстом, а также кнопки, используемые для выполнения действий.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Вызовы действий", 
			    "descr": "Создание вызовов действий для Unified Service Desk и управление ими. Вызовы действий можно добавлять к кнопкам панели задач, событиям, правилам навигации по окнам и скриптам агентов.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "События", 
			    "descr": "Создание событий и управление ими. События представляют уведомления, которые размещенный элемент управления может инициировать, чтобы сообщить приложению о том или ином происшествии.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Поиски по сущностям", 
			    "descr": "Создание поисков по сущностям и управление ими. Поиски по сущностям осуществляют запрос к веб-службам CRM, возвращая данные.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Правила навигации по окнам", 
			    "descr": "Создание правил навигации по окнам и управление ими. Правила навигации по окнам определяют взаимодействие между различными элементами управления в Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Строки сеансов", 
			    "descr": "Создание строк сеансов и управление ими. Строки сеансов определяют имя сеанса и данные обзора сеанса в Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Скрипты агентов", 
		       "descr": "Создание задач и ответов скриптов агентов и управление ими. Скрипты агентов дают агентам указания относительно того, что следует говорить при телефонных звонках и какие дальнейшие действия следует принимать в процессе взаимодействия с клиентами.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Сценарии ScriptLet", 
		       "descr": "Создание сценариев Scriptlet для Unified Service Desk и управление ими. Сценарии Scriptlet – это фрагменты кода JavaScript, выполняемые в контексте Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Формы", 
		       "descr": "Создание форм, в которых хранятся декларативные определения форм, и управление ими.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Параметры", 
		       "descr": "Создание параметров для Unified Service Desk и управление ими. Параметры – это пары имя-значение, которые могут использоваться компонентами.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Параметры пользователя", 
		       "descr": "Создание параметров пользователей для Unified Service Desk и управление ими.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Файл настройки", 
		       "descr": "Создание и управление сжатым ZIP-файлом, содержащим файлы настроек, которые необходимы для собственной конфигурации Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Настройка", 
		       "descr": "Создание конфигураций для активов Unified Service Desk, которые могут быть связаны с различными пользователями, и управление ими.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Настройки аудита и диагностики", 
		       "descr": "Создание настроек аудита и диагностики для Unified Service Desk и управление ими.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Прикрепить", 
	    "doneButton": "Готово", 
	    "attachButtonAltText": "Прикрепить сжатый ZIP-файл, содержащий файлы настроек.", 
	    "doneButtonAltText": "Отправить сжатый ZIP-файл, содержащий файлы настроек.", 
	    "deleteButtonAltText": "Удалить сжатый ZIP-файл.", 
	    "deleteAttachmentTitle": "Удалить прикрепленный файл", 
	    "fileValidationTitle": "Недопустимый тип файла", 
	    "fileValidation": "Недопустимый формат файла. Для прикрепления можно использовать только сжатый ZIP-файл. Архивируйте свои файлы настроек в ZIP-файл, а затем прикрепите его снова.\r\nUnified Service Desk извлечет файлы из ZIP-файла для загрузки содержимого при запуске клиентского приложения.", 
	    "fileLabel": "ФАЙЛ", 
	    "deleteConfirmation": "Удалить прикрепленный файл?", 
	    "attachmentFailure": "Ошибка отправки файла. Выберите сжатый ZIP-файл и повторите попытку." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Если выбрать эту настройку как настройку по умолчанию, все ранее заданные конфигурации будут перезаписаны. Продолжить?", 
	    "OK": "Продолжить", 
	    "Cancel": "Отмена", 
	    "title": "Установить эту конфигурацию как конфигурацию по умолчанию?", 
	    "ErrorTitle": "Эту конфигурацию невозможно задать как конфигурацию по умолчанию.", 
	    "ErrorMessage": "По умолчанию можно задать только активные конфигурации. Активируйте эту конфигурацию и повторите попытку.", 
	    "SetDefaultErrorMessage": "Выбранная конфигурация уже является конфигурацией по умолчанию.", 
	    "inactiveCloneTitle": "Невозможно дублировать запись", 
	    "inactiveCloneAlert": "Невозможно дублировать неактивную запись конфигурации. Активируйте запись конфигурации и повторите попытку.", 
	    "cloningError": "Ошибка дублирования записи:", 
	    "okButton": "ОК", 
	    "cloneTitle": "Дублировать существующую конфигурацию", 
	    "cloneMessage": "Создать копию этой конфигурации.\r\nБудет выполнено дублирование значений полей и связанных ссылок на записи из оригинальной конфигурации.\r\nПользователи, связанные с оригинальной конфигурацией, дублированы не будут.", 
	    "cloneButton": "Дублировать", 
	    "cloneCancel": "Отмена", 
	    "copy": " — Копировать" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Доступные значения", 
	    "selectedValues": "Выбранные значения" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
