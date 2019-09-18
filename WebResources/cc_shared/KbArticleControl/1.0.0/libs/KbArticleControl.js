var MscrmControls;!function(MscrmControls){var KbArticleControl;!function(KbArticleControl){"use strict";var Constants=function(){function Constants(){}return Constants.NumberOfViewsIconToolTip="SearchWidget.SearchKMArticles.NumberOfViewsToolTip",Constants.ModifiedOnLabelToolTip="SearchWidget.SearchKMArticles.LastModifiedDateLabelToolTip",Constants.RatingIconToolTip="SearchWidget.SearchKMArticles.RatingIconToolTip",Constants.ModifiedOnLabel="SearchWidget.SearchKMArticles.LastModifiedDateLabel",Constants}();KbArticleControl.Constants=Constants}(KbArticleControl=MscrmControls.KbArticleControl||(MscrmControls.KbArticleControl={}))}(MscrmControls||(MscrmControls={}));var MscrmControls;!function(MscrmControls){var KbArticleControl;!function(KbArticleControl_1){"use strict";var KbArticleControl=function(){function KbArticleControl(){}return KbArticleControl.prototype.init=function(context,notifyOutputChanged,state,container){this._context=context},KbArticleControl.prototype.updateView=function(context){return this._context=context,this.render(!1)},KbArticleControl.prototype.renderArticleMetadata=function(){null==this.KbSearchResultLegendsObject&&(this.KbSearchResultLegendsObject=new KbArticleControl_1.KbSearchResultLegends,this.KbSearchResultLegendsObject.init(this._context));var resultLegends=this.KbSearchResultLegendsObject.render(this._context.parameters.article);return this._context.factory.createElement("Container",{id:"kbSearchResults.footer.id",key:"kbSearchResults.footer.id",style:{width:"100%",display:"flex"}},resultLegends)},KbArticleControl.prototype.renderArticleTitle=function(title){return this._context.factory.createElement("LABEL",{id:"contentPaneArticleTitle",style:{fontFamily:this._context.theming.fontfamilies.semibold,fontSize:this._context.theming.fontsizes.font125,color:this._context.theming.colors.grays.gray06,textOverflow:"ellipsis",overflow:"hidden",width:"100%",maxWidth:"100%",height:"2em",whiteSpace:"normal"}},title)},KbArticleControl.prototype.renderControlBlock=function(isPopupControl){void 0===isPopupControl&&(isPopupControl=!1);var controlBlock=[],title=this._context.parameters.article.title,renderArticleTitle=this.renderArticleTitle(title);return controlBlock.push(this._context.factory.createElement("Container",{id:"ContentPaneArticleName",key:"ContentPaneArticleNameDiv",style:{marginTop:this._context.theming.measures.measure100,marginBottom:this._context.theming.measures.measure025,width:"100%"}},renderArticleTitle)),controlBlock.push(this._context.factory.createElement("Container",{id:"ContentPaneArticleMetadata",key:"ContentPaneArticleMetadatadiv",style:{minHeight:"20px",marginTop:this._context.theming.measures.measure025,width:"100%"}},this.renderArticleMetadata())),this._context.factory.createElement("Container",{id:"controlBlockArticleInfoHeaderReadPane",key:"controlBlockArticleInfoReadPanelDiv",ref:"controlBlockArticleInfoReadPanelDiv"},controlBlock)},KbArticleControl.prototype.render=function(isPopupControl){return this.renderControlBlock(isPopupControl)},KbArticleControl.prototype.getOutputs=function(){return null},KbArticleControl.prototype.destroy=function(){},KbArticleControl}();KbArticleControl_1.KbArticleControl=KbArticleControl}(KbArticleControl=MscrmControls.KbArticleControl||(MscrmControls.KbArticleControl={}))}(MscrmControls||(MscrmControls={}));var MscrmControls;!function(MscrmControls){var KbArticleControl;!function(KbArticleControl){"use strict";var KbSearchResultLegends=function(){function KbSearchResultLegends(){}return KbSearchResultLegends.prototype.init=function(context,notifyOutputChanged,state,container){this._context=context},KbSearchResultLegends.prototype.render=function(kbSearchRecord){var modifiedOnValue,controlBlock=[],knowledgeArticleViews=kbSearchRecord.knowledgeArticleViews,knowledgeArticleViewsTooltipValue=MscrmCommon.ControlUtils.String.Format(this._context.resources.getString(KbArticleControl.Constants.NumberOfViewsIconToolTip),knowledgeArticleViews.toString()),modifiedOnResourceTooltipValue=this._context.resources.getString(KbArticleControl.Constants.ModifiedOnLabelToolTip),ratingTooltipValue=this._context.resources.getString(KbArticleControl.Constants.RatingIconToolTip),knowledgeArticleViewsLabel=this._context.factory.createElement("LABEL",{id:"knowledgeArticleViews",key:"knowledgeArticleViews",title:knowledgeArticleViewsTooltipValue},knowledgeArticleViews),rating=kbSearchRecord.rating,ratingLabel=this._context.factory.createElement("LABEL",{id:"rating",key:"rating",title:ratingTooltipValue},rating);if(kbSearchRecord.modifiedOn){var formattedDateTime=this._context.formatting.formatTime(new Date(kbSearchRecord.modifiedOn.toString()),1).split(/\s/);modifiedOnValue=formattedDateTime.length>1?formattedDateTime[0]:""}modifiedOnResourceTooltipValue=modifiedOnResourceTooltipValue.concat(" "+modifiedOnValue);var modifiedOnValueLabel=this._context.factory.createElement("LABEL",{id:"modifiedOnValue",key:"modifiedOnValue",style:{padding:"0 0 0 3px",fontSize:this._context.theming.fontsizes.font100,color:this._context.theming.colors.grays.gray05},title:modifiedOnResourceTooltipValue},modifiedOnValue),modifiedOnResourceValue=this._context.resources.getString(KbArticleControl.Constants.ModifiedOnLabel),modifiedOnResourceLabel=this._context.factory.createElement("LABEL",{id:"modifiedOnResourceValue",key:"modifiedOnResourceValue",style:{fontSize:this._context.theming.fontsizes.font100,color:this._context.theming.colors.grays.gray05},title:modifiedOnResourceTooltipValue},modifiedOnResourceValue),modifiedOnDiv=this._context.factory.createElement("Container",{id:"kbSearchResults.footerDivModifiedOn",key:"kbSearchResults.footerDivModifiedOn",style:{whiteSpace:"nowrap",flexWrap:"wrap",marginLeft:this._context.client.isRTL?this._context.theming.measures.measure100:0,marginRight:this._context.client.isRTL?0:this._context.theming.measures.measure100,display:"flex"}},[modifiedOnResourceLabel,modifiedOnValueLabel]),numberOfViewsIconId="microsoftIcon_numberOfViewsButton_",numberOfViewsIcon=this._context.factory.createElement("MICROSOFTICON",{id:numberOfViewsIconId,key:numberOfViewsIconId,type:176}),numberOfViewsIconDiv=this._context.factory.createElement("Container",{id:"numberOfViewsIcon",key:"numberOfViewsIconDiv",ref:"numberOfViewsIconDiv",style:{whiteSpace:"nowrap",display:"inline-block",paddingLeft:this._context.client.isRTL?this._context.theming.measures.measure025:0,paddingRight:this._context.client.isRTL?0:this._context.theming.measures.measure025,fontSize:"16px"},title:knowledgeArticleViewsTooltipValue},numberOfViewsIcon);if(controlBlock.push(numberOfViewsIconDiv,knowledgeArticleViewsLabel),"true"==this._context.parameters.enableRating){var ratingFullIconId="microsoftIcon_ratingFullButton_",ratingFullIcon=this._context.factory.createElement("MICROSOFTICON",{id:ratingFullIconId,key:ratingFullIconId,type:16}),ratingFullIconDiv=this._context.factory.createElement("Container",{id:"ratingFullIcon",key:"ratingFullIconDiv",ref:"ratingFullIconDiv",style:{whiteSpace:"nowrap",display:"inline-block",marginLeft:this._context.client.isRTL?0:this._context.theming.measures.measure100,marginRight:this._context.client.isRTL?this._context.theming.measures.measure100:0,paddingLeft:this._context.client.isRTL?this._context.theming.measures.measure025:0,paddingRight:this._context.client.isRTL?0:this._context.theming.measures.measure025,fontSize:"16px"},title:ratingTooltipValue},ratingFullIcon);controlBlock.push(ratingFullIconDiv,ratingLabel)}var footerDivRatingandArticleView=this._context.factory.createElement("Container",{id:"kbSearchResults.footerDivRatingandArticleView",key:"kbSearchResults.footerDivRatingandArticleView",style:{whiteSpace:"normal",display:"flex",flexWrap:"nowrap"}},controlBlock),headerIconsBlock=this._context.factory.createElement("Container",{id:"controlBlockHeaderIconPane",key:"controlBlockHeaderIconPaneDiv",ref:"controlBlockHeaderIconPaneDiv",className:"controlBlockHeaderIconPane",style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",width:"100%"}},[modifiedOnDiv,footerDivRatingandArticleView]);return headerIconsBlock},KbSearchResultLegends.prototype.getOutputs=function(){return null},KbSearchResultLegends.prototype.destroy=function(){},KbSearchResultLegends.prototype.onPreNavigation=function(){},KbSearchResultLegends}();KbArticleControl.KbSearchResultLegends=KbSearchResultLegends}(KbArticleControl=MscrmControls.KbArticleControl||(MscrmControls.KbArticleControl={}))}(MscrmControls||(MscrmControls={}));
//# sourceMappingURL=d:\a\1\s\target\Release\amd64\package\Controls\\KbArticleControl\KbArticleControl.js.map