﻿using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk.Query;
using System.Activities;
using VEIS.Plugins.Models;
using Microsoft.Xrm.Sdk.Workflow;
using VEIS.Plugins.Messages;
using PersonSearch.Plugin.Helpers;
using VEIS.Plugin.Helpers;

namespace PersonSearch.Plugin
{
    public partial class APIMGetToken : BaseAction
    {
        protected override void Execute(CodeActivityContext context)
        {
            try
            {
                using (var localContext = new ActionContext(context))
                {
                    //  retriev veis config
                    VeisConfig config = localContext.RetrieveVeisConfig("ftp_mviserviceurl", "ftp_mvisubscriptionkey");
                    //  get token
                    WebApiUtility.
                    //this.Response = 
                }
            }
            catch(Exception ex)
            {

            }
        }

    }
}
