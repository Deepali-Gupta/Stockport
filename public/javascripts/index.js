$(document).ready(function () {
    var table_stocks = $('#table_stocks').DataTable();
    var table_gainers = $('#table_gainers').DataTable();
    var table_losers = $('#table_losers').DataTable();
    loadStocks();
    loadTopGainers();
    loadTopLosers();
    // table_stocks.column(0).visible(false);
    table_stocks.on('click', 'tr', function () {
        var data = table.row(this).data();
        var stock = data[0];
        console.log(stock);

        // alert('Clicked row id ' + id);
    });



    function loadStocks() {
        var url = "/api/stocks";
        $.getJSON(url, function (json) {
            // console.log(json);
            var tr;
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                // tr = $('<tr/>');
                // tr.append("<td>" + json[i].stockname + "</td>");
                // tr.append("<td>" + json[i].industry + "</td>");
                // $('#table_id').append(tr);
                table_stocks.row.add([
                    json[i].stockname,
                    json[i].industry,
                    json[i].curr_price,
                    json[i].diff,
                    json[i].perc
                ]);
            }
            table_stocks.draw();
        });
    }
    function loadTopGainers() {
        var url = "/api/topstocks";
        $.getJSON(url, function (json) {
            // console.log(json);
            var tr;
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                // tr = $('<tr/>');
                // tr.append("<td>" + json[i].stockname + "</td>");
                // tr.append("<td>" + json[i].industry + "</td>");
                // $('#table_id').append(tr);
                table_gainers.row.add([
                    json[i].stockname,
                    json[i].curr_price,
                    json[i].diff,
                    json[i].perc
                ]);
            }
            table_gainers.draw();
        });
    }
    function loadTopLosers() {
        var url = "/api/lowstocks";
        $.getJSON(url, function (json) {
            // console.log(json);
            var tr;
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                // tr = $('<tr/>');
                // tr.append("<td>" + json[i].stockname + "</td>");
                // tr.append("<td>" + json[i].industry + "</td>");
                // $('#table_id').append(tr);
                table_losers.row.add([
                    json[i].stockname,
                    json[i].curr_price,
                    json[i].diff,
                    json[i].perc
                ]);
            }
            table_losers.draw();
        });
    }
    $("#form1").submit(function (event) {

        // Stop form from submitting normally
        event.preventDefault();

        // Get some values from elements on the page:
        var form = $(this),
            n = form.find("input[name='name']").val(),
            b = form.find("input[name = 'breed']").val(),
            a = form.find("input[name = 'age']").val(),
            s = form.find("input[name = 'sex']").val(),
            url = form.attr("action");

        // Send the data using post
        var posting = $.post(url, { name: n, breed: b, age: a, sex: s });

        // Put the results in a div
        posting.done(function (data) {
            console.log(data);
        });
    });
    // $('button').click(function () {
    //     console.log("pressed");
    //     // $.getJSON("/api/puppies", function (json) {
    //     //     console.log(json);
    //     // });
    //     // var url = "/api/puppies";
    //     // $.getJSON(url, function (json) {
    //     //     console.log(json);
    //     //     var tr;
    //     //     json = json.data;
    //     //     for (var i = 0; i < json.length; i++) {
    //     //         tr = $('<tr/>');
    //     //         tr.append("<td>" + json[i].name + "</td>");
    //     //         tr.append("<td>" + json[i].sex+ "</td>");
    //     //         $('table').append(tr);
    //     //     }
    //     // });
    //     // table.draw();
    //     $.post("api/puppies/", { name: "John", breed: "dd", age: "2", sex: "M" })
    //         .done(function (data) {
    //             console.log(data);
    //         });

});