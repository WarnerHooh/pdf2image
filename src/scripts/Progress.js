function Progress(id) {
  this.$progress = $('#' + id);
  this._$uploadBlocker = this.$progress.find('.uploadBlocker');
  this._$uploadCount = this.$progress.find('.uploadCount');
  this._$uploadResult = this.$progress.find('.uploadResult');
}

Progress.prototype.uploading = function(p, filename) {
  var _p = p + '%',
      _tips = +p !== 100 ? "Uploading file: " + filename + "..." : "Uploaded successfully. Now converting. Please hold on...";
  this.$progress.show();
  this._$uploadCount.html(_p);
  this._$uploadBlocker.css({width: _p});
  this._$uploadResult.html(_tips);
};

Progress.prototype.finish = function(path) {
  var _tips = "<p>Converted successfully! File saved in: </p><p>" + path + "</p><p>Please check in this directory.</p>";
  this._$uploadResult.html(_tips);
};

export default Progress;
