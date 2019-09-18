    /**
    * XrmSvcToolkit v0.2, a small JavaScript library that helps access 
    * Microsoft Dynamics CRM 2011 web service interfaces (SOAP and REST)
    *
    * @copyright    Copyright (c) 2011 - 2013, KingswaySoft (http://www.kingswaysoft.com)
    * @license      Microsoft Public License (Ms-PL)
    * @developer    Daniel Cai (http://danielcai.blogspot.com)
    * @contributors George Doubinski, Mitch Milam, Carsten Groth
    *
    * THIS SOFTWARE IS PROVIDED BY KingswaySoft ''AS IS'' AND ANY
    * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    * DISCLAIMED. IN NO EVENT SHALL KingswaySoft BE LIABLE FOR ANY
    * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    *
    */
	var XrmSvcToolkit=function(a,b){var c="/XRMServices/2011/OrganizationData.svc",d="/XRMServices/2011/Organization.svc/web",e=Object.prototype.toString,f=function(a){return"[object Function]"===e.call(a)},g=function(a){return!isNaN(parseInt(a))},h=function(a){return"[object String]"===e.call(a)},i=function(a){return"[object Array]"===e.call(a)},j=function(a){return!(!h(a)||0===a.length)&&/[^\s]+/.test(a)},k=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.?(\d*)?(Z|[+-]\d{2}?(:\d{2})?)?$/,l=/^\/Date\(([-+]?\d+)\)\/$/,m=function(){if(f(a.GetGlobalContext))return GetGlobalContext();if(Xrm!=b)return Xrm.Page.context;throw new Error("CRM context is not available.")}(),n=function(){if(m.getClientUrl!==b)return m.getClientUrl();var c=a.location.protocol+"//"+a.location.host;if(m.isOutlookClient()&&!m.isOutlookOnline())return c;var d=m.getServerUrl();return d=d.replace(/^(http|https):\/\/([_a-zA-Z0-9\-\.]+)(:([0-9]{1,5}))?/,c),d=d.replace(/\/$/,"")}(),o=function(a){var b;try{b=JSON.parse(a.responseText).error.message.value}catch(c){b=a.responseText}return b=b.length>0?"Error: "+a.status+": "+a.statusText+": "+b:"Error: "+a.status+": "+a.statusText,new Error(b)},p=function(a){var b=a.responseText.length>0?"Error: "+a.status+": "+a.statusText+": "+a.responseText:"Error: "+a.status+": "+a.statusText;return new Error(b)},q=function(a,b){if("string"==typeof b&&b.match(l)){var c=b.replace(l,"$1");return new Date(parseInt(c,10))}return b},r=function(a){if(null==a)return null;if(""==a)return"";for(var b,c="",d=0;d<a.length;d++)b=a.charCodeAt(d),b>96&&b<123||b>64&&b<91||b>47&&b<58||32==b||44==b||46==b||45==b||95==b?c+=String.fromCharCode(b):c=c+"&#"+b+";";return c},s=function(a){if(null==a||!a.match(k))return null;var b=k.exec(a);return new Date(Date.UTC(parseInt(b[1],10),parseInt(b[2],10)-1,parseInt(b[3],10),parseInt(b[4],10)-(""==b[8]||"Z"==b[8]?0:parseInt(b[8])),parseInt(b[5],10),parseInt(b[6],10)))},t=function(a,b){for(var c=0;c<a.attributes.length;c++){var d=a.attributes[c];if(d.name==b)return d.value}},u=function(a){return a.text!==b?a.text:a.textContent},v=function(a,b){switch(a){case"c:string":case"c:guid":return u(b);case"c:boolean":return"true"===u(b);case"c:int":return parseInt(u(b));case"c:decimal":case"c:double":return parseFloat(u(b));case"c:dateTime":return s(u(b));case"a:OptionSetValue":return b=z(b,"a:Value"),{Value:parseInt(u(b))};case"a:Money":return b=z(b,"a:Value"),{Value:u(b)};case"a:EntityReference":return y(b);case"a:EntityCollection":return x(b);case"a:AliasedValue":return b=z(b,"a:Value"),a=t(b,"i:type"),v(a,b);default:throw new Error('Unhandled field type: "'+a+'", please report the problem to the developer. ')}},w=function(a,c){if(i(a)&&a.length>0)return a.join(",");if(h(a))return a;if(c!=b)throw new Error(c+" parameter must be either a delimited string or an array. ");return""},x=function(a){for(var b,c,d,e,f,g=0;g<a.childNodes.length;g++){var h=a.childNodes[g];switch(h.nodeName){case"a:EntityName":b=u(h);break;case"a:MoreRecords":c="true"===u(h);break;case"a:PagingCookie":d=u(h);break;case"a:TotalRecordCount":e=parseInt(u(h));break;case"a:Entities":f=h}}for(var i={entityName:b,moreRecords:c,pagingCookie:d,totalRecordCount:e,entities:[]},j=0;j<f.childNodes.length;j++){for(var k={formattedValues:[]},l=f.childNodes[j],m=z(l,"a:Attributes"),n=0;n<m.childNodes.length;n++){var o=m.childNodes[n],p=u(z(o,"b:key")),q=z(o,"b:value"),r=t(q,"i:type");k[p]=v(r,q)}for(var s=z(l,"a:FormattedValues"),w=0;w<s.childNodes.length;w++){var x=s.childNodes[w];k.formattedValues[u(z(x,"b:key"))]=u(z(x,"b:value"))}i.entities.push(k)}return i},y=function(a){for(var b,c,d,e=0;e<a.childNodes.length;e++){var f=a.childNodes[e];switch(f.nodeName){case"a:Id":b=u(f);break;case"a:LogicalName":c=u(f);break;case"a:Name":d=u(f)}}return{Id:b,LogicalName:c,Name:d}},z=function(a,b){for(var c=0;c<a.childNodes.length;c++){var d=a.childNodes[c];if(d.nodeName==b)return d}},A=function(a){try{var b=a.firstChild.firstChild,c=z(b,"s:Fault"),d=z(c,"faultstring");return new Error(u(d))}catch(a){return new Error("An error occurred when parsing the error returned from CRM server: "+a.message)}},B=function(a,b,c){try{var d=a.firstChild.firstChild.firstChild.firstChild}catch(a){return void c(a)}return b(d)},C=function(a){var b=z(a,"a:Results"),c=z(b.firstChild,"b:value");return x(c)},D=function(a,b,c){if(a.status>=200&&a.status<300||304===a.status||1223===a.status){try{var d=a.responseText?JSON.parse(a.responseText,q).d:null}catch(a){return void c(a)}return b(d)}c(o(a))},E=function(a,b,c){var d=new XMLHttpRequest;d.open(a.type,a.url,a.async),d.setRequestHeader("Accept","application/json"),d.setRequestHeader("Content-Type","application/json; charset=utf-8"),a.method&&d.setRequestHeader("X-HTTP-Method",a.method);if(a.async)d.onreadystatechange=function(){4==d.readyState&&D(d,b,c)},a.data?d.send(a.data):d.send();else try{return a.data?d.send(a.data):d.send(),D(d,b,c)}catch(a){c(a)}},F=function(a,b,c,e){var f=new XMLHttpRequest;f.open("POST",n+d,b),f.setRequestHeader("Accept","application/xml, text/xml, */*"),f.setRequestHeader("Content-Type","text/xml; charset=utf-8"),f.setRequestHeader("SOAPAction","http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");var g=['<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body>',a,"</s:Body></s:Envelope>"].join("");if(b)f.onreadystatechange=function(){4==f.readyState&&(200==f.status?B(f.responseXML,c,e):e(p(f)))},f.send(g);else{var h;try{if(f.send(g),200==f.status)return B(f.responseXML,c,e);var i=A(f.responseXML);return void e(i)}catch(a){return void e(a)}c(h)}},G=function(a){if(!j(a.executeXml))throw new Error("executeXml parameter was not provided. ");var b=!!a.async;return F(a.executeXml,b,function(c){if(f(a.successCallback)&&a.successCallback(c),!b)return c},function(b){if(!f(a.errorCallback))throw b;a.errorCallback(b)})},H=function(a){if(!j(a.id))throw new Error("id parameter was not provided. ");if(!j(a.entityName))throw new Error("entityName parameter was not provided. ");if(!g(a.stateCode))throw new Error("stateCode parameter must be an integer. ");null==a.statusCode&&(a.statusCode=-1);var b=['<Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services">','<request i:type="b:SetStateRequest"',' xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts" ',' xmlns:b="http://schemas.microsoft.com/crm/2011/Contracts" ',' xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic" ',' xmlns:i="http://www.w3.org/2001/XMLSchema-instance">',"<a:Parameters>","<a:KeyValuePairOfstringanyType>","<c:key>EntityMoniker</c:key>",'<c:value i:type="a:EntityReference">',"<a:Id>",a.id,"</a:Id>","<a:LogicalName>",a.entityName,"</a:LogicalName>",'<a:Name i:nil="true" />',"</c:value>","</a:KeyValuePairOfstringanyType>","<a:KeyValuePairOfstringanyType>","<c:key>State</c:key>",'<c:value i:type="a:OptionSetValue">',"<a:Value>",a.stateCode,"</a:Value>","</c:value>","</a:KeyValuePairOfstringanyType>","<a:KeyValuePairOfstringanyType>","<c:key>Status</c:key>",'<c:value i:type="a:OptionSetValue">',"<a:Value>",a.statusCode,"</a:Value>","</c:value>","</a:KeyValuePairOfstringanyType>","</a:Parameters>",'<a:RequestId i:nil="true"/>',"<a:RequestName>SetState</a:RequestName>","</request>","</Execute>"].join(""),c=!!a.async;return F(b,c,function(b){if(f(a.successCallback)&&a.successCallback(b),!c)return b},function(b){if(!f(a.errorCallback))throw b;a.errorCallback(b)})},I=function(a){if(!j(a.fetchXml))throw new Error("fetchXml parameter was not provided. ");var b=['<Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services">','<request i:type="a:RetrieveMultipleRequest"',' xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts" ',' xmlns:i="http://www.w3.org/2001/XMLSchema-instance">','<a:Parameters xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic">',"<a:KeyValuePairOfstringanyType>","<c:key>Query</c:key>",'<c:value i:type="a:FetchExpression">',"<a:Query>",r(a.fetchXml),"</a:Query>","</c:value>","</a:KeyValuePairOfstringanyType>","</a:Parameters>",'<a:RequestId i:nil="true"/>',"<a:RequestName>RetrieveMultiple</a:RequestName>","</request>","</Execute>"].join(""),c=!!a.async;return F(b,c,function(b){var d=C(b);if(f(a.successCallback)&&a.successCallback(d),!c)return d},function(b){if(!f(a.errorCallback))throw b;a.errorCallback(b)})},J=function(a){if(!j(a.entityName))throw new Error("entityName parameter was not provided. ");if(!j(a.id))throw new Error("id parameter was not provided. ");var b=null==a.select?"":w(a.select,"select"),d=null==a.expand?"":w(a.expand,"expand"),e="";(b.length>0||d.length>0)&&(e="?",b.length>0&&(e+="$select="+b,d.length>0&&(e+="&")),d.length>0&&(e+="$expand="+d));var g={url:n+c+"/"+a.entityName+"Set(guid'"+a.id+"')"+e,type:"GET",async:!!a.async};return E(g,function(b){if(f(a.successCallback)&&a.successCallback(b),!a.async)return b},function(b){if(!f(a.errorCallback))throw b;a.errorCallback(b)})},K=function(a){if(!j(a.entityName))throw new Error("entityName parameter was not provided. ");var b="";if(null!=a.odataQuery){if(!h(a.odataQuery))throw new Error("odataQuery parameter must be a string. ");b="?"!=a.odataQuery.charAt(0)?"?"+a.odataQuery:a.odataQuery}var d={url:n+c+"/"+a.entityName+"Set"+b,type:"GET",async:!!a.async};return E(d,function(b){return f(a.successCallback)&&a.successCallback(b.results),a.async?void(null!=b.__next?(a.odataQuery=b.__next.substring((n+c+"/"+a.entityName+"Set").length),K(a)):f(a.completionCallback)&&a.completionCallback()):b.results},function(b){if(!f(a.errorCallback))throw b;a.errorCallback(b)})},L=function(d){if(!j(d.entityName))throw new Error("entityName parameter was not provided. ");if(null===d.entity||d.entity===b)throw new Error("entity parameter was not provided. ");var e={url:n+c+"/"+d.entityName+"Set",type:"POST",data:a.JSON.stringify(d.entity),async:!!d.async};return E(e,function(a){if(f(d.successCallback)&&d.successCallback(a),!d.async)return a},function(a){if(!f(d.errorCallback))throw a;d.errorCallback(a)})},M=function(d){if(!j(d.entityName))throw new Error("entityName parameter was not provided. ");if(!j(d.id))throw new Error("id parameter was not provided. ");if(null===d.entity||d.entity===b)throw new Error("entity parameter was not provided. ");var e={url:n+c+"/"+d.entityName+"Set(guid'"+d.id+"')",type:"POST",method:"MERGE",data:a.JSON.stringify(d.entity),async:!!d.async};return E(e,function(a){if(f(d.successCallback)&&d.successCallback(a),!d.async)return a},function(a){if(!f(d.errorCallback))throw a;d.errorCallback(a)})},N=function(a){if(!j(a.entityName))throw new Error("entityName parameter was not provided. ");if(!j(a.id))throw new Error("id parameter was not provided. ");var b={url:n+c+"/"+a.entityName+"Set(guid'"+a.id+"')",type:"POST",method:"DELETE",async:!!a.async};return E(b,function(b){if(f(a.successCallback)&&a.successCallback(b),!a.async)return b},function(b){if(!f(a.errorCallback))throw b;a.errorCallback(b)})},O=function(b){if(!j(b.entity1Id))throw new Error("entity1Id parameter was not provided. ");if(!j(b.entity1Name))throw new Error("entity1Name parameter was not provided. ");if(!j(b.entity2Id))throw new Error("entity2Id parameter was not provided. ");if(!j(b.entity2Name))throw new Error("entity2Name parameter was not provided. ");if(!j(b.relationshipName))throw new Error("relationshipName parameter was not provided. ");var d={uri:n+c+"/"+b.entity2Name+"Set(guid'"+b.entity2Id+"')"},e={url:n+c+"/"+b.entity1Name+"Set(guid'"+b.entity1Id+"')/$links/"+b.relationshipName,type:"POST",data:a.JSON.stringify(d),async:!!b.async};return E(e,function(a){if(f(b.successCallback)&&b.successCallback(a),!b.async)return a},function(a){if(!f(b.errorCallback))throw a;b.errorCallback(a)})},P=function(a){if(!j(a.entity1Id))throw new Error("entity1Id parameter was not provided. ");if(!j(a.entity1Name))throw new Error("entity1Name parameter was not provided. ");if(!j(a.entity2Id))throw new Error("entity2Id parameter was not provided. ");if(!j(a.relationshipName))throw new Error("relationshipName parameter was not provided. ");var b={url:n+c+"/"+a.entity1Name+"Set(guid'"+a.entity1Id+"')/$links/"+a.relationshipName+"(guid'"+a.entity2Id+"')",type:"POST",method:"DELETE",async:!!a.async};return E(b,function(b){if(f(a.successCallback)&&a.successCallback(b),!a.async)return b},function(b){if(!f(a.errorCallback))throw b;a.errorCallback(b)})};return{context:m,serverUrl:n,retrieve:J,retrieveMultiple:K,createRecord:L,updateRecord:M,deleteRecord:N,associate:O,disassociate:P,setState:H,execute:G,fetch:I}}(window);