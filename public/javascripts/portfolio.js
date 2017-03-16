$(document).ready(function () {

    var portfolio_stock_div = $('#portfolio_stock_div');
    portfolio_stock_div.hide();

    var table_portfolio_stock_detail =  $('#table_portfolio_stock_detail').DataTable();
    var table_portfolio_stocks = $('#table_portfolio_stocks').DataTable();
    loadNetValue();
    loadPortfolioStocks();
    function loadNetValue() {
        var url = "/portfolio/getnetvalue";
        $.getJSON(url, function (json) {
            // console.log(json);

            json = json.data;
            $('#portfolio_value').text(json.net_value);
            $('#portfolio_profit').text("Net profit : " + json.profit);
        });
    }
    function loadPortfolioStocks() {
        var url = "/portfolio/getportstocks";
        $.getJSON(url, function (json) {
            // console.log(json);
            json = json.data;
            for (var i = 0; i < json.length; i++) {
                // tr = $('<tr/>');
                // tr.append("<td>" + json[i].stockname + "</td>");
                // tr.append("<td>" + json[i].industry + "</td>");
                // $('#table_id').append(tr);
                table_portfolio_stocks.row.add([
                    json[i].stockname,
                    json[i].close,
                    json[i].diff,
                    json[i].perc,
                    json[i].qty,
                    json[i].profit
                ]);
            }
            table_portfolio_stocks.draw();
        });
    }

    table_portfolio_stocks.on('click', 'tr', function () {
        //populate table_stock_details
        var data = table_portfolio_stocks.row(this).data();
        var stock = data[0];
        // console.log(stock);
        $('#stock_name').text(stock);
        var url1 = "/portfolio/gettranshist";
        // var url2 = "/api/stockhist/" + stock;
        // Send the data using post
        var posting = $.post(url1, { stockname: stock });

        // Put the results in a div
        posting.done(function (json) {
            console.log(json);
            json = json.data;
            table_portfolio_stock_detail.clear();
            for (var i = 0; i < json.length; i++) {
                table_portfolio_stock_detail.row.add([
                    json[i].trans_date,
                    json[i].close,
                    json[i].trans_qty                   
                ]);
            }
            table_portfolio_stock_detail.draw();
        });
        portfolio_stock_div.show();
        $('html, body').animate({
            scrollTop: portfolio_stock_div.offset().top
        }, 1000);
    });
});

    // $("form").submit(function (event) {
        //     console.log("registration button clicked");
        //     // Stop form from submitting normally
        //     event.preventDefault();
        //     // Get some values from elements on the page:
        //     var form = $(this),
        //         n = form.find("input[name= 'username']").val(),
        //         p = form.find("input[name = 'password']").val(),
        //         e = form.find("input[name = 'email']").val(),
        //         url = "/register";
        //     var posting = $.post(url, { username: n, password: p, role: "member", email: e });
        //     posting.done(function (data) {
        //         console.log(data);
        //         // TODO
        //     });
        // });