//request_USD.js
//Tool to Test if running under USD

function USDTest() {
try {
    if(location.href.indexOf("Outlook15White") != -1) {
      //USD Session
        alert("USD Session Detected!");
      }
      else { alert("Non-USD Session Detected!"); }
    }
  catch (err) {
    alert("USD Test Error: " + err);
  }
}
