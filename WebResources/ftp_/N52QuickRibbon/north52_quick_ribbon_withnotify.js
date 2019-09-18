//If the SDK namespace object is not defined, create it.
if (typeof (N52QuickRibbon) == "undefined"){ N52QuickRibbon = {}; }

N52QuickRibbon.SyncResult= true;

// Used the calling a formula from the ribbon against a list view - fires against every selected record
N52QuickRibbon.ExecuteFormulaOnView= function(guidsArray, entitytype, lcid, shortcode)
{		   	
   	for(var i=0;i<guidsArray.length;i++)
   	{
   		try{
			var executionContext= N52QuickRibbon.BuildExecutionObject(guidsArray[i], entitytype, lcid);
			var formulaParams = N52.Clientside.BuildFormulaParameters(executionContext, shortcode, null, false);
			N52.Clientside.ExecuteFormulasNative(executionContext, formulaParams , N52.Clientside.RetrieveFormulaCallBack, N52QuickRibbon.CompleteCallBack); 
		}	
	
		catch (ex)
		{
			alert('North52 BPA: Failed to fire Quick Ribbon:  ' + ex.message, 'WARNING', 'msg1');
		}
	}
};

// Used when calling a formula from the ribbon on an open record 
N52QuickRibbon.ExecuteFormulaOnForm= function(shortcode)
{
	try{
	   	var targetentityid = null;
	   	var entitytype = null; 
	   	var lcid = null; 
	   	
		var executionContext= N52QuickRibbon.BuildExecutionObject(targetentityid, entitytype, lcid);
		var formulaParams = N52.Clientside.BuildFormulaParameters(executionContext, shortcode, null, false);
		N52.Clientside.ExecuteFormulasNative(executionContext, formulaParams , N52.Clientside.RetrieveFormulaCallBack, N52QuickRibbon.CompleteCallBack); 
				
	}
	catch (ex)
	{
		Xrm.Page.ui.setFormNotification('North52 BPA: Failed to fire Quick Ribbon:  ' + ex.message, 'WARNING', 'msg1');
	}
};

// Used if you want set a N52 rule to disable a Ribbon Button - List View
// If being used against a list view, it will check only against the first record
N52QuickRibbon.EnableDisableRibbonButtonView= function(guidsArray, entitytype, lcid, shortcode)
{
	if (guidsArray.length == 0 || entitytype == null || lcid == null || shortcode == null)
	{
		return false;
	}
	else
	{
		try{
			var executionContext= N52QuickRibbon.BuildExecutionObject(guidsArray[0], entitytype, lcid);
			var formulaParams = N52.Clientside.BuildFormulaParameters(executionContext, shortcode, null, true);
			N52.Clientside.ExecuteFormulasNative(executionContext, formulaParams , N52QuickRibbon.DisableButtonFormulaCallback,N52QuickRibbon.CompleteCallBack); 
				
			return N52QuickRibbon.SyncResult;
			
		}
		catch(ex){ 
		
			alert('North52 BPA: EnableDisable Button Failure:  ' + ex.message, 'WARNING', 'msg1');
		
		}
	}	
};


// Used if you want set a N52 rule to disable a Ribbon Button - List View
// If being used against a list view, it will check only against the first record
N52QuickRibbon.EnableDisableRibbonButtonForm= function(shortcode)
{
	var targetentityid = null;
	var entitytype = null;
	var lcid = null;

	try{
		var executionContext= N52QuickRibbon.BuildExecutionObject(targetentityid, entitytype, lcid);
		var formulaParams = N52.Clientside.BuildFormulaParameters(executionContext, shortcode, null, true);
		N52.Clientside.ExecuteFormulasNative(executionContext, formulaParams , N52QuickRibbon.DisableButtonFormulaCallback,N52QuickRibbon.CompleteCallBack); 
			
		return N52QuickRibbon.SyncResult;
		
	}
	catch(ex){
		
		Xrm.Page.ui.setFormNotification('North52 BPA: EnableDisable Button Failure:  ' + ex.message, 'WARNING', 'msg1');
	}	
};



N52QuickRibbon.DisableButtonFormulaCallback= function(retrievedFormulaResults)
{
	window['n52ExecutionContext'] = null;
	window['n52AllowSaveEvent'] = null; 

	var formulaResult = retrievedFormulaResults[0];
    var formulaResultEx = formulaResult.north52_Result == null ? formulaResult.north52_result : formulaResult.north52_Result; 
    var n52Result = N52JSON.parse(formulaResultEx);
	
	N52QuickRibbon.SyncResult = n52Result.PropertyValueAction.toString().toLowerCase() == 'false' ? false : true;
	
};


	
N52QuickRibbon.CompleteCallBack= function()
{

};

N52QuickRibbon.RetrieveFormulaCallBack= function(retrievedFormulaResults)	
{
        var formulaResult = retrievedFormulaResults[0];
        var formulaResultEx = formulaResult.north52_Result == null ? formulaResult.north52_result : formulaResult.north52_Result;	
        //var n52Result = N52JSON.parse(formulaResultEx);
        
        var n52result =N52JSON.parse(formulaResultEx).PropertyValueAction.toString();
        
         if(n52result !="NoOp")
         {
                if (n52result.substring(0, 6) == "notify") {
                    //debugger;
                    var args = n52result.substring(7, n52result.length);
                    var listItems = args.split("|");

                    for (var i = 0; i < listItems.length; i++) {
                        var notification = listItems[i].split(",");
                        var msg = notification[0];
                        var level = notification[1];
                        var id = notification[2];

                        parent.Xrm.Page.ui.clearFormNotification(id);
                        parent.Xrm.Page.ui.setFormNotification(msg, level, id);

                    }
                }
                else {
                    parent.Xrm.Page.ui.clearFormNotification('msgbutton');
                    parent.Xrm.Page.ui.setFormNotification(result, 'INFO', 'msgbutton');
                }
         }
		else {
        	N52QuickRibbon.ProcessResult(n52Result);
        }

	
	window['n52ExecutionContext'] = null;
  	window['n52AllowSaveEvent'] = null;
	
};

N52QuickRibbon.ProcessResult= function(n52Result)
{
   var formulatype = n52Result.FormulaType;
   var propertyname = n52Result.PropertyName;
   var propertyvalueaction = n52Result.PropertyValueAction; 
};


N52QuickRibbon.BuildExecutionObject= function(guid, entitytype, lcid)
{
	var executionContext= N52.Clientside.BuildExecutionObject('n52clientside', guid, -1, lcid,entitytype);
	return executionContext;
};

