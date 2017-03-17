$(document).ready(function () {
    var loggedin = $("#loggedin");
    var reg = $('#signup');
    var signin = $('#login');
    loggedin.hide();
    function setview() {
        $.getJSON("/isloggedin", function (data) {
            console.log(data);
            if (data != false) {
                console.log("thjdslknmsanbdkgjfasl");
                loggedin.text(data);
                loggedin.show();
                reg.hide();
                signin.hide();
            }
            else {
                loggedin.hide();
                reg.show();
                signin.show();
            }
        });
    }
});