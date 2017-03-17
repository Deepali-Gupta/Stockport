$(document).ready(function () {
    var table_sensex = $('#table_sensex').DataTable();
    showSensexDetails();
    loadTableAndChart();
    function loadTableAndChart() {
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
                chart.options.data[0].dataPoints.push({ y: parseInt( json[i].close) });
            }
            chart.options.data[0].dataPoints.reverse();
            table_sensex.draw();
            chart.render();
        });
    }
    function showSensexDetails() {
        var url = "/api/getsensexprice";
        $.getJSON(url, function (json) {
            // console.log(json); 
            json = json.data;
            console.log(json);
            $('#sensex_index').text(json.close);
            $('#sensex_diff').text("Change = " + json.diff);
            $('#sensex_perc').text("Percentage Change = " + json.perc+" %");
        });
    }
    var chart = new CanvasJS.Chart("chartContainer",
        {
            title: {
                text: "Sensex Value over last 3 months"
            },
            theme: "theme2",
            animationEnabled: true,
            axisX: {
                valueFormatString: ""
            },
            axisY: {
                valueFormatString: "#0",
                includeZero: false
            },
            data: [
                {
                    type: "line",
                    showInLegend: true,
                    legendText: "Index Value",
                    dataPoints: []
                }
            ]
        });

});