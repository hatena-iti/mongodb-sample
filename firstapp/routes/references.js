/* Copyright 2013 Intelligent Technology Inc.
 *
 * Released under the MIT license
 * See http://opensource.org/licenses/mit-license.php for full text.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Referenceスキーマ定義
var ReferenceSchema = new Schema({
    sitename: String,	// サイト名
    url: String,		// URL
    desc: String,		// 説明
    name: String,		// 登録者
    comments : [],		// コメント：埋込オブジェクト
    rate : Number		// 評価レート
});

// mongoDBサーバ接続
var db=mongoose.createConnection('mongodb://localhost/reference_db');

// Referenceスキーマモデル生成
var References = db.model('References', ReferenceSchema);

// 検索
var find = function(req, res) {
	
	//  検索条件取得（req.query)
	//  {}の場合は全件検索
    var searchItem = req.query || {};

	// 	findの第1引数：検索条件
    References.find(searchItem, function(err, docs) {
		//検索結果をクライアントに送信
        res.send(docs);
    });
};

exports.find = find;

// エラーで無ければ、全件検索を行う
var findAll = function(req, res, err) {
    if(err) {
        console.log(err);
    } else {
		//　全件検索
        find(req, res);
    }
}

// 新規登録
exports.save = function(req, res) {

	// インスタンス生成
    var reference = new References();

	//　登録データをreq.bodyから取得し、インスタンスに設定
    for(var property in req.body) {
        reference[property] = req.body[property] || "";
    }

	//ドキュメント保存
    reference.save(function(err) {
        findAll(req, res, err);
    });
};

// 更新
exports.update = function(req, res) {

	// 更新データをreq.bodyから取得
    var inputData = req.body;

    // ドキュメント更新
	// 第1引数：更新するレコードを選択するためのクエリー
    // 第2引数：対象のオブジェクトを更新するオブジェクト
    References.update({ _id: inputData._id}, {$set: {
                                            sitename : inputData.sitename || "",
                                            url : inputData.url || "",
                                            desc : inputData.desc || "",
                                            name : inputData.name || "",
                                            rate : inputData.rate || 0
                                            }
                                        },
        function(err) {
            findAll(req, res, err);
        }
    );
};

// 削除
exports.remove = function(req, res) {
	// ドキュメント削除
    References.remove({ _id: req.body._id}, function(err) {
        findAll(req, res, err);
    });
};

// コメント追加
exports.comments = function(req, res) {

	// 登録データ
    var inputData = req.body;

	// 第1引数：更新するレコードを選択するためのクエリー
    // 第2引数：対象のオブジェクトを更新するオブジェクト
	//          $pushにより、埋込オブジェクトのcomments配列にinputData.commentsが挿入される
    References.update({ '_id': req.params.id}, 
					  { $push: { comments: inputData.comments} },
					  function(err) {
				          findAll(req, res, err);
    });
};

// ソート
exports.sort = function(req, res) {
	//　ソートパラメータ設定
    var sortParameter = {};
    sortParameter[req.query.sortItem] = parseInt(req.query.sortValue);

    // findの第3引数にソートパラメータを指定して検索
    References.find({},{},{sort: sortParameter}, function(err, docs) {
        res.send(docs);
    });
};

