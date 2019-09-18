Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "構成する項目を選択してください。", 
	    "data": [
			{ 
			    "title": "ホストされたコントロール", 
			    "descr": "ホストされたコントロールを作成および管理します。ホストされたコントロールは、Unified Service Desk を使用してアプリケーションを作成するために使用する主な要素です。", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "ツール バー", 
			    "descr": "Unified Service Desk のツール バーとボタンを作成および管理します。ツール バーの各ボタンにはアイコンとテキストが付いていて、ボタンを使用してアクションを実行できます。", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "アクション コール", 
			    "descr": "Unified Service Desk のアクション コールを作成および管理します。アクション コールは、ツールバーのボタン、イベント、ウィンドウ ナビゲーション ルール、およびエージェント スクリプトに追加できます。", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "イベント", 
			    "descr": "イベントを作成および管理します。イベントは、ホストされたコントロールがトリガーする通知で、何かが発生していることをアプリケーションに示します。", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "エンティティ検索", 
			    "descr": "エンティティ検索を作成および管理します。エンティティ検索は、CRM Web サービスに対してクエリを出し、データを返します。", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "ウィンドウ ナビゲーション ルール", 
			    "descr": "ウィンドウのナビゲーション ルールを作成および管理します。ウィンドウ ナビゲーション ルールは、Unified Service Desk の各種のコントロール間の相互作用を定義します。", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "セッション行", 
			    "descr": "セッション行を作成および管理します。セッション行は、Unified Service Desk のセッション名とセッションの概要情報を定義します。", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "エージェント スクリプト", 
		       "descr": "エージェント スクリプトのタスクと回答を作成および管理します。エージェント スクリプトは、通話で言うことやプロセスの次のステップは何かについてエージェントにガイダンスを提供します。", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "スクリプトレット", 
		       "descr": "Unified Service Desk のスクリプトレットを作成および管理します。スクリプトレットは、Unified Service Desk のコンテキストで実行される JavaScript のスニペットです。", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "フォーム", 
		       "descr": "宣言型フォームの定義を格納するフォームを作成および管理します。", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "オプション", 
		       "descr": "Unified Service Desk のオプションを作成および管理します。オプションは、コンポーネントが使用できる名前値のペアです。", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "ユーザー設定", 
		       "descr": "Unified Service Desk のユーザー設定を作成および管理します。", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "カスタマイズ ファイル", 
		       "descr": "Unified Service Desk でのカスタム構成に必要なカスタマイズ ファイルを含む圧縮 (.zip) ファイルを作成および管理します。", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "構成", 
		       "descr": "各ユーザーに関連付けることができる Unified Service Desk 資産の構成を作成および管理します。", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "監査と診断の設定", 
		       "descr": "Unified Service Desk の監査と診断の設定を作成および管理します。", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "添付", 
	    "doneButton": "完了", 
	    "attachButtonAltText": "カスタマイズ ファイルを含む圧縮 (.zip) ファイルを添付します。", 
	    "doneButtonAltText": "カスタマイズ ファイルを含む圧縮 (.zip) ファイルをアップロードします。", 
	    "deleteButtonAltText": "圧縮 (.zip) ファイルを削除します。", 
	    "deleteAttachmentTitle": "添付ファイルの削除", 
	    "fileValidationTitle": "無効な FileType", 
	    "fileValidation": "ファイル形式が無効です。圧縮 (.zip) ファイルのみを添付できます。カスタマイズ ファイルを .zip ファイルに圧縮してから、もう一度添付してください。\r\nUnified Service Desk で .zip ファイルからファイルが抽出され、クライアント アプリケーションが開始されたときにファイルの内容が読み込まれます。", 
	    "fileLabel": "ファイル", 
	    "deleteConfirmation": "添付ファイルを削除しますか?", 
	    "attachmentFailure": "ファイルのアップロードが失敗しました。アップロードする圧縮 (.zip) ファイルを選択して、やり直してください。" 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "これを既定として選択すると、以前に設定した構成は上書きされます。続行しますか?", 
	    "OK": "続行", 
	    "Cancel": "キャンセル", 
	    "title": "この構成を既定として設定しますか?", 
	    "ErrorTitle": "この構成は既定として設定できません。", 
	    "ErrorMessage": "アクティブな構成だけを既定として設定できます。この構成をアクティブ化してから、やり直してください。", 
	    "SetDefaultErrorMessage": "選択した構成は、既に既定になっています。", 
	    "inactiveCloneTitle": "レコードを複製できません", 
	    "inactiveCloneAlert": "非アクティブなレコードを複製することはできません。構成レコードをアクティブ化してから、やり直してください。", 
	    "cloningError": "レコードの複製中にエラーが発生しました:", 
	    "okButton": "OK", 
	    "cloneTitle": "既存の構成を複製", 
	    "cloneMessage": "この構成の新しいコピーを作成します。\r\nフィールド値および関連するレコード参照が元の構成から複製されます。\r\n元の構成に関連付けられたユーザーは複製されません。", 
	    "cloneButton": "複製", 
	    "cloneCancel": "キャンセル", 
	    "copy": " - コピー" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "使用可能な値", 
	    "selectedValues": "選択された値" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
