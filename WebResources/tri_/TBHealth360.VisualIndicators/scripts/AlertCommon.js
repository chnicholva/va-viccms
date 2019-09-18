function setHref(link, clientUrl, entityName, id) {
    link.href = clientUrl + "/main.aspx?etn=" + entityName + "&id=%7b" + id + "%7d&pagetype=entityrecord";
    link.target = "_blank";
}

function showImage(thisImage, imageWidth, imageHeight, title) {
    showImage(thisImage, imageWidth, imageHeight, title, 0, 0);
}

function showImage(thisImage, imageWidth, imageHeight, title, leftMargin, rightMargin) {
    var newStyle = 'visibility:visible;  border:none; margin-left:' + leftMargin + 'px;  margin-right:' + rightMargin + 'px;';
    thisImage.setAttribute('style', newStyle);
    thisImage.setAttribute('width', imageWidth);
    thisImage.setAttribute('height', imageHeight);
    thisImage.setAttribute('title', title);
}

function showImage2(thisImage, title) {
    thisImage.setAttribute('style', 'visibility:visible;  border:none;');
    thisImage.setAttribute('title', title);
}

function hideImage(thisImage) {
    thisImage.setAttribute('width', 0);
    thisImage.setAttribute('height', 0);
    thisImage.setAttribute('style', 'visibility:hidden; border:none; margin-left:0; margin-right:0;');
}


function errorHandler(xmlHttpRequest, textStatus, errorThrow) {
    Xrm.Utility.alertDialog("Error : " + textStatus + ": " + xmlHttpRequest.statusText);
}

function addImagetoHTMLControl(formFactor, sourceName, imageWidth, imageHeight, spanText, onClick) {
    if (formFactor === 2) {
        return addImagetoHTMLTablet(sourceName, imageWidth, imageHeight, spanText, onClick);
    } else {
        return addImagetoHTMLWeb(sourceName, imageWidth, imageHeight, spanText, onClick);
    }
}

function addImagetoHTMLTablet(sourceName, imageWidth, imageHeight, spanText, onClick) {
    var newHTML = "<tr><td>";
    if (typeof onClick === "undefined" || onClick == null) {
        newHTML += "<img src='" + sourceName + "' style='visibility:visible; margin-bottom: 25px; margin-top: 5px; width=" + imageWidth + "; heigth=" + imageHeight + ";'>";
    } else {
        newHTML += "<img onclick='" + onClick + "' src='" + sourceName + "' style='visibility:visible; cursor: pointer; margin-bottom: 25px; margin-top: 5px; width=" + imageWidth + "; heigth=" + imageHeight + ";'>";
    }
    newHTML += "<span style='line-height:" + imageHeight + "px;'>&nbsp;" + spanText + "</span></td></tr>";
    return newHTML;
}

function addImagetoHTMLWeb(sourceName, imageWidth, imageHeight, spanText, onClick) {
    if (typeof onClick === "undefined" || onClick == null) {
        var newHTML = "<img src='" + sourceName + "' style='visibility:visible; margin-bottom: 0px; margin-top: 0px; width=" + imageWidth + "; heigth=" + imageHeight + ";' title='" + spanText + "'>";
    } else {
        newHTML = "<img onclick='" + onClick + "' src='" + sourceName + "' onmouseover='' style='visibility:visible; cursor: pointer; margin-bottom: 0px; margin-top: 0px; width=" + imageWidth + "; heigth=" + imageHeight + ";' title='" + spanText + "'>";
    }
    return newHTML;
}

function addAnchorImagetoHTMLControl(formFactor, sourceName, imageWidth, imageHeight, spanText, clientUrl, entityName, id) {
    if (formFactor === 2) {
        return addImagetoHTMLTablet(sourceName, imageWidth, imageHeight, spanText);
    } else {
        href = clientUrl + "/main.aspx?etn=" + entityName + "&id=%7b" + id + "%7d&pagetype=entityrecord";
        var newHtml = "<a id='" + sourceName + "a' target='_blank' href='" + href + "'>";
        newHtml += addImagetoHTMLWeb(sourceName, imageWidth, imageHeight, spanText);
        newHtml += "</a>";
        return newHtml;
    }
}