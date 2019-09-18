Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Який елемент потрібно настроїти?", 
	    "data": [
			{ 
			    "title": "Розміщені компоненти", 
			    "descr": "Створіть розміщені компоненти й керуйте ними. Розміщені компоненти є первинними елементами, що використовуються для розробки програм за допомогою платформи Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Панелі інструментів", 
			    "descr": "Створюйте панелі інструментів і кнопки для Unified Service Desk і керуйте ними. На панелях інструментів розташовані кнопки із зображеннями та текстом, і за їх допомогою виконуються дії.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Виклики дії", 
			    "descr": "Створюйте виклики дії для Unified Service Desk і керуйте ними. Виклики дії можна додавати до кнопок на панелях інструментів, подій, правил переходів між вікнами та сценаріїв агентів.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Події", 
			    "descr": "Створюйте події та керуйте ними. Події є сповіщеннями, які запускає розміщений компонент із метою повідомити програмі, що відбувається якась подія.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Пошуки сутностей", 
			    "descr": "Створюйте пошуки сутностей і керуйте ними. Пошуки сутностей надсилають запит до веб-служб CRM на повернення даних.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Правила переходу між вікнами", 
			    "descr": "Створюйте правила переходу між вікнами та керуйте ними. Ці правила визначають взаємодію між різними елементами керування в Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Рядки сеансу", 
			    "descr": "Створюйте рядки сеансу та керуйте ними. Рядки сеансу визначають назву сеансу та інформацію огляду сеансу в Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Сценарії агента", 
		       "descr": "Створюйте завдання й відповіді сценаріїв агента та керуйте ними. У сценаріях агента містяться вказівки для агентів з рекомендаціями, що відповідати на виклики та якою має бути послідовність дій.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Скриптлети", 
		       "descr": "Створюйте скриптлети для Unified Service Desk і керуйте ними. Сценарії є фрагментами JavaScript, які виконуються в контексті Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Форми", 
		       "descr": "Створюйте форми, що містять декларативні визначення форм, і керуйте ними.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Параметри", 
		       "descr": "Створюйте параметри для Unified Service Desk і керуйте ними. Параметри – це пари \"ім’я-значення\", які можуть використовуватися компонентами.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Настройки користувача", 
		       "descr": "Створюйте настройки користувача для Unified Service Desk і керуйте ними.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Файл настроювання", 
		       "descr": "Створіть стиснутий файл (.zip), який містить файли настроювання, необхідні для настроюваної конфігурації в Unified Service Desk, і керуйте ним.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Конфігурація", 
		       "descr": "Створюйте конфігурації для ресурсів Unified Service Desk і керуйте ними. Ресурси Unified Service Desk можуть бути пов’язані з різними користувачами.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Параметри діагностики та відстеження", 
		       "descr": "Створіть параметри діагностики та відстеження для Unified Service Desk і керуйте ними.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Вкласти", 
	    "doneButton": "Готово", 
	    "attachButtonAltText": "Вкладіть стиснутий файл (.zip), який містить файли настроювання.", 
	    "doneButtonAltText": "Передайте стиснутий файл (.zip), який містить файли настроювання.", 
	    "deleteButtonAltText": "Видаліть стиснутий файл (.zip).", 
	    "deleteAttachmentTitle": "Видалити вкладений файл", 
	    "fileValidationTitle": "Неприпустимий FileType", 
	    "fileValidation": "Неприпустимий формат файлу. Можна вкласти тільки стиснутий файл (.zip). Стисніть файли настроювань у файл .zip і повторіть спробу.\r\nUnified Service Desk видобуде файли із файлу .zip, щоб завантажити вміст, коли буде запущено клієнтську програму.", 
	    "fileLabel": "ФАЙЛ", 
	    "deleteConfirmation": "Справді видалити вкладений файл?", 
	    "attachmentFailure": "Не вдалося передати файл. Повторіть спробу, вибравши стиснутий файл (.zip) для передавання." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Вибір цих настройок за замовчування змінить раніше настроєну конфігурацію. Продовжити?", 
	    "OK": "Продовжити", 
	    "Cancel": "Скасувати", 
	    "title": "Установити цю конфігурацію як конфігурацію за замовчуванням?", 
	    "ErrorTitle": "Цю конфігурацію не можна установити як конфігурацію за замовчуванням.", 
	    "ErrorMessage": "Лише активні конфігурації можна установлювати як конфігурації за замовчуванням. Активуйте цю конфігурацію та повторіть спробу.", 
	    "SetDefaultErrorMessage": "Вибрана конфігурація вже використовується за замовчуванням.", 
	    "inactiveCloneTitle": "Не вдалося створити точну копію запису", 
	    "inactiveCloneAlert": "Створити точну копію неактивного запису конфігурації не можна. Активуйте запис конфігурації та повторіть спробу.", 
	    "cloningError": "Під час створення точної копії запису сталася помилка:", 
	    "okButton": "OK", 
	    "cloneTitle": "Створити точну копію наявної конфігурації", 
	    "cloneMessage": "Створіть нову копію цієї конфігурації.\r\nЗ оригінальної конфігурації буде створено точні копії значень полів і посилань пов’язаних записів.\r\nТочні копії користувачів, пов’язаних з оригінальною конфігурацією, створено не буде.", 
	    "cloneButton": "Точна копія", 
	    "cloneCancel": "Скасувати", 
	    "copy": " – Копіювати" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Доступні значення", 
	    "selectedValues": "Вибрані значення" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
