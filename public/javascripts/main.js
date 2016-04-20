(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Progress(id) {
  this.$progress = $('#' + id);
  this._$uploadBlocker = this.$progress.find('.uploadBlocker');
  this._$uploadCount = this.$progress.find('.uploadCount');
  this._$uploadResult = this.$progress.find('.uploadResult');
}

Progress.prototype.uploading = function (p, filename) {
  var _p = p + '%',
      _tips = +p !== 100 ? "Uploading file: " + filename + "..." : "Uploaded successfully. Now converting. Please hold on...";
  this.$progress.show();
  this._$uploadCount.html(_p);
  this._$uploadBlocker.css({ width: _p });
  this._$uploadResult.html(_tips);
};

Progress.prototype.finish = function (path) {
  var _tips = "<p>Converted successfully! File saved in: </p><p>" + path + "</p><p>Please check in this directory.</p>";
  this._$uploadResult.html(_tips);
};

exports.default = Progress;

},{}],2:[function(require,module,exports){
'use strict';

var _Progress = require('./Progress.js');

var _Progress2 = _interopRequireDefault(_Progress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {
  var uploadContainer = document.getElementById('uploadContainer');

  uploadContainer.addEventListener("dragenter", dragenter, false);
  uploadContainer.addEventListener("dragover", dragover, false);
  uploadContainer.addEventListener("drop", drop, false);

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    var dt = e.dataTransfer;
    var files = dt.files;
    if (files.length) {
      //var file = files[0];
      //var reader = new FileReader();
      //reader.onload = function() {
      //    document.getElementById("filecontent").innerHTML = this.result;
      //};
      //reader.readAsText(file);

      ajaxUpload(files[0]);
    }
  }

  function ajaxUpload(file) {
    console.log(file);
    var fd = new FormData();
    var progress = new _Progress2.default('uploadProgress');

    fd.append("myhead", file);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        progress.finish(xhr.responseText);
      }
    };

    //侦查当前附件上传情况
    xhr.upload.onprogress = function (evt) {
      //侦查附件上传情况
      //通过事件对象侦查
      //该匿名函数表达式大概0.05-0.1秒执行一次
      //console.log(evt);
      //console.log(evt.loaded);  //已经上传大小情况
      //evt.total; 附件总大小
      var loaded = evt.loaded;
      var tot = evt.total;
      var per = Math.floor(100 * loaded / tot); //已经上传的百分比

      progress.uploading(per, file.name);
    };

    xhr.open("post", "./upload");
    xhr.send(fd);
  }
});

},{"./Progress.js":1}]},{},[2]);
