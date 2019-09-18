Type.registerNamespace("USD.Resources"); 
(function () { 
    USD.Resources.SettingsPage = 
	{ 
	    "headertitle": "Unified Service Desk", 
	    "headerdesc": "Bạn muốn đặt cấu hình mục nào?", 
	    "data": [
			{ 
			    "title": "Kiểm soát Tổ chức", 
			    "descr": "Tạo và quản lý kiểm soát tổ chức. Kiểm soát Tổ chức là yếu tố chính được sử dụng để xây dựng ứng dụng bằng Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-hostedcontrols",
			    "logicalname": "uii_hostedapplication"
			}, 
			{ 
			    "title": "Thanh công cụ", 
			    "descr": "Tạo và quản lý thanh công cụ và nút cho Unified Service Desk. Thanh công cụ chứa nút có hình ảnh và văn bản và nút được sử dụng để thực thi hành động.", 
			    "cssclass": "ms-usd-ImageStrip-toolbars",
			    "logicalname": "msdyusd_toolbarstrip"
			}, 
			{ 
			    "title": "Cuộc gọi Hành động", 
			    "descr": "Tạo và quản lý cuộc gọi hành động cho Unified Service Desk. Bạn có thể thêm cuộc gọi hành động vào các nút trên thanh công cụ, sự kiện, quy tắc điều hướng cửa sổ và mã lệnh của tổng đài viên.", 
			    "cssclass": "ms-usd-ImageStrip-actioncalls",
			    "logicalname": "msdyusd_agentscriptaction"
			}, 
			{ 
			    "title": "Sự kiện", 
			    "descr": "Tạo và quản lý sự kiện. Sự kiện là thông báo mà kiểm soát tổ chức kích hoạt để cho ứng dụng biết rằng có điều gì đó đang xảy ra.", 
			    "cssclass": "ms-usd-ImageStrip-events",
			    "logicalname": "msdyusd_uiievent"
			}, 
			{ 
			    "title": "Tìm kiếm Thực thể", 
			    "descr": "Tạo và quản lý tìm kiếm thực thể. Tìm kiếm thực thể truy vấn dịch vụ web CRM để trả về dữ liệu.", 
			    "cssclass": "ms-usd-ImageStrip-entitysearches",
			    "logicalname": "msdyusd_entitysearch"
			}, 
			{ 
			    "title": "Quy tắc Điều hướng Cửa sổ", 
			    "descr": "Tạo và quản lý quy tắc điều hướng cửa sổ. Quy tắc điều hướng cửa sổ xác định tương tác giữa các kiểm soát khác nhau trong Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-windownavigationrules",
			    "logicalname": "msdyusd_windowroute"
			}, 
			{ 
			    "title": "Mô tả Phiên", 
			    "descr": "Tạo và quản lý mô tả phiên. Mô tả phiên xác định tên phiên và thông tin tổng quát về phiên trong Unified Service Desk.", 
			    "cssclass": "ms-usd-ImageStrip-sessionlines",
			    "logicalname": "msdyusd_sessioninformation"
			}, 
		   { 
		       "title": "Mã lệnh của Tổng đài viên", 
		       "descr": "Tạo và quản lý câu trả lời và nhiệm vụ của mã lệnh của tổng đài viên. Mã lệnh của tổng đài viên cung cấp hướng dẫn cho tổng đài viên về những gì họ nên nói trong các cuộc gọi cũng như những bước tiếp theo trong quá trình.", 
		       "cssclass": "ms-usd-ImageStrip-agentscripts",
		       "logicalname": "msdyusd_task"
		   }, 
		   { 
		       "title": "Scriptlet", 
		       "descr": "Tạo và quản lý scriptlet cho Unified Service Desk. Scriptlet là đoạn mã JavaScript được thực thi trong ngữ cảnh của Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-scriptlets",
		       "logicalname": "msdyusd_scriptlet"
		   }, 
		   { 
		       "title": "Biểu mẫu", 
		       "descr": "Tạo và quản lý biểu mẫu lưu trữ định nghĩa biểu mẫu khai báo.", 
		       "cssclass": "ms-usd-ImageStrip-forms",
		       "logicalname": "msdyusd_form"
		   }, 
		   { 
		       "title": "Tùy chọn", 
		       "descr": "Tạo và quản lý tùy chọn cho Unified Service Desk. Tùy chọn là cặp giá trị tên có thể được sử dụng bởi các thành phần.", 
		       "cssclass": "ms-usd-ImageStrip-options",
		       "logicalname": "uii_option"
		   }, 
		   { 
		       "title": "Thiết đặt Người dùng", 
		       "descr": "Tạo và quản lý thiết đặt người dùng cho Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-usersettings",
		       "logicalname": "msdyusd_usersettings"
		   }, 
		   { 
		       "title": "Tệp Tùy chỉnh", 
		       "descr": "Tạo và quản lý tệp nén (.zip) chứa tệp tùy chỉnh được yêu cầu cho cấu hình tùy chỉnh trong Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-customizationfiles",
		       "logicalname": "msdyusd_customizationfiles"
		   }, 
		   { 
		       "title": "Cấu hình", 
		       "descr": "Tạo và quản lý cấu hình cho nội dung Unified Service Desk có thể được kết hợp với những người dùng khác.", 
		       "cssclass": "ms-usd-ImageStrip-configuration",
		       "logicalname": "msdyusd_configuration"
		   }, 
		   { 
		       "title": "Thiết đặt Kiểm tra và Chẩn đoán", 
		       "descr": "Tạo và quản lý Thiết đặt Kiểm tra và Chẩn đoán cho Unified Service Desk.", 
		       "cssclass": "ms-usd-ImageStrip-auditanddiagnosticssetting",
		       "logicalname": "msdyusd_auditanddiagnosticssetting"
		   } 
	    ] 
	}; 
    //Resource strings for customizationFiles entity FileUpload control 
    USD.Resources.CustomizationFilesPage = 
	{ 
	    "attachButton": "Đính kèm", 
	    "doneButton": "Hoàn tất", 
	    "attachButtonAltText": "Đính kèm tệp nén (.zip) chứa tệp tùy chỉnh.", 
	    "doneButtonAltText": "Tải lên tệp nén (.zip) chứa tệp tùy chỉnh.", 
	    "deleteButtonAltText": "Xóa tệp nén (.zip).", 
	    "deleteAttachmentTitle": "Xóa tệp được đính kèm", 
	    "fileValidationTitle": "Loại Tệp Không hợp lệ", 
	    "fileValidation": "Định dạng tệp không hợp lệ. Bạn chỉ có thể đính kèm tệp nén (.zip). Nén các tệp tùy chỉnh của bạn thành một tệp .zip rồi thử đính kèm lại.\r\nUnified Service Desk sẽ giải nén các tệp từ tệp .zip để tải nội dung khi ứng dụng khách khởi động.", 
	    "fileLabel": "TỆP", 
	    "deleteConfirmation": "Bạn có chắc chắn muốn xóa tệp được đính kèm không?", 
	    "attachmentFailure": "Tải lên tệp không thành công. Hãy thử lại bằng cách chọn tệp nén (.zip) để tải lên." 
	}; 
    USD.Resources.ConfigurationPage = 
	{ 
	    "IsDefaultNotification": "Chọn tùy chọn này là mặc định sẽ thay thế mọi cấu hình đã đặt trước đó. Bạn có muốn tiếp tục không?", 
	    "OK": "Tiếp tục", 
	    "Cancel": "Hủy", 
	    "title": "Bạn có muốn đặt cấu hình này là mặc định không?", 
	    "ErrorTitle": "Không thể đặt cấu hình này là mặc định.", 
	    "ErrorMessage": "Chỉ có thể đặt các cấu hình hiện hoạt là mặc định. Kích hoạt cấu hình này rồi thử lại.", 
	    "SetDefaultErrorMessage": "Cấu hình đã chọn đã được đặt là mặc định.", 
	    "inactiveCloneTitle": "Không thể sao y bản ghi", 
	    "inactiveCloneAlert": "Bạn không thể sao y bản ghi cấu hình không hoạt động. Kích hoạt bản ghi cấu hình và thử lại.", 
	    "cloningError": "Đã xảy ra lỗi trong khi sao y bản ghi:", 
	    "okButton": "OK", 
	    "cloneTitle": "Sao y Cấu hình Hiện có", 
	    "cloneMessage": "Tạo bản sao mới của cấu hình này.\r\nCác giá trị trường và tham chiếu bản ghi có liên quan từ cấu hình ban đầu sẽ được sao y.\r\nNgười dùng được liên kết với cấu hình ban đầu sẽ không được sao y.", 
	    "cloneButton": "Sao y", 
	    "cloneCancel": "Hủy", 
	    "copy": " - Sao chép" 
	}; 
    //Resource strings for AuditAndDiagnosticsSetting entity UserSchemaSettings 
    USD.Resources.AuditAndDiagnosticsSettingPage = 
	{ 
	    "availableValues": "Giá trị Có sẵn", 
	    "selectedValues": "Giá trị đã Chọn" 
	}; 
})(); 
if (USD.OnPageLoad !== undefined && USD.OnPageLoad !== null) { USD.OnPageLoad() }; 
