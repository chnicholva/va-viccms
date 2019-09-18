Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Item manakah yang akan dikonfigurasi?", 
	    "data": [
			{ 
			    "title": "Kontrol Di-host", 
			    "descr": "Membuat dan mengelola kontrol yang di-host. Kontrol Di-host merupakan elemen utama yang digunakan untuk membangun aplikasi menggunakan Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Toolbar", 
			    "descr": "Membuat dan mengelola toolbar dan tombol untuk Unified Service Desk. Toolbar mencakup tombol dengan gambar dan teks, dan tombol digunakan untuk mengeksekusi tindakan.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Pemanggilan Tindakan", 
			    "descr": "Membuat dan mengelola pemanggilan tindakan untuk Unified Service Desk. Pemanggilan tindakan dapat ditambahkan ke tombol toolbar, aktivitas, aturan navigasi jendela, dan skrip agen.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Aktivitas", 
			    "descr": "Membuat dan mengelola aktivitas. Aktivitas adalah pemberitahuan yang dipicu kontrol di-host untuk menunjukkan ke aplikasi bahwa sesuatu terjadi.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Pencarian Entitas", 
			    "descr": "Membuat dan mengelola pencarian entitas. Pencarian entitas akan mengkueri layanan web CRM untuk menghasilkan data.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Aturan Navigasi Jendela", 
			    "descr": "Membuat dan mengelola aturan navigasi jendela. Aturan navigasi jendela menentukan interaksi di antara berbagai kontrol di Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Baris Sesi", 
			    "descr": "Membuat dan mengelola baris sesi. Baris sesi menentukan informasi nama sesi dan ikhtisar sesi di Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Skrip Agen", 
		       "descr": "Membuat dan mengelola tugas skrip agen dan jawaban. Skrip agen memberikan panduan untuk agen tentang apa yang harus dikatakan pada panggilan dan apa langkah-langkah berikutnya dalam proses.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlet", 
		       "descr": "Membuat dan mengelola scriptlet untuk Unified Service Desk. Scriptlet adalah potongan JavaScript yang dieksekusi dalam konteks Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulir", 
		       "descr": "Membuat dan mengelola formulir yang menyimpan definisi formulir deklaratif.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Pilihan", 
		       "descr": "Membuat dan mengelola pilihan untuk Unified Service Desk. Pilihan adalah pasangan nilai nama yang dapat digunakan oleh komponen.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Pengaturan Pengguna", 
		       "descr": "Membuat dan mengelola pengaturan pengguna untuk Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "File Penyesuaian", 
		       "descr": "Buat dan kelola file terkompresi (.zip) berisi file penyesuaian yang diperlukan untuk konfigurasi kustom dalam Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfigurasi", 
		       "descr": "Membuat dan mengelola konfigurasi untuk aset Unified Service Desk yang dapat dikaitkan dengan berbagai pengguna.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Pengaturan Audit &amp; Diagnostik", 
		       "descr": "Membuat dan mengelola Pengaturan Audit &amp; Diagnostik untuk Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Lampirkan", 
	    "doneButton": "Selesai", 
	    "attachButtonAltText": "Lampirkan file terkompresi (.zip) yang berisi file penyesuaian.", 
	    "doneButtonAltText": "Unggah file terkompresi (.zip) yang berisi file penyesuaian.", 
	    "deleteButtonAltText": "Hapus file terkompresi (.zip).", 
	    "deleteAttachmentTitle": "Hapus lampiran file", 
	    "fileValidationTitle": "FileType Tidak Valid", 
	    "fileValidation": "Format file ini tidak valid. Anda hanya dapat melampirkan file terkompresi (.zip). Kompresikan file penyesuaian ke file .zip, lalu coba lampirkan kembali.\r\nUnified Service Desk akan mengekstrak file dari file .zip untuk memuat konten bila aplikasi klien dimulai.", 
	    "fileLabel": "FILE", 
	    "deleteConfirmation": "Anda yakin ingin menghapus file lampiran?", 
	    "attachmentFailure": "File gagal diunggah. Coba lagi dengan memilih file terkompresi (.zip) yang akan diunggah." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Memilih pilihan ini sebagai default akan menimpa konfigurasi yang telah ditetapkan sebelumnya. Lanjutkan?", 
	    "OK": "Lanjut", 
	    "Cancel": "Batal", 
	    "title": "Anda ingin menetapkan konfigurasi ini sebagai default?", 
	    "ErrorTitle": "Konfigurasi ini tidak dapat ditetapkan sebagai default.", 
	    "ErrorMessage": "Hanya konfigurasi aktif yang dapat ditetapkan sebagai default. Aktifkan konfigurasi ini, lalu coba lagi.", 
	    "SetDefaultErrorMessage": "Konfigurasi yang dipilih sudah ditetapkan sebagai default.", 
	    "inactiveCloneTitle": "Tidak dapat mengkloning rekaman", 
	    "inactiveCloneAlert": "Anda tidak dapat mengkloning rekaman konfigurasi yang tidak aktif. Aktifkan rekaman konfigurasi, lalu coba lagi.", 
	    "cloningError": "Terjadi kesalahan saat mengkloning rekaman:", 
	    "okButton": "OK", 
	    "cloneTitle": "Kloningkan Konfigurasi yang Ada", 
	    "cloneMessage": "Buat salinan baru konfigurasi ini.\r\nNilai bidang dan referensi rekaman terkait dari konfigurasi asli akan dikloning.\r\nPengguna terkait konfigurasi asli tidak akan dikloning.", 
	    "cloneButton": "Kloning", 
	    "cloneCancel": "Batal", 
	    "copy": " - Salin" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Nilai yang Tersedia", 
	    "selectedValues": "Nilai Dipilih" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
