Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Item apakah yang anda mahu konfigurasikan?", 
	    "data": [
			{ 
			    "title": "Kawalan Berhos", 
			    "descr": "Cipta dan uruskan kawalan berhos. Kawalan Berhos ialah elemen utama yang digunakan untuk membina aplikasi menggunakan Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Bar Alat", 
			    "descr": "Cipta dan uruskan bar alat dan butang untuk Unified Service Desk. Bar alat mengandungi butang dengan imej dan teks serta butang yang digunakan untuk melakukan tindakan.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Panggilan Tindakan", 
			    "descr": "Cipta dan uruskan panggilan tindakan untuk Unified Service Desk. Panggilan tindakan boleh ditambah pada butang bar alat, peristiwa, peraturan navigasi tetingkap dan ejen skrip.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Peristiwa", 
			    "descr": "Cipta dan uruskan peristiwa. Peristiwa ialah pemberitahuan yang dicetuskan oleh kawalan berhos untuk menandakan kepada aplikasi bahawa sesuatu sedang berlaku.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Carian Entiti", 
			    "descr": "Cipta dan uruskan carian entiti. Pertanyaan carian entiti perkhidmatan web untuk mengembalikan data.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Peraturan Navigasi Tetingkap", 
			    "descr": "Cipta dan uruskan peraturan navigasi tetingkap. Peraturan navigasi tetingkap menentukan interaksi antara pelbagai kawalan dalam Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Baris Sesi", 
			    "descr": "Cipta dan uruskan baris sesi. Baris sesi menentukan nama sesi dan maklumat gambaran keseluruhan sesi dalam Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Skrip Ejen", 
		       "descr": "Cipta dan uruskan tugas serta jawapan skrip ejen. Skrip ejen memberi panduan kepada ejen tentang apa yang harus mereka katakan semasa panggilan atau langkah seterusnya dalam proses.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skriplet", 
		       "descr": "Cipta dan uruskan skriplet untuk Unified Service Desk. Skriplet ialah coretan JavaScript yang dilaksanakan dalam konteks Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Borang", 
		       "descr": "Cipta dan uruskan borang yang menyimpan definisi bentuk perisytiharan.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Pilihan", 
		       "descr": "Cipta dan uruskan pilihan untuk Unified Service Desk. Pilihan ialah pasangan nilai nama yang boleh digunakan oleh komponen.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Tetapan Pengguna", 
		       "descr": "Cipta dan uruskan tetapan pengguna untuk Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Fail Penyesuaian", 
		       "descr": "Cipta dan uruskan fail mampat (.zip) yang mengandungi fail penyesuaian yang diperlukan untuk konfigurasi tersuai dalam Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurasi", 
		       "descr": "Cipta dan uruskan konfigurasi untuk aset Unified Service Desk yang boleh dikaitkan dengan pengguna berlainan.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Audit &amp; Tetapan Diagnostik", 
		       "descr": "Cipta dan uruskan Audit &amp; Tetapan Diagnostik untuk Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Lampir", 
	    "doneButton": "Selesai", 
	    "attachButtonAltText": "Lampirkan fail mampat (.zip) yang mengandungi fail penyesuaian.", 
	    "doneButtonAltText": "Muat naik fail mampat (.zip) yang mengandungi fail penyesuaian.", 
	    "deleteButtonAltText": "Keluarkan fail mampat (.zip).", 
	    "deleteAttachmentTitle": "Padam fail yang dilampirkan", 
	    "fileValidationTitle": "FileType Tidak Sah", 
	    "fileValidation": "Format fail tidak sah. Anda hanya boleh melampirkan fail (.zip) yang dimampatkan. Mampatkan fail penyesuaian ke dalam fail .zip, dan kemudian cuba melampirkan sekali lagi.\r\nUnified Service Desk akan mengekstrak fail .zip untuk memuatkan kandungan apabila aplikasi klien dimulakan.", 
	    "fileLabel": "FAIL", 
	    "deleteConfirmation": "Adakah anda pasti mahu memadamkan fail yang dilampirkan?", 
	    "attachmentFailure": "Muat naik fail gagal. Cuba sekali lagi dengan memilih fail mampat (.zip) untuk muat naik." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Memilih ini sebagai lalai akan mengatasi sebarang konfigurasi yang ditetapkan sebelum ini. Adakah anda mahu teruskan?", 
	    "OK": "Teruskan", 
	    "Cancel": "Batal", 
	    "title": "Adakah anda mahu menetapkan konfigurasi ini sebagai lalai?", 
	    "ErrorTitle": "Konfigurasi ini tidak boleh ditetapkan sebagai lalai.", 
	    "ErrorMessage": "Hanya konfigurasi aktif boleh ditetapkan sebagai lalai. Aktifkan konfigurasi ini, dan kemudian cuba lagi.", 
	    "SetDefaultErrorMessage": "Konfigurasi yang dipilih sudah pun lalai.", 
	    "inactiveCloneTitle": "Tidak dapat mengklon rekod", 
	    "inactiveCloneAlert": "Anda tidak dapat mengklon rekod konfigurasi tidak aktif. Aktifkan rekod konfigurasi, dan cuba lagi.", 
	    "cloningError": "Terdapat ralat semasa mengklonkan rekod:", 
	    "okButton": "OK", 
	    "cloneTitle": "Klon Konfigurasi Sedia Ada", 
	    "cloneMessage": "Cipta salinan baru konfigurasi ini.\r\nNilai medan dan rujukan rekod berkaitan daripada konfigurasi asal akan diklonkan.\r\nPengguna yang berkaitan dengan konfigurasi asal tidak akan diklonkan.", 
	    "cloneButton": "Klon", 
	    "cloneCancel": "Batal", 
	    "copy": " - Salinan" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Nilai yang Tersedia", 
	    "selectedValues": "Nilai yang Terpilih" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
