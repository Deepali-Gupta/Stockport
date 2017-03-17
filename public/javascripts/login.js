$(document).ready(function () {
    $("form").submit(function (event) {
        console.log("login button pressed");
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var form = $(this),
            n = form.find("input[name= 'username']").val(),
            p = form.find("input[name = 'password']").val(),
            url = "/login";
        var posting = $.post("/login", { username: n, password: p });
        posting.done(function (data) {
            console.log(data);
            if (data.authenticated) {
                alert ("Login Successful!");
                window.location = "/home";
            }
            else {
                // tempAlert("Login failed",5000);
                 alert ("Login Failed!");
                window.location = "/login";
            }

        });
    });
});