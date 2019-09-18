Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "‏‏ما العنصر الذي ترغب في تكوينه؟", 
	    "data": [
			{ 
			    "title": "عناصر التحكم المستضافة", 
			    "descr": "إنشاء عناصر التحكم المستضافة وإدارتها. تعد عناصر التحكم المستضافة عناصر أساسية تستخدم لإنشاء تطبيقات باستخدام Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "أشرطة الأدوات", 
			    "descr": "إنشاء أشرطة أدوات وأزرار لـ Unified Service Desk وإدارتها. تحتوي أشرطة الأدوات على أزرار تتضمن صورًا ونصوصًا، وأزرار يتم استخدامها لتنفيذ الإجراءات.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "استدعاءات الإجراءات", 
			    "descr": "إنشاء أشرطة أدوات واستدعاءات إجراءات لـ Unified Service Desk وإدارتها. يمكن إضافة استدعاءات الإجراءات إلى أزرار شريط الأدوات والأحداث وقواعد التنقل عبر النوافذ‬ والبرامج النصية للمندوب‬.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "الأحداث", 
			    "descr": "إنشاء الأحداث وإدارتها. الأحداث هي إعلامات يقوم عنصر التحكم المستضاف بتشغيلها ليشير للتطبيق أن شيئًا ما يحدث.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "عمليات البحث عن كيانات", 
			    "descr": "إنشاء عمليات البحث عن كيانات وإدارتها. تقوم عمليات البحث عن الكيانات باستعلام خدمات ويب CRM لإرجاع البيانات.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "قواعد التنقل عبر النوافذ", 
			    "descr": "إنشاء قواعد تنقل عبر النوافذ وإدارتها. تقوم قواعد التنقل عبر النوافذ بتحديد التفاعل بين عناصر التحكم المتنوعة في Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "سطور جلسة العمل", 
			    "descr": "إنشاء سطور جلسة العمل وإدارتها. تقوم سطور جلسة العمل بتحديد اسم جلسة العمل ومعلومات النظرة العامة على جلسة العمل في Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "البرامج النصية للمندوب", 
		       "descr": "إنشاء إجابات ومهام البرنامج النصي للمندوب وإدارتها. توفر البرمجة النصية للمندوب توجيهات للمندوبين حول ما يجب أن يقولوه في المكالمات أو الخطوات التالية في العملية.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "برامج ScriptLet النصية", 
		       "descr": "إنشاء برامج ScriptLet نصية لـ Unified Service Desk وإدارتها. ‏‫تعد برامج ScriptLet النصية أجزاءً من JavaScript التي يتم تنفيذها في بيئة Unified Service Desk.‬", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "النماذج", 
		       "descr": "إنشاء النماذج التي تخزن تعريفات نماذج توضيحية وإدارتها.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "خيارات", 
		       "descr": "إنشاء خيارات لـ Unified Service Desk وإدارتها. الخيارات هي أزواج لقيمة الاسم التي يمكن استخدامها عن طريق المكونات.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "إعدادات المستخدم", 
		       "descr": "إنشاء إعدادات المستخدم لـ Unified Service Desk وإدارتها.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "ملف التخصيص", 
		       "descr": "إنشاء الملف المضغوط‏‫ (‎.zip‎) الذي يحتوي على ملفات التخصيص المطلوبة للتكوين المخصص في Unified Service Desk وإدارته.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "التكوين", 
		       "descr": "إنشاء وإدارة تكوينات لأصول Unified Service Desk التي يمكن إقرانها بمستخدمين مختلفين.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "إعدادات التدقيق وعمليات التشخيص", 
		       "descr": "إنشاء إعدادات التدقيق وعمليات التشخيص لـ Unified Service Desk وإدارتها.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "إرفاق", 
	    "doneButton": "تم", 
	    "attachButtonAltText": "إرفاق ملف مضغوط (‎.zip) يحتوي على ملفات التخصيص.", 
	    "doneButtonAltText": "تحميل الملف المضغوط (‎.zip) الذي يحتوي على ملفات التخصيص.", 
	    "deleteButtonAltText": "إزالة الملف المضغوط (zip.).", 
	    "deleteAttachmentTitle": "حذف الملف المرفق", 
	    "fileValidationTitle": "اسم الملف غير صالح", 
	    "fileValidation": "تنسيق الملف غير صالح. يمكنك إرفاق ملف مضغوط (‎.zip‎) فقط. اضغط ملفات التخصيص الخاصة بك في ملف ‎.zip‎ وحاول إرفاقه مرة أخرى بعد ذلك.\r\nسيقوم Unified Service Desk باستخراج الملفات من ملف ‎.zip‎ لتحميل المحتويات عند بدء تشغيل تطبيق العميل.", 
	    "fileLabel": "الملف‬", 
	    "deleteConfirmation": "هل تريد بالفعل حذف الملف المرفق؟", 
	    "attachmentFailure": "فشل تحميل الملف. حاول مرة أخرى عن طريق تحديد ملف مضغوط (‎.zip‎) لتحميله." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "سيتجاوز تحديد هذا كافتراضي أي تكوين معيَّن مسبقًا. هل تريد المتابعة؟", 
	    "OK": "متابعة", 
	    "Cancel": "‏‏إلغاء", 
	    "title": "هل تريد تعيين هذا التكوين كتكوين افتراضي؟", 
	    "ErrorTitle": "لا يمكن تعيين هذا التكوين كتكوين افتراضي.", 
	    "ErrorMessage": "يمكن تعيين التكوينات النشطة فقط كتكوينات افتراضية. قم بتنشيط هذا التكوين، وحاول مرة أخرى.", 
	    "SetDefaultErrorMessage": "التكوين المحدد هو بالفعل التكوين الافتراضي.", 
	    "inactiveCloneTitle": "لا يمكن استنساخ السجل", 
	    "inactiveCloneAlert": "‏‏لا يمكنك استنساخ سجل تكوين غير نشط. قم بتنشيط سجل التكوين، وحاول مرة أخرى.", 
	    "cloningError": "حدث خطأ عند استنساخ سجل:", 
	    "okButton": "موافق", 
	    "cloneTitle": "استنساخ التكوين الموجود", 
	    "cloneMessage": "قم بإنشاء نسخة جديدة من هذا التكوين.\r\nسيتم استنساخ قيم الحقول ومراجع السجلات المرتبطة من التكوين الأصلي.\r\nلن يتم استنساخ المستخدمين المقترنين بالتكوين الأصلي.", 
	    "cloneButton": "استنساخ‬", 
	    "cloneCancel": "‏‏إلغاء", 
	    "copy": " - نسخ" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "القيم المتوفرة", 
	    "selectedValues": "القيم المحددة" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
