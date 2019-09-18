Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Que item você gostaria de configurar?", 
	    "data": [
			{ 
			    "title": "Controles Hospedados", 
			    "descr": "Crie e gerencie controles hospedados. Controles Hospedados são elementos primários usados para criar aplicativos usando o Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Barras de Ferramentas", 
			    "descr": "Crie e gerencie barras de ferramentas e botões para o Unified Service Desk. As barras de ferramentas contêm botões com imagens e texto, e os botões são usados para executar ações.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Chamadas de Ação", 
			    "descr": "Crie e gerencie chamadas de ação para o Unified Service Desk. As chamadas de ação podem ser adicionadas aos botões da barra de ferramentas, eventos, regras de navegação da janela e scripts do agente.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Eventos", 
			    "descr": "Crie e gerencie eventos. Eventos são notificações que um controle hospedado dispara para indicar ao aplicativo que algo está ocorrendo.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Pesquisas de Entidades", 
			    "descr": "Crie e gerencie pesquisas de entidades. As pesquisas de entidades consultam os serviços Web do CRM para retornar dados.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Regras de Navegação da Janela", 
			    "descr": "Crie e gerencie regras de navegação da janela. As regras de navegação definem a interação entre vários controles no Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Linhas de Sessão", 
			    "descr": "Crie e gerencie linhas de sessão. As linhas de sessão definem o nome da sessão e informações de visão geral da sessão no Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Scripts do Agente", 
		       "descr": "Crie e gerencie tarefas e respostas do script do agente. O script do agente fornece orientações aos agentes sobre o que eles devem dizer nas chamadas e quais são as próximas etapas do processo.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlets", 
		       "descr": "Crie e gerencie scriptlets para o Unified Service Desk. Scriptlets são snippets de JavaScript que são executados no contexto do Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Formulários", 
		       "descr": "Crie e gerencie formulários que armazenam definições de formulário declarativas.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Opções", 
		       "descr": "Crie e gerencie opções para Unified Service Desk. As opções são pares de valores de nome que podem ser usados pelos componentes.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Configurações do Usuário", 
		       "descr": "Crie e gerencie as configurações do usuário para o Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Arquivo de Personalização", 
		       "descr": "Crie e gerencie o arquivo compactado (.zip) que contém os arquivos de personalização necessários para a configuração personalizada do Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Configuração", 
		       "descr": "Crie e gerencie configurações para ativos do Unified Service Desk que podem ser associados a usuários diferentes.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Configurações de Auditoria e Diagnóstico", 
		       "descr": "Crie e gerencie as Configurações de Auditoria e Diagnóstico para o Unified Service Desk.", 
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
	    "attachButtonAltText": "Anexe um arquivo compactado (.zip) que contém os arquivos de personalização.", 
	    "doneButtonAltText": "Carregue o arquivo compactado (.zip) que contém os arquivos de personalização.", 
	    "deleteButtonAltText": "Remova o arquivo compactado (.zip).", 
	    "deleteAttachmentTitle": "Excluir arquivo anexado", 
	    "fileValidationTitle": "FileType Inválido", 
	    "fileValidation": "O formato de arquivo não é válido. Você só pode anexar um arquivo compactado (.zip). Comprima seus arquivos de personalização em um arquivo .zip e tente anexar novamente.\r\nO Unified Service Desk extrairá arquivos do .zip para carregar o conteúdo quando o aplicativo cliente for iniciado.", 
	    "fileLabel": "ARQUIVO", 
	    "deleteConfirmation": "Tem certeza de que deseja excluir o arquivo anexado?", 
	    "attachmentFailure": "Falha no upload do arquivo. Tente novamente escolhendo um arquivo compactado (.zip) para carregar." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "A seleção dessa opção como padrão substituirá qualquer configuração previamente definida. Deseja continuar?", 
	    "OK": "Continuar", 
	    "Cancel": "Cancelar", 
	    "title": "Deseja definir essa configuração como padrão?", 
	    "ErrorTitle": "Essa configuração não pode ser definida como padrão.", 
	    "ErrorMessage": "Somente configurações ativas podem ser definidas como padrão. Ative essa configuração e tente novamente.", 
	    "SetDefaultErrorMessage": "A configuração selecionada já é o padrão.", 
	    "inactiveCloneTitle": "Não é possível clonar o registro", 
	    "inactiveCloneAlert": "Você não pode clonar um registro de configuração inativa. Ative o registro de configuração e tente novamente.", 
	    "cloningError": "Ocorreu um erro durante a clonagem de um registro:", 
	    "okButton": "OK", 
	    "cloneTitle": "Clonar Configuração Existente", 
	    "cloneMessage": "Crie uma nova cópia desta configuração.\r\nOs valores dos campos e as referências de registros relacionados da configuração original serão clonados.\r\nOs usuários associados à configuração original não serão clonados.", 
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
