/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
$(document).ready(function(){var destroy=function(){if(this.options.enhanced)return;if(this._originalTabIndex!=null)this.element.attr("tabindex",this._originalTabIndex);else this.element.removeAttr("tabindex");this.on.remove();this.off.remove();this.element.unwrap();this.element.removeClass("ui-flipswitch-input");this.flipswitch.remove()};$.widget("mobile.flipswitch",$.mobile.flipswitch,{_destroy:destroy})})