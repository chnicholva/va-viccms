Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "구성할 항목을 선택하십시오.", 
	    "data": [
			{ 
			    "title": "호스팅된 컨트롤", 
			    "descr": "호스팅된 컨트롤을 만들고 관리합니다. 호스팅된 컨트롤은 Unified Service Desk를 사용하여 응용 프로그램을 빌드하는 데 사용되는 기본 요소입니다.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "도구 모음", 
			    "descr": "Unified Service Desk에 대한 도구 모음과 단추를 만들고 관리합니다. 도구 모음에는 이미지와 텍스트가 포함된 단추가 있으며, 단추는 작업을 실행하는 데 사용됩니다.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "작업 호출", 
			    "descr": "Unified Service Desk에 대한 작업 호출을 만들고 관리합니다. 작업 호출은 도구 모음 단추, 이벤트, 창 탐색 규칙 및 에이전트 스크립트에 추가할 수 있습니다.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "이벤트", 
			    "descr": "이벤트를 만들고 관리합니다. 이벤트는 호스팅된 컨트롤에서 무엇인가 일어나고 있음을 응용 프로그램에 나타내기 위해 발생되는 알림입니다.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "엔터티 검색", 
			    "descr": "엔터티 검색을 만들고 관리합니다. 엔터티 검색은 CRM 웹 서비스를 쿼리하여 데이터를 반환합니다.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "창 탐색 규칙", 
			    "descr": "창 탐색 규칙을 만들고 관리합니다. 창 탐색 규칙은 Unified Service Desk의 다양한 컨트롤 간 상호 작용을 정의합니다.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "세션 라인", 
			    "descr": "세션 라인을 만들고 관리합니다. 세션 라인은 Unified Service Desk에서 세션 이름과 세션 개요 정보를 정의합니다.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "에이전트 스크립트", 
		       "descr": "에이전트 스크립트 작업 및 답변을 만들고 관리합니다. 에이전트 스크립팅은 에이전트가 통화 시 어떻게 말해야 하는지와 프로세스에서 다음 단계가 무엇인지에 대한 지침을 에이전트에게 제공합니다.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "스크립틀릿", 
		       "descr": "Unified Service Desk에 대한 스크립틀릿을 만들고 관리합니다. 스크립틀릿은 Unified Service Desk 컨텍스트에서 실행되는 JavaScript의 조각입니다.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "양식", 
		       "descr": "선언적 양식 정의를 저장하는 양식을 만들고 관리합니다.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "옵션", 
		       "descr": "Unified Service Desk에 대한 옵션을 만들고 관리합니다. 옵션은 구성 요소에서 사용할 수 있는 이름 값 쌍입니다.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "사용자 설정", 
		       "descr": "Unified Service Desk에 대한 사용자 설정을 만들고 관리합니다.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "사용자 지정 파일", 
		       "descr": "Unified Service Desk에서 사용자 지정 구성에 필요한 사용자 지정 파일이 들어 있는 압축 파일(.zip)을 만들고 관리합니다.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "구성", 
		       "descr": "다른 사용자에게 연결할 수 있는 Unified Service Desk 자산에 대한 구성을 만들고 관리합니다.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "감사 및 진단 설정", 
		       "descr": "Unified Service Desk에 대한 감사 및 진단 설정을 만들고 관리합니다.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "첨부", 
	    "doneButton": "완료", 
	    "attachButtonAltText": "사용자 지정 파일이 들어 있는 압축 파일(.zip)을 첨부합니다.", 
	    "doneButtonAltText": "사용자 지정 파일이 들어 있는 압축 파일(.zip)을 업로드합니다.", 
	    "deleteButtonAltText": "압축 파일(.zip)을 제거합니다.", 
	    "deleteAttachmentTitle": "첨부 파일 삭제", 
	    "fileValidationTitle": "잘못된 FileType", 
	    "fileValidation": "파일 형식이 잘못되었습니다. 압축 파일(.zip)만 첨부할 수 있습니다. 사용자 지정 파일을 .zip 파일로 압축한 후 다시 첨부해 보십시오.\r\n클라이언트 응용 프로그램이 시작되면 Unified Service Desk에서 .zip 파일의 압축을 풀어 콘텐츠를 로드합니다.", 
	    "fileLabel": "파일", 
	    "deleteConfirmation": "첨부 파일을 삭제하시겠습니까?", 
	    "attachmentFailure": "파일을 업로드하지 못했습니다. 업로드할 압축 파일(.zip)을 선택하여 다시 시도하십시오." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "이 값을 기본값으로 선택하면 이전에 설정된 구성이 모두 다시 정의됩니다. 계속하시겠습니까?", 
	    "OK": "계속", 
	    "Cancel": "취소", 
	    "title": "이 구성을 기본값으로 설정하시겠습니까?", 
	    "ErrorTitle": "이 구성을 기본값으로 설정할 수 없습니다.", 
	    "ErrorMessage": "활성 구성만 기본값으로 설정할 수 있습니다. 이 구성을 활성화한 후 다시 시도하십시오.", 
	    "SetDefaultErrorMessage": "선택한 구성은 이미 기본값입니다.", 
	    "inactiveCloneTitle": "레코드를 복제할 수 없음", 
	    "inactiveCloneAlert": "비활성 구성 레코드를 복제할 수 없습니다. 구성 레코드를 활성화하고 다시 시도하십시오.", 
	    "cloningError": "레코드를 복제하는 동안 오류가 발생했습니다:", 
	    "okButton": "확인", 
	    "cloneTitle": "기존 구성 복제", 
	    "cloneMessage": "이 구성의 새 복사본을 만듭니다.\r\n원래 구성에서 참조하는 필드 값 및 관련 레코드가 복제됩니다.\r\n원래 구성에 연결된 사용자는 복제되지 않습니다.", 
	    "cloneButton": "복제", 
	    "cloneCancel": "취소", 
	    "copy": " - 복사" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "사용 가능한 값", 
	    "selectedValues": "선택한 값" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
