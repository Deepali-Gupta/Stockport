$(document).ready(function () {
    // populate the drop down menu
    loadMenu();
    function loadMenu() {

        //get all users
        var url1 = "/api/allusers";
        $.getJSON(url1, function (json) {
            json = json.data;
            // console.log(json);

            var listItems = "";
            for (var i = 0; i < json.length; i++) {
                listItems += "<option >" + json[i].username + "</option>";
            }
            // console.log(listItems);
            $("#delsel").html(listItems);
        });
    }

    $("#form_del").submit(function (event) {
        console.log("delete button clicked");
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var user = $('#delsel  option:selected').text();
        // console.log("+++++++++++++", user);
        var url = "/api/removeuser";
        var posting = $.post(url, { username: user });
        posting.done(function (data) {
            console.log(data);
            alert(data.message);
            location.reload(true);
        });
    });


    $("#form_edit").submit(function (event) {
        console.log("edit button clicked");
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var form = $(this);
        var user = $('#delsel  option:selected').text();
        var r = $('#rolesel  option:selected').text(),
            n = form.find("input[name= 'username']").val(),
            p = form.find("input[name = 'password']").val(),
            e = form.find("input[name = 'email']").val()
        // console.log("+++++++++++++", user);
        var url = "/api/updateuser";
        var posting = $.post(url, {
            username1: user,
            username2: n, password: p, 
            email: e, 
            role: r
        });
        posting.done(function (data) {
            console.log(data.message);
            alert(data.message);
            location.reload(true);
        });
    });

});