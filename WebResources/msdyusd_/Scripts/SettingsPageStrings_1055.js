Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Hangi öğeyi yapılandırmak istiyorsunuz?", 
	    "data": [
			{ 
			    "title": "Barındırılan Denetimler", 
			    "descr": "Barındırılan denetimler oluşturun ve yönetin. Barındırılan Denetimler, Unified Service Desk kullanarak uygulama oluşturmak için kullanılan birincil öğelerdir.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Araç Çubukları", 
			    "descr": "Unified Service Desk için araç çubukları ve düğmeler oluşturun ve yönetin. Araç çubukları görüntüler ve metin ile birlikte bulunan düğmeler içerir ve düğmeler eylem yürütmek için kullanılır.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Eylem Çağrıları", 
			    "descr": "Unified Service Desk için eylem çağrıları oluşturun ve yönetin. Eylem çağrıları araç çubuğu düğmelerine, olaylara, pencere gezinti kurallarına ve aracı betiklere eklenebilirler.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Olaylar", 
			    "descr": "Olaylar oluşturun ve yönetin. Olaylar, barındırılan bir denetimin, uygulamaya bir şey oluştuğunu belirtmek üzere tetiklediği bildirimlerdir.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Varlık Aramaları", 
			    "descr": "Varlık aramaları oluşturun ve yönetin. Varlık aramaları, veri getirmek için CRM web hizmetlerini sorgular.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Pencere Gezinti Kuralları", 
			    "descr": "Pencere gezinti kuralları oluşturun ve yönetin. Pencere gezinti kuralları, Unified Service Desk üzerindeki çeşitli denetimler arasındaki etkileşimi tanımlar.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Oturum Satırları", 
			    "descr": "Oturum satırları oluşturun ve yönetin. Oturum satırları, Unified Service Desk üzerindeki oturum adı ve oturum genel bakış bilgilerini tanımlar.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Aracı Betikler", 
		       "descr": "Aracı betik görevleri ve yanıtları oluşturun ve yönetin. Aracı betik aracılara, çağrı sırasında ne söylemeleri gerektiğiyle ve sürecin sonraki adımlarıyla ilgili rehberlik sunar.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Kod parçacıkları", 
		       "descr": "Unified Service Desk için kod parçacıkları oluşturun ve yönetin. Kod parçacıkları, Unified Service Desk bağlamında yürütülen JavaScript parçacıklarıdır.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formlar", 
		       "descr": "Bildirimli form tanımları depolayan formlar oluşturun ve yönetin.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Seçenekler", 
		       "descr": "Unified Service Desk için seçenekler oluşturun ve yönetin. Seçenekler, bileşenler tarafından kullanılabilen ad değer çiftleridir.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Kullanıcı Ayarları", 
		       "descr": "Unified Service Desk için kullanıcı ayarları oluşturun ve yönetin.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Özelleştirme Dosyası", 
		       "descr": "Unified Service Desk'te özel yapılandırma için gerekli olan özelleştirme dosyalarını içeren sıkıştırılmış (.zip) dosyasını oluşturun ve yönetin.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Yapılandırma", 
		       "descr": "Farklı kullanıcılarla ilişkilendirilebilir Unified Service Desk varlıkları için yapılandırmalar oluşturun ve yönetin.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Denetim ve Tanılama Ayarları", 
		       "descr": "Unified Service Desk için Denetim ve Tanılama Ayarlarını oluşturun ve yönetin.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Ekle", 
	    "doneButton": "Bitti", 
	    "attachButtonAltText": "Özelleştirme dosyalarını içeren bir sıkıştırılmış (.zip) dosya iliştirin.", 
	    "doneButtonAltText": "Özelleştirme dosyalarını içeren bir sıkıştırılmış (.zip) dosyayı karşıya yükleyin.", 
	    "deleteButtonAltText": "Sıkıştırılmış (.zip) dosyayı kaldırın.", 
	    "deleteAttachmentTitle": "Eklenen dosyayı sil", 
	    "fileValidationTitle": "Geçersiz FileType", 
	    "fileValidation": "Dosya biçimi geçersiz. Yalnızca sıkıştırılmış bir dosya (.zip) iliştirebilirsiniz. Özelleştirme dosyalarınızı bir .zip dosyası halinde sıkıştırıp yeniden iliştirmeyi deneyin.\r\nİstemci uygulaması başlatılınca Unified Service Desk bu .zip dosyasındaki dosyaları çıkarıp yükleyecektir.", 
	    "fileLabel": "DOSYA", 
	    "deleteConfirmation": "Eklenen dosyayı silmek istediğinizden emin misiniz?", 
	    "attachmentFailure": "Dosya karşıya yüklenemedi. Karşıya yüklemek için sıkıştırılmış (.zip) bir doya seçip yeniden deneyin." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Bunu varsayılan olarak seçmek, daha önce belirlenen yapılandırmaları geçersiz kılar. Devam etmek istiyor musunuz?", 
	    "OK": "Devam", 
	    "Cancel": "İptal", 
	    "title": "Bu yapılandırmayı varsayılan olarak ayarlamak istiyor musunuz?", 
	    "ErrorTitle": "Bu yapılandırma varsayılan olarak ayarlanamaz.", 
	    "ErrorMessage": "Yalnızca etkin yapılandırmalar varsayılan olarak ayarlanabilir. Bu yapılandırmayı etkinleştirip yeniden deneyin.", 
	    "SetDefaultErrorMessage": "Seçili yapılandırma zaten varsayılan.", 
	    "inactiveCloneTitle": "Kayıt kopyalanamıyor", 
	    "inactiveCloneAlert": "Etkin olmayan bir yapılandırma kaydını kopyalayamazsınız. Yapılandırma kaydını etkinleştirip yeniden deneyin.", 
	    "cloningError": "Kayıt kopyalanırken hata oluştu:", 
	    "okButton": "Tamam", 
	    "cloneTitle": "Varolan Yapılandırmayı Kopyala", 
	    "cloneMessage": "Bu yapılandırmanın yeni bir kopyasını oluşturun.\r\nOrijinal yapılandırmaya ait alan değerleri ve ilgili kayıtlar kopyalanır.\r\nOrijinal yapılandırmayla ilişkilendirilmiş kullanıcılar kopyalanmaz.", 
	    "cloneButton": "Kopyala", 
	    "cloneCancel": "İptal", 
	    "copy": " - Kopyala" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Kullanılabilir Değerler", 
	    "selectedValues": "Seçili Değerler" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
