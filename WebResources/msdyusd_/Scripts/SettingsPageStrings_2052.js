Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "您要配置哪个项目?", 
	    "data": [
			{ 
			    "title": "托管控件", 
			    "descr": "创建和管理托管控件。托管控件是使用 Unified Service Desk 来构建应用程序所用的主要元素。", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "工具栏", 
			    "descr": "创建和管理 Unified Service Desk 的工具栏和按钮。工具栏包含带有图像和文本的按钮，按钮用于执行相关操作。", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "操作调用", 
			    "descr": "创建和管理 Unified Service Desk 的操作调用。操作调用可以添加到工具栏按钮、事件、窗口导航规则和代理脚本。", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "事件", 
			    "descr": "创建和管理事件。事件是托管控件触发器用于向应用程序指示正在发生的事情的通知。", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "实体搜索", 
			    "descr": "创建和管理实体搜索。实体搜索会查询 CRM Web 服务，以返回数据。", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "窗口导航规则", 
			    "descr": "创建和管理窗口导航规则。窗口导航规则定义 Unified Service Desk 中各个控件之间的交互。", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "会话行", 
			    "descr": "创建和管理会话行。会话行定义 Unified Service Desk 中的会话名称和会话概述信息。", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "代理脚本", 
		       "descr": "创建和管理代理脚本任务和答案。代理脚本为代理提供有关在聊天对话中他们应叙述的内容和流程后续步骤方面的指导。", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlet", 
		       "descr": "创建和管理 Unified Service Desk 的 Scriptlet。Scriptlet 是在 Unified Service Desk 环境中执行的 JavaScript 片段。", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "窗体", 
		       "descr": "创建和管理用于存储声明性表单定义的窗体。", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "选项", 
		       "descr": "创建和管理 Unified Service Desk 的选项。选项是可由组件使用的名称值对。", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "用户设置", 
		       "descr": "创建和管理 Unified Service Desk 的用户设置。", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "自定义文件", 
		       "descr": "创建并管理包含 Unified Service Desk 中自定义配置所需自定义文件的压缩(.zip)文件。", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "配置", 
		       "descr": "创建和管理可与不同用户关联的 Unified Service Desk 资产的配置。", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "审核和诊断设置", 
		       "descr": "创建并管理 Unified Service Desk 的审核和诊断设置。", 
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
	    "attachButtonAltText": "附加一个包含自定义文件的压缩(.zip)文件。", 
	    "doneButtonAltText": "上载包含自定义文件的压缩(.zip)文件。", 
	    "deleteButtonAltText": "删除压缩(.zip)文件。", 
	    "deleteAttachmentTitle": "删除附加的文件", 
	    "fileValidationTitle": "无效文件类型", 
	    "fileValidation": "文件格式无效。您只能附加压缩(.zip)文件。请将您的自定义文件压缩为一个 .zip 文件，然后重新尝试附加。\r\nUnified Service Desk 将在客户端应用程序启动时，从 .zip 文件中提取文件以加载文件内容。", 
	    "fileLabel": "文件", 
	    "deleteConfirmation": "是否确定要删除附加的文件?", 
	    "attachmentFailure": "文件上载失败。请选择要上载的压缩(.zip)文件后重试。" 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "选择此项为默认项将替代之前设定的任何配置。是否要继续?", 
	    "OK": "继续", 
	    "Cancel": "取消", 
	    "title": "是否要将此配置设为默认配置?", 
	    "ErrorTitle": "此配置不能设置为默认配置。", 
	    "ErrorMessage": "只有可用配置可设为默认配置。请激活此配置，然后重试。", 
	    "SetDefaultErrorMessage": "所选配置已设置为默认配置。", 
	    "inactiveCloneTitle": "无法克隆记录", 
	    "inactiveCloneAlert": "无法克隆停用的配置记录。请激活此配置记录，然后重试。", 
	    "cloningError": "克隆记录时出错:", 
	    "okButton": "确定", 
	    "cloneTitle": "克隆现有配置", 
	    "cloneMessage": "创建此配置的新副本。\r\n来自原始配置的字段值和相关记录引用将被克隆。\r\n与原始配置关联的用户不会被克隆。", 
	    "cloneButton": "克隆", 
	    "cloneCancel": "取消", 
	    "copy": " - 副本" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "可用值", 
	    "selectedValues": "所选值" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
