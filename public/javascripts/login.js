$(document).ready(function () {
    $("form").submit(function (event) {
        console.log("here-dfkjsd");
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var form = $(this),
            n = form.find("input[name= 'userName']").val(),
            p = form.find("input[name = 'password']").val(),
            url = "/login";
        var posting = $.post("/login", { username: n, password: p });
        posting.done(function (data) {
        // console.log(data);
        });
    });
});