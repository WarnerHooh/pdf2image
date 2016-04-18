var path = require('path');
var fs = require('fs');

var PDFImage = require("pdf-image").PDFImage;


var converted = 0;
function convert(pdfImage) {
    return function(pageNumber, callback) {
        pdfImage.convertPage(pageNumber).then(function (imagePath) {
            console.log(imagePath);
            // 0-th page (first page) of the slide.pdf is available as slide-0.png
            fs.existsSync("./slide-" + pageNumber + ".png") // => true

            callback && callback(pageNumber + 1);
        }).catch(function(err) {
            console.log(err);
        });
    }
}

function convertPdf(pdfFile, callback) {
    fs.stat(pdfFile, function(err, data) {
        if(err) {
            console.log(err);
        } else if(data) {

            var PdfReader = require('pdfreader').PdfReader;
            var pdfImage = new PDFImage(pdfFile);
            var pdfConvert = convert(pdfImage);
            var totalPages = 0;

            new PdfReader().parseFileItems(pdfFile, function(err, item){
                if(item && item.page) {
                    totalPages = item.page;

                    console.log("Convert page: " + item.page);
                    pdfConvert(item.page - 1, function(currentPage) {
                        if(totalPages === currentPage) {
                            callback && callback();
                        }
                    });
                }
            });
        }
    });
};


module.exports = convertPdf;