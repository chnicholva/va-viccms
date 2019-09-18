Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": " Unified Service Desk", 
	    "headerdesc": "您要設定哪個項目?", 
	    "data": [
			{ 
			    "title": "託管控制項", 
			    "descr": "建立和管理託管控制項。託管控制項是用來建置使用 Unified Service Desk 之應用程式的主要項目。", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "工具列", 
			    "descr": "建立和管理 Unified Service Desk 的工具列和按鈕。工具列包含具有影像和文字的按鈕，這些按鈕是用來執行動作。", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "動作呼叫", 
			    "descr": "建立和管理 Unified Service Desk 的動作呼叫。動作呼叫可加到工具列按鈕、事件、視窗導覽規則和客服專員底稿。", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "事件", 
			    "descr": "建立和管理事件。事件是託管控制項觸發的通知，向應用程式指示發生某種狀況。", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "實體搜尋", 
			    "descr": "建立和管理實體搜尋。實體搜尋會查詢 CRM Web 服務以傳回資料。", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "視窗導覽規則", 
			    "descr": "建立和管理視窗導覽規則。視窗導覽規則定義 Unified Service Desk 中各種控制項之間的互動。", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "工作階段行", 
			    "descr": "建立和管理工作階段行。工作階段行定義 Unified Service Desk 中的工作階段名稱和工作階段概觀資訊。", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "客服專員底稿", 
		       "descr": "建立和管理客服專員底稿工作和解答。客服專員底稿指導客服專員在通話時應該說什麼，以及接下來的程序步驟是什麼。", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "程式碼片段", 
		       "descr": "建立和管理 Unified Service Desk 的程式碼片段。程式碼片段是在 Unified Service Desk 內容中執行的 JavaScript 程式碼片段。", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "表單", 
		       "descr": "建立和管理儲存宣告式表單定義的表單。", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "選項", 
		       "descr": "建立和管理 Unified Service Desk 的選項。選項是元件可用的名稱值組。", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "使用者設定", 
		       "descr": "建立和管理 Unified Service Desk 的使用者設定。", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "自訂檔案", 
		       "descr": "建立及管理壓縮檔 (.zip)，內含 Unified Service Desk 中自訂設定所需的自訂檔案。", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "設定", 
		       "descr": "建立和管理可以與不同使用者建立關聯之 Unified Service Desk 資產的設定。", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "稽核與診斷設定", 
		       "descr": "建立及管理 Unified Service Desk 的稽核與診斷設定。", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "附加", 
	    "doneButton": "完成", 
	    "attachButtonAltText": "附加內含自訂檔案的壓縮檔 (.zip)。", 
	    "doneButtonAltText": "上傳內含自訂檔案的壓縮檔 (.zip)。", 
	    "deleteButtonAltText": "移除壓縮檔 (.zip)。", 
	    "deleteAttachmentTitle": "刪除附加檔案", 
	    "fileValidationTitle": "無效的檔案類型", 
	    "fileValidation": "檔案格式無效。您只能附加壓縮檔 (.zip)。請將您的自訂檔案壓縮成 .zip 檔案，然後重試一次附加。\r\n用戶端應用程式啟動時，Unified Service Desk 會解壓縮 .zip 檔案中的檔案，以載入內容。", 
	    "fileLabel": "檔案", 
	    "deleteConfirmation": "您確定要刪除附加檔案嗎?", 
	    "attachmentFailure": "檔案上傳失敗。請選取要上傳的壓縮檔 (.zip)，再試一次。" 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "若選取這一項做為預設值，將會覆寫先前設定的任何組態。您要繼續嗎?", 
	    "OK": "繼續", 
	    "Cancel": "取消", 
	    "title": "您要將這個設定設為預設值嗎?", 
	    "ErrorTitle": "這個設定無法設為預設值。", 
	    "ErrorMessage": "只有使用中設定可設為預設值。請啟用這個設定，然後再試一次。", 
	    "SetDefaultErrorMessage": "選取的設定已經是預設值。", 
	    "inactiveCloneTitle": "無法再製記錄", 
	    "inactiveCloneAlert": "您無法再製非使用中設定記錄。請啟用設定記錄，然後再試一次。", 
	    "cloningError": "再製記錄期間發生錯誤:", 
	    "okButton": "確定", 
	    "cloneTitle": "再製現有的設定", 
	    "cloneMessage": "建立此設定的新複本。\r\n原始設定的欄位值和相關記錄參照都會再製。\r\n原始設定的相關使用者不會再製。", 
	    "cloneButton": "再製", 
	    "cloneCancel": "取消", 
	    "copy": " - 複製" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "可用的值", 
	    "selectedValues": "選取的值" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
