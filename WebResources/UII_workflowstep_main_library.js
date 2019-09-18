function Form_onload() {
    document.FilterLookup = function (source, target) {
        if (IsNull(source) || IsNull(target)) { return; }

        var name = IsNull(source.DataValue) ? '' : source.DataValue[0].name;

        target.additionalparams = 'search=' + name;
    }

    function ScriptLoader(func) {
        var loader = this;

        /* if ScriptLoading > 0 then scripts are still loading */
        loader.ScriptLoading = 0;
        /* the script entity point e.g. OnCrmPageLoad */
        loader.Init = func;
        /*
        url - script url
        noc - include a nocache querystring parameter
        */
        loader.Load = function (url, noc) {
            var script = document.createElement("SCRIPT");
            script.src = url + (noc ? "?nocache=" + Math.random() : "");

            script.onreadystatechange = function () {
                if (!(script.readyState == 'loaded' || script.readyState == 'complete')) {
                    return;
                }

                /* if loader.ScriptLoading > 0 true else false */
                if (--loader.ScriptLoading) {
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
}
function Form_onsave() {
    WorkflowStepSave();
}
