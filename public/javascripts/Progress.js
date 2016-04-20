'use strict';

function Progress(id) {
  this.$progress = $('#' + id);
  var _$uploadBlocker = this.$progress.find('.uploadBlocker');
  var _$uploadCount = this.$progress.find('.uploadBCount');
}
Progress.prototype.update = function (p) {
  var _p = p + '%';
  this.progress.show();
  _$uploadCount.html(_p);
  _$uploadBlocker.css({ width: _p });
};

exports.default = Progress;
//# sourceMappingURL=Progress.js.map
