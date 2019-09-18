function Form_onload()
{
function ScriptLoader(func)
{ 
   var loader = this;
  
   /* if ScriptLoading > 0 then scripts are still loading */
   loader.ScriptLoading = 0;
   /* the script entity point e.g. OnCrmPageLoad */
   loader.Init = func;
   /*
      url - script url
      noc - include a nocache querystring parameter
   */
   loader.Load = function(url,noc)
   {
      var script = document.createElement("SCRIPT");
      script.src = url + (noc ? "?nocache=" + Math.random() : "");
 
      script.onreadystatechange = function()
      {
            if (!(script.readyState == 'loaded' || script.readyState == 'complete'))
            {
                  return;
            }
   
            /* if loader.ScriptLoading > 0 true else false */
            if (--loader.ScriptLoading)
            {
                  return;  
            }
   
            /* finished loading (loader.ScriptLoading == 0) , call entry point */
            loader.Init(); 
      }
  
      /* append the script to the head tag */
      document.documentElement.childNodes[0].appendChild(script);
      /* indicate that this script is loading */
      loader.ScriptLoading++;
   } 
}


/* Start Script Execution */
function OnCrmPageLoad()
{
var res = CommonFunction();   
workflowsteponload();
}

/* 
      create a Script loader object + function to be called when the script has
      finished loading 
*/
window.ScriptLibrary = new ScriptLoader(OnCrmPageLoad);

/* url , false - cache, true - no cache */
ScriptLibrary.Load('/ISV/UII-ISV/JavaScript/Common.js',true);
ScriptLibrary.Load('/ISV/UII-ISV/JavaScript/Workflow.js',true);
}
function Form_onsave()
{
WorkflowMaponSave();
}
