/* Copyright 2013 Intelligent Technology Inc.
 *
 * Released under the MIT license
 * See http://opensource.org/licenses/mit-license.php for full text.
 */

$(function() {

    var listData = {};  // リストのデータ

    // サーバから取得したデータをテーブルに表示
    var makeTable = function(data) {
        listData = convertToHash(data);
        $("#tableItems").empty();

        for(var i=0; i<data.length; i++) {
            // コメントをオブジェクトから文字列に変換
            var commentList = commentToString(data[i].comments);
            // 評価がnullの時は0を表示
            var rate = data[i].rate || 0;

            $("#tableItems").append("<tr></tr>")
                           .find("tr:last")
                           .append("<td><input type='radio' name='choose' value='" + $.escapeHTML(data[i]._id) + "'>")
                           .append("<td><a href='" + $.escapeHTML(data[i].url) + "'>" + $.escapeHTML(data[i].sitename) + "</a></td>")
                           .append("<td>" + $.escapeHTML(data[i].desc) + "</td>")
                           .append("<td>" + $.escapeHTML(data[i].name) + "</td>")
                           .append("<td>" + commentList + "</td>")
                           .append("<td>" + rate + "</td>")
        }
        // 要素を空にする
        emptyElementValue();

    };


    // 選択した列データでソートする(昇順)
    $("input[data-sortOrder='ascendingOrder']").click(function() {
        var sortParameter = {sortItem : $(this).attr("data-sortKey"), sortValue : 1};
        $.getJSON('references/sort', sortParameter, makeTable);
    });

    // 選択した列データでソートする(降順)
    $("input[data-sortOrder='descendingOrder']").click(function() {
        var sortParameter = {sortItem : $(this).attr("data-sortKey"), sortValue : -1}
        $.getJSON('references/sort', sortParameter, makeTable);
    });

    var convertToHash = function(data) {
        var object = {};
        for(var i = 0; i < data.length; i++) {
            object[data[i]._id] = data[i];
        }
        return object;
    };


    // コメントオブジェクトを文字列形式に変換
    var commentToString = function(data) {
        var commentList = '';
        for (var j=0; j<data.length; j++) {
            commentList += $.escapeHTML(data[j].commentName + "　：　" + data[j].commentContents) + "<br/>";
        }
        return commentList;
    };

    // 入力テキストを空にする
    var emptyElementValue = function() {
        $("#sitename").val('');
        $("#url").val('');
        $("#desc").val('');
        $("#name").val('');
        $("#commentName").val('');
        $("#commentContents").val('');
        $("#rate").val('');
    };

    //登録者の評価を表示
    var averageRate = function(data) {
        if(!data[0]) {
            $("#averageRate").text(0);
        } else {
            $("#averageRate").text(data[0].average.toFixed(1));
        }
    };

    // リストの取得
    $.getJSON('references', makeTable);

    // 新規ボタン押下時
    $("#save").click(function(){
        var param = {
                  "sitename" : $("#sitename").val() || "",
                  "url"      : $("#url").val() || "",
                  "desc"     : $("#desc").val() || "",
                  "name"     : $("#name").val() || "",
                  "rate"     : $("#rate").val() || 0,
                    };
        $.postJSON('references', param, makeTable);
    });

    // 更新ボタン押下時
    $("#update").click(function() {
        var checkedItem = $("[name = 'choose']:checked");

        if (checkedItem.length == 0) {
            return alert('選択されていません');
        }
        if ($("#rate").val() < 1 || $("#rate").val() > 5) {
            return alert('1～5までの数値を入力してください');
        }
        var param = {
                    "sitename" : $("#sitename").val() || "",
                    "url"      : $("#url").val() || "",
                    "desc"     : $("#desc").val() || "",
                    "name"     : $("#name").val() || "",
                    "rate"     : $("#rate").val() || 0,
                    "_id"      : checkedItem.val() || ""
                    };
        $.putJSON('references', param, makeTable);
    });

      // 削除ボタン押下時
    $("#remove").click(function() {
        var checkedItem = $("[name = 'choose']:checked");
        if(checkedItem.length == 0){
            return alert('選択されていません');
        }
        var param = { "_id" : checkedItem.val()};
        $.deleteJSON('references', param, makeTable);
    });

    // コメント追加ボタン押下時
    $("#addComment").click(function() {
        var checkedItem = $("[name = 'choose']:checked");

        if (checkedItem.length == 0) {
            return alert('選択されていません');
        }
        var param = {
                    "comments" : {"commentName":$("#commentName").val(), "commentContents":$("#commentContents").val()},
                    "_id"      : checkedItem.val()
                    };
        $.postJSON('references/' + param._id + '/comments', param, makeTable);
    });

    // 検索ボタン押下時
    $("#search").click(function() {
        var param = {"name" : $("#searchName").val()};
        // 登録者で検索
        $.getJSON('references', param, makeTable);

    });

    // ラジオボタンで選択した行データを、テキスト入力エリアに反映させる
    $(document).on("click", "input:radio[name = 'choose']", function() {
        var chose = listData[$("[name = 'choose']:checked").val()];
        for(var property in chose) {
            $("#" + property).val(chose[property]);
        }
    });
});