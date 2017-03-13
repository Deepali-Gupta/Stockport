$(document).ready(function () {
    var table = $('#table_id').DataTable();
    loadStocks();
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
                table.row.add([
                    json[i].stockname,
                    json[i].industry
                ]);
            }
            table.draw();
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