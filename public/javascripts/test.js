$(document).ready(function () {
    var table = $('table').DataTable();
    $('button').click(function () {

        console.log("pressed");
        // $.getJSON("/api/puppies", function (json) {
        //     console.log(json);
        // });
        var url = "/api/puppies";
        $.getJSON(url, function (json) {
            console.log(json);
            var tr;
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                tr = $('<tr/>');
                tr.append("<td>" + json[i].name + "</td>");
                tr.append("<td>" + json[i].sex+ "</td>");
                $('table').append(tr);
            }
        });
        table.draw();
        

    });

})
