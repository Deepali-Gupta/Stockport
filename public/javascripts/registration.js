$(document).ready(function () {
    $("form").submit(function (event) {
        console.log("registration button clicked");
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var form = $(this),
            n = form.find("input[name= 'username']").val(),
            p = form.find("input[name = 'password']").val(),
            e = form.find("input[name = 'email']").val(),
            url = "/register";
        var posting = $.post(url, { username: n, password: p, role: "member", email: e });
        posting.done(function (data) {
            console.log(data);
            alert(data.message);
            location.reload(true);

        });
    });
});