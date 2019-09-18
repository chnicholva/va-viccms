Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "आप किस आइटम को कॉन्फ़िगर करना चाहेंगे?", 
	    "data": [
			{ 
			    "title": "होस्टेड नियंत्रण", 
			    "descr": "होस्टेड नियंत्रण बनाएँ और प्रबंधित करें. होस्टेड नियंत्रण प्राथमिक एलिमेंट होते हैं जिनका उपयोग Unified Service Desk का उपयोग करके अनुप्रयोग बनाने के लिए किया जाता है.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "उपकरण पट्टी", 
			    "descr": "Unified Service Desk के लिए उपकरण पट्टियाँ और बटन बनाएँ और प्रबंधित करें. टूलबार्स में छवियों और टेक्स्ट वाले बटनों की एक सूची होती है, और बटनों को क्रियाएँ करने के लिए उपयोग किया जाता है.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "क्रिया कॉल", 
			    "descr": "Unified Service Desk के लिए क्रिया कॉल बनाएँ और प्रबंधित करें. क्रिया कॉलों को उपकरण पट्टी बटनों, इवेंट्स, विंडो नेविगेशन नियमों, और एजेंट स्क्रिप्ट में जोड़ा जा सकता है.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "इवेंट्स", 
			    "descr": "इवेंट्स बनाएँ और प्रबंधित करें. ईवेंट्स ऐसे नोटिफ़िकेशन होते हैं जो एक होस्टेड नियंत्रण ट्रिगर करके एप्लिकेशन को यह संकेत देता है कि कुछ चल रहा है.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "निकाय खोजें", 
			    "descr": "निकाय खोजें बनाएँ और प्रबंधित करें. निकाय खोजें डेटा वापस करने के लिए CRM वेब सेवाओं को क्वेरी करती हैं.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Window नेवीगेशन नियम", 
			    "descr": "विंडो नेविगेशन नियम बनाएँ और प्रबंधित करें. विंडो नेविगेशन नियम Unified Service Desk में अलग-अलग नियंत्रणों के बीच इंटरेक्शन को परिभाषित करते हैं.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "सत्र पंक्तियाँ", 
			    "descr": "सत्र पंक्तियाँ बनाएँ और प्रबंधित करें. सत्र पंक्तियाँ Unified Service Desk में सत्र नाम और सत्र ओवरव्यू जानकारी को परिभाषित करती हैं.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "एजेंट स्क्रिप्ट्स", 
		       "descr": "एजेंट स्क्रिप्ट्स कार्य और उत्तर बनाएँ और प्रबंधित करें. एजेंट स्क्रिप्टिंग एजेंट्स को मार्गदर्शन देता है कि उन्हें कॉल्स पर क्या कहना चाहिए और प्रक्रिया में अगले चरण क्या हैं.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "स्क्रिप्टलेट्स", 
		       "descr": "Unified Service Desk के लिए स्क्रिप्टलेट्स बनाएँ और प्रबंधित करें. स्क्रिप्टलेट्स Unified Service Desk के संदर्भ में निष्पादित होने वाली JavaScript की स्निपेट्स हैं.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "प्रपत्र", 
		       "descr": "वे प्रपत्र बनाएँ और प्रबंधित करें जो घोषणात्मक प्रपत्र परिभाषाओं को संग्रहित करते हैं.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "विकल्प", 
		       "descr": "Unified Service Desk के लिए विकल्प बनाएँ और प्रबंधित करें. विकल्प नाम मान जोड़े हैं जिनका उपयोग घटकों द्वारा किया जा सकता है.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "उपयोगकर्ता सेटिंग्स", 
		       "descr": "Unified Service Desk के लिए उपयोगकर्ता सेटिंग्स बनाएँ और प्रबंधित करें.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "अनुकूलन फ़ाइल", 
		       "descr": "संपीड़ित (.zip) फ़ाइल बनाएँ और प्रबंधित करें जिसमें Unified Service Desk में कस्टम कॉन्फ़िगरेशन के लिए आवश्यक अनुकूलन फ़ाइलें होती हैं.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "कॉन्फ़िगरेशन", 
		       "descr": "Unified Service Desk एसेट्स के लिए कॉन्फ़िगरेशन बनाएँ और प्रबंधित करें जिन्हें विभिन्न उपयोगकर्ताओं के साथ संबद्ध किया जा सकता है.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "ऑडिट और नैदानिकी सेटिंग्स", 
		       "descr": "Unified Service Desk के लिए ऑडिट और नैदानिकी सेटिंग्स बनाएँ और प्रबंधित करें.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "अनुलग्न करें", 
	    "doneButton": "पूर्ण", 
	    "attachButtonAltText": "एक संपीड़ित (.zip) फ़ाइल अनुलग्न करें जिसमें अनुकूलन फ़ाइलें हों.", 
	    "doneButtonAltText": "वह संपीड़ित (.zip) फ़ाइल अपलोड करें जिसमें अनुकूलन फ़ाइलें हैं.", 
	    "deleteButtonAltText": "संपीड़ित (.zip) फ़ाइल निकालें.", 
	    "deleteAttachmentTitle": "संलग्न फ़ाइल हटाएँ", 
	    "fileValidationTitle": "अमान्य FileType", 
	    "fileValidation": "फ़ाइल प्रारूप मान्य नहीं है. आप केवल एक संपीड़ित (.zip) फ़ाइल संलग्न कर सकते हैं. अपनी अनुकूलन फ़ाइलों को एक .zip फ़ाइल में संपीड़ित करें, और उसके बाद फिर से संलग्न करने का प्रयास करें.\r\nUnified Service Desk क्लाइंट अनुप्रयोग के आरंभ किए जाने पर सामग्री को लोड करने के लिए .zip फ़ाइल से फ़ाइलों को निष्कर्षित करेगा.", 
	    "fileLabel": "फ़ाइल", 
	    "deleteConfirmation": "क्या आप संलग्न फ़ाइल को वाकई हटाना चाहते हैं?", 
	    "attachmentFailure": "फ़ाइल अपलोड करना विफल हो गया. एक संपीड़ित (.zip) फ़ाइल को चुनकर फिर से अपलोड करने का प्रयास करें." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "इसे डिफ़ॉल्ट के रूप में चुनने से पूर्व में सेट किया गया कॉन्फ़िगरेशन ओवरराइड हो जाएगा. क्या आप जारी रखना चाहते हैं?", 
	    "OK": "जारी रखें", 
	    "Cancel": "रद्द करें", 
	    "title": "क्या आप इस कॉन्फ़िगरेशन को डिफ़ॉल्ट के रूप में सेट करना चाहते हैं?", 
	    "ErrorTitle": "इस कॉन्फ़िगरेशन को डिफ़ॉल्ट के रूप में सेट नहीं किया जा सकता.", 
	    "ErrorMessage": "केवल सक्रिय कॉन्फ़िगरेशन डिफ़ॉल्ट के रूप में सेट किए जा सकते हैं. इस कॉन्फ़िगरेशन को सक्रिय करें और उसके बाद पुनः प्रयास करें.", 
	    "SetDefaultErrorMessage": "चुना गया कॉन्फ़िगरेशन पहले से ही डिफ़ॉल्ट है.", 
	    "inactiveCloneTitle": "रिकॉर्ड का क्लोन नहीं बनाया जा सकता", 
	    "inactiveCloneAlert": "आप एक निष्क्रिय कॉन्फ़िगरेशन रिकॉर्ड का क्लोन नहीं बना सकते. कॉन्फ़िगरेशन रिकॉर्ड को सक्रिय करें, और फिर से प्रयास करें.", 
	    "cloningError": "रिकॉर्ड की क्लोनिंग करते समय एक त्रुटि हुई:", 
	    "okButton": "ठीक", 
	    "cloneTitle": "मौजूदा​​ कॉन्फ़िगरेशन को क्लोन करें", 
	    "cloneMessage": "इस कॉन्फ़िगरेशन की एक नई प्रतिलिपि बनाएँ.\r\nमूल कॉन्फ़िगरेशन से फ़ील्ड मान और संबंधित रिकॉर्ड संदर्भ क्लोन किए जाएँगे.\r\nमूल कॉन्फ़िगरेशन से संबंधित उपयोगकर्ता क्लोन नहीं किए जाएँगे.", 
	    "cloneButton": "क्लोन करें", 
	    "cloneCancel": "रद्द करें", 
	    "copy": " - प्रतिलिपि बनाएँ" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "उपलब्ध मान", 
	    "selectedValues": "चयनित मान" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
