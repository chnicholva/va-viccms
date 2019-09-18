Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Ποιανού στοιχείου θέλετε να ρυθμίσετε τις παραμέτρους;", 
	    "data": [
			{ 
			    "title": "Φιλοξενούμενα στοιχεία ελέγχου", 
			    "descr": "Δημιουργήστε και διαχειριστείτε φιλοξενούμενα στοιχεία ελέγχου. Τα φιλοξενούμενα στοιχεία ελέγχου είναι τα κύρια στοιχεία που χρησιμοποιούνται για τη δημιουργία εφαρμογών με το Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Γραμμές εργαλείων", 
			    "descr": "Δημιουργήστε και διαχειριστείτε γραμμές εργαλείων και κουμπιά για το Unified Service Desk. Οι γραμμές εργαλείων περιέχουν κουμπιά με εικόνες και κείμενο, ενώ τα κουμπιά χρησιμοποιούνται για την εκτέλεση ενεργειών.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Κλήσεις ενέργειας", 
			    "descr": "Δημιουργήστε και διαχειριστείτε κλήσεις ενέργειας για το Unified Service Desk. Οι κλήσεις ενέργειας μπορούν να προστεθούν σε κουμπιά γραμμών εργαλείων, συμβάντα, κανόνες περιήγησης παραθύρου και δέσμες ενεργειών εκπροσώπου.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Συμβάντα", 
			    "descr": "Δημιουργήστε και διαχειριστείτε συμβάντα. Τα συμβάντα είναι ειδοποιήσεις που ενεργοποιούνται από ένα φιλοξενούμενο στοιχείο ελέγχου, για να υποδειχθεί η εφαρμογή στην οποία συμβαίνει κάτι.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Αναζητήσεις οντοτήτων", 
			    "descr": "Δημιουργήστε και διαχειριστείτε αναζητήσεις οντοτήτων. Οι αναζητήσεις οντοτήτων θέτουν ερωτήματα στις υπηρεσίες web του CRM για την επιστροφή δεδομένων.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Κανόνες περιήγησης παραθύρου", 
			    "descr": "Δημιουργήστε και διαχειριστείτε κανόνες περιήγησης παραθύρου. Οι κανόνες περιήγησης παραθύρου ορίζουν την αλληλεπίδραση ανάμεσα σε διάφορα στοιχεία ελέγχου στο Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Γραμμές περιόδου λειτουργίας", 
			    "descr": "Δημιουργήστε και διαχειριστείτε γραμμές περιόδου λειτουργίας. Οι γραμμές περιόδου λειτουργίας ορίζουν ονόματα περιόδων λειτουργίας και πληροφορίες επισκόπησης περιόδων λειτουργίας στο Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Δέσμες ενεργειών εκπροσώπου", 
		       "descr": "Δημιουργήστε και διαχειριστείτε εργασίες και απαντήσεις δεσμών ενεργειών εκπροσώπου. Οι δέσμες ενεργειών εκπροσώπου παρέχουν οδηγίες στους εκπροσώπους σχετικά με το τι θα πρέπει να λένε σε κλήσεις και αναφέρουν ποια είναι τα επόμενα βήματα στη διαδικασία.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlet", 
		       "descr": "Δημιουργήστε και διαχειριστείτε scriptlet για το Unified Service Desk. Τα scriptlet είναι τμήματα JavaScript που εκτελούνται στο περιβάλλον του Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Φόρμες", 
		       "descr": "Δημιουργήστε και διαχειριστείτε φόρμες που αποθηκεύουν ορισμούς φορμών με δηλώσεις.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Επιλογές", 
		       "descr": "Δημιουργήστε και διαχειριστείτε επιλογές για το Unified Service Desk. Οι επιλογές είναι ζεύγη ονόματος τιμής που μπορούν να χρησιμοποιηθούν από στοιχεία.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Ρυθμίσεις χρηστών", 
		       "descr": "Δημιουργήστε και διαχειριστείτε ρυθμίσεις χρηστών για το Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Αρχείο προσαρμογής", 
		       "descr": "Δημιουργήστε και διαχειριστείτε το συμπιεσμένο (.zip) αρχείο που περιέχει τα αρχεία προσαρμογής που απαιτούνται για την προσαρμοσμένη ρύθμιση παραμέτρων στο Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Ρύθμιση παραμέτρων", 
		       "descr": "Δημιουργήστε και διαχειριστείτε ρυθμίσεις παραμέτρων για πόρους του Unified Service Desk που μπορούν να συσχετιστούν με διαφορετικούς χρήστες.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Ρυθμίσεις ελέγχου &amp; διαγνωστικών", 
		       "descr": "Δημιουργήστε και διαχειριστείτε τις Ρυθμίσεις ελέγχου &amp; διαγνωστικών για το Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Επισύναψη", 
	    "doneButton": "Ολοκληρώθηκε", 
	    "attachButtonAltText": "Επισυνάψτε ένα συμπιεσμένο (.zip) αρχείο που περιέχει τα αρχεία προσαρμογής.", 
	    "doneButtonAltText": "Ανεβάστε το συμπιεσμένο (.zip) αρχείο που περιέχει τα αρχεία προσαρμογής.", 
	    "deleteButtonAltText": "Καταργήστε το συμπιεσμένο (.zip) αρχείο.", 
	    "deleteAttachmentTitle": "Διαγραφή συνημμένου αρχείου", 
	    "fileValidationTitle": "Μη έγκυρο FileType", 
	    "fileValidation": "Η μορφή αρχείου δεν είναι έγκυρη. Μπορείτε να επισυνάψετε μόνο ένα συμπιεσμένο αρχείο (.zip). Συμπιέστε τα αρχεία προσαρμογής σε ένα αρχείο .zip και μετά δοκιμάστε να επαναλάβετε την επισύναψη.\r\nΤο Unified Service Desk θα εξαγάγει τα αρχεία από το αρχείο .zip για τη φόρτωση των περιεχομένων κατά την έναρξη της εφαρμογής πελάτη.", 
	    "fileLabel": "ΑΡΧΕΙΟ", 
	    "deleteConfirmation": "Θέλετε σίγουρα να διαγράψετε το συνημμένο αρχείο;", 
	    "attachmentFailure": "Η αποστολή του αρχείου απέτυχε. Δοκιμάστε ξανά επιλέγοντας να ανεβάσετε ένα συμπιεσμένο (.zip) αρχείο." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Αν οριστεί ως προεπιλογή θα παρακάμψει οποιαδήποτε προηγούμενη καθορισμένη ρύθμιση παραμέτρων. Θέλετε να συνεχίσετε;", 
	    "OK": "Συνέχεια", 
	    "Cancel": "Άκυρο", 
	    "title": "Θέλετε να ορίσετε αυτήν τη ρύθμιση παραμέτρων ως προεπιλογή;", 
	    "ErrorTitle": "Αυτή η ρύθμιση παραμέτρων δεν μπορεί να οριστεί ως προεπιλογή.", 
	    "ErrorMessage": "Μόνο οι ενεργές ρυθμίσεις παραμέτρων μπορούν να οριστούν ως προεπιλογή. Ενεργοποιήστε αυτήν τη ρύθμιση παραμέτρων και μετά δοκιμάστε ξανά.", 
	    "SetDefaultErrorMessage": "Η επιλεγμένη ρύθμιση παραμέτρων είναι ήδη η προεπιλεγμένη.", 
	    "inactiveCloneTitle": "Δεν είναι δυνατή η κλωνοποίηση της καρτέλας", 
	    "inactiveCloneAlert": "Δεν μπορείτε να κλωνοποιήσετε μια ανενεργή καρτέλα ρύθμισης παραμέτρων. Ενεργοποιήστε την καρτέλα ρύθμισης παραμέτρων και δοκιμάστε ξανά.", 
	    "cloningError": "Παρουσιάστηκε σφάλμα κατά την κλωνοποίηση μιας καρτέλας:", 
	    "okButton": "ΟΚ", 
	    "cloneTitle": "Κλωνοποίηση υπάρχουσας ρύθμισης παραμέτρων", 
	    "cloneMessage": "Δημιουργήστε ένα νέο αντίγραφο αυτής της ρύθμισης παραμέτρων.\r\nΘα κλωνοποιηθούν οι τιμές πεδίων και οι σχετιζόμενες αναφορές καρτελών από την αρχική ρύθμιση παραμέτρων.\r\nΔεν θα κλωνοποιηθούν οι χρήστες που συσχετίζονται με την αρχική ρύθμιση παραμέτρων.", 
	    "cloneButton": "Κλωνοποίηση", 
	    "cloneCancel": "Άκυρο", 
	    "copy": " - Αντιγραφή" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Διαθέσιμες τιμές", 
	    "selectedValues": "Επιλεγμένες τιμές" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
