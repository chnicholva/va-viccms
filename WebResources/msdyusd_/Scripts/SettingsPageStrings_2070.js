Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Que item pretende configurar?", 
	    "data": [
			{ 
			    "title": "Controlos Alojados", 
			    "descr": "Criar e gerir controlos alojados. Os Controlos Alojados são os elementos primários utilizados para a criação de aplicações com o Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Barras de Ferramentas", 
			    "descr": "Criar e gerir barras de ferramentas e botões para o Unified Service Desk. As barras de ferramentas contêm botões com imagens e texto e os botões são utilizados para executar ações.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Chamadas de Ação", 
			    "descr": "Criar e gerir chamadas de ação para o Unified Service Desk. As chamadas de ação podem ser adicionadas a botões de barra de ferramentas, eventos, regras de navegação na janela e scripts do agente.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Eventos", 
			    "descr": "Criar e gerir eventos. Os eventos são notificações que um controlo alojado aciona para indicar à aplicação algo que está a ocorrer.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Pesquisas de Entidades", 
			    "descr": "Criar e gerir pesquisas de entidades. As pesquisas de entidades consultam os serviços Web do CRM para devolver dados.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Regras de Navegação na Janela", 
			    "descr": "Criar e gerir regras de navegação na janela. As regras de navegação na janela definem a interação entre vários controlos no Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Linhas de Sessão", 
			    "descr": "Criar e gerir linhas de sessão. As linhas de sessão definem informações de nome e descrição geral de sessão no Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Scripts do Agente", 
		       "descr": "Criar e gerir tarefas e respostas de script do agente. Os scripts do agente fornecem orientação aos agentes sobre o que deverão dizer nas chamadas ou quais são os próximos passos do processo.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Criar e gerir scriptlets para o Unified Service Desk. Os scriptlets são fragmentos de JavaScript que são executados no contexto do Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulários", 
		       "descr": "Criar e gerir formulários que armazenam definições de formulário declarativas.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opções", 
		       "descr": "Criar e gerir opções para o Unified Service Desk. As opções são pares nome/valor que podem ser utilizados pelos componentes.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Definições do Utilizador", 
		       "descr": "Criar e gerir definições do utilizador para o Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Ficheiro de Personalização", 
		       "descr": "Crie e gira o ficheiro comprimido (.zip) que contém os ficheiros de personalização necessários para efetuar uma configuração personalizada no Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configuração", 
		       "descr": "Criar e gerir configurações para recursos do Unified Service Desk que podem ser associados a vários utilizadores.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Definições de Auditoria e Diagnóstico", 
		       "descr": "Criar e gerir Definições de Auditoria e Diagnóstico para o Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Anexar", 
	    "doneButton": "Concluído", 
	    "attachButtonAltText": "Anexe um ficheiro comprimido (.zip) que contenha os ficheiros de personalização.", 
	    "doneButtonAltText": "Carregue o ficheiro comprimido (.zip) que contém os ficheiros de personalização.", 
	    "deleteButtonAltText": "Remova o ficheiro comprimido (.zip).", 
	    "deleteAttachmentTitle": "Elimine o ficheiro anexado", 
	    "fileValidationTitle": "Tipo de Ficheiro Inválido", 
	    "fileValidation": "O formato de ficheiro não é válido. Só é possível anexar um ficheiro comprimido (.zip). Comprima os seus ficheiros de personalização num ficheiro .zip e, em seguida, tente anexar novamente.\r\nO Unified Service Desk irá extrair os ficheiros do ficheiro .zip para carregar os conteúdos quando a aplicação for iniciada.", 
	    "fileLabel": "FICHEIRO", 
	    "deleteConfirmation": "Tem a certeza de que pretende eliminar o ficheiro anexado?", 
	    "attachmentFailure": "O carregamento de ficheiro falhou. Selecione um ficheiro comprimido (.zip) para carregar e tente novamente." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Ao selecionar esta opção como a predefinição irá substituir quaisquer configurações previamente definidas. Pretende continuar?", 
	    "OK": "Continuar", 
	    "Cancel": "Cancelar", 
	    "title": "Pretende definir esta configuração como a predefinição?", 
	    "ErrorTitle": "Esta configuração não pode ser definida como predefinição.", 
	    "ErrorMessage": "Apenas as configurações ativas podem ser definidas como a predefinição. Ative esta configuração e, em seguida, tente novamente.", 
	    "SetDefaultErrorMessage": "A configuração selecionada já se encontra definida como a predefinição.", 
	    "inactiveCloneTitle": "Não é possível clonar o registo", 
	    "inactiveCloneAlert": "Não é possível clonar um registo de configuração inativo. Ative o registo de configuração e, em seguida, tente novamente.", 
	    "cloningError": "Ocorreu um erro ao clonar um registo:", 
	    "okButton": "OK", 
	    "cloneTitle": "Clonar a Configuração Existente", 
	    "cloneMessage": "Crie uma cópia nova desta configuração.\r\nOs valores dos campos e as referências de registo relacionadas da configuração original serão clonados.\r\nOs utilizadores associados à configuração original não serão clonados.", 
	    "cloneButton": "Clonar", 
	    "cloneCancel": "Cancelar", 
	    "copy": " - Copiar" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Valores Disponíveis", 
	    "selectedValues": "Valores Selecionados" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
