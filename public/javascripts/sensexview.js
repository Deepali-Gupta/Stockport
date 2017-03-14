$(document).ready(function () {
    var table_sensex = $('#table_sensex').DataTable();

    loadTable();
    showSensexDetails();

    function loadTable() {
        var url = "/api/getsensexhist";
        $.getJSON(url, function (json) {

            json = json.data;
            for (var i = 0; i < json.length; i++) {
                table_sensex.row.add([
                    json[i].day,
                    json[i].open,
                    json[i].high,
                    json[i].low,
                    json[i].close,
                    json[i].volume,
                    json[i].adj_close
                ]);
            }
            table_sensex.draw();
        });
    }
    function showSensexDetails() {
        var url = "/api/getsensexprice";
        $.getJSON(url, function (json) {
            // console.log(json); 
            json = json.data;
            console.log(json);
            $('#sensex_index').text(json.close);
            $('#sensex_diff').text("diff = " + json.diff);
            $('#sensex_perc').text("perc = " + json.perc);
        });
    }

});