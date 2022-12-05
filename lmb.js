// Browser check
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
    return p.toString() === "[object SafariRemoteNotification]";
})(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
// Internet Explorer 6-11
var isIE = /*@cc_on!@*/ false || !!document.documentMode;
// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

function is_InternetExplorer() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0) { // If Internet Explorer, return version number
        return true;
    }
    return false;
}

var p = document.createElement("p");
p.className = 'alert alert-warning'
p.innerHTML = 'Some features of this tool will not work in Internet Explorer. Please use this tool in a modern browser like Mozilla Firefox or Google Chrome.'
if (isIE) {
    document.getElementById('upload-area').prepend(p);
}

(function test() {

    document.getElementById("document")
        .addEventListener("change", handleFileSelect, false);
    var filename = "";

    function handleFileSelect(event) {
        var inputFileName = event.target.value.split('\\').slice(-1)[0];

        filename = inputFileName.split('.docx')[0]

        console.log(event.target.value.split('\\').slice(-1)[0]);
        readFileInputEventAsArrayBuffer(event, function(arrayBuffer) {
            mammoth.convertToHtml({
                    arrayBuffer: arrayBuffer
                })
                .then(displayResult)
                .done()
        });
    }

    function displayResult(result) {
        document.getElementById("output").innerHTML = result.value;
        var content = process(result.value);
        console.log(result.messages);



        var w = document.createElement("p");
        w.className = 'alert alert-warning mammoth-message'
        w.innerHTML = result.messages
        document.getElementById('upload-area').prepend(w);

        save(content, filename + '.html')

    }

    function save(html, filename) {
        var htmlContent = [html];
        var bl = new Blob(htmlContent, {
            type: "text/html"
        });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(bl);
        a.className = 'download-button';
        a.download = filename;
        a.hidden = false;
        // document.body.appendChild(a);
        document.getElementById('upload-area').append(a)
        a.innerHTML = "Download " + filename;
        // a.onclick=window.navigator.msSaveOrOpenBlob(bl, filename);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(bl, filename);
        } else {
            a.click();
        }
    }

    function readFileInputEventAsArrayBuffer(event, callback) {
        var file = event.target.files[0];

        var reader = new FileReader();

        reader.onload = function(loadEvent) {
            var arrayBuffer = loadEvent.target.result;
            callback(arrayBuffer);
        };

        reader.readAsArrayBuffer(file);
    }

    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function process(str) {

        var div = document.createElement('div');
        div.innerHTML = str.trim();

        return format(div, 0).innerHTML;
    }

    function format(node, level) {

        var indentBefore = new Array(level++ + 1).join('  '),
            indentAfter = new Array(level - 1).join('  '),
            textNode;

        for (var i = 0; i < node.children.length; i++) {

            textNode = document.createTextNode('\n' + indentBefore);
            node.insertBefore(textNode, node.children[i]);

            format(node.children[i], level);

            if (node.lastElementChild == node.children[i]) {
                textNode = document.createTextNode('\n' + indentAfter);
                node.appendChild(textNode);
            }
        }

        return node;
    }
})();
