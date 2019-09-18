Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Który element chcesz skonfigurować?", 
	    "data": [
			{ 
			    "title": "Hostowane kontrolki", 
			    "descr": "Utwórz hostowane kontrolki i zarządzaj nimi. Hostowane kontrolki to podstawowe elementy używane przy tworzeniu aplikacji przy użyciu rozwiązania Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Paski narzędzi", 
			    "descr": "Utwórz paski narzędzi i zarządzaj nimi na potrzeby rozwiązania Unified Service Desk. Paski narzędzi zawierają przyciski z obrazami i tekstem. Przyciski służą do wykonywania działań.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Wywołania akcji", 
			    "descr": "Utwórz wywołania akcji i zarządzaj nimi na potrzeby rozwiązania Unified Service Desk. Wywołania akcji można dodawać do przycisków pasków narzędzi, zdarzeń, reguł nawigacji w oknie i skryptów agenta.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Zdarzenia", 
			    "descr": "Utwórz zdarzenia i zarządzaj nimi. Zdarzenia są powiadomieniami, które hostowana kontrolka może wyzwolić, aby poinformować aplikację, że coś się dzieje.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Wyszukiwania encji", 
			    "descr": "Utwórz wyszukiwania encji i zarządzaj nimi. Wyszukiwania encji wysyłają do usług CRM sieci Web zapytania o dane.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Reguły nawigacji w oknie", 
			    "descr": "Utwórz reguły nawigacji w oknie i zarządzaj nimi. Reguły nawigacji w oknie określają interakcję między różnymi kontrolkami w rozwiązaniu Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Wiersze sesji", 
			    "descr": "Utwórz wiersze sesji i zarządzaj nimi. Wiersze sesji określają nazwę sesji oraz ogólne informacje o sesji w rozwiązaniu Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Skrypty agenta", 
		       "descr": "Utwórz zadania i odpowiedzi skryptu agenta i zarządzaj nimi. Obsługa skryptów agenta podaje wskazówki pomocne agentom, podpowiadające im co powinni mówić podczas rozmów telefonicznych i jakie są następne kroki w procesie.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Skryptlety", 
		       "descr": "Utwórz skryplety i zarządzaj nimi na potrzeby rozwiązania Unified Service Desk. Skryptlety są urywkami kodu JavaScript wykonywanymi w kontekście rozwiązania Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formularze", 
		       "descr": "Utwórz formularze przechowujące deklaratywne definicje formularzy i zarządzaj nimi.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opcje", 
		       "descr": "Utwórz opcji i zarządzaj nimi na potrzeby rozwiązania Unified Service Desk. Opcje są parami nazw i wartości, które mogą być używane przez składniki.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Ustawienia użytkownika", 
		       "descr": "Utwórz ustawienia użytkownika zarządzaj nimi na potrzeby rozwiązania Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Plik dostosowania", 
		       "descr": "Tworzenie skompresowanego pliku (.zip) zawierającego pliki dostosowania niezbędne do niestandardowego skonfigurowania programu Unified Service Desk oraz zarządzanie tym plikiem.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Konfiguracja", 
		       "descr": "Utwórz konfiguracje i zarządzaj nimi na potrzeby zasobów rozwiązania Unified Service Desk, które można kojarzyć z różnymi użytkownikami.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Ustawienia inspekcji i diagnostyki", 
		       "descr": "Tworzenie ustawień inspekcji i diagnostyki dla programu Unified Service Desk oraz zarządzanie nimi.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Dołącz", 
	    "doneButton": "Gotowe", 
	    "attachButtonAltText": "Dołączanie skompresowanego pliku (.zip) zawierającego pliki dostosowania.", 
	    "doneButtonAltText": "Przekazywanie na serwer skompresowanego pliku (.zip) zawierającego pliki dostosowania.", 
	    "deleteButtonAltText": "Usuwanie skompresowanego pliku (.zip).", 
	    "deleteAttachmentTitle": "Usuń dołączony plik", 
	    "fileValidationTitle": "Nieprawidłowy typ pliku", 
	    "fileValidation": "Format pliku jest nieprawidłowy. Można dołączyć tylko plik skompresowany (ZIP). Skompresuj pliki dostosowania w pliku ZIP, a następnie spróbuj ponownie dołączyć plik.\r\nRozwiązanie Unified Service Desk wyodrębni pliki z pliku ZIP w celu załadowania zawartości, gdy zostanie uruchomiona aplikacja kliencka.", 
	    "fileLabel": "PLIK", 
	    "deleteConfirmation": "Czy na pewno chcesz usunąć dołączony plik?", 
	    "attachmentFailure": "Przekazanie pliku nie powiodło się. Spróbuj ponownie, wybierając plik skompresowany (.zip)." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Wybranie tej konfiguracji jako domyślnej spowoduje zastąpienie ustawionej uprzednio konfiguracji. Czy chcesz kontynuować?", 
	    "OK": "Kontynuuj", 
	    "Cancel": "Anuluj", 
	    "title": "Czy chcesz ustawić tę konfigurację jako domyślną?", 
	    "ErrorTitle": "Tej konfiguracji nie można ustawić jako domyślnej.", 
	    "ErrorMessage": "Jako domyślną konfigurację można ustawić tylko aktywną konfigurację. Aktywuj tę konfigurację, a następnie spróbuj ponownie.", 
	    "SetDefaultErrorMessage": "Wybrana konfiguracja jest już konfiguracją domyślną.", 
	    "inactiveCloneTitle": "Nie można sklonować rekordu", 
	    "inactiveCloneAlert": "Nie można sklonować nieaktywnego rekordu konfiguracji. Aktywuj rekord konfiguracji i spróbuj ponownie.", 
	    "cloningError": "Wystąpił błąd podczas klonowania rekordu:", 
	    "okButton": "OK", 
	    "cloneTitle": "Sklonuj istniejącą konfigurację", 
	    "cloneMessage": "Tworzenie nowej kopii tej konfiguracji.\r\nWartości pól oraz odniesienia do pokrewnych rekordów z oryginalnej konfiguracji zostaną sklonowane.\r\nUżytkownicy skojarzeni z oryginalną konfiguracją nie zostaną sklonowani.", 
	    "cloneButton": "Klonuj", 
	    "cloneCancel": "Anuluj", 
	    "copy": " - Kopiuj" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Dostępne wartości", 
	    "selectedValues": "Wybrane wartości" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
