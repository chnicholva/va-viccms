function Colorize() {
    $(document).ready(function () {
        var timer = setInterval(function () {
            // If grids haven't loaded yet we go to the next interval
            if ($(".ms-crm-List-Data tr").length > 0) {
                clearInterval(timer);
                $("#refreshButtonLink").click(Colorize());
                setColors();
            }
        }, 50);
    });
}

function ColorizeForm() {
    var timer = setInterval(function () {
        // If grids haven't loaded yet we go to the next interval
        if ($(".ms-crm-List-Data tr").length > 0) {
            clearInterval(timer);
            setColors();
            var grid = document.getElementById("gridADD");
            if(!!grid && grid.hasOwnProperty("control")){
            	grid.control.add_onRefresh(setColors);
            }
        }
    }, 50);
}

function setColors() {
    // Go through each grid row
    $(".ms-crm-List-Data tr").each(function () {
        // Go through each cell of the row, if we have matching text for priority then set the background appropriately
        $(this).children().each(function () {
            if ($(this).text() == "Low") {
                $(this).parent().css("background-color", "lightgreen");
                return false;
            }
            if ($(this).text() == "Medium") {
                $(this).parent().css("background-color", "yellow");
                return false;
            }
            if ($(this).text() == "High") {
                $(this).parent().css("background-color", "pink");
                return false;
            }
        });
    });
}