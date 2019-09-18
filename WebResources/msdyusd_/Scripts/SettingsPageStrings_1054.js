Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "คุณต้องการกำหนดค่ารายการใด", 
	    "data": [
			{ 
			    "title": "การควบคุมที่เป็นโฮสต์", 
			    "descr": "สร้างและจัดการการควบคุมที่เป็นโฮสต์ การควบคุมที่เป็นโฮสต์คือองค์ประกอบหลักที่ใช้สำหรับการสร้างแอพพลิเคชันโดยใช้ Unified Service Desk", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "แถบเครื่องมือ", 
			    "descr": "สร้างและจัดการแถบเครื่องมือและปุ่มสำหรับ Unified Service Desk แถบเครื่องมือประกอบด้วยปุ่มที่มีรูปและข้อความ และปุ่มจะใช้สำหรับดำเนินการต่างๆ", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "การเรียกใช้การดำเนินการ", 
			    "descr": "สร้างและจัดการการเรียกใช้การดำเนินการสำหรับ Unified Service Desk การเรียกใช้การดำเนินการจะสามารถเพิ่มลงในปุ่มแถบเครื่องมือ เหตุการณ์ กฎการนำทางหน้าต่าง และสคริปต์ตัวแทนได้", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "เหตุการณ์", 
			    "descr": "สร้างและจัดการเหตุการณ์ เหตุการณ์คือการแจ้งเตือนซึ่งทริกเกอร์โดยการควบคุมที่เป็นโฮสต์เพื่อบ่งชี้ให้แอพพลิเคชันทราบว่ามีบางสิ่งบางอย่างเกิดขึ้น", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "การค้นหาเอนทิตี", 
			    "descr": "สร้างและจัดการการค้นหาเอนทิตี การค้นหาเอนทิตีจะสอบถามการบริการ CRM บนเว็บเพื่อให้ส่งคืนข้อมูล", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "กฎการนำทางหน้าต่าง", 
			    "descr": "สร้างและจัดการกฎการนำทางหน้าต่าง กฎการนำทางหน้าต่างจะกำหนดการโต้ตอบระหว่างตัวควบคุมต่างๆ ใน Unified Service Desk", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "บรรทัดเซสชัน", 
			    "descr": "สร้างและจัดการบรรทัดเซสชัน บรรทัดเซสชันจะกำหนดชื่อเซสชันและข้อมูลภาพรวมของเซสชันใน Unified Service Desk", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "สคริปต์ตัวแทน", 
		       "descr": "สร้างและจัดการงานและคำตอบเกี่ยวกับสคริปต์ตัวแทน การจัดทำสคริปต์ตัวแทนจะเป็นแนวทางแนะนำสิ่งที่ตัวแทนควรพูดในการติดต่อทางโทรศัพท์ และแนะนำขั้นตอนถัดไปที่อยู่ระหว่างดำเนินการ", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "สร้างและจัดการ Scriptlet สำหรับ Unified Service Desk โดย Scriptlet เป็นส่วนย่อยของ JavaScript ที่ดำเนินการในบริบทของ Unified Service Desk", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "ฟอร์ม", 
		       "descr": "สร้างและจัดการฟอร์มที่จัดเก็บข้อกำหนดสำหรับฟอร์มประกาศ", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "ตัวเลือก", 
		       "descr": "สร้างและจัดการตัวเลือกสำหรับ Unified Service Desk ตัวเลือกเหล่านี้ได้แก่คู่ค่าของชื่อที่ส่วนประกอบต่างๆ สามารถใช้งานได้", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "การตั้งค่าผู้ใช้", 
		       "descr": "สร้างและจัดการการตั้งค่าผู้ใช้สำหรับ Unified Service Desk", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "แฟ้มการแก้ไข/ปรับปรุงตามคำสั่ง", 
		       "descr": "สร้างและจัดการแฟ้มที่บีบอัด (.zip) ซึ่งมีแฟ้มการแก้ไข/ปรับปรุงตามคำสั่งที่จำเป็นสำหรับการกำหนดค่าแบบกำหนดเองใน Unified Service Desk", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "การกำหนดค่า", 
		       "descr": "สร้างและจัดการการกำหนดค่าสำหรับแอสเซทของ Unified Service Desk ที่สามารถเชื่อมโยงกับผู้ใช้รายอื่นๆ", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "การตั้งค่าการตรวจสอบและการวินิจฉัย", 
		       "descr": "สร้างและจัดการการตั้งค่าการตรวจสอบและการวินิจฉัยสำหรับ Unified Service Desk", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "แนบ", 
	    "doneButton": "เสร็จแล้ว", 
	    "attachButtonAltText": "แนบแฟ้มที่บีบอัด (.zip) ซึ่งมีแฟ้มการแก้ไข/ปรับปรุงตามคำสั่ง", 
	    "doneButtonAltText": "อัปโหลดแฟ้มที่บีบอัด (.zip) ซึ่งมีแฟ้มการแก้ไข/ปรับปรุงตามคำสั่ง", 
	    "deleteButtonAltText": "ลบแฟ้มที่บีบอัด (.zip)", 
	    "deleteAttachmentTitle": "ลบแฟ้มที่แนบ", 
	    "fileValidationTitle": "FileType ไม่ถูกต้อง", 
	    "fileValidation": "รูปแบบแฟ้มไม่ถูกต้อง คุณสามารถแนบได้เฉพาะแฟ้ม (.zip) ที่บีบอัดเท่านั้น บีบอัดแฟ้มการแก้ไข/ปรับปรุงตามคำสั่งลงในแฟ้ม .zip แล้วลองแนบอีกครั้ง\r\nUnified Service Desk จะแยกแฟ้มออกจากแฟ้ม .zip เพื่อโหลดเนื้อหาเมื่อแอพพลิเคชันไคลเอ็นต์เริ่มต้น", 
	    "fileLabel": "แฟ้ม", 
	    "deleteConfirmation": "คุณแน่ใจหรือไม่ว่าคุณต้องการลบแฟ้มที่แนบ", 
	    "attachmentFailure": "การอัปโหลดแฟ้มไม่สำเร็จ ลองอีกครั้งโดยการเลือกแฟ้มที่บีบอัด (.zip) เพื่ออัปโหลด" 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "การเลือกรายการนี้เป็นค่าเริ่มต้นจะแทนที่การกำหนดค่าที่กำหนดเป็นค่าเริ่มต้นก่อนหน้านี้ คุณต้องการดำเนินการต่อหรือไม่", 
	    "OK": "ดำเนินการต่อ", 
	    "Cancel": "ยกเลิก", 
	    "title": "คุณต้องการตั้งค่าการกำหนดค่านี้เป็นค่าเริ่มต้นหรือไม่", 
	    "ErrorTitle": "ไม่สามารถตั้งค่าการกำหนดค่านี้เป็นค่าเริ่มต้น", 
	    "ErrorMessage": "เฉพาะการกำหนดค่าที่ใช้งานอยู่เท่านั้นจึงจะสามารถตั้งค่าเป็นค่าเริ่มต้น เริ่มการใช้งานการกำหนดค่านี้ แล้วลองอีกครั้ง", 
	    "SetDefaultErrorMessage": "การกำหนดค่าที่เลือกเป็นค่าเริ่มต้นอยู่แล้ว", 
	    "inactiveCloneTitle": "ไม่สามารถลอกแบบเรกคอร์ด", 
	    "inactiveCloneAlert": "คุณไม่สามารถลอกแบบเรกคอร์ดการกำหนดค่าที่ไม่ใช้งาน เริ่มการใช้งานเรกคอร์ดการกำหนดค่า และลองอีกครั้ง", 
	    "cloningError": "มีข้อผิดพลาดในระหว่างการลอกแบบเรกคอร์ด:", 
	    "okButton": "ตกลง", 
	    "cloneTitle": "ลอกแบบการกำหนดค่าที่มีอยู่", 
	    "cloneMessage": "สร้างสำเนาใหม่ของการกำหนดค่านี้\r\nจะมีการลอกแบบค่าฟิลด์และการอ้างอิงเรกคอร์ดที่เกี่ยวข้องจากการกำหนดค่าเดิม\r\nจะไม่มีการลอกแบบผู้ใช้ที่เชื่อมโยงกับการกำหนดค่าเดิม", 
	    "cloneButton": "ลอกแบบ", 
	    "cloneCancel": "ยกเลิก", 
	    "copy": " - คัดลอก" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "ค่าที่มี", 
	    "selectedValues": "ค่าที่เลือก" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
