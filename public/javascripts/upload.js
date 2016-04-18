(function($) {

    $(function() {
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
            if(files.length) {
                //var file = files[0];
                //var reader = new FileReader();
                //reader.onload = function() {
                //    document.getElementById("filecontent").innerHTML = this.result;
                //};
                //reader.readAsText(file);

                ajaxUpload(files[0]);
            }
        }


        function ajaxUpload(file){
            var fd = new FormData();
            fd.append("myhead",file);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4 && xhr.status==200){
                    alert(xhr.responseText);
                }
            };

            //侦查当前附件上传情况
            xhr.upload.onprogress = function(evt){
                //侦查附件上传情况
                //通过事件对象侦查
                //该匿名函数表达式大概0.05-0.1秒执行一次
                //console.log(evt);
                //console.log(evt.loaded);  //已经上传大小情况
                //evt.total; 附件总大小
                var loaded = evt.loaded;
                var tot = evt.total;
                var per = Math.floor(100*loaded/tot);  //已经上传的百分比
                console.log(per);
                //var son =  document.getElementById('son');
                //son.innerHTML = per+"%";
                //son.style.width = per+"%";
            };

            xhr.open("post","./upload");
            xhr.send(fd);
        }
    });
})(jQuery);