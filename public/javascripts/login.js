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
                // tempAlert("Login Success",5000);
                window.location = "/home";
            }
            else {
                // tempAlert("Login failed",5000);
                alert ("Login Failed!");
                window.location = "/login";
            }

        });
    });

    function tempAlert(msg, duration) {
        var el = document.createElement("div");
        el.setAttribute("style", "position:absolute;top:40%;left:20%;background-color:white;");
        el.innerHTML = msg;
        setTimeout(function () {
            el.parentNode.removeChild(el);
        }, duration);
        document.body.appendChild(el);
    }
});