$(document).ready(function () {
    $("form").submit(function (event) {
        // console.log("here");
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var form = $(this),
            n = form.find("input[name= 'userName']").val(),
            p = form.find("input[name = 'password']").val(),
            url = "/login";
        // Send the data using post
        var posting = $.post(url, { userName: n, password: p });
        posting.done(function (data) {
            console.log(data);
        });
    });
});