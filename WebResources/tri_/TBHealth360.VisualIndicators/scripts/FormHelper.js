function refreshIndicators(webresourcename){
  var webResourceControl = Xrm.Page.ui.controls.get(webresourcename);
  var websrc = webResourceControl.getSrc();
  //websrc = websrc + "%26reload%3dyes";
  webResourceControl.setSrc(websrc);
}