Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "את התצורה של איזה פריט ברצונך לקבוע?", 
	    "data": [
			{ 
			    "title": "פקדים מתארחים", 
			    "descr": "צור ונהל פקדים מתארחים. פקדים מתארחים הם הרכיבים העיקריים המשמשים לבניית יישומים באמצעות Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "סרגלי כלים", 
			    "descr": "צור ונהל סרגלי כלים ולחצנים עבור Unified Service Desk. סרגלי כלים מכילים לחצנים עם תמונות וטקסט, ולחצנים משמשים לביצוע פעולות.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "קריאות לפעולה", 
			    "descr": "צור ונהל קריאות לפעולה עבור Unified Service Desk. ניתן להוסיף קריאות לפעולה ללחצני סרגל כלים, אירועים, כללי ניווט בחלונות‬ וקבצי Script של סוכן‬.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "אירועים", 
			    "descr": "צור ונהל אירועים. אירועים הם הודעות שפקד מתארח מפעיל כדי לציין ליישום כי משהו מתרחש.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "חיפושי ישויות", 
			    "descr": "צור ונהל ‏‫חיפושי ישויות. ‏‫חיפושי ישויות מבצעים שאילתה על שירותי האינטרנט של CRM כדי להחזיר נתונים.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "כללי ניווט בחלונות", 
			    "descr": "צור ונהל כללי ניווט בחלונות. כללי ניווט בחלונות מגדירים את האינטראקציה בין פקדים שונים ב- Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "שורות הפעלה", 
			    "descr": "צור ונהל שורות הפעלה. שורות הפעלה מגדירות פרטי שם הפעלה ומבט כולל על הפעלה‬ ב- Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "קבצי Script של סוכן", 
		       "descr": "צור ונהל משימות ותשובות של קבצי Script של סוכן. Scripting של סוכן נותן הדרכה לסוכנים על מה שעליהם לומר בשיחות ולגבי הצעדים הבאים בתהליך.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "רכיבי ScriptLet", 
		       "descr": "צור ונהל רכיבי ScriptLet עבור Unified Service Desk. רכיבי ScriptLet הם מקטעים של JavaScript המבוצעים בהקשר של Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "טפסים", 
		       "descr": "צור ונהל טפסים שבהם מאוחסנות הגדרות טופס הצהרתיות.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "אפשרויות", 
		       "descr": "צור ונהל אפשרויות עבור Unified Service Desk. אפשרויות הן זוגות של שמות וערכים שרכיבים יכולים להשתמש בהם.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "הגדרות משתמש", 
		       "descr": "צור ונהל הגדרות משתמש עבור Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "קובץ התאמה אישית", 
		       "descr": "צור ונהל את הקובץ הדחוס (‎.zip) המכיל את קבצי ההתאמה האישית שנדרשים עבור קביעת תצורה מותאמת אישית ב- Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "תצורה", 
		       "descr": "צור ונהל תצורות עבור נכסי Unified Service Desk שניתן לשייך אותם למשתמשים שונים.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "הגדרות ביקורת ואבחון", 
		       "descr": "צור ונהל הגדרות ביקורת ואבחון עבור Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "צרף", 
	    "doneButton": "בוצע", 
	    "attachButtonAltText": "צרף קובץ דחוס (‎.zip) המכיל את קבצי ההתאמה האישית.", 
	    "doneButtonAltText": "העלה את הקובץ הדחוס (‎.zip) המכיל את קבצי ההתאמה האישית.", 
	    "deleteButtonAltText": "הסר את הקובץ הדחוס (‎.zip).", 
	    "deleteAttachmentTitle": "מחק קובץ מצורף", 
	    "fileValidationTitle": "FileType לא חוקי", 
	    "fileValidation": "תבנית הקובץ אינה חוקית. באפשרותך לצרף רק קובץ דחוס (‎.zip). דחס את קבצי ההתאמה האישית לקובץ ‎.zip ולאחר מכן נסה שוב לצרף.\r\nUnified Service Desk יחלץ קבצים מקובץ ה- ‎.zip כדי לטעון את התוכן כאשר יישום הלקוח יופעל.", 
	    "fileLabel": "קובץ", 
	    "deleteConfirmation": "‏‏האם אתה בטוח שברצונך למחוק את הקובץ המצורף?", 
	    "attachmentFailure": "העלאת הקובץ נכשלה. נסה שוב על-ידי בחירת קובץ דחוס (‎.zip) להעלאה." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "בחירה באפשרות זו כברירת המחדל תעקוף כל תצורה קודמת שנקבעה. האם ברצונך להמשיך?", 
	    "OK": "המשך", 
	    "Cancel": "ביטול", 
	    "title": "האם ברצונך לקבוע תצורה זו כברירת המחדל?", 
	    "ErrorTitle": "אין אפשרות לקבוע תצורה זו כברירת המחדל.", 
	    "ErrorMessage": "ניתן לקבוע רק תצורות פעילות כברירת המחדל. הפעל תצורה זו ולאחר מכן נסה שוב.", 
	    "SetDefaultErrorMessage": "התצורה שנבחרה מוגדרת כבר כברירת המחדל.", 
	    "inactiveCloneTitle": "‏‏אין אפשרות לשכפל רשומה", 
	    "inactiveCloneAlert": "‏‏אין באפשרותך לשכפל רשומת תצורה לא פעילה. הפעל את רשומת התצורה ונסה שוב.", 
	    "cloningError": "‏‏אירעה שגיאה במהלך שכפול רשומה:", 
	    "okButton": "אישור", 
	    "cloneTitle": "שכפל תצורה קיימת", 
	    "cloneMessage": "צור עותק חדש של תצורה זו.\r\nערכי שדות והפניות לרשומות קשורות מהתצורה המקורית ישוכפלו.\r\nמשתמשים המשויכים לתצורה המקורית לא ישוכפלו.", 
	    "cloneButton": "שכפל", 
	    "cloneCancel": "ביטול", 
	    "copy": " - עותק" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "ערכים זמינים", 
	    "selectedValues": "ערכים שנבחרו" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
