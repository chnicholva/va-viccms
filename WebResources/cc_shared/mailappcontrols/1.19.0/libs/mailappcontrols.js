var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MscrmControls;
(function (MscrmControls) {
    var Account;
    (function (Account) {
        "use strict";
        var NamePropertyName = "name";
        var AccountControl = (function () {
            function AccountControl() {
            }
            AccountControl.prototype.init = function (context, notifyOutputChanged, state) {
                this._context = context;
            };
            AccountControl.prototype.updateView = function (context) {
                this._context = context;
                if (!context.parameters.value || !context.parameters.value.raw) {
                    return context.factory.createElement("CONTAINER", {
                        id: "AccountControlEmptyContainer",
                        key: "AccountControlEmptyContainer",
                    });
                }
                this._accountRecord = this._context.parameters.value.raw;
                var headerLabel = context.factory.createElement("LABEL", {
                    key: "AccountControlHeaderLabel",
                    style: {
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: this._context.theming.fontsizes.font100,
                        fontFamily: this._context.theming.fontfamilies.regular,
                        paddingBottom: this._context.theming.measures.measure100,
                    },
                }, this._context.resources.getString("AccountControl_Header"));
                return context.factory.createElement("CONTAINER", {
                    id: "AccountControlContainer",
                    key: "AccountControlContainer",
                    style: {
                        display: "block",
                        width: "100%",
                        color: this._context.theming.colors.grays.gray05,
                        backgroundColor: this._context.theming.colors.whitebackground,
                        paddingTop: this._context.theming.measures.measure100,
                        paddingLeft: this._context.theming.measures.measure100,
                        paddingRight: this._context.theming.measures.measure050,
                        paddingBottom: this._context.theming.measures.measure100,
                        boxSizing: "border-box",
                    },
                }, [headerLabel, this._renderAccountForm()]);
            };
            AccountControl.prototype._renderAccountForm = function () {
                return this._context.factory.createElement("CONTAINER", {
                    id: "AccountForm",
                    key: "AccountForm",
                    style: {
                        "display": "flex",
                        "flexDirection": "row",
                        "alignItems": "center",
                        "justifyContent": "space-between",
                    },
                }, [this._renderAccountIcon(), this._renderAccountLink(), this._renderCommandBar()]);
            };
            AccountControl.prototype._renderAccountLink = function () {
                var accountName = this._getAccountName();
                return this._context.factory.createElement("LABEL", {
                    key: "AccountLink",
                    id: "AccountLink",
                    style: {
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "block",
                        flex: "1 1 auto",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: this._context.theming.colors.basecolor.blue.blue3,
                        fontSize: this._context.theming.fontsizes.font100,
                        fontFamily: this._context.theming.fontfamilies.semibold,
                    },
                    tabIndex: 0,
                    title: accountName,
                    role: "link",
                    onClick: this._onAccountNameClick.bind(this),
                    onKeyDown: this._onAccountNameKeyDown.bind(this),
                }, [accountName]);
            };
            AccountControl.prototype._onAccountNameClick = function () {
                var formOptions = {
                    entityName: this._getEntityName(),
                    entityId: this._getAccountId(),
                };
                this._context.navigation.openForm(formOptions);
            };
            AccountControl.prototype._onAccountNameKeyDown = function (e) {
                if (e.keyCode === 13) {
                    this._onAccountNameClick();
                }
            };
            AccountControl.prototype._renderAccountIcon = function () {
                var imageUrl = this._getAccountImageUrl();
                var entityImage = this._context.factory.createElement("ENTITYIMAGE", {
                    key: "AccountIcon",
                    hasPrimaryImageField: true,
                    style: {
                        borderRadius: "50%",
                        display: "block",
                        height: "100%",
                        color: this._context.theming.colors.basecolor.white,
                    },
                    alt: this._getAccountName(),
                    imageSrc: imageUrl,
                    entityPrimaryField: this._getAccountName(),
                });
                return this._context.factory.createElement("CONTAINER", {
                    key: "AccountIconContainer",
                    id: "AccountIconContainer",
                    style: {
                        display: "block",
                        flex: "0 0 " + this._context.theming.measures.measure250,
                        borderRadius: "50%",
                        width: this._context.theming.measures.measure250,
                        height: this._context.theming.measures.measure250,
                        lineHeight: this._context.theming.measures.measure250,
                        backgroundColor: this._context.theming.colors.grays.gray01,
                        color: this._context.theming.colors.grays.gray07,
                        fontSize: "16px",
                        textAlign: "center",
                        marginRight: this._context.theming.measures.measure100,
                    },
                }, entityImage);
            };
            AccountControl.prototype._getAccountImageUrl = function () {
                return null;
            };
            AccountControl.prototype._getAccountName = function () {
                return this._accountRecord.Name;
            };
            AccountControl.prototype._getAccountId = function () {
                return this._accountRecord.Id.toString();
            };
            AccountControl.prototype._getEntityName = function () {
                return this._accountRecord.LogicalName;
            };
            AccountControl.prototype._renderCommandBar = function () {
                var entityReference = {
                    Id: this._getAccountId(),
                    LogicalName: this._getEntityName(),
                    Name: this._getAccountName(),
                };
                return this._context.factory.createElement("COMMANDBAR", {
                    key: "AccountControlTrackCommandBar",
                    iconPosition: 1,
                    mainMenuLength: 1,
                    width: 50,
                    commandbarDisplayMode: 0,
                    ribbonId: "QuickForm:" + this._getEntityName(),
                    selectedRecords: [entityReference],
                    customCommandManagerStyle: {
                        margin: "0px",
                        border: "0px none",
                    },
                    commandBarStyle: {
                        container: {
                            margin: "0px",
                            border: "0px none",
                        },
                        list: {
                            margin: "0px",
                        },
                        listItem: {
                            width: "50px",
                        },
                        listItemBody: {
                            text: {
                                display: "none",
                            },
                            icon: {
                                lineHeight: "16px",
                            },
                            iconWrapperStyles: {
                                margin: "0px",
                                fontSize: "16px",
                                height: this._context.theming.measures.measure200,
                                lineHeight: this._context.theming.measures.measure200,
                                padding: "0px",
                                border: "0px none",
                                background: "transparent",
                                display: "flex",
                                overflow: "hidden",
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                            button: {
                                padding: "0px",
                                backgroundColor: "transparent",
                                lineHeight: this._context.theming.measures.measure200,
                                height: this._context.theming.measures.measure200,
                                borderWidth: 0,
                                cursor: "pointer",
                                ":hover": {
                                    backgroundColor: this._context.theming.colors.basecolor.white,
                                },
                                alignItems: "center",
                            },
                            flyoutButtonChevronIconWrapper: {
                                padding: "0px",
                            },
                        },
                    },
                });
            };
            AccountControl.prototype.getOutputs = function () {
                return null;
            };
            AccountControl.prototype.destroy = function () {
            };
            return AccountControl;
        }());
        Account.AccountControl = AccountControl;
    })(Account = MscrmControls.Account || (MscrmControls.Account = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var FollowRestrictedRecipientsControl = (function () {
            function FollowRestrictedRecipientsControl() {
            }
            FollowRestrictedRecipientsControl.prototype.init = function (context, notifyOutputChanged, state) {
                this._context = context;
            };
            FollowRestrictedRecipientsControl.prototype.updateView = function (context) {
                this._context = context;
                var hasRecords = this._context.parameters.Records && this._context.parameters.Records.raw && Array.isArray(this._context.parameters.Records.raw);
                if (!hasRecords) {
                    return null;
                }
                return this._context.factory.createElement("CONTAINER", {
                    id: "FollowRestrictedRecipientsContainer",
                    key: "FollowRestrictedRecipientsContainer",
                    style: {
                        display: "block",
                    },
                }, [
                    this._renderErrorLabel(),
                    this._renderListHeader(),
                    this._renderRecordsList(),
                ]);
            };
            FollowRestrictedRecipientsControl.prototype._renderRecordsList = function () {
                var _this = this;
                return this._context.factory.createElement("CONTAINER", {
                    id: "FollowRestrictedRecipientsListContainer",
                    key: "FollowRestrictedRecipientsListContainer",
                    style: {
                        display: "block",
                    },
                }, this._context.parameters.Records.raw.reduce(function (l, r) { return l.concat(_this._renderRecord(r)); }, []));
            };
            FollowRestrictedRecipientsControl.prototype._renderErrorLabel = function () {
                var message = this._context.resources.getString("RECIPIENTS_DONT_ALLOW_TO_FOLLOW");
                return this._context.factory.createElement("LABEL", {
                    key: "ErrorText",
                    id: "ErrorText",
                    style: {
                        display: "block",
                        color: this._context.theming.colors.basecolor.red.red4,
                        fontSize: this._context.theming.fontsizes.font100,
                        fontFamily: this._context.theming.fontfamilies.regular,
                        marginBottom: this._context.theming.measures.measure050,
                    },
                    title: message,
                }, [message]);
            };
            FollowRestrictedRecipientsControl.prototype._renderListHeader = function () {
                var header = this._context.resources.getString("RECIPIENTS_WHO_CANT_BE_FOLLOWED");
                return this._context.factory.createElement("LABEL", {
                    key: "ListHeader",
                    id: "ListHeader",
                    style: {
                        display: "block",
                        color: this._context.theming.colors.basecolor.grey.grey7,
                        fontSize: this._context.theming.fontsizes.font100,
                        fontFamily: this._context.theming.fontfamilies.regular,
                    },
                    title: header,
                }, [header]);
            };
            FollowRestrictedRecipientsControl.prototype._renderRecord = function (record) {
                var _this = this;
                return this._context.factory.createElement("LABEL", {
                    key: "Record_" + record.Id.guid,
                    id: "Record_" + record.Id.guid,
                    style: {
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: this._context.theming.colors.basecolor.blue.blue3,
                        fontSize: this._context.theming.fontsizes.font100,
                        fontFamily: this._context.theming.fontfamilies.semibold,
                        marginBottom: this._context.theming.measures.measure100,
                    },
                    tabIndex: 0,
                    title: record.Name,
                    role: "link",
                    onClick: this._onRecordClick.bind(this, this._context, record),
                    onKeyDown: function (e) {
                        _this._onRecordKeyDown.bind(e, _this._context, record);
                    },
                }, [record.Name]);
            };
            FollowRestrictedRecipientsControl.prototype._onRecordClick = function (context, record) {
                var formOptions = {
                    entityName: record.LogicalName,
                    entityId: record.Id.guid.toString(),
                };
                context.navigation.openForm(formOptions);
            };
            FollowRestrictedRecipientsControl.prototype._onRecordKeyDown = function (e, context, record) {
                if (e.keyCode === 13) {
                    this._onRecordClick(context, record);
                }
            };
            FollowRestrictedRecipientsControl.prototype.getOutputs = function () {
                return null;
            };
            FollowRestrictedRecipientsControl.prototype.destroy = function () {
            };
            return FollowRestrictedRecipientsControl;
        }());
        MailApp.FollowRestrictedRecipientsControl = FollowRestrictedRecipientsControl;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var Models;
(function (Models) {
    (function (TrackingState) {
        TrackingState[TrackingState["NotLinked"] = 0] = "NotLinked";
        TrackingState[TrackingState["WillBeLinked"] = 1] = "WillBeLinked";
        TrackingState[TrackingState["IsLinked"] = 2] = "IsLinked";
        TrackingState[TrackingState["WillBeUnlinked"] = 3] = "WillBeUnlinked";
        TrackingState[TrackingState["WillBeUnlinkedAndDeleted"] = 4] = "WillBeUnlinkedAndDeleted";
        TrackingState[TrackingState["LinkFailed"] = 5] = "LinkFailed";
        TrackingState[TrackingState["InProgress"] = 6] = "InProgress";
    })(Models.TrackingState || (Models.TrackingState = {}));
    var TrackingState = Models.TrackingState;
})(Models || (Models = {}));
var Models;
(function (Models) {
    (function (FollowState) {
        FollowState[FollowState["IsNotFollowed"] = 0] = "IsNotFollowed";
        FollowState[FollowState["IsFollowed"] = 1] = "IsFollowed";
    })(Models.FollowState || (Models.FollowState = {}));
    var FollowState = Models.FollowState;
    ;
})(Models || (Models = {}));
var Constants;
(function (Constants) {
    Constants.contextId = "MAIL_CONTEXT";
    Constants.PropertyIds = {
        Subject: "SUBJECT",
        PlainBody: "PLAIN_BODY",
        HtmlBody: "HTML_BODY",
        ReceivedOn: "RECEIVED_ON",
        TrackStatus: "TRACK_STATUS",
        TrackAllowedStatus: "TRACK_ALLOWED_STATUS",
        MailboxItem: "MAILBOX_ITEM",
        ItemType: "ITEM_TYPE",
        AttachmentIds: "ATTACHMENT_IDS",
        EwsUrl: "EWS_URL",
        EwsToken: "EWS_TOKEN",
        IsComposeMode: "IS_COMPOSE_MODE",
        MessageRecipients: "MESSAGE_RECIPIENTS",
        MeetingAttendees: "MEETING_ATTENDEES",
        IsDesktopOutlook: "IS_DESKTOP_OUTLOOK",
        IsSent: "IS_SENT",
        IsDelegatedMailbox: "IS_DELEGATED_MAILBOX",
        ResolvedRecipients: "RESOLVED_RECIPIENTS",
        SelectedRecipient: "SELECTED_RECIPIENT",
        IsOrganizerResolvedAsUser: "IS_ORGANIZER_RESOLVED_AS_USER",
        MailboxItemFromServer: "MAILBOX_ITEM_FROM_SERVER",
        IsLimitedMode: "IS_LIMITED_MODE",
        LimitedModeNotificationState: "LIMITED_MODE_NOTIFICATION_STATE",
        IsCreateContactWithoutTracking: "IS_CREATE_CONTACT_WITHOUT_TRACKING",
    };
    Constants.ActionIds = {
        Track: "TRACK",
        Untrack: "UNTRACK",
        Follow: "FOLLOW",
        Unfollow: "UNFOLLOW",
        InsertBody: "INSERT_BODY",
        AddAttachments: "ADD_ATTACHMENTS",
        SetSubject: "SET_SUBJECT",
        GetEmailLinks: "GET_EMAIL_LINKS",
        SetTrackingInfo: "SET_TRACKING_INFO",
        RemoveTrackingInfo: "REMOVE_TRACKING_INFO",
        ResolveRecipientFromScratch: "RESOLVE_RECIPIENT_FROM_SCRATCH",
        SetSelectedRecipient: "SET_SELECTED_RECIPIENT",
        RetryTrack: "RETRY_TRACK",
        SetLimitedModeNotificationStateAction: "SET_LIMITED_MODE_NOTIFICATION_STATE",
    };
    Constants.DialogNames = {
        Follow: "new_FollowEmail",
        Unfollow: "new_UnfollowEmail",
        EmailTemplate: "InsertEmailTemplate_MultiPage_MDD",
        SalesLiterature: "MailAppSalesLiterature",
        KnowledgeArticle: "MailAppKnowledgeArticle",
        AppointmentConflict: "MailAppAppointmentConflict",
    };
    Constants.MailboxItemTypes = {
        Message: "message",
        Appointment: "appointment",
    };
    Constants.CalendarItemTypes = {
        Single: "Single",
        Occurence: "Occurence",
        Exception: "Exception",
        RecurringMaster: "RecurringMaster",
    };
    Constants.CrmTypeNames = {
        User: "systemuser",
        Contact: "contact",
        Lead: "lead",
        Email: "email",
        Appointment: "appointment",
        RecurringAppointmentMaster: "recurringappointmentmaster",
        ExchangeSyncIdMapping: "exchangesyncidmapping",
        Account: "account",
    };
    Constants.PropertyNames = {
        Email: "emailaddress",
        StatusCode: "statecode",
        IsDisabled: "isdisabled",
        OwnerId: "ownerid",
        FollowEmail: "followemail",
        RecipientRole: "role",
    };
    Constants.CrmTypeCodes = {
        User: 8,
        Contact: 2,
        Lead: 4,
        Appointment: 4201,
        RecurringAppointmentMaster: 4251,
    };
    Constants.MailboxItemTypeToCrmTypeMap = (_a = {},
        _a[Constants.MailboxItemTypes.Message] = Constants.CrmTypeNames.Email,
        _a[Constants.MailboxItemTypes.Appointment] = Constants.CrmTypeNames.Appointment,
        _a
    );
    Constants.FeatureNames = {
        SSSReliablePromote: "SSSReliablePromote",
        MailAppAttachmentsReliablePromote: "MailAppAttachmentsReliablePromote",
        MailAppAppointmentsReliablePromote: "MailAppAppointmentsReliablePromote",
        MailAppResolveRecipientsToAccounts: "MailAppResolveRecipientsToAccounts",
        MailAppPrepopulateFormsCase: "MailAppPrepopulateFormsCase",
    };
    Constants.GlobalCommandManagerId = "crm_header_global";
    Constants.RecipientCRMTypeNames = [
        Constants.CrmTypeNames.User,
        Constants.CrmTypeNames.Contact,
        Constants.CrmTypeNames.Lead,
        Constants.CrmTypeNames.Account,
    ];
    var _a;
})(Constants || (Constants = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        var MailAppHiddenDataCustomControl = (function () {
            function MailAppHiddenDataCustomControl() {
                var _this = this;
                this._followedEmailCrmId = null;
                this._onTrackStatusChange = function (result) {
                    _this._trackStatus = result && result.value;
                    _this._updateFollowedEmailCrmId();
                };
            }
            MailAppHiddenDataCustomControl.prototype.init = function (context, notifyOutputChanged, state) {
                var _this = this;
                var externalContexts = context && context.externalContext && context.externalContext.getAvailableExternalContexts();
                if (externalContexts && externalContexts.getByName(Constants.contextId)) {
                    this._context = context;
                    this._notifyOutputChanged = notifyOutputChanged;
                    this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.TrackStatus, {
                        updateListener: this._onTrackStatusChange,
                    })
                        .then(function (status) {
                        _this._trackStatus = status;
                        _this._updateFollowedEmailCrmId();
                    }, function (error) { return error; });
                }
                else {
                    var message = context.resources.getString("RELEVANT_MESSAGE_IN_INCORRECT_ENVIRONMENT");
                    context.navigation.openErrorDialog({ message: message });
                }
            };
            MailAppHiddenDataCustomControl.prototype._getFollowedEmailCrmId = function () {
                var isLinkedAndFollowed = this._trackStatus &&
                    this._trackStatus.crmTrackingState === Models.TrackingState.IsLinked &&
                    this._trackStatus.crmIsFollowed === Models.FollowState.IsFollowed;
                return isLinkedAndFollowed ? this._trackStatus.crmId : null;
            };
            MailAppHiddenDataCustomControl.prototype._updateFollowedEmailCrmId = function () {
                var newFollowedEmailCrmId = this._getFollowedEmailCrmId();
                if (newFollowedEmailCrmId !== this._followedEmailCrmId) {
                    this._followedEmailCrmId = newFollowedEmailCrmId;
                    this._notifyOutputChanged();
                }
            };
            MailAppHiddenDataCustomControl.prototype.updateView = function (context) {
                this._context = context;
                return this._context.factory.createElement("CONTAINER", {
                    id: "mailAppHeader",
                    style: {
                        display: "block",
                        width: "100%",
                    },
                }, null);
            };
            MailAppHiddenDataCustomControl.prototype.getOutputs = function () {
                var result = {
                    followedEmailCrmId: this._followedEmailCrmId,
                };
                return result;
            };
            MailAppHiddenDataCustomControl.prototype.destroy = function () {
                this._context.externalContext.removeExternalContextPropertyListener(Constants.contextId, Constants.PropertyIds.TrackStatus, this._onTrackStatusChange);
            };
            return MailAppHiddenDataCustomControl;
        }());
        MailApp.MailAppHiddenDataCustomControl = MailAppHiddenDataCustomControl;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var Models;
(function (Models) {
    var BaseDataSetRecord = (function () {
        function BaseDataSetRecord(entityReference) {
            this._entityReference = entityReference;
        }
        BaseDataSetRecord.prototype.getRecordId = function () {
            return this.getNamedReference().Id ? this.getNamedReference().Id.toString() : null;
        };
        BaseDataSetRecord.prototype.getErrorMessage = function () {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.isDirty = function () {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.isRecordValid = function () {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.getNotification = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.getValue = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.setValue = function (columnName, newValue) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.getFormattedValue = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.isEditable = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.isSecured = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.isReadable = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.isValid = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.getFieldRequiredLevel = function (columnName) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.getAttributes = function (column) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.getValidator = function (column) {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.getNamedReference = function () {
            return this._entityReference;
        };
        BaseDataSetRecord.prototype.getActivityPartyRecord = function () {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.validateAllColumns = function () {
            throw new Error("Not implemented");
        };
        BaseDataSetRecord.prototype.save = function () {
            throw new Error("Not implemented");
        };
        return BaseDataSetRecord;
    }());
    Models.BaseDataSetRecord = BaseDataSetRecord;
})(Models || (Models = {}));
var Common;
(function (Common) {
    var Guid = (function () {
        function Guid(value) {
            this.toString = function () {
                return this.guid;
            };
            this._guid = Guid._formatGuidString(value);
            if (!this.guid) {
                throw new Error(value + " is not a valid Guid value.");
            }
            Object.freeze(this);
        }
        Object.defineProperty(Guid.prototype, "guid", {
            get: function () {
                return this._guid;
            },
            enumerable: true,
            configurable: true
        });
        Guid._formatGuidString = function (value) {
            if (!value) {
                return null;
            }
            value = value.toLowerCase();
            var hyphenMatch = Guid.braceAndHyphenGuidVerifierPattern.exec(value);
            if (hyphenMatch) {
                if (hyphenMatch[1].length !== hyphenMatch[8].length) {
                    return null;
                }
                return hyphenMatch[2];
            }
            else {
                var contiguousMatch = Guid.contiguousGuidVerifierPattern.exec(value);
                if (contiguousMatch) {
                    return contiguousMatch.filter(function (_, index) { return index > 0; }).join("-");
                }
            }
            return null;
        };
        ;
        Guid.newGuid = function () {
            var hexChars = "0123456789abcdef";
            var guidSize = 36;
            var guidString = "";
            for (var i = 0; i < guidSize; i++) {
                if (i === 14) {
                    guidString += "4";
                }
                else if (i === 8 || i === 13 || i === 18 || i === 23) {
                    guidString += "-";
                }
                else if (i === 19) {
                    var n = Math.floor(Math.random() * 0x10);
                    guidString += hexChars.substr(n & 0x3 | 0x8, 1);
                }
                else {
                    guidString += hexChars.substr(Math.floor(Math.random() * 0x10), 1);
                }
            }
            return new Guid(guidString);
        };
        Guid.braceAndHyphenGuidVerifierPattern = /^({?)((\d|[a-f]){8}-(\d|[a-f]){4}-(\d|[a-f]){4}-(\d|[a-f]){4}-(\d|[a-f]){12})(}?)$/;
        Guid.contiguousGuidVerifierPattern = /^([a-f\d]{8})([a-f\d]{4})([a-f\d]{4})([a-f\d]{4})([a-f\d]{12})$/;
        Guid.EMPTY = new Guid("00000000-0000-0000-0000-000000000000");
        Guid.toString = function (guid) {
            if (guid) {
                return guid.guid;
            }
            return null;
        };
        Guid.equals = function (x, y) {
            return Guid.toString(x) === Guid.toString(y);
        };
        Guid.tryParse = function (value) {
            return Guid.tryParseOrNull(value) || Guid.EMPTY;
        };
        Guid.tryParseOrNull = function (value) {
            var parsedValue = Guid._formatGuidString(value);
            if (parsedValue) {
                return new Guid(parsedValue);
            }
            else {
                return null;
            }
        };
        return Guid;
    }());
    Common.Guid = Guid;
})(Common || (Common = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        (function (MicrosoftIconSymbol) {
            MicrosoftIconSymbol[MicrosoftIconSymbol["Expanded"] = 0] = "Expanded";
            MicrosoftIconSymbol[MicrosoftIconSymbol["UpArrowHead"] = 1] = "UpArrowHead";
            MicrosoftIconSymbol[MicrosoftIconSymbol["LeftArrowHead"] = 2] = "LeftArrowHead";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Collapsed"] = 3] = "Collapsed";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Edit"] = 4] = "Edit";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Save"] = 5] = "Save";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Delete"] = 6] = "Delete";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Remove"] = 7] = "Remove";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Add"] = 8] = "Add";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Cancel"] = 9] = "Cancel";
            MicrosoftIconSymbol[MicrosoftIconSymbol["HandClick"] = 10] = "HandClick";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Accept"] = 11] = "Accept";
            MicrosoftIconSymbol[MicrosoftIconSymbol["More"] = 12] = "More";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Forward"] = 13] = "Forward";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Favorite"] = 14] = "Favorite";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Placeholder"] = 15] = "Placeholder";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RatingFull"] = 16] = "RatingFull";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RatingEmpty"] = 17] = "RatingEmpty";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Options"] = 18] = "Options";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Manage"] = 19] = "Manage";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Settings"] = 20] = "Settings";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Find"] = 21] = "Find";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Help"] = 22] = "Help";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ViewNotifications"] = 23] = "ViewNotifications";
            MicrosoftIconSymbol[MicrosoftIconSymbol["StageAdvance"] = 24] = "StageAdvance";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CheckMark"] = 25] = "CheckMark";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Locked"] = 26] = "Locked";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Lock"] = 27] = "Lock";
            MicrosoftIconSymbol[MicrosoftIconSymbol["MoreOptions"] = 28] = "MoreOptions";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ContactInfo"] = 29] = "ContactInfo";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Pin"] = 30] = "Pin";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Unpin"] = 31] = "Unpin";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Refresh"] = 32] = "Refresh";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Details"] = 33] = "Details";
            MicrosoftIconSymbol[MicrosoftIconSymbol["VisualFilter"] = 34] = "VisualFilter";
            MicrosoftIconSymbol[MicrosoftIconSymbol["GlobalFilter"] = 35] = "GlobalFilter";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Diamond"] = 36] = "Diamond";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ApplyFilter"] = 37] = "ApplyFilter";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CancelFilter"] = 38] = "CancelFilter";
            MicrosoftIconSymbol[MicrosoftIconSymbol["StreamView"] = 39] = "StreamView";
            MicrosoftIconSymbol[MicrosoftIconSymbol["TileView"] = 40] = "TileView";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Import"] = 41] = "Import";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Tools"] = 42] = "Tools";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Attach"] = 43] = "Attach";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Filter"] = 44] = "Filter";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Copy"] = 45] = "Copy";
            MicrosoftIconSymbol[MicrosoftIconSymbol["HighPriority"] = 46] = "HighPriority";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ReduceTile"] = 47] = "ReduceTile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ExpandTile"] = 48] = "ExpandTile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["GlobalFilterExpand"] = 49] = "GlobalFilterExpand";
            MicrosoftIconSymbol[MicrosoftIconSymbol["GlobalFilterCollapse"] = 50] = "GlobalFilterCollapse";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Clear"] = 51] = "Clear";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Post"] = 52] = "Post";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OneNote"] = 53] = "OneNote";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Home"] = 54] = "Home";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SetAsHome"] = 55] = "SetAsHome";
            MicrosoftIconSymbol[MicrosoftIconSymbol["BackButton"] = 56] = "BackButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["BackButtonWithoutBorder"] = 57] = "BackButtonWithoutBorder";
            MicrosoftIconSymbol[MicrosoftIconSymbol["UpArrow"] = 58] = "UpArrow";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DownArrow"] = 59] = "DownArrow";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SetActiveButton"] = 60] = "SetActiveButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SearchButton"] = 61] = "SearchButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ForwardButton"] = 62] = "ForwardButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Mail"] = 63] = "Mail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CheckedMail"] = 64] = "CheckedMail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["FailedMail"] = 65] = "FailedMail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Phone"] = 66] = "Phone";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Chat"] = 67] = "Chat";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OpenPane"] = 68] = "OpenPane";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ClosePane"] = 69] = "ClosePane";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AddFriend"] = 70] = "AddFriend";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Arrow"] = 71] = "Arrow";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DropdownArrow"] = 72] = "DropdownArrow";
            MicrosoftIconSymbol[MicrosoftIconSymbol["FlsLocked"] = 73] = "FlsLocked";
            MicrosoftIconSymbol[MicrosoftIconSymbol["LinkArticle"] = 74] = "LinkArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["UnlinkArticle"] = 75] = "UnlinkArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CopyLink"] = 76] = "CopyLink";
            MicrosoftIconSymbol[MicrosoftIconSymbol["EmailLink"] = 77] = "EmailLink";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Share"] = 78] = "Share";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Assign"] = 79] = "Assign";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Connect"] = 80] = "Connect";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Opportunity"] = 81] = "Opportunity";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Appointment"] = 82] = "Appointment";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Task"] = 83] = "Task";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Case"] = 84] = "Case";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PhoneCallIncoming"] = 85] = "PhoneCallIncoming";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PhoneCallOutgoing"] = 86] = "PhoneCallOutgoing";
            MicrosoftIconSymbol[MicrosoftIconSymbol["EmailIncoming"] = 87] = "EmailIncoming";
            MicrosoftIconSymbol[MicrosoftIconSymbol["EmailOutgoing"] = 88] = "EmailOutgoing";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SendEmail"] = 89] = "SendEmail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ApplyTemplate"] = 90] = "ApplyTemplate";
            MicrosoftIconSymbol[MicrosoftIconSymbol["InsertKbArticle"] = 91] = "InsertKbArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SendSelected"] = 92] = "SendSelected";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SaveAndClose"] = 93] = "SaveAndClose";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ReplyEmail"] = 94] = "ReplyEmail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ReplyAllEmail"] = 95] = "ReplyAllEmail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ForwardEmail"] = 96] = "ForwardEmail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Close"] = 97] = "Close";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Activate"] = 98] = "Activate";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DeActivate"] = 99] = "DeActivate";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DeleteBulk"] = 100] = "DeleteBulk";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SocialActivityIncoming"] = 101] = "SocialActivityIncoming";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SocialActivityOutgoing"] = 102] = "SocialActivityOutgoing";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CustomActivity"] = 103] = "CustomActivity";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SystemPost"] = 104] = "SystemPost";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Convert"] = 105] = "Convert";
            MicrosoftIconSymbol[MicrosoftIconSymbol["MarkAsWon"] = 106] = "MarkAsWon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["MarkAsLost"] = 107] = "MarkAsLost";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SetRegarding"] = 108] = "SetRegarding";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SaveAsComplete"] = 109] = "SaveAsComplete";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SwitchProcess"] = 110] = "SwitchProcess";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Recalculate"] = 111] = "Recalculate";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SendDirectEmail"] = 112] = "SendDirectEmail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OpenMailbox"] = 113] = "OpenMailbox";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ReOpenOpportunity"] = 114] = "ReOpenOpportunity";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ReactivateLead"] = 115] = "ReactivateLead";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Disqualify"] = 116] = "Disqualify";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Qualify"] = 117] = "Qualify";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SelectView"] = 118] = "SelectView";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SelectChart"] = 119] = "SelectChart";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OpenInBrowser"] = 120] = "OpenInBrowser";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NewAppointment"] = 121] = "NewAppointment";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NewRecurringAppointment"] = 122] = "NewRecurringAppointment";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NewPhoneCall"] = 123] = "NewPhoneCall";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NewTask"] = 124] = "NewTask";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NewEmail"] = 125] = "NewEmail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AddExisting"] = 126] = "AddExisting";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SaveAndEdit"] = 127] = "SaveAndEdit";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Default"] = 128] = "Default";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ScrollRight"] = 129] = "ScrollRight";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ScrollLeft"] = 130] = "ScrollLeft";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SaveAndRunRoutingRule"] = 131] = "SaveAndRunRoutingRule";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RunRoutingRule"] = 132] = "RunRoutingRule";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ResolveCase"] = 133] = "ResolveCase";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CancelCase"] = 134] = "CancelCase";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ReactivateCase"] = 135] = "ReactivateCase";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AddToQueue"] = 136] = "AddToQueue";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CreateChildCase"] = 137] = "CreateChildCase";
            MicrosoftIconSymbol[MicrosoftIconSymbol["QueueItemRoute"] = 138] = "QueueItemRoute";
            MicrosoftIconSymbol[MicrosoftIconSymbol["QueueItemRelease"] = 139] = "QueueItemRelease";
            MicrosoftIconSymbol[MicrosoftIconSymbol["QueueItemRemove"] = 140] = "QueueItemRemove";
            MicrosoftIconSymbol[MicrosoftIconSymbol["QueueItemPick"] = 141] = "QueueItemPick";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Drilldown"] = 142] = "Drilldown";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PopOverButton"] = 143] = "PopOverButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ExitButton"] = 144] = "ExitButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ExportToExcel"] = 145] = "ExportToExcel";
            MicrosoftIconSymbol[MicrosoftIconSymbol["WordTemplates"] = 146] = "WordTemplates";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DocumentTemplates"] = 147] = "DocumentTemplates";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OpenInPowerBI"] = 148] = "OpenInPowerBI";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OpenPowerBIReport"] = 149] = "OpenPowerBIReport";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OpenDelve"] = 150] = "OpenDelve";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ArticleLink"] = 151] = "ArticleLink";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ArchiveArticle"] = 152] = "ArchiveArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ApproveArticle"] = 153] = "ApproveArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DiscardArticle"] = 154] = "DiscardArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Minor"] = 155] = "Minor";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Major"] = 156] = "Major";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PublishKnowledgeArticle"] = 157] = "PublishKnowledgeArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RelateArticle"] = 158] = "RelateArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RelateProduct"] = 159] = "RelateProduct";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RestoreArticle"] = 160] = "RestoreArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RevertToDraftArticle"] = 161] = "RevertToDraftArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Translate"] = 162] = "Translate";
            MicrosoftIconSymbol[MicrosoftIconSymbol["UpdateArticle"] = 163] = "UpdateArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RemoveFilter"] = 164] = "RemoveFilter";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Article"] = 165] = "Article";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Graph"] = 166] = "Graph";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CSR"] = 167] = "CSR";
            MicrosoftIconSymbol[MicrosoftIconSymbol["MembersIcon"] = 168] = "MembersIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["QueueIcon"] = 169] = "QueueIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SiteMap"] = 170] = "SiteMap";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NormalPriority"] = 171] = "NormalPriority";
            MicrosoftIconSymbol[MicrosoftIconSymbol["LowPriority"] = 172] = "LowPriority";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ViewIcon"] = 173] = "ViewIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RecentCases"] = 174] = "RecentCases";
            MicrosoftIconSymbol[MicrosoftIconSymbol["KBRecords"] = 175] = "KBRecords";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NumberOfViews"] = 176] = "NumberOfViews";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ResizeHandle"] = 177] = "ResizeHandle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["TaskBasedFlow"] = 178] = "TaskBasedFlow";
            MicrosoftIconSymbol[MicrosoftIconSymbol["InformationIcon"] = 179] = "InformationIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PencilIcon"] = 180] = "PencilIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ErrorIcon"] = 181] = "ErrorIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SuccessIcon"] = 182] = "SuccessIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OptionsetIcon"] = 183] = "OptionsetIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["NotificationIcon"] = 184] = "NotificationIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PanelHeaderImportDataIcon"] = 185] = "PanelHeaderImportDataIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SidePanelUpload"] = 186] = "SidePanelUpload";
            MicrosoftIconSymbol[MicrosoftIconSymbol["New"] = 187] = "New";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DetailsPageClose"] = 188] = "DetailsPageClose";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SettingsListIcon"] = 189] = "SettingsListIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ListIcon"] = 190] = "ListIcon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ForwardDisable"] = 191] = "ForwardDisable";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PdfIconFile"] = 192] = "PdfIconFile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["PresentationFile"] = 193] = "PresentationFile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OneNoteFile"] = 194] = "OneNoteFile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AccessFile"] = 195] = "AccessFile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["VisioFile"] = 196] = "VisioFile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ProjectFile"] = 197] = "ProjectFile";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Plus"] = 198] = "Plus";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ChevronUp"] = 199] = "ChevronUp";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ChevronDown"] = 200] = "ChevronDown";
            MicrosoftIconSymbol[MicrosoftIconSymbol["HappySmiley"] = 201] = "HappySmiley";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SadSmiley"] = 202] = "SadSmiley";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CaseResolution"] = 203] = "CaseResolution";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CampaignResolution"] = 204] = "CampaignResolution";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ServiceActivity"] = 205] = "ServiceActivity";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Notes"] = 206] = "Notes";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Audio"] = 207] = "Audio";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Camera"] = 208] = "Camera";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Video"] = 209] = "Video";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Image"] = 210] = "Image";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Html"] = 211] = "Html";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointEditDocument"] = 212] = "SharePointEditDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointDeleteDocument"] = 213] = "SharePointDeleteDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointCheckoutDocument"] = 214] = "SharePointCheckoutDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointCheckinDocument"] = 215] = "SharePointCheckinDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointEditDocumentProperties"] = 216] = "SharePointEditDocumentProperties";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointDiscardCheckoutDocument"] = 217] = "SharePointDiscardCheckoutDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointNewDocument"] = 218] = "SharePointNewDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointNewWordDocument"] = 219] = "SharePointNewWordDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointNewExcelDocument"] = 220] = "SharePointNewExcelDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointNewPowerPointDocument"] = 221] = "SharePointNewPowerPointDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointNewOneNoteDocument"] = 222] = "SharePointNewOneNoteDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointUploadDocument"] = 223] = "SharePointUploadDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointChangeLocation"] = 224] = "SharePointChangeLocation";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointAddDocumentLocation"] = 225] = "SharePointAddDocumentLocation";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointEditLocation"] = 226] = "SharePointEditLocation";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointOpenLocation"] = 227] = "SharePointOpenLocation";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SharePointOpenDocument"] = 228] = "SharePointOpenDocument";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SendByEmail"] = 229] = "SendByEmail";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CreateQuote"] = 230] = "CreateQuote";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Reply"] = 231] = "Reply";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Warning"] = 232] = "Warning";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Play"] = 233] = "Play";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ExpandButton"] = 234] = "ExpandButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AssociatedArticle"] = 235] = "AssociatedArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DisassociatedArticle"] = 236] = "DisassociatedArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["FormDesign"] = 237] = "FormDesign";
            MicrosoftIconSymbol[MicrosoftIconSymbol["GlobalFilterClearAll"] = 238] = "GlobalFilterClearAll";
            MicrosoftIconSymbol[MicrosoftIconSymbol["GlobalFilterExpandedRow"] = 239] = "GlobalFilterExpandedRow";
            MicrosoftIconSymbol[MicrosoftIconSymbol["GlobalFilterCollapsedRow"] = 240] = "GlobalFilterCollapsedRow";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RelationshipAssistant"] = 241] = "RelationshipAssistant";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AutomaticSuggestions"] = 242] = "AutomaticSuggestions";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SemanticZoom"] = 243] = "SemanticZoom";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SemanticZoomMirrored"] = 244] = "SemanticZoomMirrored";
            MicrosoftIconSymbol[MicrosoftIconSymbol["BackwardButton"] = 245] = "BackwardButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["MultiSelect"] = 246] = "MultiSelect";
            MicrosoftIconSymbol[MicrosoftIconSymbol["MultiSelectMirrored"] = 247] = "MultiSelectMirrored";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Spinning"] = 248] = "Spinning";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RetireProduct"] = 249] = "RetireProduct";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AddProduct"] = 250] = "AddProduct";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OfflineStatus"] = 251] = "OfflineStatus";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Abandon"] = 252] = "Abandon";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Reactivate"] = 253] = "Reactivate";
            MicrosoftIconSymbol[MicrosoftIconSymbol["FinishStage"] = 254] = "FinishStage";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SortButton"] = 255] = "SortButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SelectButton"] = 256] = "SelectButton";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SelectButtonRTL"] = 257] = "SelectButtonRTL";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Flows"] = 258] = "Flows";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OpenEntityRecord"] = 259] = "OpenEntityRecord";
            MicrosoftIconSymbol[MicrosoftIconSymbol["View"] = 260] = "View";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CreateView"] = 261] = "CreateView";
            MicrosoftIconSymbol[MicrosoftIconSymbol["EditView"] = 262] = "EditView";
            MicrosoftIconSymbol[MicrosoftIconSymbol["GuestUser"] = 263] = "GuestUser";
            MicrosoftIconSymbol[MicrosoftIconSymbol["History"] = 264] = "History";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ReassignRecords"] = 265] = "ReassignRecords";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ManageRoles"] = 266] = "ManageRoles";
            MicrosoftIconSymbol[MicrosoftIconSymbol["JoinTeams"] = 267] = "JoinTeams";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ChangeManager"] = 268] = "ChangeManager";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AddMembers"] = 269] = "AddMembers";
            MicrosoftIconSymbol[MicrosoftIconSymbol["RemoveMembers"] = 270] = "RemoveMembers";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Download"] = 271] = "Download";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SetAsDefaultView"] = 272] = "SetAsDefaultView";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Pinned"] = 273] = "Pinned";
            MicrosoftIconSymbol[MicrosoftIconSymbol["DistributionList"] = 274] = "DistributionList";
            MicrosoftIconSymbol[MicrosoftIconSymbol["MergeRecords"] = 275] = "MergeRecords";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AssociateChildCase"] = 276] = "AssociateChildCase";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SetAsDefault"] = 277] = "SetAsDefault";
            MicrosoftIconSymbol[MicrosoftIconSymbol["ConvertKnowledgeArticle"] = 278] = "ConvertKnowledgeArticle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Messenger"] = 279] = "Messenger";
            MicrosoftIconSymbol[MicrosoftIconSymbol["AssociateCategory"] = 280] = "AssociateCategory";
            MicrosoftIconSymbol[MicrosoftIconSymbol["OfficeWaffle"] = 281] = "OfficeWaffle";
            MicrosoftIconSymbol[MicrosoftIconSymbol["TripleColumn"] = 282] = "TripleColumn";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Tiles"] = 283] = "Tiles";
            MicrosoftIconSymbol[MicrosoftIconSymbol["HideVisualFilter"] = 284] = "HideVisualFilter";
            MicrosoftIconSymbol[MicrosoftIconSymbol["InteractiveDashboard"] = 285] = "InteractiveDashboard";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Dynamics365"] = 286] = "Dynamics365";
            MicrosoftIconSymbol[MicrosoftIconSymbol["SalesLiterature"] = 287] = "SalesLiterature";
            MicrosoftIconSymbol[MicrosoftIconSymbol["Checkbox"] = 288] = "Checkbox";
            MicrosoftIconSymbol[MicrosoftIconSymbol["CheckboxComposite"] = 289] = "CheckboxComposite";
        })(MailApp.MicrosoftIconSymbol || (MailApp.MicrosoftIconSymbol = {}));
        var MicrosoftIconSymbol = MailApp.MicrosoftIconSymbol;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var LIST_CONTAINER_ID = "GridListContainer";
        var LIST_ID = "GridList";
        MailApp.entityImgUrlAlias = "entityimage_url";
        MailApp.tapHoldThreshold = 800;
        var MailAppListComponent = (function () {
            function MailAppListComponent(context) {
                var _this = this;
                this._onClickCapture = function (event) {
                    _this._clearTimer();
                };
                this._onPointerMove = function (event) {
                    _this._clearTimer();
                };
                this._onPointerDown = function (event, recordId) {
                    _this._timer = setTimeout(function () { return _this._tapHold(event, recordId); }, MailApp.tapHoldThreshold);
                };
                this._clearTimer = function () {
                    if (_this._timer) {
                        clearTimeout(_this._timer);
                        _this._timer = null;
                    }
                };
                this._tapHold = function (event, recordId) {
                    _this._clearTimer();
                    event.preventDefault();
                };
                this._setContext(context);
                this._cardStates = {};
            }
            Object.defineProperty(MailAppListComponent.prototype, "dataSet", {
                get: function () {
                    return this._dataSet;
                },
                enumerable: true,
                configurable: true
            });
            MailAppListComponent.prototype.render = function (context) {
                if (context.parameters.Grid.working || !context.parameters.Grid.sortedRecordIds.length) {
                    return null;
                }
                this._setContext(context);
                return this._createList(this);
            };
            MailAppListComponent.prototype._createList = function (parent) {
                var content = this._context.parameters.Grid.hasError ? this._getErrorPlaceholder() : this._getListItemsContent();
                var innerComponents = [this._getTitle(), content];
                return this._context.factory.createElement("CONTAINER", {
                    key: LIST_CONTAINER_ID,
                    id: LIST_CONTAINER_ID,
                    role: "presentation",
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: this._context.theming.colors.whitebackground,
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                    },
                }, innerComponents);
            };
            MailAppListComponent.prototype._getErrorPlaceholder = function () {
                var errorIconStyle = {
                    fontSize: "2em",
                    fontWeight: "normal",
                    color: "red",
                };
                return this._context.factory.createElement("PLACEHOLDER", { text: this._context.parameters.Grid.errorMessage, icon: MailApp.MicrosoftIconSymbol.DetailsPageClose, iconStyle: errorIconStyle });
            };
            MailAppListComponent.prototype._getTitle = function () {
                var headerLabel = this._context.mode._customControlProperties.descriptor.Label;
                if (headerLabel) {
                    return this._context.factory.createElement("CONTAINER", {
                        key: "ListHeader",
                        id: "ListHeader",
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            flex: "0 0 auto",
                            borderBottom: "1px " + this._context.theming.solidborderstyle + " " + this._context.theming.colors.grays.gray03,
                            paddingLeft: this._context.theming.measures.measure100,
                            paddingRight: this._context.theming.measures.measure100,
                            paddingTop: this._context.theming.measures.measure050,
                            paddingBottom: this._context.theming.measures.measure050,
                            fontFamily: this._context.theming.fontfamilies.semibold,
                            fontSize: this._context.theming.fontsizes.font100,
                            color: this._context.theming.colors.basecolor.grey.grey7,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                        },
                    }, headerLabel);
                }
                else {
                    return null;
                }
            };
            MailAppListComponent.prototype._setContext = function (context) {
                var dataSet = context.parameters.Grid;
                this._recordsDataInit && !dataSet.working && this._recordsDataInit(dataSet);
                this._context = context;
                this._recordIds = dataSet.sortedRecordIds;
            };
            MailAppListComponent.prototype._getListItemsContent = function () {
                return this._context.factory.createElement("CONTAINER", {
                    key: LIST_ID,
                    id: LIST_ID,
                    role: "presentation",
                    style: {
                        flex: "1 1 auto",
                        display: "block",
                        overflowX: "hidden",
                        overflowY: "auto",
                    },
                }, this._getListItems());
            };
            MailAppListComponent.prototype._getListItems = function () {
                var _this = this;
                var cards = [];
                var dataSet = this._context.parameters.Grid;
                var records = this._recordIds.map(function (id) { return dataSet.records[id]; });
                records.forEach(function (record, index) {
                    var recordId = record.getRecordId();
                    var listItem = _this._cardStates[recordId] || (_this._cardStates[recordId] = new MailApp.MailAppListItemComponent(_this._context, record, _this));
                    var hoverStyle = {
                        backgroundColor: _this._context.theming.colors.grays.gray03,
                    };
                    var borderTop = index
                        ? "1px " + _this._context.theming.solidborderstyle + " " + _this._context.theming.colors.grays.gray03
                        : void 0;
                    var listItemStyle = {
                        display: "block",
                        listStyleType: "none",
                        cursor: "pointer",
                        paddingLeft: _this._context.theming.measures.measure100,
                        paddingRight: _this._context.theming.measures.measure100,
                        borderTop: borderTop,
                        ":hover": hoverStyle,
                    };
                    var listItemComponent = _this._context.factory.createElement("LISTITEM", {
                        id: "ListItem_" + recordId,
                        key: "ListItem_" + recordId,
                        tabIndex: -1,
                        role: "menuitem",
                        style: listItemStyle,
                        onClickCapture: _this._onClickCapture,
                        onPointerMove: _this._onPointerMove,
                        onPointerDown: function (e) { return _this._onPointerDown(e, recordId); },
                    }, listItem.render(record));
                    cards.push(listItemComponent);
                });
                return cards;
            };
            return MailAppListComponent;
        }());
        MailApp.MailAppListComponent = MailAppListComponent;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var MailAppListItemComponent = (function () {
            function MailAppListItemComponent(context, dataSetRecord, parent) {
                this._context = context;
                var entity = dataSetRecord.getNamedReference();
                this._props = {
                    entityName: entity && entity.LogicalName,
                    entityPrimaryField: this._getEntityPrimaryField(context),
                };
            }
            MailAppListItemComponent.prototype.render = function (dataSetRecord) {
                if (!this._cardComponent) {
                    this._cardComponent = this._createDefaultTemplate();
                }
                this._cardComponent.state = {
                    dataSetRecord: dataSetRecord,
                };
                return this._cardComponent.render();
            };
            MailAppListItemComponent.prototype._createDefaultTemplate = function () {
                return new MailApp.MailAppListDefaultTemplate(this._context, this._props);
            };
            MailAppListItemComponent.prototype._getEntityPrimaryField = function (context) {
                var primaryColumn = context.parameters.Grid.columns.find(function (column) { return column.isPrimary; });
                return primaryColumn ? primaryColumn.name : context.parameters.Grid.columns[0].name;
            };
            return MailAppListItemComponent;
        }());
        MailApp.MailAppListItemComponent = MailAppListItemComponent;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var DataTypeWholeDuration = "Whole.Duration";
        var MailAppListDefaultTemplate = (function () {
            function MailAppListDefaultTemplate(context, props) {
                this._state = {
                    dataSetRecord: null,
                };
                this._context = context;
                this._props = props;
            }
            Object.defineProperty(MailAppListDefaultTemplate.prototype, "state", {
                set: function (state) {
                    Object.assign(this._state, state);
                },
                enumerable: true,
                configurable: true
            });
            MailAppListDefaultTemplate.prototype.render = function () {
                var recordId = this._state.dataSetRecord.getRecordId();
                var components = [this.renderEntityImage(), this._renderListItemContent()];
                components.push(this.renderCommandBar());
                return this._context.factory.createElement("CONTAINER", {
                    key: "ListItem_" + recordId,
                    id: "ListItem_" + recordId,
                    style: {
                        "display": "flex",
                        "flexDirection": "row",
                        "alignItems": "center",
                        "justifyContent": "space-between",
                        "font-size": this._context.theming.fontsizes.font100,
                        "line-height": this._context.theming.measures.measure150,
                        "font-family": this._context.theming.fontfamilies.regular,
                        "padding-top": this._context.theming.measures.measure100,
                        "padding-bottom": this._context.theming.measures.measure100,
                        "height": this._context.theming.measures.measure450,
                    },
                    onClick: this._onListItemClickHandler.bind(this),
                }, components);
            };
            MailAppListDefaultTemplate.prototype.renderField = function (columnName, isPrimary) {
                var dataSetRecord = this._state.dataSetRecord;
                var isWholeDuration = this.getFieldType(columnName) === DataTypeWholeDuration;
                var fieldValue = isWholeDuration
                    ? dataSetRecord.reformatValue(columnName)
                    : dataSetRecord.getFormattedValue(columnName);
                return fieldValue ? this._renderLabel(fieldValue, isPrimary) : null;
            };
            MailAppListDefaultTemplate.prototype._onListItemClickHandler = function (event) {
                var entityReference = {
                    Id: new Common.Guid(this._state.dataSetRecord.getRecordId()),
                    Name: null,
                    LogicalName: this._props.entityName,
                };
                this._context.parameters.Grid.openDatasetItem(entityReference);
                event.preventDefault();
                event.stopPropagation();
            };
            MailAppListDefaultTemplate.prototype.renderEntityImage = function () {
                var entityImage = this._context.factory.createElement("ENTITYIMAGE", {
                    key: "ListCardEntityImage",
                    hasPrimaryImageField: true,
                    style: {
                        borderRadius: "50%",
                        display: "block",
                        width: "100%",
                        height: "100%",
                    },
                    entityPrimaryField: this._state.dataSetRecord.getFormattedValue(this._props.entityPrimaryField),
                });
                return this._context.factory.createElement("CONTAINER", {
                    key: "ListCardImage",
                    id: "ListCardImage",
                    style: {
                        "display": "flex",
                        "justify-content": "center",
                        "align-items": "center",
                        "flex": "0 0 " + this._context.theming.measures.measure250,
                        "border-radius": "50%",
                        "width": this._context.theming.measures.measure250,
                        "height": this._context.theming.measures.measure250,
                        "line-height": this._context.theming.measures.measure250,
                        "background-color": this._context.theming.colors.grays.gray01,
                        "color": this._context.theming.colors.basecolor.white,
                        "font-size": "16px",
                        "text-align": "center",
                        "margin-right": this._context.theming.measures.measure100,
                        "overflow": "hidden",
                    },
                }, entityImage);
            };
            MailAppListDefaultTemplate.prototype.renderCommandBar = function () {
                var _this = this;
                var enableActions = this._context.parameters.ListItemCommands && this._context.parameters.ListItemCommands.raw;
                if (enableActions) {
                    var recordId = this._state.dataSetRecord.getRecordId();
                    var commandsIds = this._context.parameters.ListItemCommands.raw.split("|").filter(function (commandId) { return !!commandId; });
                    this._context.parameters.Grid.retrieveRecordCommand([recordId], commandsIds, undefined, true, true)
                        .then(function (commandingObjects) {
                        if (commandingObjects === void 0) { commandingObjects = []; }
                        var commandsVisibleForRecord = commandingObjects.filter(function (command) {
                            return command.shouldBeVisible;
                        });
                        var newCommand = commandsVisibleForRecord[0];
                        var newCommandId = newCommand ? newCommand.commandId : "";
                        var oldCommandId = _this._command ? _this._command.commandId : "";
                        if (newCommandId !== oldCommandId) {
                            _this._command = newCommand;
                            _this._context.utils.requestRender();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                    if (this._command) {
                        var buttonId = "CardCommandButton_" + recordId;
                        var iconType = this._command.icon ? MailApp.MicrosoftIconSymbol[this._command.icon] : MailApp.MicrosoftIconSymbol.LinkArticle;
                        var icon = this._context.factory.createElement("MICROSOFTICON", {
                            id: "CardCommandIcon",
                            key: "CardCommandIcon",
                            type: iconType,
                        });
                        var button = this._context.factory.createElement("BUTTON", {
                            id: buttonId,
                            key: buttonId,
                            title: this._command.label,
                            accessibilityLabel: this._command.label,
                            role: "button",
                            tabIndex: 0,
                            onClick: function (e) {
                                if (_this._command.canExecute) {
                                    _this._command.execute();
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            },
                            style: {
                                "backgroundColor": "transparent",
                                "borderStyle": this._context.theming.noneborderstyle,
                                "line-height": "32px",
                                "width": "32px",
                                "padding": "0px",
                                "font-size": "16px",
                                "cursor": "pointer",
                                "color": this._context.theming.colors.grays.gray07,
                                "display": "block",
                                "text-align": "center",
                            },
                        }, [icon]);
                        return this._context.factory.createElement("CONTAINER", {
                            key: "CardCommandContainer_" + recordId,
                            id: "CardCommandContainer_" + recordId,
                            style: {
                                "display": "block",
                                "flex": "0 0 auto",
                                "alignSelf": "flex-start",
                            },
                        }, [button]);
                    }
                    else {
                        return null;
                    }
                }
                return null;
            };
            MailAppListDefaultTemplate.prototype._renderListItemContent = function () {
                var sectionFields = [];
                var primaryColumnName = this._props.entityPrimaryField;
                var primaryFieldComponent = this._renderListItemField(primaryColumnName, true);
                if (primaryFieldComponent) {
                    sectionFields.push(primaryFieldComponent);
                }
                var maxFieldsCount = 3;
                for (var i = 0; i < this._context.parameters.Grid.columns.length && sectionFields.length < maxFieldsCount; i++) {
                    var gridColumn = this._context.parameters.Grid.columns[i];
                    if (gridColumn.name === primaryColumnName || gridColumn.alias === MailApp.entityImgUrlAlias) {
                        continue;
                    }
                    var fieldValueComponent = this._renderListItemField(gridColumn.name, false);
                    if (fieldValueComponent) {
                        sectionFields.push(fieldValueComponent);
                    }
                }
                return this._context.factory.createElement("CONTAINER", {
                    key: "ListItemContent",
                    id: "ListItemContent",
                    style: {
                        "display": "block",
                        "width": "100%",
                        "overflow": "hidden",
                        "white-space": "nowrap",
                        "margin-right": this._context.theming.measures.measure025,
                    },
                }, sectionFields);
            };
            MailAppListDefaultTemplate.prototype._renderListItemField = function (columnName, isPrimaryField) {
                var fieldValue = this.renderField(columnName, isPrimaryField);
                return fieldValue ? this._context.factory.createElement("CONTAINER", {
                    key: "FieldValue_" + columnName,
                    id: "FieldValue_" + columnName,
                    style: {
                        "display": "block",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                    },
                }, fieldValue) : null;
            };
            MailAppListDefaultTemplate.prototype.getFieldType = function (columnName) {
                var dataSetColumns = this._context.parameters.Grid.columns;
                if (dataSetColumns) {
                    var column = dataSetColumns.find(function (dataSetColumn) { return dataSetColumn.name === columnName; });
                    return column && column.dataType;
                }
            };
            MailAppListDefaultTemplate.prototype._renderLabel = function (value, isPrimaryField) {
                if (isPrimaryField === void 0) { isPrimaryField = false; }
                return this._context.factory.createElement("LABEL", {
                    key: "ListItemLabel",
                    title: value,
                    style: {
                        "display": "block",
                        "text-decoration": "none",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "cursor": "pointer",
                        "color": isPrimaryField
                            ? this._context.theming.colors.grays.gray07
                            : this._context.theming.colors.grays.gray05,
                    },
                }, value);
            };
            return MailAppListDefaultTemplate;
        }());
        MailApp.MailAppListDefaultTemplate = MailAppListDefaultTemplate;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var MailAppListControl = (function () {
            function MailAppListControl() {
                var _this = this;
                this._onTrackStatusChange = function () { return _this._context.utils.requestRender(); };
            }
            MailAppListControl.prototype.init = function (context, notifyOutputChanged, state) {
                var externalContexts = context && context.externalContext && context.externalContext.getAvailableExternalContexts();
                if (externalContexts && externalContexts.getByName(Constants.contextId)) {
                    this._context = context;
                    this._listComponent = new MailApp.MailAppListComponent(this._context);
                    this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.TrackStatus, {
                        updateListener: this._onTrackStatusChange,
                    });
                }
            };
            MailAppListControl.prototype.updateView = function (context) {
                this._context = context;
                if (this._context.parameters.Grid.working) {
                    return;
                }
                return this._listComponent.render(this._context);
            };
            MailAppListControl.prototype.getOutputs = function () {
                return null;
            };
            MailAppListControl.prototype.destroy = function () {
                this._context.externalContext.removeExternalContextPropertyListener(Constants.contextId, Constants.PropertyIds.TrackStatus, this._onTrackStatusChange);
            };
            return MailAppListControl;
        }());
        MailApp.MailAppListControl = MailAppListControl;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var Models;
(function (Models) {
    (function (RecipientRole) {
        RecipientRole[RecipientRole["Sender"] = 1] = "Sender";
        RecipientRole[RecipientRole["To"] = 2] = "To";
        RecipientRole[RecipientRole["Cc"] = 3] = "Cc";
        RecipientRole[RecipientRole["Bcc"] = 4] = "Bcc";
        RecipientRole[RecipientRole["Organizer"] = 5] = "Organizer";
        RecipientRole[RecipientRole["RequiredAttendee"] = 6] = "RequiredAttendee";
        RecipientRole[RecipientRole["OptionalAttendee"] = 7] = "OptionalAttendee";
    })(Models.RecipientRole || (Models.RecipientRole = {}));
    var RecipientRole = Models.RecipientRole;
    ;
})(Models || (Models = {}));
var Models;
(function (Models) {
    var RecipientRecord = (function (_super) {
        __extends(RecipientRecord, _super);
        function RecipientRecord(recordId, entityLogicalName, dataValues) {
            _super.call(this, {
                Id: recordId || "",
                LogicalName: entityLogicalName,
                Name: dataValues.name,
            });
            this._dataValues = dataValues;
        }
        RecipientRecord.ExternalContextRecipientToRecipientRecord = function (entity) {
            return new Models.RecipientRecord(entity.entityReference.Id && entity.entityReference.Id.guid, entity.entityReference.LogicalName, entity.dataValues);
        };
        RecipientRecord.prototype.getFormattedValue = function (columnName) {
            return this._dataValues[columnName];
        };
        RecipientRecord.prototype.setValue = function (columnName, newValue) {
            this._isDirty = true;
            this._dataValues[columnName] = newValue;
            return null;
        };
        RecipientRecord.prototype.isDirty = function () {
            return this._isDirty;
        };
        return RecipientRecord;
    }(Models.BaseDataSetRecord));
    Models.RecipientRecord = RecipientRecord;
})(Models || (Models = {}));
var Enums;
(function (Enums) {
    (function (TrackAllowedStatus) {
        TrackAllowedStatus[TrackAllowedStatus["Allowed"] = 1] = "Allowed";
        TrackAllowedStatus[TrackAllowedStatus["ForbiddenOccurence"] = 2] = "ForbiddenOccurence";
        TrackAllowedStatus[TrackAllowedStatus["ForbiddenMeetingInviteRequest"] = 3] = "ForbiddenMeetingInviteRequest";
        TrackAllowedStatus[TrackAllowedStatus["ForbiddenMeetingInviteResponse"] = 4] = "ForbiddenMeetingInviteResponse";
        TrackAllowedStatus[TrackAllowedStatus["ForbiddenForOrganizerResolvedAsUser"] = 5] = "ForbiddenForOrganizerResolvedAsUser";
        TrackAllowedStatus[TrackAllowedStatus["ForbiddenInLimitedMode"] = 6] = "ForbiddenInLimitedMode";
    })(Enums.TrackAllowedStatus || (Enums.TrackAllowedStatus = {}));
    var TrackAllowedStatus = Enums.TrackAllowedStatus;
})(Enums || (Enums = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var NamePropertyName = "name";
        var EmailPropertyName = "emailaddress";
        var EntityImagePropertyName = "entityImage";
        var EntityHealthScore = "entityHealthScore";
        var RecipientsTabsScrollContainerId = "RecipientsTabsScrollContainer";
        var RecipientTabIdPrefix = "RecipientTab_";
        var DistributionListRecipientType = "distributionList";
        var ExternalUserRecipientType = "externalUser";
        var OtherRecipientType = "other";
        var MembersIconEntityName = "membersicon";
        var UserRecipientType = "user";
        var MailAppRecipientsTabControl = (function () {
            function MailAppRecipientsTabControl() {
                var _this = this;
                this._startTabIndex = 0;
                this._onSelectedRecipientChange = function (result) {
                    if (result && result.status === 1) {
                        if (_this._selectedRecipientExternalPropertyValue !== result.value) {
                            _this._selectedRecipientExternalPropertyValue = result.value;
                            _this._selectedRecord = null;
                            _this._context.utils.requestRender();
                        }
                    }
                };
                this._onResolveRecipients = function (recipientsResult) {
                    if (recipientsResult.status === 1) {
                        _this._processRecipientsChange(recipientsResult.value, true);
                    }
                };
            }
            Object.defineProperty(MailAppRecipientsTabControl.prototype, "RecipientsRecords", {
                get: function () {
                    return this._recipientsRecords || [];
                },
                set: function (records) {
                    this._recipientsRecords = records;
                },
                enumerable: true,
                configurable: true
            });
            ;
            ;
            MailAppRecipientsTabControl.prototype.init = function (context, notifyOutputChanged, state) {
                this._notifyOutputChanged = notifyOutputChanged;
                this._context = context;
                this._getRecipients();
            };
            MailAppRecipientsTabControl.prototype.updateView = function (context) {
                this._context = context;
                if (this._getCurrentRecipientsCount() === -1 || !this._itemType) {
                    return null;
                }
                if (this._getCurrentRecipientsCount() === 0 && this._itemType) {
                    return this._createNoRecipientControl();
                }
                this._updateSelection();
                return context.factory.createElement("CONTAINER", {
                    id: "RecipientsTabContainer",
                    key: "RecipientsTabContainer",
                    style: {
                        "display": "block",
                        "width": "100%",
                        "font-family": this._context.theming.fontfamilies.regular,
                        "color": this._context.theming.colors.grays.gray05,
                        "background-color": this._context.theming.colors.whitebackground,
                    },
                }, [this._createHeaderLabel(), this._createRecipientsTabs(this.RecipientsRecords)]);
            };
            MailAppRecipientsTabControl.prototype._createHeaderLabel = function () {
                var headerLabel = "";
                if (this._itemType) {
                    headerLabel = this._context.resources.getString("MailAppRecipientsTabControl_" + (this._itemType === Constants.MailboxItemTypes.Message ? "Recipients" : "Attendees") + "_Header");
                }
                return this._context.factory.createElement("TEXT", {
                    id: "RecipientsTabContainerHeader",
                    key: "RecipientsTabContainerHeader",
                    semanticTag: "h2",
                    style: {
                        "display": "block",
                        "font-size": this._context.theming.measures.measure100,
                        "line-height": this._context.theming.measures.measure100,
                        "padding": this._context.theming.measures.measure100,
                        "font-weight": "normal",
                    },
                }, headerLabel);
            };
            MailAppRecipientsTabControl.prototype._createNoRecipientControl = function () {
                var text = this._context.resources.getString(this._itemType === Constants.MailboxItemTypes.Message ? "MailAppRecipientsTabControl_No_Recipients" : "MailAppRecipientsTabControl_No_Attendees");
                return this._context.factory.createElement("LABEL", {
                    id: "No_Recipients_Label",
                    key: "No_Recipients_Label",
                    style: {
                        display: "block",
                        padding: this._context.theming.measures.measure100,
                    },
                }, text);
            };
            MailAppRecipientsTabControl.prototype._createRecipientsTabs = function (recipientsRecords) {
                var _this = this;
                var recipientsTabs = recipientsRecords.map(function (recipientRecord, recipientRecordIndex) {
                    return _this._createRecipientTab(recipientRecord, recipientRecordIndex, recipientsRecords.length);
                });
                return this._context.factory.createElement("HORIZONTALSCROLL", {
                    id: RecipientsTabsScrollContainerId,
                    key: "RecipientsTabsScrollContainer",
                    startChildIndex: this._startTabIndex,
                    scrollViewStyle: {
                        overflowX: "hidden",
                    },
                    arrowButtonStyle: {
                        "height": "52px",
                        "border": "0px " + this._context.theming.noneborderstyle,
                        "color": this._context.theming.colors.grays.gray05,
                        "font-size": "16px",
                        "background-color": this._context.theming.colors.whitebackground,
                        "padding": "0px",
                        "cursor": "pointer",
                        ":disabled": {
                            "opacity": "0",
                        },
                    },
                    arrowWidth: 16,
                    prevArrowIconType: 2,
                    nextArrowIconType: 71,
                }, recipientsTabs);
            };
            MailAppRecipientsTabControl.prototype._onKeyUp = function (event, currentIndex, recipientsCount) {
                switch (event.keyCode) {
                    case 37:
                        if (!this._context.userSettings.isRTL) {
                            this._focusPreviousRecipient(currentIndex, recipientsCount);
                        }
                        else {
                            this._focusNextRecipient(currentIndex, recipientsCount);
                        }
                        break;
                    case 39:
                        if (!this._context.userSettings.isRTL) {
                            this._focusNextRecipient(currentIndex, recipientsCount);
                        }
                        else {
                            this._focusPreviousRecipient(currentIndex, recipientsCount);
                        }
                        break;
                    case 36:
                        this._context.accessibility.focusElementById(this._getRecipientTabId(0));
                        break;
                    case 35:
                        this._context.accessibility.focusElementById(this._getRecipientTabId(recipientsCount - 1));
                        break;
                    case 13:
                        this._changeSelectTab(this.RecipientsRecords[currentIndex]);
                }
            };
            MailAppRecipientsTabControl.prototype._focusPreviousRecipient = function (currentIndex, recipientsCount) {
                var prevIndex = currentIndex - 1;
                if (prevIndex === -1) {
                    prevIndex = recipientsCount - 1;
                }
                this._context.accessibility.focusElementById(this._getRecipientTabId(prevIndex));
            };
            MailAppRecipientsTabControl.prototype._focusNextRecipient = function (currentIndex, recipientsCount) {
                var nextIndex = currentIndex + 1;
                if (nextIndex === recipientsCount) {
                    nextIndex = 0;
                }
                this._context.accessibility.focusElementById(this._getRecipientTabId(nextIndex));
            };
            MailAppRecipientsTabControl.prototype._getUnquotedName = function (recipientName) {
                if (recipientName && recipientName.charAt(0) === "'" && recipientName.charAt(recipientName.length - 1) === "'") {
                    recipientName = recipientName.substring(1, recipientName.length - 1);
                }
                return recipientName;
            };
            MailAppRecipientsTabControl.prototype._createRecipientTab = function (recipientRecord, recipientRecordIndex, recipientsCount) {
                var _this = this;
                var recipientName = this._getUnquotedName(recipientRecord.getFormattedValue(NamePropertyName));
                var recipientEmail = recipientRecord.getFormattedValue(EmailPropertyName);
                var entityLogicalName = this._getRecordEntityLogicalName(recipientRecord);
                var recipientTabWidth = this._context.theming.measures.measure350;
                var entityHealthScore = recipientRecord.getFormattedValue(EntityHealthScore);
                var entityReference = {
                    entityName: (entityLogicalName && entityLogicalName !== OtherRecipientType) ? entityLogicalName : MembersIconEntityName,
                };
                var iconStyle = {
                    "width": recipientTabWidth,
                    "height": recipientTabWidth,
                    "font-size": this._isDistributionList(recipientRecord) ? this._context.theming.fontsizes.font150 : this._context.theming.fontsizes.font115,
                    "font-family": this._context.theming.fontfamilies.regular,
                    "display": "block",
                    "line-height": entityHealthScore ? this._context.theming.measures.measure250 : recipientTabWidth,
                    "border-radius": "50%",
                    "box-sizing": "border-box",
                    "color": this._context.theming.colors.base.white,
                    "border": (entityHealthScore ? this._context.theming.measures.measure050 : "0px") + " " + this._context.theming.solidborderstyle + " " + this._context.theming.colors.whitebackground,
                };
                var image = recipientRecord.getFormattedValue(EntityImagePropertyName);
                var recipientIcon = this._context.factory.createElement("ENTITYIMAGE", {
                    id: "Img_" + recipientRecordIndex,
                    hasPrimaryImageField: recipientName !== recipientEmail,
                    entityReference: entityReference,
                    style: iconStyle,
                    entityPrimaryField: recipientName,
                    imageSrc: image ? "data:image;base64," + image : null,
                    entityHealthScore: entityHealthScore,
                    alt: this._getEntityImageAltText(recipientRecord),
                });
                var tabStyle = {
                    "flex": "0 0 " + recipientTabWidth,
                    "display": "block",
                    "text-align": "center",
                    "marginLeft": !this._context.client.isRTL && recipientRecordIndex ? this._context.theming.measures.measure100 : "0px",
                    "marginRight": this._context.client.isRTL && recipientRecordIndex ? this._context.theming.measures.measure100 : "0px",
                    "cursor": "pointer",
                };
                var isSelected = this._selectedRecord && this._selectedRecord.getFormattedValue(EmailPropertyName) === recipientRecord.getFormattedValue(EmailPropertyName);
                var tabId = this._getRecipientTabId(recipientRecordIndex);
                var tabKey = RecipientTabIdPrefix + recipientEmail;
                return this._context.factory.createElement("CONTAINER", {
                    id: tabId,
                    key: tabKey,
                    style: tabStyle,
                    tabIndex: 0,
                    title: recipientName || recipientEmail,
                    onClick: this._changeSelectTab.bind(this, recipientRecord),
                    onKeyUp: function (event) {
                        _this._onKeyUp(event, recipientRecordIndex, recipientsCount);
                    },
                }, [recipientIcon, this._renderRecipientName(recipientName, recipientEmail, recipientRecordIndex, isSelected)]);
            };
            MailAppRecipientsTabControl.prototype._updateSelection = function () {
                var selectedRecipientEmail = this._selectedRecord && this._selectedRecord.getFormattedValue(EmailPropertyName);
                this._applySelection(selectedRecipientEmail || this._selectedRecipientExternalPropertyValue);
            };
            MailAppRecipientsTabControl.prototype._isSelectedRecordChanged = function (newRecord) {
                var isSelectedRecordChanged = !this._isSelectedRecordEmailAddressSame(newRecord && newRecord.getFormattedValue(EmailPropertyName));
                var isRecordEntityTypeChanged = this._isCRMRecord(this._selectedRecord) !== this._isCRMRecord(newRecord);
                return isSelectedRecordChanged || isRecordEntityTypeChanged;
            };
            MailAppRecipientsTabControl.prototype._getRecordByEmailAddress = function (emaiAddress) {
                for (var i = 0; i < this.RecipientsRecords.length; i++) {
                    var record = this.RecipientsRecords[i];
                    var recordEmail = record.getFormattedValue(EmailPropertyName);
                    if (recordEmail && emaiAddress && recordEmail.toLowerCase() === emaiAddress.toLowerCase()) {
                        return record;
                    }
                }
                return null;
            };
            MailAppRecipientsTabControl.prototype._isSelectedRecordEmailAddressSame = function (emailaddress) {
                return emailaddress && this._selectedRecord &&
                    this._selectedRecord.getFormattedValue(EmailPropertyName) &&
                    this._selectedRecord.getFormattedValue(EmailPropertyName).toLowerCase() === emailaddress.toLowerCase();
            };
            MailAppRecipientsTabControl.prototype._getRecipients = function () {
                var _this = this;
                var selectedRecipientPromise = this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.SelectedRecipient, {
                    updateListener: this._onSelectedRecipientChange,
                });
                Promise.all([
                    this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.ItemType),
                    this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.ResolvedRecipients, {
                        updateListener: this._onResolveRecipients,
                    }),
                ])
                    .then(function (results) {
                    var itemType = results[0], externalContextRecipientRecordsResult = results[1];
                    _this._itemType = itemType;
                    selectedRecipientPromise.then(function (selectedRecipient) {
                        _this._selectedRecipientExternalPropertyValue = selectedRecipient;
                        _this._processRecipientsChange(externalContextRecipientRecordsResult);
                    }, function () {
                        _this._processRecipientsChange(externalContextRecipientRecordsResult);
                    });
                })
                    .catch(function (error) { return void 0; });
            };
            MailAppRecipientsTabControl.prototype._processRecipientsChange = function (result, isUpdate) {
                if (isUpdate === void 0) { isUpdate = false; }
                if (!result || !result.recipients) {
                    return;
                }
                var recipients = result.recipients;
                var newRecipients = recipients.map(Models.RecipientRecord.ExternalContextRecipientToRecipientRecord);
                var isInitialResolution = !this._recipientsRecords;
                var isNewMailboxItem = result && result.isNewMailboxItem;
                if (isNewMailboxItem || !newRecipients.length) {
                    this._selectedRecord = null;
                }
                if (!isInitialResolution && !isNewMailboxItem) {
                    var changesFlags = this._getEmailsAddressDetailsChangesFlags(newRecipients);
                    if (changesFlags.isRecipientsWereAdded || changesFlags.isRecipientsWereRemoved) {
                        this._showRecipientsChangedNotification(changesFlags);
                    }
                }
                var newSender = newRecipients.find(function (recipient) {
                    var role = recipient.getFormattedValue("role");
                    return role === Models.RecipientRole.Sender || role === Models.RecipientRole.Organizer;
                });
                if (this._isSenderChanged(newSender) || isNewMailboxItem) {
                    this._currentSender = newSender;
                }
                this.RecipientsRecords = newRecipients;
                this._notifyOutputChanged();
                this._context.utils.requestRender();
            };
            MailAppRecipientsTabControl.prototype._showRecipientsChangedNotification = function (changesFlags) {
                var _this = this;
                var resourceIdPrefix = this._itemType === Constants.MailboxItemTypes.Message ? "Recipients_" : "Attendees_";
                var resourceIdSuffix = "Were_Added";
                if (changesFlags.isRecipientsWereAdded && changesFlags.isRecipientsWereRemoved) {
                    resourceIdSuffix = "Were_Added_And_Removed";
                }
                else if (changesFlags.isRecipientsWereRemoved) {
                    resourceIdSuffix = "Were_Removed";
                }
                var message = this._context.resources.getString("MailAppRecipientsTabControl_" + resourceIdPrefix + resourceIdSuffix);
                if (this._lastRecepientChangedNotificationId) {
                    this._context.utils.clearGlobalNotification(this._lastRecepientChangedNotificationId);
                }
                this._context.utils.addGlobalNotification(1, 1, message, "", null, null).then(function (notificationId) {
                    _this._lastRecepientChangedNotificationId = notificationId;
                });
            };
            MailAppRecipientsTabControl.prototype._getCurrentRecipientsCount = function () {
                return this._recipientsRecords ? this._recipientsRecords.length : -1;
            };
            MailAppRecipientsTabControl.prototype._getEmailsAddressDetailsChangesFlags = function (newRecipients) {
                var _this = this;
                if (!this._recipientsRecords) {
                    return;
                }
                var isRecipientsWereRemoved = false;
                var newRecipientsDictionary = {};
                (newRecipients || []).forEach(function (recipient) {
                    newRecipientsDictionary[_this._getRecipientEmail(recipient)] = true;
                });
                this.RecipientsRecords.forEach(function (recipient) {
                    var email = _this._getRecipientEmail(recipient);
                    if (newRecipientsDictionary[email]) {
                        delete newRecipientsDictionary[email];
                    }
                    else {
                        isRecipientsWereRemoved = true;
                    }
                });
                return {
                    isRecipientsWereAdded: Object.keys(newRecipientsDictionary).length > 0,
                    isRecipientsWereRemoved: isRecipientsWereRemoved,
                };
            };
            MailAppRecipientsTabControl.prototype._getRecipientEmail = function (recipient) {
                var email = recipient.getFormattedValue(Constants.PropertyNames.Email);
                return email && email.toLowerCase();
            };
            MailAppRecipientsTabControl.prototype._isSenderChanged = function (newSender) {
                return newSender && this._currentSender
                    ? this._currentSender
                        .getFormattedValue(Constants.PropertyNames.Email) !== newSender
                        .getFormattedValue(Constants.PropertyNames.Email)
                    : Boolean(newSender || this._currentSender);
            };
            MailAppRecipientsTabControl.prototype._applySelection = function (selectedRecipient) {
                if (!this.RecipientsRecords || !this.RecipientsRecords.length) {
                    return;
                }
                var selectedRecord;
                for (var i = 0; i < this.RecipientsRecords.length; i++) {
                    var record = this.RecipientsRecords[i];
                    var recordEmail = record.getFormattedValue(EmailPropertyName);
                    if (recordEmail && selectedRecipient && recordEmail.toLowerCase() === selectedRecipient.toLowerCase()) {
                        selectedRecord = record;
                        break;
                    }
                    else if (!selectedRecord) {
                        if (record.getNamedReference() &&
                            (record.getNamedReference().LogicalName === Constants.CrmTypeNames.Contact ||
                                record.getNamedReference().LogicalName === Constants.CrmTypeNames.Lead ||
                                record.getNamedReference().LogicalName === Constants.CrmTypeNames.Account ||
                                record.getNamedReference().LogicalName === ExternalUserRecipientType)) {
                            selectedRecord = record;
                        }
                    }
                }
                if (!selectedRecord) {
                    selectedRecord = this.RecipientsRecords[0];
                }
                if (this._isSelectedRecordChanged(selectedRecord)) {
                    this._setSelectedRecord(selectedRecord);
                    this._context.utils.requestRender();
                }
            };
            MailAppRecipientsTabControl.prototype._isDistributionList = function (recipientRecord) {
                return this._getRecordEntityLogicalName(recipientRecord) === DistributionListRecipientType;
            };
            MailAppRecipientsTabControl.prototype._getEntityImageAltText = function (recipientRecord) {
                if (this._isCRMRecord(recipientRecord)) {
                    var fullName = recipientRecord.getFormattedValue(NamePropertyName);
                    var healthScore = recipientRecord.getFormattedValue(EntityHealthScore);
                    if (healthScore) {
                        var localization = this._context.resources.getString("MailAppRecipientsTabControl_RecipientFullName_WithScore");
                        return this._format(localization, fullName, healthScore);
                    }
                    else {
                        var localization = this._context.resources.getString("MailAppRecipientsTabControl_RecipientFullName");
                        return this._format(localization, fullName);
                    }
                }
                else {
                    var localization = this._context.resources.getString("MailAppRecipientsTabControl_UnknownRecipientWithEmail");
                    return this._format(localization, recipientRecord.getFormattedValue(EmailPropertyName));
                }
            };
            MailAppRecipientsTabControl.prototype._getRecipientTabId = function (tabIndex) {
                return RecipientTabIdPrefix + tabIndex;
            };
            MailAppRecipientsTabControl.prototype._renderRecipientName = function (recipientName, recipientEmail, recipientIndex, selected) {
                return this._context.factory.createElement("CONTAINER", {
                    id: "Name_" + recipientIndex,
                    key: "Name_" + recipientEmail,
                    style: {
                        "display": "block",
                        "width": this._context.theming.measures.measure350,
                        "whiteSpace": "normal",
                        "text-overflow": "ellipsis",
                        "overflow": "hidden",
                        "font-size": this._context.theming.fontsizes.font075,
                        "height": this._context.theming.fontsizes.font175,
                        "line-height": this._context.theming.fontsizes.font175,
                        "margin-bottom": this._context.theming.measures.measure075,
                        "border-bottom": "3px " + this._context.theming.solidborderstyle + " " + (selected ? this._context.theming.colors.basecolor.blue.blue3 : this._context.theming.colors.whitebackground),
                    },
                }, [this._getRecipientFirstName(recipientName, recipientEmail)]);
            };
            MailAppRecipientsTabControl.prototype._getRecipientFirstName = function (displayName, email) {
                var isNameEmail = (displayName || email).indexOf("@") !== -1;
                if (displayName && !isNameEmail) {
                    var commaSeparatedArray = displayName.split(",");
                    if (commaSeparatedArray.length > 1) {
                        return commaSeparatedArray[commaSeparatedArray.length - 1];
                    }
                    var spaceSeparatedArray = displayName.split(" ");
                    return spaceSeparatedArray.slice(0, -1).join(" ") || displayName;
                }
                return email.substring(0, email.indexOf("@"));
            };
            MailAppRecipientsTabControl.prototype._changeSelectTab = function (recipientRecord) {
                this._setSelectedRecord(recipientRecord);
                this._context.utils.requestRender();
                if (recipientRecord && recipientRecord.getFormattedValue(EmailPropertyName)) {
                    this._context.externalContext.invokeExternalContextAction(Constants.contextId, Constants.ActionIds.SetSelectedRecipient, {
                        args: {
                            selectedRecipient: recipientRecord.getFormattedValue(EmailPropertyName),
                        },
                    });
                }
            };
            MailAppRecipientsTabControl.prototype._setSelectedRecord = function (recipientRecord) {
                this._selectedRecord = recipientRecord;
                this._notifyOutputChanged();
            };
            MailAppRecipientsTabControl.prototype._isCRMRecord = function (record) {
                var entityLogicalName = this._getRecordEntityLogicalName(record);
                return entityLogicalName && Constants.RecipientCRMTypeNames.indexOf(entityLogicalName) !== -1;
            };
            MailAppRecipientsTabControl.prototype._getRecordEntityLogicalName = function (record) {
                return record && record.getNamedReference() && record.getNamedReference().LogicalName;
            };
            MailAppRecipientsTabControl.prototype._format = function (str) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return str.replace(/{(\d+)}/g, function (match, i) {
                    return typeof args[i] !== "undefined"
                        ? args[i]
                        : match;
                });
            };
            MailAppRecipientsTabControl.prototype.getOutputs = function () {
                var result = {
                    selectedCrmRecord: this._isCRMRecord(this._selectedRecord) ? this._selectedRecord : null,
                    selectedUnresolvedRecord: this._isCRMRecord(this._selectedRecord) ? null : this._selectedRecord,
                };
                return result;
            };
            MailAppRecipientsTabControl.prototype.destroy = function () {
                if (this._lastRecepientChangedNotificationId) {
                    this._context.utils.clearGlobalNotification(this._lastRecepientChangedNotificationId);
                }
                if (this._lastAvoidDuplicatesNotificationId) {
                    this._context.utils.clearGlobalNotification(this._lastAvoidDuplicatesNotificationId);
                }
                this._context.externalContext.removeExternalContextPropertyListener(Constants.contextId, Constants.PropertyIds.SelectedRecipient, this._onSelectedRecipientChange);
                this._context.externalContext.removeExternalContextPropertyListener(Constants.contextId, Constants.PropertyIds.ResolvedRecipients, this._onResolveRecipients);
            };
            return MailAppRecipientsTabControl;
        }());
        MailApp.MailAppRecipientsTabControl = MailAppRecipientsTabControl;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var Models;
(function (Models) {
    var MetadataQuery = (function () {
        function MetadataQuery(metadataType, metadataSubType, entityLogicalName) {
            this.MetadataType = null;
            this.MetadataSubtype = null;
            this.EntityLogicalName = null;
            this.MetadataId = null;
            this.MetadataName = null;
            this.GetDefault = true;
            this.DependencyDepth = 2;
            this.ChangedAfter = null;
            this.Exclude = [];
            this.AppId = null;
            if (!metadataType || !metadataSubType) {
                throw new Error("Can't construct metadata query");
            }
            this.MetadataType = metadataType;
            this.MetadataSubtype = metadataSubType;
            this.EntityLogicalName = entityLogicalName;
        }
        MetadataQuery.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "MetadataType": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "MetadataSubtype": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "EntityLogicalName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "MetadataId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "MetadataName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "GetDefault": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "DependencyDepth": {
                        "typeName": "Microsoft.Dynamics.CRM.DependencyDepth",
                        "structuralProperty": 3,
                        "enumProperties": [
                            {
                                "name": "Unknown",
                                "value": 0,
                            },
                            {
                                "name": "OnDemandWithContext",
                                "value": 1,
                            },
                            {
                                "name": "OnDemandWithoutContext",
                                "value": 2,
                            },
                            {
                                "name": "OnDemandContextOnly",
                                "value": 3,
                            },
                            {
                                "name": "Offline",
                                "value": 4,
                            },
                            {
                                "name": "Mobile",
                                "value": 5,
                            },
                        ],
                    },
                    "ChangedAfter": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "Exclude": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 4,
                    },
                    "AppId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: null,
                operationType: null,
            };
        };
        return MetadataQuery;
    }());
    Models.MetadataQuery = MetadataQuery;
    var GetClientMetadataRequest = (function () {
        function GetClientMetadataRequest(metadataType, metadataSubType, entityLogicalName) {
            this.ClientMetadataQuery = new MetadataQuery(metadataType, metadataSubType, entityLogicalName);
        }
        GetClientMetadataRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "ClientMetadataQuery": {
                        "typeName": "Microsoft.Dynamics.CRM.MetadataQuery",
                        "structuralProperty": 2,
                    },
                },
                operationName: "GetClientMetadata",
                operationType: 1,
            };
        };
        return GetClientMetadataRequest;
    }());
    Models.GetClientMetadataRequest = GetClientMetadataRequest;
})(Models || (Models = {}));
var Models;
(function (Models) {
    var GetEntityDefinition = (function () {
        function GetEntityDefinition(filter) {
            this.columns = ["LogicalName"];
            this.filter = "$filter=" + filter;
        }
        GetEntityDefinition.prototype.getMetadata = function () {
            return {
                boundParameter: undefined,
                parameterTypes: undefined,
                operationType: 2,
                operationName: "EntityDefinitions",
            };
        };
        return GetEntityDefinition;
    }());
    Models.GetEntityDefinition = GetEntityDefinition;
})(Models || (Models = {}));
var Models;
(function (Models) {
    var GetEntityAttributeRequest = (function (_super) {
        __extends(GetEntityAttributeRequest, _super);
        function GetEntityAttributeRequest(typeName, attributeFilter) {
            _super.call(this, "LogicalName eq '" + typeName + "'&$expand=Attributes($filter=" + attributeFilter + ")");
        }
        return GetEntityAttributeRequest;
    }(Models.GetEntityDefinition));
    Models.GetEntityAttributeRequest = GetEntityAttributeRequest;
})(Models || (Models = {}));
var Models;
(function (Models) {
    var GetEntityNameRequest = (function (_super) {
        __extends(GetEntityNameRequest, _super);
        function GetEntityNameRequest(typeCode) {
            _super.call(this, "ObjectTypeCode eq " + typeCode);
        }
        return GetEntityNameRequest;
    }(Models.GetEntityDefinition));
    Models.GetEntityNameRequest = GetEntityNameRequest;
})(Models || (Models = {}));
var Retrievers;
(function (Retrievers) {
    var MetadataRequestor = (function () {
        function MetadataRequestor(executeFunction, utils) {
            this._utils = utils;
            this._executeFunction = executeFunction;
        }
        MetadataRequestor.prototype._execute = function (request, onSuccess, onFailed) {
            this._executeFunction(request).then(function (response) {
                response.json().then(function (odataResponse) {
                    if (odataResponse && odataResponse.Metadata) {
                        try {
                            var result = JSON.parse(odataResponse.Metadata);
                            onSuccess(result);
                        }
                        catch (err) {
                            onFailed(err);
                        }
                    }
                    else {
                        onFailed(new Error("odataResponse.Metadata is empty"));
                    }
                }, onFailed);
            }, onFailed);
        };
        MetadataRequestor.prototype.requestEntitiesMetadata = function (entityTypes, onSuccess, onFailed) {
            var metadataSubType = {};
            entityTypes.forEach(function (entityType) {
                metadataSubType[entityType] = [];
            });
            this._execute(new Models.GetClientMetadataRequest("entity", JSON.stringify(metadataSubType).replace(/\"/g, '\\"'), null), onSuccess, onFailed);
        };
        MetadataRequestor.prototype.requestDefaultFormMetadata = function (entityType, formType, onSuccess, onFailed) {
            this._execute(new Models.GetClientMetadataRequest("form", formType, entityType), onSuccess, onFailed);
        };
        MetadataRequestor.prototype.requestEntityNameFromTypeCode = function (typeCode) {
            return this._executeFunction(new Models.GetEntityNameRequest(typeCode)).then(function (response) {
                return response.json().then(function (responseJson) {
                    if (responseJson && responseJson.value && responseJson.value[0] && responseJson.value[0].LogicalName) {
                        return responseJson.value[0].LogicalName;
                    }
                    else {
                        throw new Error("Unable to determine entity name from type code");
                    }
                });
            });
        };
        MetadataRequestor.prototype.requestRegardingTargets = function () {
            var regardingObjectIdAttributeName = "regardingobjectid";
            var entityType = "activitypointer";
            var isMetadataWithTargetFCBEnabled = this._utils.isFeatureEnabled("MailAppAttributeTargets");
            return isMetadataWithTargetFCBEnabled
                ? this._getEntityAttributeTargets(entityType, regardingObjectIdAttributeName)
                : this._requestTargets(entityType, regardingObjectIdAttributeName);
        };
        MetadataRequestor.prototype._getEntityAttributeTargets = function (entityTyepName, attributeName) {
            return this._utils.getEntityMetadata(entityTyepName, [attributeName])
                .then(function (entityMetadata) {
                return entityMetadata.Attributes.getByName(attributeName).Targets;
            })
                .catch(function () {
                throw new Error("Unable to get activitypointer regarding object targets");
            });
        };
        MetadataRequestor.prototype._requestTargets = function (entityTyepName, attributeName) {
            var attributeFilter = "LogicalName eq '" + attributeName + "'";
            var request = new Models.GetEntityAttributeRequest(entityTyepName, attributeFilter);
            return this._executeFunction(request)
                .then(function (response) { return response.json(); })
                .then(function (responseJson) {
                {
                    if (responseJson &&
                        responseJson.value &&
                        responseJson.value[0] &&
                        responseJson.value[0].Attributes &&
                        responseJson.value[0].Attributes[0] &&
                        responseJson.value[0].Attributes[0].Targets) {
                        return responseJson.value[0].Attributes[0].Targets;
                    }
                    else {
                        throw new Error("Unable to get activitypointer regarding object targets");
                    }
                }
            });
        };
        return MetadataRequestor;
    }());
    Retrievers.MetadataRequestor = MetadataRequestor;
})(Retrievers || (Retrievers = {}));
var Retrievers;
(function (Retrievers) {
    var ObjectTypeCodeToLogicalNameMappingRetriever = (function () {
        function ObjectTypeCodeToLogicalNameMappingRetriever(metadataRequestor) {
            this._mapping = {
                1: "account",
                2: "contact",
                3: "opportunity",
                4: "lead",
                8: "systemuser",
                112: "incident",
            };
            this._metadataRequestor = metadataRequestor;
            this._listeners = [];
            this._errorListeners = [];
        }
        ObjectTypeCodeToLogicalNameMappingRetriever.prototype.onChanged = function (callback) {
            this._listeners.push(callback);
        };
        ObjectTypeCodeToLogicalNameMappingRetriever.prototype.onFailed = function (callback) {
            this._errorListeners.push(callback);
        };
        ObjectTypeCodeToLogicalNameMappingRetriever.prototype.getMapping = function () {
            return this._mapping;
        };
        ObjectTypeCodeToLogicalNameMappingRetriever.prototype.getEntityName = function (typeCode) {
            var _this = this;
            if (this._mapping[typeCode]) {
                return this._mapping[typeCode];
            }
            this._metadataRequestor.requestEntityNameFromTypeCode(typeCode).then(function (entityName) {
                _this._mapping[typeCode] = entityName;
                _this._notify();
            }, function (error) {
                _this._notifyError(error);
            });
            return null;
        };
        ObjectTypeCodeToLogicalNameMappingRetriever.prototype._notify = function () {
            var _this = this;
            this._listeners.forEach(function (listener) {
                listener(_this._mapping);
            });
        };
        ObjectTypeCodeToLogicalNameMappingRetriever.prototype._notifyError = function (error) {
            this._errorListeners.forEach(function (listener) {
                listener(error);
            });
        };
        return ObjectTypeCodeToLogicalNameMappingRetriever;
    }());
    Retrievers.ObjectTypeCodeToLogicalNameMappingRetriever = ObjectTypeCodeToLogicalNameMappingRetriever;
})(Retrievers || (Retrievers = {}));
var Retrievers;
(function (Retrievers) {
    (function (RetrieveState) {
        RetrieveState[RetrieveState["Success"] = 0] = "Success";
        RetrieveState[RetrieveState["SaveAsyncError"] = 1] = "SaveAsyncError";
        RetrieveState[RetrieveState["SaveAsyncUnavailable"] = 2] = "SaveAsyncUnavailable";
        RetrieveState[RetrieveState["ExchangeCallError"] = 3] = "ExchangeCallError";
        RetrieveState[RetrieveState["EwsErrorResponseCode"] = 4] = "EwsErrorResponseCode";
        RetrieveState[RetrieveState["RestErrorDelegateAccess"] = 5] = "RestErrorDelegateAccess";
        RetrieveState[RetrieveState["ErrorDelegateAccessMissingWritePermission"] = 6] = "ErrorDelegateAccessMissingWritePermission";
        RetrieveState[RetrieveState["ErrorDelegateAccessSaveAsync"] = 7] = "ErrorDelegateAccessSaveAsync";
    })(Retrievers.RetrieveState || (Retrievers.RetrieveState = {}));
    var RetrieveState = Retrievers.RetrieveState;
    var TrackStatusRetriever = (function () {
        function TrackStatusRetriever(context) {
            var _this = this;
            this._trackStatus = null;
            this._trackAllowedStatus = null;
            this._typeNamesWithRegarding = [];
            this.onChanged = function (callback) {
                _this._listeners.push(callback);
            };
            this.onFailed = function (callback) {
                _this._errorListeners.push(callback);
            };
            this._notify = function () {
                _this._listeners.forEach(function (listener) {
                    listener(_this._trackStatus, _this._trackAllowedStatus);
                });
            };
            this._notifyError = function (error) {
                var eventParams = [
                    { name: "Error", value: JSON.stringify(error) },
                ];
                _this._context.reporting.reportFailure("MailApp.Control.TrackBar.TrackStatusRetriever", new Error(error.message), null, eventParams);
                _this._errorListeners.forEach(function (listener) {
                    listener(error);
                });
            };
            this._onTrackStatusChange = function (result) {
                var status = result && result.value ? result.value : null;
                var shouldNotify = _this._setTrackStatus(status);
                shouldNotify && _this._notify();
            };
            this._onTrackAllowedStatusChange = function (result) {
                var status = result ? result.value : null;
                var shouldNotify = _this._setTrackAllowedStatus(status);
                shouldNotify && _this._notify();
            };
            this._context = context;
            this._metadataRequestor = new Retrievers.MetadataRequestor(context.webAPI.execute.bind(context.webAPI), this._context.utils);
            this._listeners = [];
            this._errorListeners = [];
            this._mappingRetriever = new Retrievers.ObjectTypeCodeToLogicalNameMappingRetriever(this._metadataRequestor);
            this._mappingRetriever.onChanged(this._notify);
            this._mappingRetriever.onFailed(this._notifyError);
        }
        Object.defineProperty(TrackStatusRetriever.prototype, "hasRegardingObject", {
            get: function () {
                return this._trackStatus &&
                    this._trackStatus.crmRegardingObjectId &&
                    this._trackStatus.crmRegardingObjectId.indexOf(Common.Guid.EMPTY.toString()) === -1 &&
                    this._trackStatus.crmRegardingObjectType && (this._trackStatus.crmTrackingState === Models.TrackingState.IsLinked ||
                    this._trackStatus.crmTrackingState === Models.TrackingState.WillBeLinked ||
                    this._trackStatus.crmTrackingState === Models.TrackingState.LinkFailed);
            },
            enumerable: true,
            configurable: true
        });
        TrackStatusRetriever.prototype.init = function () {
            this._retrieveTrackStatus();
        };
        TrackStatusRetriever.prototype.getTypeNamesWithRegarding = function () {
            return this._typeNamesWithRegarding || [];
        };
        TrackStatusRetriever.prototype.getTrackStatus = function () {
            return this._trackStatus;
        };
        TrackStatusRetriever.prototype.isTrackAllowed = function () {
            return this._trackAllowedStatus === Enums.TrackAllowedStatus.Allowed;
        };
        TrackStatusRetriever.prototype.trackAllowedStatus = function () {
            return this._trackAllowedStatus;
        };
        TrackStatusRetriever.prototype.isTrackPending = function () {
            return this._trackStatus && this._trackStatus.crmTrackingState === Models.TrackingState.WillBeLinked;
        };
        TrackStatusRetriever.prototype.isUntrackPending = function () {
            return this._trackStatus && this._trackStatus.crmTrackingState === Models.TrackingState.WillBeUnlinked;
        };
        TrackStatusRetriever.prototype.getRegardingObject = function () {
            if (this.hasRegardingObject && this._mappingRetriever.getEntityName(this._trackStatus.crmRegardingObjectType)) {
                return new Models.BaseDataSetRecord({
                    Id: this._trackStatus.crmRegardingObjectId || "",
                    LogicalName: this._mappingRetriever.getEntityName(this._trackStatus.crmRegardingObjectType),
                    Name: this._trackStatus.crmRegardingObjectName,
                });
            }
            return null;
        };
        TrackStatusRetriever.prototype.destroy = function () {
            this._context.externalContext.removeExternalContextPropertyListener(Constants.contextId, Constants.PropertyIds.TrackStatus, this._onTrackStatusChange);
            this._context.externalContext.removeExternalContextPropertyListener(Constants.contextId, Constants.PropertyIds.TrackAllowedStatus, this._onTrackAllowedStatusChange);
            this._listeners = [];
        };
        TrackStatusRetriever.prototype._retrieveTrackStatus = function () {
            var _this = this;
            Promise.all([
                this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.TrackStatus, {
                    updateListener: this._onTrackStatusChange,
                }),
                this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.TrackAllowedStatus, {
                    updateListener: this._onTrackAllowedStatusChange,
                }),
                this._metadataRequestor.requestRegardingTargets(),
            ]).then(function (_a) {
                var trackStatus = _a[0], trackAllowed = _a[1], typeNamesWithRegarding = _a[2];
                var isTrackStatusChanged = _this._setTrackStatus(trackStatus);
                var isTrackAllowedStatusChanged = _this._setTrackAllowedStatus(trackAllowed);
                var isTypeNamesWithRegardingChanged = _this._setTypeNamesWithRegarding(typeNamesWithRegarding);
                if (isTypeNamesWithRegardingChanged) {
                    var trace = {
                        eventName: "uci_trace",
                        eventParameters: [
                            { name: "Data", value: JSON.stringify({ RegardingTypes: typeNamesWithRegarding }) },
                            { name: "Message", value: "Types for Regarding lookup changed" },
                            { name: "ComponentName", value: "MailApp.Control.SetRegardingNames" },
                            { name: "ApplicationEventLevel", value: "1" },
                        ],
                    };
                    _this._context.reporting.reportEvent(trace);
                }
                if (isTrackStatusChanged || isTrackAllowedStatusChanged || isTypeNamesWithRegardingChanged) {
                    _this._notify();
                }
            }, this._notifyError);
        };
        TrackStatusRetriever.prototype._setTrackStatus = function (trackStatus) {
            if (trackStatus === void 0) { trackStatus = null; }
            var isTrackStatusEqual = trackStatus && this._trackStatus ?
                trackStatus.crmTrackingState === this._trackStatus.crmTrackingState &&
                    trackStatus.crmRegardingObjectId === this._trackStatus.crmRegardingObjectId &&
                    trackStatus.crmRegardingObjectType === this._trackStatus.crmRegardingObjectType
                : trackStatus === this._trackStatus;
            this._trackStatus = trackStatus;
            return !isTrackStatusEqual;
        };
        TrackStatusRetriever.prototype._setTrackAllowedStatus = function (trackAllowedStatus) {
            if (trackAllowedStatus === void 0) { trackAllowedStatus = null; }
            var isTrackStatusAllowedUpdated = this._trackAllowedStatus !== trackAllowedStatus;
            this._trackAllowedStatus = trackAllowedStatus;
            return isTrackStatusAllowedUpdated;
        };
        TrackStatusRetriever.prototype._setTypeNamesWithRegarding = function (typeNamesWithRegarding) {
            if (!this._compareArrays(this._typeNamesWithRegarding, typeNamesWithRegarding)) {
                this._typeNamesWithRegarding = typeNamesWithRegarding;
                return true;
            }
            return false;
        };
        TrackStatusRetriever.prototype._compareArrays = function (arr1, arr2) {
            if (arr1 === arr2) {
                return true;
            }
            else if (arr1 == null || arr2 == null) {
                return false;
            }
            else if (arr1.length !== arr2.length) {
                return false;
            }
            else {
                var difference = arr1.reduce(function (prevValue, currentValue) {
                    var index = prevValue.indexOf(currentValue);
                    if (index !== -1) {
                        prevValue.splice(index, 1);
                    }
                    return prevValue;
                }, arr2.concat());
                return difference.length === 0;
            }
        };
        return TrackStatusRetriever;
    }());
    Retrievers.TrackStatusRetriever = TrackStatusRetriever;
})(Retrievers || (Retrievers = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var CONTAINER_ID = "LimitedModeNotification";
        var ResourceStrings = {
            NotificationMessage: "LimitedMode_NotificationMessage",
        };
        var ColorStyles = {
            Text: "#1F2126",
            Background: "#FFF4CE",
            Border: "#efefef",
        };
        var LimitedModeNotification = (function () {
            function LimitedModeNotification(context, props) {
                this._context = context;
                this._props = props;
            }
            LimitedModeNotification.prototype.render = function (context) {
                var message = this._context.resources.getString(ResourceStrings.NotificationMessage);
                var infoIconStyle = {
                    paddingTop: "4px",
                };
                var infoIcon = this._getIconComponent(179, infoIconStyle, null);
                var closeIconStyle = {
                    cursor: "pointer",
                    padding: "4px",
                    fontWeight: "bold",
                    fontSize: this._context.theming.fontsizes.font100,
                };
                var closeIcon = this._getIconComponent(97, closeIconStyle, this._props.onClose);
                var content = this._getLinkComponent(message);
                return this._context.factory.createElement("CONTAINER", {
                    key: CONTAINER_ID,
                    id: CONTAINER_ID,
                    style: {
                        backgroundColor: ColorStyles.Background,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        padding: "3px 5px",
                        boxSizing: "border-box",
                        borderBottom: "1px solid " + ColorStyles.Border,
                    },
                }, [infoIcon, content, closeIcon]);
            };
            LimitedModeNotification.prototype._getIconComponent = function (entityPrimaryField, styles, action) {
                return this._context.factory.createElement("MICROSOFTICON", {
                    id: CONTAINER_ID + "_Icon" + entityPrimaryField,
                    key: CONTAINER_ID + "_Icon" + entityPrimaryField,
                    type: entityPrimaryField,
                    style: Object.assign({
                        fontSize: this._context.theming.fontsizes.font125,
                    }, styles),
                    onClick: action,
                });
            };
            LimitedModeNotification.prototype._getLinkComponent = function (message) {
                var isRTL = this._context.client.isRTL;
                return this._context.factory.createElement("HYPERLINK", {
                    id: CONTAINER_ID + "_Link",
                    key: CONTAINER_ID + "_Link",
                    href: this._props.helpLink,
                    target: "_blank",
                    accessibilityLabel: message,
                    tabIndex: -1,
                    style: (_a = {
                            color: ColorStyles.Text
                        },
                        _a["padding" + (isRTL ? "Right" : "Left")] = "4px",
                        _a.fontFamily = this._context.theming.fontfamilies.regular,
                        _a.fontSize = this._context.theming.measures.measure075,
                        _a.lineHeight = "18px",
                        _a.textDecoration = "none",
                        _a[":hover"] = {
                            textDecoration: "underline",
                        },
                        _a
                    ),
                }, message);
                var _a;
            };
            return LimitedModeNotification;
        }());
        MailApp.LimitedModeNotification = LimitedModeNotification;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var TrackCommandId = "MailApp.TrackRegarding.Button";
        var TrackBarCommands = [
            "MailApp.TrackEmailWithoutRegarding.Button",
            "MailApp.TrackAppointmentWithoutRegarding.Button",
            "MailApp.UntrackEmail.Button",
            "MailApp.UntrackAppointment.Button",
            "MailApp.ViewEmailActivity.Button",
            "MailApp.ViewAppointmentActivity.Button",
            "MailApp.OpenRecordOnWeb.Button",
        ];
        var MailAppTrackBarControl = (function () {
            function MailAppTrackBarControl() {
                var _this = this;
                this._trackBarCommands = [];
                this._showTrackNotAllowedToastNotification = function () {
                    if (_this._lastTrackForbiddenNotificationId) {
                        _this._context.utils.clearGlobalNotification(_this._lastTrackForbiddenNotificationId);
                    }
                    var forbiddenMessage = _this._getTrackForbiddenMessage();
                    _this._context.utils.addGlobalNotification(1, 3, forbiddenMessage, "", null, null).then(function (notificationId) {
                        _this._lastTrackForbiddenNotificationId = notificationId;
                    });
                };
                this._onTrackStatusRetrieverError = function (trackStatusRetrieverError) {
                    switch (trackStatusRetrieverError.code) {
                        case Retrievers.RetrieveState.RestErrorDelegateAccess:
                            _this._openErrorDialog({ message: _this._context.resources.getString("MailAppTrackBarControl_DelegateAccess_RestFailure") });
                            break;
                        case Retrievers.RetrieveState.ErrorDelegateAccessMissingWritePermission:
                            _this._openErrorDialog({ message: _this._context.resources.getString("MailAppTrackBarControl_DelegateAccess_MissingWritePermission") });
                            break;
                        case Retrievers.RetrieveState.ErrorDelegateAccessSaveAsync:
                            _this._openErrorDialog({ message: _this._context.resources.getString("MailAppTrackBarControl_DelegateAccess_SaveAsyncFailure") });
                            break;
                        case Retrievers.RetrieveState.EwsErrorResponseCode:
                        case Retrievers.RetrieveState.SaveAsyncUnavailable:
                        case Retrievers.RetrieveState.SaveAsyncError:
                            var errorResourceId = _this._itemType === Constants.MailboxItemTypes.Appointment
                                ? "MailAppTrackBarControl_Track_Appointment_Failure_Short"
                                : "MailAppTrackBarControl_Track_Email_EWS_Failure_Short";
                            var errorMessage = _this._context.resources.getString(errorResourceId);
                            _this._context.utils.addGlobalNotification(1, 2, errorMessage, "", null, null);
                            break;
                        case Retrievers.RetrieveState.ExchangeCallError:
                        default:
                            if (trackStatusRetrieverError.code === null || trackStatusRetrieverError.code === undefined) {
                                _this._openErrorDialog(trackStatusRetrieverError);
                            }
                            else {
                                _this._context.utils.addGlobalNotification(1, 2, _this._context.resources.getString("MailAppTrackBarControl_Retrieve_EWS_Failure_Short"), "", null, null);
                            }
                    }
                };
                this._onItemChanged = function () {
                    _this._context.utils.clearGlobalNotifications && _this._context.utils.clearGlobalNotifications();
                };
            }
            Object.defineProperty(MailAppTrackBarControl.prototype, "_isExternalContextAvailable", {
                get: function () {
                    var externalContexts = this._context
                        ? this._context.externalContext && this._context.externalContext.getAvailableExternalContexts()
                        : null;
                    return externalContexts && externalContexts.getByName(Constants.contextId);
                },
                enumerable: true,
                configurable: true
            });
            MailAppTrackBarControl.prototype.init = function (context, notifyOutputChanged, state) {
                var _this = this;
                this._context = context;
                if (!this._isExternalContextAvailable) {
                    return;
                }
                this._notifyOutputChanged = notifyOutputChanged;
                this._context = context;
                this._trackStatusRetriever = new Retrievers.TrackStatusRetriever(this._context);
                this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.ItemType).then(function (itemType) {
                    _this._itemType = itemType;
                    _this._subscribeToTrackStatusChange();
                }, function (error) {
                    _this._openErrorDialog(error);
                });
                this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.MailboxItem, {
                    updateListener: this._onItemChanged,
                });
                Promise.all([
                    this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.IsLimitedMode),
                    this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.LimitedModeNotificationState),
                ])
                    .then(function (_a) {
                    var isLimitedMode = _a[0], _b = _a[1], helpLink = _b.helpLink, hasBeenClosed = _b.hasBeenClosed;
                    _this._isLimitedMode = isLimitedMode;
                    if (isLimitedMode && !hasBeenClosed) {
                        _this._notificationComponent = new MailApp.LimitedModeNotification(context, {
                            onClose: function (e) {
                                _this._context.externalContext.invokeExternalContextAction(Constants.contextId, Constants.ActionIds.SetLimitedModeNotificationStateAction);
                                _this._notificationComponent = null;
                                _this._context.utils.requestRender();
                            },
                            helpLink: helpLink,
                        });
                    }
                    _this._context.utils.requestRender();
                });
            };
            MailAppTrackBarControl.prototype._subscribeToTrackStatusChange = function () {
                var _this = this;
                var prevRegardingObjectId;
                this._trackStatusRetriever.onChanged(function (trackStatus, trackAllowedStatus) {
                    var isTrackStatusDefined = trackStatus !== null && trackAllowedStatus !== null;
                    if (isTrackStatusDefined && trackAllowedStatus !== Enums.TrackAllowedStatus.ForbiddenInLimitedMode && !_this._trackStatusRetriever.isTrackAllowed()) {
                        _this._showTrackNotAllowedToastNotification();
                    }
                    var newRegardingObject = _this._trackStatusRetriever.getRegardingObject();
                    var newRegardingObjectId = newRegardingObject && newRegardingObject.getRecordId();
                    if (prevRegardingObjectId !== newRegardingObjectId) {
                        prevRegardingObjectId = newRegardingObjectId;
                        _this._notifyOutputChanged();
                    }
                    _this._context.utils.requestRender();
                });
                this._trackStatusRetriever.onFailed(this._onTrackStatusRetrieverError);
                this._trackStatusRetriever.init();
            };
            MailAppTrackBarControl.prototype._getTrackForbiddenMessage = function () {
                var message;
                switch (this._trackStatusRetriever.trackAllowedStatus()) {
                    case Enums.TrackAllowedStatus.ForbiddenOccurence:
                        message = this._context.resources.getString("MailAppTrackBarControl_Track_Forbidden_Occurence");
                        break;
                    case Enums.TrackAllowedStatus.ForbiddenMeetingInviteRequest:
                        message = this._context.resources.getString("MailAppTrackBarControl_Track_Forbidden_Meeting_Request");
                        break;
                    case Enums.TrackAllowedStatus.ForbiddenMeetingInviteResponse:
                        message = this._context.resources.getString("MailAppTrackBarControl_Track_Forbidden_Meeting_Response");
                        break;
                    case Enums.TrackAllowedStatus.ForbiddenForOrganizerResolvedAsUser:
                        message = this._context.resources.getString("MailAppTrackBarControl_Track_Forbidden_Organizer_As_User");
                        break;
                }
                return message;
            };
            MailAppTrackBarControl.prototype.updateView = function (context) {
                this._context = context;
                if (!this._isExternalContextAvailable) {
                    return;
                }
                var trackStatus = this._trackStatusRetriever.getTrackStatus();
                var trackAllowedStatus = this._trackStatusRetriever.trackAllowedStatus();
                var typeNamesWithRegarding = this._trackStatusRetriever.getTypeNamesWithRegarding();
                var children = [];
                if (trackStatus && trackAllowedStatus !== void 0 && typeNamesWithRegarding && this._itemType) {
                    children.push(this._renderTrackStatus(trackAllowedStatus, trackStatus), this._renderSetRegardingForm());
                }
                if (this._notificationComponent) {
                    children.unshift(this._notificationComponent.render(context));
                }
                return this._render(children);
            };
            MailAppTrackBarControl.prototype._render = function (children) {
                if (children === void 0) { children = []; }
                return this._context.factory.createElement("CONTAINER", {
                    id: "MailAppTrackBarContainer",
                    key: "MailAppTrackBarContainer",
                    style: {
                        "display": "block",
                        "width": "100%",
                    },
                }, children);
            };
            MailAppTrackBarControl.prototype._getStatusRenderDetails = function (crmTrackingState) {
                switch (crmTrackingState) {
                    case Models.TrackingState.IsLinked:
                        return this._trackStatusRetriever.hasRegardingObject
                            ? this._getRenderDetailsTrackedRegarding()
                            : this._getRenderDetailsTracked();
                    case Models.TrackingState.WillBeLinked:
                        return this._getRenderDetailsTrackPending();
                    case Models.TrackingState.LinkFailed:
                        return this._getRenderDetailsTrackFailed();
                    case Models.TrackingState.InProgress:
                        return this._getRenderDetailsTrackInProgress();
                    default:
                        return this._getRenderDetailsUntracked();
                }
            };
            MailAppTrackBarControl.prototype._getRenderDetailsUntracked = function () {
                var text = this._context.resources.getString("MailAppTrackBarControl_UntrackedStatus");
                return {
                    text: text,
                    tooltip: text,
                    textColor: this._context.theming.colors.basecolor.black,
                    backgroundColor: "#cde6f7",
                    commandingHoverColor: "#9dc3e6",
                };
            };
            MailAppTrackBarControl.prototype._getRenderDetailsTracked = function () {
                var text = this._context.resources.getString("MailAppTrackBarControl_TrackedStatus");
                return {
                    text: text,
                    tooltip: text,
                    textColor: this._context.theming.colors.basecolor.black,
                    backgroundColor: "#e4f9d4",
                    commandingHoverColor: "#c5e0b4",
                };
            };
            MailAppTrackBarControl.prototype._getRenderDetailsTrackedRegarding = function () {
                var text = this._context.resources.getString("MailAppTrackBarControl_TrackedRegardingStatus");
                return {
                    text: text,
                    tooltip: text,
                    textColor: this._context.theming.colors.basecolor.black,
                    backgroundColor: "#e4f9d4",
                    commandingHoverColor: "#c5e0b4",
                };
            };
            MailAppTrackBarControl.prototype._getRenderDetailsTrackPending = function () {
                var tooltipTemplate = this._context.resources.getString("MailAppTrackBarControl_TrackedPendingStatus_Tooltip");
                var tooltip = this._format(tooltipTemplate, this._getItemTypeLocalizedName());
                return {
                    text: this._context.resources.getString("MailAppTrackBarControl_TrackedPendingStatus"),
                    tooltip: tooltip,
                    textColor: this._context.theming.colors.basecolor.black,
                    backgroundColor: "#cde6f7",
                    commandingHoverColor: "#9dc3e6",
                };
            };
            MailAppTrackBarControl.prototype._getRenderDetailsTrackFailed = function () {
                var tooltipTemplate = this._context.resources.getString("MailAppTrackBarControl_TrackFailedStatus_Tooltip");
                var tooltip = this._format(tooltipTemplate, this._getItemTypeLocalizedName());
                return {
                    text: this._context.resources.getString("MailAppTrackBarControl_TrackFailedStatus"),
                    tooltip: tooltip,
                    textColor: this._context.theming.colors.basecolor.red.red4,
                    backgroundColor: "#efefef",
                    commandingHoverColor: "#d8d8d8",
                };
            };
            MailAppTrackBarControl.prototype._getRenderDetailsTrackInProgress = function () {
                var text = this._context.resources.getString("MailAppTrackBarControl_InProgressStatus");
                return {
                    text: text,
                    tooltip: text,
                    textColor: this._context.theming.colors.basecolor.black,
                    backgroundColor: "#fff4a8",
                    commandingHoverColor: "#a2993e",
                };
            };
            MailAppTrackBarControl.prototype._getItemTypeLocalizedName = function () {
                return this._context.resources.getString(this._itemType === Constants.MailboxItemTypes.Message
                    ? "MailAppTrackBarControl_ItemType_Message"
                    : "MailAppTrackBarControl_ItemType_Appointment");
            };
            MailAppTrackBarControl.prototype._renderTrackStatus = function (trackAllowedStatus, _a) {
                var crmTrackingState = _a.crmTrackingState;
                if (trackAllowedStatus === Enums.TrackAllowedStatus.ForbiddenInLimitedMode && crmTrackingState !== Models.TrackingState.IsLinked) {
                    return null;
                }
                this._statusRenderDetails = this._getStatusRenderDetails(crmTrackingState);
                return this._context.factory.createElement("CONTAINER", {
                    id: "StatusLabelContainer",
                    key: "StatusLabelContainer",
                    style: {
                        "display": "flex",
                        "flexDirection": "row",
                        "alignItems": "center",
                        "justifyContent": "space-between",
                        "backgroundColor": this._statusRenderDetails.backgroundColor,
                    },
                }, [this._renderStatusLabel(), this._renderCommandBar()]);
            };
            MailAppTrackBarControl.prototype._renderStatusLabel = function () {
                return this._context.factory.createElement("LABEL", {
                    key: "StatusLabel",
                    id: "StatusLabel",
                    style: {
                        "display": "block",
                        "flex": "1 1 auto",
                        "overflow": "hidden",
                        "textOverflow": "ellipsis",
                        "whiteSpace": "nowrap",
                        "height": "48px",
                        "lineHeight": "48px",
                        "paddingLeft": this._context.client.isRTL ? 0 : this._context.theming.measures.measure100,
                        "paddingRight": this._context.client.isRTL ? this._context.theming.measures.measure100 : 0,
                        "color": this._statusRenderDetails.textColor,
                        "fontSize": this._context.theming.fontsizes.font100,
                        "fontFamily": this._context.theming.fontfamilies.regular,
                    },
                    title: this._statusRenderDetails.tooltip,
                }, [this._statusRenderDetails.text]);
            };
            MailAppTrackBarControl.prototype._renderCommandBar = function () {
                if (this._trackStatusRetriever.getTrackStatus().crmTrackingState === Models.TrackingState.InProgress) {
                    return null;
                }
                return this._context.factory.createElement("COMMANDBAR", {
                    key: "TrackBarControlCommandBar",
                    iconPosition: 1,
                    mainMenuLength: 1,
                    ribbonId: null,
                    selectedRecords: [],
                    addedCommandList: this._getAddedTrackBarCommands(),
                    customCommandManagerStyle: {
                        "margin": "0px",
                        "border": "0px none",
                    },
                    commandBarStyle: {
                        container: {
                            "margin": "0px",
                            "border": "0px none",
                        },
                        list: {
                            "margin": "0px",
                        },
                        listItem: {
                            "marginLeft": this._context.client.isRTL ? 0 : this._context.theming.measures.measure050,
                            "marginRight": this._context.client.isRTL ? this._context.theming.measures.measure050 : 0,
                        },
                        listItemBody: {
                            text: {
                                "display": "block",
                                "overflow": "hidden",
                            },
                            iconWrapperStyles: {
                                "margin": "0px",
                            },
                        },
                        overflowFlyoutMoreButton: {
                            "fontSize": "16px",
                            "height": "48px",
                            "lineHeight": "48px",
                            "padding": "0px",
                            "textAlign": "center",
                            "border": "0px none",
                            "background": "transparent",
                            "display": "block",
                            "overflow": "hidden",
                            "cursor": "pointer",
                            ":hover": {
                                "backgroundColor": this._statusRenderDetails.commandingHoverColor,
                            },
                        },
                    },
                });
            };
            MailAppTrackBarControl.prototype._getAddedTrackBarCommands = function () {
                var _this = this;
                this._context.utils.retrieveRecordCommand({}, Constants.GlobalCommandManagerId, [], TrackBarCommands)
                    .then(function (commands) {
                    if (commands === void 0) { commands = []; }
                    var updatedTrackBarCommands = commands
                        .filter(function (commandObject) { return commandObject.canExecute; })
                        .map(function (commandObject) {
                        return {
                            Icon: commandObject.icon,
                            DisplayText: commandObject.label,
                            Tooltip: {
                                title: commandObject.tooltip,
                            },
                            Id: commandObject.commandId,
                            execute: commandObject.execute,
                        };
                    });
                    if (_this._isTrackCommandsChanged(updatedTrackBarCommands)) {
                        _this._trackBarCommands = updatedTrackBarCommands;
                        _this._context.utils.requestRender();
                    }
                });
                var trackBarCommands = this._trackBarCommands.slice();
                if (!this._isUntracked() && this._trackStatusRetriever.isTrackAllowed()) {
                    trackBarCommands.unshift(this._getSetRegardingCommand());
                }
                if (this._trackStatusRetriever.getTrackStatus().crmTrackingState === Models.TrackingState.LinkFailed && this._isLimitedMode !== void 0) {
                    if (this._isLimitedMode) {
                        trackBarCommands.unshift(this._getRetryTrackCommand(function () {
                            var regardingObject = _this._trackStatusRetriever.getRegardingObject();
                            var namedReference = regardingObject ? regardingObject.getNamedReference() : null;
                            var lookupValue = namedReference ? {
                                id: regardingObject.getRecordId(),
                                name: namedReference.Name,
                                entityType: namedReference.LogicalName,
                            } : null;
                            _this._trackRegarding(lookupValue);
                        }));
                    }
                    else {
                        trackBarCommands.unshift(this._getRetryTrackCommand());
                    }
                }
                return trackBarCommands;
            };
            MailAppTrackBarControl.prototype._isTrackCommandsChanged = function (newTrackBarCommands) {
                if (newTrackBarCommands === void 0) { newTrackBarCommands = []; }
                var newTrackBarCommandsIds = newTrackBarCommands.map(function (command) { return command.Id; }).sort();
                var oldTrackBarCommandsIds = this._trackBarCommands.map(function (command) { return command.Id; }).sort();
                return newTrackBarCommandsIds
                    .some(function (commandId, index) { return commandId !== oldTrackBarCommandsIds[index]; });
            };
            MailAppTrackBarControl.prototype._getSetRegardingCommand = function () {
                var commandLabelResourceId = this._trackStatusRetriever.hasRegardingObject
                    ? "MailAppTrackBarControl_ChangeRegardingButtonLabel"
                    : "MailAppTrackBarControl_SetRegardingButtonLabel";
                var commandLabel = this._context.resources.getString(commandLabelResourceId);
                return {
                    Icon: "LinkArticle",
                    DisplayText: commandLabel,
                    Tooltip: {
                        title: commandLabel,
                    },
                    Id: "MailApp.Track",
                    execute: this._showTrackRegardingForm.bind(this),
                };
            };
            MailAppTrackBarControl.prototype._getRetryTrackCommand = function (execute) {
                var _this = this;
                if (execute === void 0) { execute = function () {
                    var args = { trackingState: Models.TrackingState.WillBeLinked };
                    _this._context.externalContext.invokeExternalContextAction(Constants.contextId, Constants.ActionIds.RetryTrack, { args: args });
                }; }
                var text = this._context.resources.getString("Retry_Track");
                return {
                    Icon: "Refresh",
                    DisplayText: text,
                    Tooltip: {
                        title: text,
                    },
                    Id: "MailApp.RetryTrack",
                    execute: execute,
                };
            };
            MailAppTrackBarControl.prototype._renderSetRegardingForm = function () {
                if (!this._isTrackRegardingFormVisible()) {
                    return null;
                }
                var setRegardingText = this._context.resources.getString("MailAppTrackBarControl_SetRegardingLabel");
                var setRegardingLabel = this._context.factory.createElement("LABEL", {
                    key: "SetRegardingLabel",
                    id: "SetRegardingLabel",
                    style: {
                        "display": "block",
                        "whiteSpace": "nowrap",
                        "color": this._context.theming.colors.basecolor.grey.grey7,
                        "fontSize": this._context.theming.fontsizes.font100,
                        "overflow": "hidden",
                        "textOverflow": "elipsis",
                        "fontFamily": this._context.theming.fontfamilies.regular,
                        "marginBottom": this._context.theming.measures.measure025,
                    },
                    title: setRegardingText,
                }, [setRegardingText]);
                return this._context.factory.createElement("CONTAINER", {
                    id: "SetRegardingForm",
                    key: "SetRegardingForm",
                    style: {
                        "display": "flex",
                        "flexDirection": "column",
                        "marginTop": this._context.theming.measures.measure100,
                        "marginLeft": this._context.theming.measures.measure100,
                        "marginRight": this._isCloseSetRegardingFormButtonVisible() ? "0px" : this._context.theming.measures.measure100,
                    },
                }, [setRegardingLabel, this._renderSetRegardingLookup()]);
            };
            MailAppTrackBarControl.prototype._renderSetRegardingLookup = function () {
                var typeNamesWithRegarding = this._trackStatusRetriever.getTypeNamesWithRegarding();
                if (typeNamesWithRegarding.length === 0) {
                    return null;
                }
                var properties = {
                    descriptor: {
                        Id: "MscrmControls.FieldControls.SimpleLookupControl",
                        Label: this._context.resources.getString("MailAppTrackBarControl_SetRegardingLabel"),
                        Name: "",
                        ShowLabel: true,
                        Visible: true,
                        Disabled: false,
                    },
                    parameters: {
                        value: {
                            Type: "Lookup.Regarding",
                            Usage: 3,
                            Static: false,
                            Callback: this._lookupValueChanged.bind(this),
                            Value: [],
                            Attributes: {
                                LogicalName: "regardingobjectid",
                                Targets: typeNamesWithRegarding,
                                Format: "regarding",
                                Type: "lookup",
                            },
                        },
                        viewportSizeMode: {
                            Usage: 1,
                            Static: true,
                            Type: "Whole.None",
                            Value: 1,
                            Primary: false,
                        },
                        deviceSizeMode: {
                            Usage: 1,
                            Static: true,
                            Type: "Whole.None",
                            Value: 1,
                            Primary: false,
                        },
                    },
                    key: "SetRegardingLookup",
                };
                var lookupControl = this._context.factory.createComponent("MscrmControls.FieldControls.SimpleLookupControl", "SetRegardingLookup", properties);
                return this._context.factory.createElement("CONTAINER", {
                    id: "SetRegardingForm",
                    key: "SetRegardingForm",
                    style: {
                        "display": "flex",
                        "flexDirection": "row",
                        "alignItems": "center",
                        "justifyContent": "space-between",
                    },
                }, [lookupControl, this._renderCloseSetRegardingFormButton()]);
            };
            MailAppTrackBarControl.prototype._isCloseSetRegardingFormButtonVisible = function () {
                return !this._isUntracked();
            };
            MailAppTrackBarControl.prototype._renderCloseSetRegardingFormButton = function () {
                var _this = this;
                if (!this._isCloseSetRegardingFormButtonVisible()) {
                    return null;
                }
                var addIcon = this._context.factory.createElement("MICROSOFTICON", {
                    id: "CloseSetRegardingFormButtonIcon",
                    key: "CloseSetRegardingFormButtonIcon",
                    type: 9,
                });
                var buttonTitle = this._context.resources.getString("MailAppTrackBarControl_CloseSetRegardingFormLabel");
                return this._context.factory.createElement("BUTTON", {
                    id: "CloseSetRegardingFormButton",
                    key: "CloseSetRegardingFormButton",
                    title: buttonTitle,
                    accessibilityLabel: buttonTitle,
                    role: "button",
                    tabIndex: 0,
                    onClick: function () {
                        _this._hideTrackRegardingForm();
                    },
                    style: {
                        "flex": "0 0 auto",
                        "backgroundColor": "transparent",
                        "borderStyle": "none",
                        "color": this._context.theming.colors.grays.gray07,
                        "paddingTop": this._context.theming.measures.measure075,
                        "paddingBottom": this._context.theming.measures.measure100,
                        "paddingLeft": this._context.theming.measures.measure050,
                        "paddingRight": this._context.theming.measures.measure100,
                        "fontSize": "16px",
                        "cursor": "pointer",
                    },
                }, [addIcon]);
            };
            MailAppTrackBarControl.prototype._showTrackRegardingForm = function () {
                this._isTrackRegardingFormActive = true;
                this._context.utils.requestRender();
            };
            MailAppTrackBarControl.prototype._hideTrackRegardingForm = function () {
                this._isTrackRegardingFormActive = false;
                this._context.utils.requestRender();
            };
            MailAppTrackBarControl.prototype._isTrackRegardingFormVisible = function () {
                return (this._isUntracked() || this._isTrackRegardingFormActive) && this._trackStatusRetriever.isTrackAllowed();
            };
            MailAppTrackBarControl.prototype._isUntracked = function () {
                var trackStatus = this._trackStatusRetriever.getTrackStatus();
                return trackStatus.crmTrackingState === Models.TrackingState.NotLinked
                    || trackStatus.crmTrackingState === Models.TrackingState.WillBeUnlinked
                    || trackStatus.crmTrackingState === Models.TrackingState.WillBeUnlinkedAndDeleted;
            };
            MailAppTrackBarControl.prototype._lookupValueChanged = function (item) {
                var setRegardingRecord = Array.isArray(item) ? item[0] : item;
                if (setRegardingRecord) {
                    this._trackRegarding(setRegardingRecord);
                    this._hideTrackRegardingForm();
                }
            };
            MailAppTrackBarControl.prototype._trackRegarding = function (setRegardingRecord) {
                var allRecords = {};
                allRecords[setRegardingRecord.id] = this._getDataSetRecord(setRegardingRecord);
                this._context.utils.retrieveRecordCommand(allRecords, Constants.GlobalCommandManagerId, [setRegardingRecord.id], [TrackCommandId]).then(function (commands) {
                    var trackCommand = commands && commands[0];
                    if (trackCommand && trackCommand.canExecute) {
                        trackCommand.execute();
                    }
                });
            };
            MailAppTrackBarControl.prototype._getDataSetRecord = function (setRegardingRecord) {
                var setRegardingDataSetRecord = {};
                setRegardingDataSetRecord.getNamedReference = function () { return setRegardingRecord; };
                return setRegardingDataSetRecord;
            };
            MailAppTrackBarControl.prototype._openErrorDialog = function (error) {
                var message = error && error.message
                    ? error.message
                    : this._context.resources.getString("MailAppTrackBarControl_Retrieve_EWS_Failure_Short");
                this._context.navigation.openErrorDialog({
                    message: message,
                    details: error && error.stack ? error.stack : "No stack available.",
                });
            };
            MailAppTrackBarControl.prototype._format = function (str) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return str.replace(/{(\d+)}/g, function (match, i) {
                    return typeof args[i] !== "undefined"
                        ? args[i]
                        : match;
                });
            };
            MailAppTrackBarControl.prototype.getOutputs = function () {
                return {
                    regardingObject: this._trackStatusRetriever.getRegardingObject(),
                };
            };
            MailAppTrackBarControl.prototype.destroy = function () {
                if (this._lastTrackForbiddenNotificationId) {
                    this._context.utils.clearGlobalNotification(this._lastTrackForbiddenNotificationId);
                }
                this._trackStatusRetriever && this._trackStatusRetriever.destroy();
                this._context.externalContext.removeExternalContextPropertyListener(Constants.contextId, Constants.PropertyIds.MailboxItem, this._onItemChanged);
            };
            return MailAppTrackBarControl;
        }());
        MailApp.MailAppTrackBarControl = MailAppTrackBarControl;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        ;
        ;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Containers;
    (function (Containers) {
        "use strict";
        var FORM_METADATA_SYBTYPE = "quick";
        var FORMID_UNKNOWN = "UNKNOW_FORM";
        var DO_NOT_SHOW = "DO_NOT_SHOW";
        var QuickFormWrapper = (function () {
            function QuickFormWrapper() {
                this._uniqueId = Common.Guid.newGuid();
            }
            QuickFormWrapper.prototype.init = function (context, notifyOutputChanged, state) {
                this._context = context;
            };
            QuickFormWrapper.prototype._requestDefaultForm = function (formType) {
                var _this = this;
                var getFormId = this._context.utils.getFormId;
                if (!getFormId) {
                    this._formId = FORMID_UNKNOWN;
                    this._context.utils.requestRender();
                    return;
                }
                var promise = getFormId(this._currentEntityReference.LogicalName, "Quick");
                promise.then(function (id) {
                    if (id != null) {
                        _this._formId = id;
                    }
                    else {
                        _this._formId = FORMID_UNKNOWN;
                    }
                    _this._context.utils.requestRender();
                }, function (err) {
                    throw new Error("Corrupted _requestDefaultForm");
                });
            };
            QuickFormWrapper.prototype._isTypeChanged = function (newEntityReference) {
                return (!this._currentEntityReference ||
                    (newEntityReference !== null && this._currentEntityReference.LogicalName !== newEntityReference.LogicalName));
            };
            QuickFormWrapper.prototype._updateTypeLabel = function () {
                var _this = this;
                this._typeRequestStamp = Date.now();
                var currentRequestStamp = this._typeRequestStamp;
                this._entityMetadataRequest = this._context.utils.getEntityMetadata(this._context.parameters.data.raw.getNamedReference().LogicalName);
                this._entityMetadataRequest.then(function (metadata) {
                    if (currentRequestStamp >= _this._typeRequestStamp) {
                        if (_this._typeLabel !== metadata.DisplayName) {
                            _this._typeLabel = metadata.DisplayName;
                            if (_this._formId) {
                                _this._context.utils.requestRender();
                            }
                        }
                    }
                });
            };
            QuickFormWrapper.prototype.updateView = function (context) {
                var _this = this;
                this._context = context;
                var namedReference = this._context.parameters.data.raw && this._context.parameters.data.raw.getNamedReference();
                if (namedReference) {
                    var isTypeChanged = this._isTypeChanged(namedReference);
                    this._currentEntityReference = namedReference;
                    if (isTypeChanged) {
                        this._formId = "";
                        this._typeLabel = "";
                        this._entityMetadataRequest = null;
                    }
                    if (!this._typeLabel && !this._entityMetadataRequest) {
                        this._updateTypeLabel();
                    }
                    if (!this._formId) {
                        if (this._context.parameters.predefinedForms && this._context.parameters.predefinedForms.raw) {
                            var predefinedForms = this._context.parameters.predefinedForms.raw.split(",");
                            var formMapping_1 = {};
                            predefinedForms.forEach(function (formString) {
                                if (formString) {
                                    formMapping_1[formString.split("#")[0]] = formString.split("#")[1];
                                }
                            });
                            if (formMapping_1.hasOwnProperty(this._currentEntityReference.LogicalName)) {
                                this._formId = formMapping_1[this._currentEntityReference.LogicalName];
                            }
                        }
                        if (!this._formId) {
                            this._requestDefaultForm(FORM_METADATA_SYBTYPE);
                        }
                    }
                }
                else {
                    this._currentEntityReference = null;
                }
                if (!this._formId || !this._currentEntityReference || this._formId === DO_NOT_SHOW) {
                    return this._context.factory.createElement("LABEL", {
                        key: "label",
                        style: {
                            display: "none",
                        },
                    }, "");
                }
                if (this._formId === FORMID_UNKNOWN) {
                    var event_1 = {
                        eventName: "uci_trace",
                        eventParameters: [
                            { name: "Data", value: JSON.stringify(namedReference) },
                            { name: "ApplicationEventLevel", value: "3" },
                            { name: "Message", value: "Form Id is unknown" },
                            { name: "ComponentName", value: "MailApp.Control.QuickFormWrapper" },
                        ],
                    };
                    this._context.reporting.reportEvent(event_1);
                    return this._context.factory.createElement("LABEL", {
                        key: "label",
                    }, this._context.resources.getString("QuickFormWrapper_Have_No_Deafult_Form"));
                }
                var valueParam = {
                    Usage: 0,
                    Type: "Form.QuickForm",
                    Value: this._formId + ":Quick|" + this._currentEntityReference.LogicalName + "|" + this._currentEntityReference.Id,
                    Static: false,
                    Primary: true,
                };
                var formType = this._context.parameters.formType && this._context.parameters.formType.raw ?
                    this._context.parameters.formType.raw :
                    "QuickFormCardControl";
                var label = this._typeLabel ? this._typeLabel : "";
                if (this._context.parameters.label && this._context.parameters.label.raw) {
                    label = this._context.parameters.label.raw;
                    var resourceIds = label.match(/\$.+?\$/g);
                    if (resourceIds && resourceIds.length > 0) {
                        resourceIds.forEach(function (recourceId) {
                            label = label.replace("" + recourceId, _this._context.resources.getString(recourceId.substring(1, recourceId.length - 1)));
                        });
                        label = label.replace("\{TypeName\}", this._typeLabel);
                    }
                }
                var properties = {
                    descriptor: {
                        Id: "MscrmControls.Containers." + formType,
                        Label: "",
                        Name: "",
                        ShowLabel: false,
                        Visible: true,
                        Disabled: false,
                        Parameters: {
                            QuickForms: {
                                Usage: 0,
                                Type: "Form.QuickForm",
                                Value: "&lt;QuickFormIds&gt;&lt;QuickFormId entityname=\"" + this._currentEntityReference.LogicalName + "\"&gt;" + this._formId + "&lt;/QuickFormId&gt;&lt;/QuickFormIds&gt;",
                                Static: false,
                                Primary: true,
                            },
                        },
                    },
                    controlstates: {
                        hasFocus: this._context.mode.hasFocus,
                        isControlDisabled: this._context.mode.isControlDisabled,
                        label: label,
                    },
                    parameters: {
                        "value": valueParam,
                        "hideImage": {
                            Usage: 1,
                            Type: "Whole.None",
                            Value: this._context.parameters.hideImage && this._context.parameters.hideImage.raw,
                            Static: true,
                            Primary: true,
                        },
                    },
                };
                return this._context.factory.createComponent("MscrmControls.Containers." + formType, formType + "#" + this._currentEntityReference.LogicalName + "#" + this._currentEntityReference.Id + "#" + this._uniqueId, properties);
            };
            QuickFormWrapper.prototype.getOutputs = function () {
                return null;
            };
            QuickFormWrapper.prototype.destroy = function () {
            };
            return QuickFormWrapper;
        }());
        Containers.QuickFormWrapper = QuickFormWrapper;
    })(Containers = MscrmControls.Containers || (MscrmControls.Containers = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var StatusLabel;
    (function (StatusLabel) {
        "use strict";
        var StatusLabelControl = (function () {
            function StatusLabelControl() {
            }
            StatusLabelControl.prototype.init = function (context, notifyOutputChanged, state) {
                this._context = context;
                this._icons = {
                    "InProgress": {
                        "iconId": 248,
                        "iconColor": this._context.theming.colors.grays.gray07,
                    },
                    "Success": {
                        "iconId": 182,
                        "iconColor": this._context.theming.colors.basecolor.green.green4,
                    },
                    "Failure": {
                        "iconId": 181,
                        "iconColor": this._context.theming.colors.basecolor.red.red4,
                    },
                };
            };
            StatusLabelControl.prototype.updateView = function (context) {
                this._context = context;
                return this._context.factory.createElement("CONTAINER", {
                    id: "StatusLabelContainer",
                    key: "StatusLabelContainer",
                    style: {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    },
                }, [this._renderText(), this._renderIcon()]);
            };
            StatusLabelControl.prototype._renderText = function () {
                var statusText = this._context.mode._customControlProperties.descriptor.Label;
                return this._context.factory.createElement("LABEL", {
                    key: "StatusText",
                    id: "StatusText",
                    style: {
                        textDecoration: "none",
                        display: "block",
                        flex: "1 1 auto",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: this._context.theming.colors.basecolor.grey.grey5,
                        fontSize: this._context.theming.fontsizes.font100,
                        fontFamily: this._context.theming.fontfamilies.regular,
                    },
                    tabIndex: 0,
                    title: statusText,
                }, [statusText]);
            };
            StatusLabelControl.prototype._renderIcon = function () {
                var statusIcon = this._context.parameters.StatusIcon && this._context.parameters.StatusIcon.raw;
                if (!statusIcon || !this._icons[statusIcon]) {
                    return null;
                }
                return this._context.factory.createElement("MICROSOFTICON", {
                    id: "StatusIcon",
                    key: "StatusIcon",
                    type: this._icons[statusIcon].iconId,
                    style: {
                        display: "block",
                        color: this._icons[statusIcon].iconColor,
                        paddingLeft: this._context.theming.measures.measure200,
                        fontSize: "16px",
                    },
                });
            };
            StatusLabelControl.prototype.getOutputs = function () {
                return null;
            };
            StatusLabelControl.prototype.destroy = function () {
            };
            return StatusLabelControl;
        }());
        StatusLabel.StatusLabelControl = StatusLabelControl;
    })(StatusLabel = MscrmControls.StatusLabel || (MscrmControls.StatusLabel = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var UnboundHyperlinkControl;
    (function (UnboundHyperlinkControl_1) {
        "use strict";
        var UnboundHyperlinkControl = (function () {
            function UnboundHyperlinkControl() {
            }
            UnboundHyperlinkControl.prototype.init = function (context, notifyOutputChanged, state) {
                this._context = context;
            };
            UnboundHyperlinkControl.prototype.updateView = function (context) {
                this._context = context;
                return this._createUnboundLink();
            };
            UnboundHyperlinkControl.prototype._createUnboundLink = function () {
                var linkText = this._context.mode._customControlProperties.descriptor.Label;
                var linkUrl = this._context.parameters.LinkUrl.raw;
                return this._context.factory.createElement("HYPERLINK", {
                    id: "unboundLink",
                    key: "unboundLink",
                    href: linkUrl,
                    target: "_blank",
                    accessibilityLabel: linkText,
                    tabIndex: -1,
                    style: {
                        color: this._context.theming.colors.basecolor.blue.blue3,
                        fontSize: this._context.theming.fontsizes.font100,
                        textDecoration: "none",
                    },
                }, linkText);
            };
            UnboundHyperlinkControl.prototype.getOutputs = function () {
                return null;
            };
            UnboundHyperlinkControl.prototype.destroy = function () {
            };
            return UnboundHyperlinkControl;
        }());
        UnboundHyperlinkControl_1.UnboundHyperlinkControl = UnboundHyperlinkControl;
    })(UnboundHyperlinkControl = MscrmControls.UnboundHyperlinkControl || (MscrmControls.UnboundHyperlinkControl = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var MailAppStyleManager = (function () {
            function MailAppStyleManager() {
            }
            MailAppStyleManager.prototype.init = function (context) {
                this._context = context;
            };
            MailAppStyleManager.prototype.getLabelStyle = function () {
                return {
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: this._context.theming.fontsizes.font100,
                    fontFamily: this._context.theming.fontfamilies.semibold,
                };
            };
            MailAppStyleManager.prototype.getHeaderStyle = function () {
                return Object.assign(this.getLabelStyle(), {
                    fontFamily: this._context.theming.fontfamilies.regular,
                });
            };
            MailAppStyleManager.prototype.getLinkStyle = function () {
                return Object.assign(this.getLabelStyle(), {
                    color: this._context.theming.colors.basecolor.blue.blue3,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                });
            };
            MailAppStyleManager.prototype.getLinkButtonStyle = function () {
                return {
                    backgroundColor: "transparent",
                    borderStyle: "none",
                    color: this._context.theming.colors.grays.gray07,
                    paddingTop: this._context.theming.measures.measure075,
                    paddingBottom: this._context.theming.measures.measure100,
                    paddingLeft: this._context.client.isRTL ? this._context.theming.measures.measure100 : this._context.theming.measures.measure050,
                    paddingRight: this._context.client.isRTL ? this._context.theming.measures.measure050 : this._context.theming.measures.measure100,
                    marginLeft: this._context.client.isRTL ? 0 : this._context.theming.measures.measure200,
                    marginRight: this._context.client.isRTL ? this._context.theming.measures.measure200 : 0,
                    fontSize: "16px",
                    cursor: "pointer",
                };
            };
            MailAppStyleManager.prototype.getFlyoutStyle = function () {
                return {
                    border: "1px " + this._context.theming.solidborderstyle + " " + this._context.theming.colors.controlborder,
                };
            };
            MailAppStyleManager.prototype.getFlyoutItemStyle = function () {
                return {
                    display: "block",
                    lineHeight: this._context.theming.measures.measure250,
                    paddingLeft: this._context.theming.measures.measure100,
                    paddingRight: this._context.theming.measures.measure100,
                    whiteSpace: "nowrap",
                    color: this._context.theming.colors.grays.gray07,
                    fontSize: this._context.theming.fontsizes.font100,
                    fontFamily: this._context.theming.fontfamilies.regular,
                    cursor: "pointer",
                    backgroundColor: this._context.theming.colors.whitebackground,
                    ":hover": {
                        backgroundColor: this._context.theming.colors.grays.gray03,
                    },
                };
            };
            MailAppStyleManager.prototype.getFlyoutItemHoverStyle = function () {
                return {
                    backgroundColor: "#E6F2FA",
                };
            };
            return MailAppStyleManager;
        }());
        MailApp.MailAppStyleManager = MailAppStyleManager;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var MailApp;
    (function (MailApp) {
        "use strict";
        var NamePropertyName = "name";
        var EmailPropertyName = "emailaddress";
        var RolePropertyName = "role";
        var DistributionListLogicalName = "distributionList";
        var LIST_ITEM_ID_PREFIX = "RecipientsCreateFormAdd_";
        var UnknownRecipientSummaryControl = (function () {
            function UnknownRecipientSummaryControl() {
                var _this = this;
                this._onOpenFormSuccess = function (saveResult) {
                    if (!saveResult) {
                        return;
                    }
                    if (_this._getFieldValue(EmailPropertyName)) {
                        _this._context.externalContext.invokeExternalContextAction(Constants.contextId, Constants.ActionIds.ResolveRecipientFromScratch, {
                            args: {
                                emailAddress: _this._getFieldValue(EmailPropertyName),
                            },
                        });
                    }
                    if (saveResult.savedEntityReference && _this._isSender()) {
                        Promise.all([
                            _this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.TrackStatus),
                            _this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.IsCreateContactWithoutTracking),
                        ])
                            .then(function (_a) {
                            var trackStatus = _a[0], isCreateContactWithoutTracking = _a[1];
                            if (trackStatus && trackStatus.crmTrackingState === Models.TrackingState.NotLinked && !isCreateContactWithoutTracking) {
                                _this._trackWithRegarding(saveResult.savedEntityReference[0]);
                            }
                        });
                    }
                };
            }
            UnknownRecipientSummaryControl.prototype.init = function (context, notifyOutputChanged, state) {
                var _this = this;
                this._context = context;
                var uniqueId = this._context.accessibility.getUniqueId("button");
                this._addRecipientButtonId = "RecipientsCreateForm_" + uniqueId;
                this._mailAppStyleManager = new MailApp.MailAppStyleManager();
                this._mailAppStyleManager.init(this._context);
                this._context.externalContext.getExternalContextProperty(Constants.contextId, Constants.PropertyIds.TrackAllowedStatus)
                    .then(function (trackAllowedStatus) {
                    _this._isTrackAllowed = trackAllowedStatus === Enums.TrackAllowedStatus.Allowed;
                    _this._context.utils.requestRender();
                });
            };
            UnknownRecipientSummaryControl.prototype.updateView = function (context) {
                var _this = this;
                this._context = context;
                if (!context.parameters.data || !context.parameters.data.raw) {
                    return context.factory.createElement("CONTAINER", {
                        id: "RecipientsCreateFormEmptyContainer",
                        key: "RecipientsCreateFormEmptyContainer",
                    });
                }
                var headerLabel = context.factory.createElement("LABEL", {
                    id: "RecipientCreateFormHeaderLabel",
                    key: "RecipientCreateFormHeaderLabel",
                    style: this._mailAppStyleManager.getHeaderStyle(),
                }, this._getRecipientCreateFormHeaderText());
                var recipientCard = this._renderUnresolvedRecipientCard();
                var hasEntityCreatePermissions = this._getEntityTypesFromParameters().some(function (entityType) {
                    return _this._context.utils.hasEntityPrivilege(entityType, 1, -1);
                });
                var canShowContactDuplicateWarning = this._isTrackAllowed && this._isSender();
                var contactDuplicateWarning = canShowContactDuplicateWarning ? this._renderContactDuplicateWarning() : null;
                var controls = hasEntityCreatePermissions ? this._renderControls() : null;
                var cardForm = context.factory.createElement("CONTAINER", {
                    id: "RecipientsCreateFormContainer",
                    key: "RecipientsCreateFormContainer",
                    style: {
                        "display": "flex",
                        "flexDirection": "row",
                        "alignItems": "flex-end",
                        "justifyContent": "space-between",
                    },
                }, [recipientCard, controls]);
                return context.factory.createElement("CONTAINER", {
                    id: "RecipientsCreateFormContainer",
                    key: "RecipientsCreateFormContainer",
                    style: {
                        "display": "block",
                        "width": "100%",
                        "color": this._context.theming.colors.grays.gray05,
                        "background-color": this._context.theming.colors.whitebackground,
                        "padding-top": this._context.theming.measures.measure100,
                        "padding-left": this._context.client.isRTL ? 0 : this._context.theming.measures.measure100,
                        "padding-right": this._context.client.isRTL ? this._context.theming.measures.measure100 : 0,
                        "box-sizing": "border-box",
                    },
                }, [headerLabel, contactDuplicateWarning, cardForm]);
            };
            UnknownRecipientSummaryControl.prototype.openAddRecipientFlyout = function () {
                this._isAddRecipientFlyoutOpened = true;
                this._context.utils.requestRender();
            };
            UnknownRecipientSummaryControl.prototype.closeAddRecipientFlyout = function () {
                this._isAddRecipientFlyoutOpened = false;
                this._context.utils.requestRender();
            };
            UnknownRecipientSummaryControl.prototype._renderUnresolvedRecipientCard = function () {
                var cardChildren = [];
                var recipientName = this._getFieldValue(NamePropertyName);
                if (recipientName && recipientName !== this._getFieldValue(EmailPropertyName)) {
                    cardChildren.push(this._context.factory.createElement("LABEL", {
                        id: "RecipientCreateFormName",
                        key: "RecipientCreateFormName",
                        style: this._mailAppStyleManager.getLabelStyle(),
                    }, [recipientName]));
                }
                var emailAddress = this._getFieldValue(EmailPropertyName);
                if (emailAddress) {
                    cardChildren.push(this._context.factory.createElement("HYPERLINK", {
                        id: "RecipientCreateFormEmail",
                        key: "RecipientCreateFormEmail",
                        target: "_blank",
                        href: "mailto:" + emailAddress,
                        style: this._mailAppStyleManager.getLinkStyle(),
                        title: emailAddress,
                    }, [emailAddress]));
                }
                return this._context.factory.createElement("CONTAINER", {
                    id: "RecipientsCreateFormCard",
                    key: "RecipientsCreateFormCard",
                    style: {
                        "display": "block",
                        "padding-bottom": this._context.theming.measures.measure100,
                        "padding-top": this._context.theming.measures.measure075,
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap",
                    },
                }, cardChildren);
            };
            UnknownRecipientSummaryControl.prototype._renderControls = function () {
                var controls = [];
                controls.push(this._renderAddRecipientButton());
                if (this._isAddRecipientFlyoutOpened) {
                    controls.push(this._renderAddRecipientFlyout());
                }
                return this._context.factory.createElement("CONTAINER", {
                    id: "RecipientsCreateFormControls",
                    key: "RecipientsCreateFormControls",
                    style: {
                        display: "block",
                    },
                }, controls);
            };
            UnknownRecipientSummaryControl.prototype._renderAddRecipientButton = function () {
                var _this = this;
                var addIcon = this._context.factory.createElement("MICROSOFTICON", {
                    id: "RecipientsCreateFormAddButtonIcon",
                    key: "RecipientsCreateFormAddButtonIcon",
                    type: 8,
                });
                var buttonTitle = this._context.resources.getString("UnknownRecipientSummaryControl_Add_To_Dynamics_365");
                return this._context.factory.createElement("BUTTON", {
                    id: this._addRecipientButtonId,
                    key: this._addRecipientButtonId,
                    title: buttonTitle,
                    accessibilityLabel: buttonTitle,
                    accessibilityHasPopup: true,
                    role: "button",
                    tabIndex: 0,
                    onClick: function () {
                        _this.openAddRecipientFlyout();
                    },
                    style: this._mailAppStyleManager.getLinkButtonStyle(),
                }, [addIcon]);
            };
            UnknownRecipientSummaryControl.prototype._renderContactDuplicateWarning = function () {
                var warningIcon = this._context.factory.createElement("MICROSOFTICON", {
                    id: "ContactDuplicateWarningIcon",
                    key: "ContactDuplicateWarningIcon",
                    type: 179,
                    style: {
                        position: "relative",
                        fontSize: "20px",
                        top: "5px",
                        marginRight: "5px",
                    },
                });
                var contactDuplicateWarningText = this._context.resources.getString("UnknownRecipientSummaryControl_Create_Contact_To_Avoid_Duplicates");
                var warningLabel = this._context.factory.createElement("LABEL", {
                    id: "ContactDuplicateWarningLabel",
                    key: "ContactDuplicateWarningLabel",
                }, contactDuplicateWarningText);
                return this._context.factory.createElement("CONTAINER", {
                    id: "ContactDuplicateWarningContainer",
                    key: "ContactDuplicateWarningContainer",
                    style: {
                        display: "block",
                        color: "#3b3a39",
                        paddingTop: this._context.theming.measures.measure050,
                        paddingBottom: this._context.theming.measures.measure025,
                    },
                }, [warningIcon, warningLabel]);
            };
            UnknownRecipientSummaryControl.prototype._onAddRecipientClick = function (clickedEntityType) {
                var formOptions = {
                    entityName: clickedEntityType,
                    useQuickCreateForm: true,
                };
                var prefillOptions = this._getPrefillOptions(clickedEntityType);
                this.closeAddRecipientFlyout();
                this._context.navigation.openForm(formOptions, prefillOptions).then(this._onOpenFormSuccess);
            };
            UnknownRecipientSummaryControl.prototype._getPrefillOptions = function (entityType) {
                var names = this._getRecipientFirstAndLastName();
                var email = this._getFieldValue(EmailPropertyName);
                var prefillOptions;
                if (entityType === Constants.CrmTypeNames.Account) {
                    var domain = email.match(/@([^.]+)/);
                    if (domain) {
                        prefillOptions = {
                            "name": domain[1],
                            "emailaddress1": email,
                        };
                    }
                }
                else {
                    prefillOptions = {
                        "emailaddress1": email,
                        "firstname": names.firstName,
                        "lastname": names.lastName,
                    };
                }
                return prefillOptions;
            };
            UnknownRecipientSummaryControl.prototype._getRecipientFirstAndLastName = function () {
                var displayName = this._getFieldValue(NamePropertyName);
                var email = this._getFieldValue(EmailPropertyName);
                var isNameEmail = (displayName || email).indexOf("@") !== -1;
                if (displayName && !isNameEmail) {
                    var commaSeparatedArray = displayName.split(",");
                    if (commaSeparatedArray.length > 1) {
                        if (commaSeparatedArray.length === 2) {
                            return {
                                firstName: commaSeparatedArray[1],
                                lastName: commaSeparatedArray[0],
                            };
                        }
                        return {
                            lastName: displayName,
                        };
                    }
                    var spaceSeparatedArray = displayName.split(" ");
                    return {
                        firstName: spaceSeparatedArray.length > 1 ? spaceSeparatedArray.slice(0, -1).join(" ") : null,
                        lastName: spaceSeparatedArray[spaceSeparatedArray.length - 1],
                    };
                }
                var dotSeparatedArray = email.substring(0, email.indexOf("@")).split(".");
                if (dotSeparatedArray.length === 2) {
                    return {
                        firstName: this._capitalizeFirstLetter(dotSeparatedArray[0]),
                        lastName: this._capitalizeFirstLetter(dotSeparatedArray[1]),
                    };
                }
                return {};
            };
            UnknownRecipientSummaryControl.prototype._capitalizeFirstLetter = function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            UnknownRecipientSummaryControl.prototype._trackWithRegarding = function (senderEntity) {
                var _this = this;
                var setRegardingRecord = {
                    id: senderEntity.id,
                    name: senderEntity.name,
                    Name: senderEntity.name,
                    logicalName: senderEntity.entityType,
                    LogicalName: senderEntity.entityType,
                    entityName: senderEntity.entityType,
                    entityType: senderEntity.entityType,
                };
                var setRegardingDataSetRecord = { getNamedReference: function () { return setRegardingRecord; } };
                var TrackCommandId = "MailApp.TrackRegarding.Button";
                this._context.utils.retrieveRecordCommand((_a = {}, _a[setRegardingRecord.id] = setRegardingDataSetRecord, _a), Constants.GlobalCommandManagerId, [setRegardingRecord.id], [TrackCommandId])
                    .then(function (commands) {
                    var trackCommand = commands && commands[0];
                    if (trackCommand && trackCommand.canExecute) {
                        trackCommand.execute();
                    }
                }, function (error) {
                    var eventParams = [
                        { name: "Data", value: JSON.stringify(setRegardingRecord) },
                        { name: "Error", value: JSON.stringify(error) },
                    ];
                    _this._context.reporting.reportFailure("MailApp.Control.UnknownRecipientSummary", new Error("Failed to retrieve record from CRM"), null, eventParams);
                });
                var _a;
            };
            UnknownRecipientSummaryControl.prototype._isSender = function () {
                return parseInt(this._getFieldValue(RolePropertyName), 10) === Models.RecipientRole.Sender;
            };
            UnknownRecipientSummaryControl.prototype._renderAddRecipientFlyout = function () {
                var _this = this;
                var entityTypesToAdd = this._getEntityTypesFromParameters().filter(function (entityType) {
                    return _this._isFCBRequiredAndEnabled(entityType) && _this._context.utils.hasEntityPrivilege(entityType, 1, -1);
                });
                var dropdownChildren = entityTypesToAdd.map(function (currentEntityType, currentIndex) {
                    var lastItemIndex = entityTypesToAdd.length - 1;
                    var prevEntityType = entityTypesToAdd[currentIndex === 0 ? lastItemIndex : currentIndex - 1];
                    var nextEntityType = entityTypesToAdd[currentIndex === lastItemIndex ? 0 : currentIndex + 1];
                    return _this._renderAddRecipientFlyoutItem(currentEntityType, _this._getResourceKeyForEntityType(currentEntityType), prevEntityType, nextEntityType);
                });
                var dropdown = this._context.factory.createElement("LIST", {
                    id: "RecipientsCreateFormAddRecipientDropdown",
                    key: "RecipientsCreateFormAddRecipientDropdown",
                    role: "menu",
                    accessibilityLabel: "Commands",
                }, dropdownChildren);
                return this._context.factory.createElement("FLYOUT", {
                    id: "RecipientsCreateFormAddRecipientFlyout",
                    key: "RecipientsCreateFormAddRecipientFlyout",
                    flyoutDirection: 7,
                    flyoutStyle: this._mailAppStyleManager.getFlyoutStyle(),
                    positionType: "relative",
                    relativeToElementId: this._addRecipientButtonId,
                    onOutsideClick: function () {
                        _this.closeAddRecipientFlyout();
                    },
                }, [dropdown]);
            };
            UnknownRecipientSummaryControl.prototype._isFCBRequiredAndEnabled = function (entityType) {
                if (entityType === Constants.CrmTypeNames.Account) {
                    return this._context.utils.isFeatureEnabled(Constants.FeatureNames.MailAppResolveRecipientsToAccounts);
                }
                else {
                    return true;
                }
            };
            UnknownRecipientSummaryControl.prototype._getResourceKeyForEntityType = function (entityType) {
                entityType = entityType.toLowerCase();
                var capitalizedEntityType = entityType.charAt(0).toUpperCase() + entityType.slice(1);
                return this._context.resources.getString("UnknownRecipientSummaryControl_Add_As_" + capitalizedEntityType);
            };
            UnknownRecipientSummaryControl.prototype._getEntityTypesFromParameters = function () {
                var entityTypesToAddString = this._context.parameters.entityTypesToAdd && this._context.parameters.entityTypesToAdd.raw;
                if (!entityTypesToAddString) {
                    return [];
                }
                return entityTypesToAddString.split(",").map(function (t) { return t.trim().toLowerCase(); });
            };
            UnknownRecipientSummaryControl.prototype._renderAddRecipientFlyoutItem = function (entityType, label, prevEntityType, nextEntityType) {
                return this._context.factory.createElement("LISTITEM", {
                    id: LIST_ITEM_ID_PREFIX + entityType,
                    key: LIST_ITEM_ID_PREFIX + entityType,
                    role: "menuitem",
                    tabIndex: 0,
                    accessibilityLabel: label,
                    style: this._mailAppStyleManager.getFlyoutItemStyle(),
                    onClick: this._onAddRecipientClick.bind(this, entityType),
                    onKeyDown: this._onListItemKeyDownHandler.bind(this, entityType, nextEntityType, prevEntityType),
                }, [label]);
            };
            UnknownRecipientSummaryControl.prototype._onListItemKeyDownHandler = function (entityType, nextEntityType, prevEntityType, e) {
                if (e.keyCode === 40) {
                    this._focusOnKeyDown(LIST_ITEM_ID_PREFIX + nextEntityType, e);
                }
                if (e.keyCode === 38) {
                    this._focusOnKeyDown(LIST_ITEM_ID_PREFIX + prevEntityType, e);
                }
                if (e.keyCode === 27) {
                    this.closeAddRecipientFlyout();
                    this._context.accessibility.focusElementById(this._addRecipientButtonId);
                }
                if (e.keyCode === 13) {
                    this._onAddRecipientClick(entityType);
                }
            };
            UnknownRecipientSummaryControl.prototype._focusOnKeyDown = function (elementId, e) {
                this._context.accessibility.focusElementById(elementId);
                e.preventDefault();
                e.stopPropagation();
            };
            UnknownRecipientSummaryControl.prototype._getFieldValue = function (fieldName) {
                return this._context.parameters.data.raw && this._context.parameters.data.raw.getFormattedValue(fieldName);
            };
            UnknownRecipientSummaryControl.prototype._getRecordEntityLogicalName = function () {
                var namedReference = this._context.parameters.data.raw && this._context.parameters.data.raw.getNamedReference();
                return namedReference && namedReference.LogicalName;
            };
            UnknownRecipientSummaryControl.prototype._getRecipientCreateFormHeaderText = function () {
                return this._getRecordEntityLogicalName() === DistributionListLogicalName ?
                    this._context.resources.getString("UnknownRecipientSummaryControl_Distribution_List") :
                    this._context.resources.getString("UnknownRecipientSummaryControl_Unknown_Recipient");
            };
            UnknownRecipientSummaryControl.prototype.getOutputs = function () {
                return null;
            };
            UnknownRecipientSummaryControl.prototype.destroy = function () {
            };
            return UnknownRecipientSummaryControl;
        }());
        MailApp.UnknownRecipientSummaryControl = UnknownRecipientSummaryControl;
    })(MailApp = MscrmControls.MailApp || (MscrmControls.MailApp = {}));
})(MscrmControls || (MscrmControls = {}));
//# sourceMappingURL=MailAppControls.js.map