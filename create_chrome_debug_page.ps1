$htmlClean = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$css = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css", [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

$htmlClean = [regex]::Replace($htmlClean, '<link rel="stylesheet" href="style\.css[^"]*">', '')
$htmlClean = [regex]::Replace($htmlClean, '<script src="app\.js[^"]*"></script>', '')

$styleTag = "`n<style>`n" + $css + "`n</style>`n</head>"
$htmlCombined = $htmlClean.Replace('</head>', $styleTag)

$debugScript = @'
<script>
window.DEBUG_LOGS = [];
function logDebug(type, msg) {
    window.DEBUG_LOGS.push("[" + type + "] " + msg);
    var div = document.getElementById("debug-log-output");
    if (div) div.innerHTML = window.DEBUG_LOGS.join("<br>");
}
window.onerror = function(msg, url, line, col, err) {
    logDebug("ERROR", msg + " at line " + line + ":" + col + " (" + (err ? err.stack : "") + ")");
    return false;
};
window.addEventListener("unhandledrejection", function(e) {
    logDebug("PROMISE_REJECT", e.reason);
});
var origErr = console.error;
console.error = function() {
    logDebug("CONSOLE_ERR", Array.from(arguments).join(" "));
    origErr.apply(console, arguments);
};
var origWarn = console.warn;
console.warn = function() {
    logDebug("CONSOLE_WARN", Array.from(arguments).join(" "));
    origWarn.apply(console, arguments);
};
window.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        logDebug("INFO", "Running switchTabSection('test-1')...");
        try {
            if (window.switchTabSection) {
                window.switchTabSection('test-1');
                var c = document.getElementById('test1-questions-container');
                logDebug("INFO", "switchTabSection('test-1') completed. test1 container length: " + (c ? c.innerHTML.length : "null"));
                if (c && c.innerHTML.length > 5000) {
                    logDebug("SUCCESS", "Test 1 questions rendered successfully (" + c.innerHTML.length + " characters)!");
                }
            } else {
                logDebug("ERROR", "window.switchTabSection is NOT defined!");
            }
        } catch(e) {
            logDebug("EXC_SWITCH_TEST1", e + " " + e.stack);
        }

        setTimeout(function() {
            logDebug("INFO", "Simulating click on Test 1 option A of question 1...");
            try {
                var btn = document.querySelector(".test1-opt-btn");
                if (btn) {
                    btn.click();
                    logDebug("INFO", "Clicked option btn. test1-exp-q1 class: " + (document.getElementById("test1-exp-q1") ? document.getElementById("test1-exp-q1").className : "null"));
                    logDebug("SUCCESS", "Option clicked and checked successfully!");
                } else {
                    logDebug("ERROR", "No .test1-opt-btn found!");
                }
            } catch(e) {
                logDebug("EXC_CLICK_OPT", e + " " + e.stack);
            }
        }, 1000);
    }, 1000);
});
</script>
'@

$htmlCombined = $htmlCombined.Replace('</head>', "$debugScript`n</head>")

$bodyBottom = @'
<div id="debug-log-output" style="position:fixed;top:0;left:0;right:0;max-height:300px;overflow:auto;background:#0f172a;color:#10b981;font-size:15px;z-index:999999;padding:12px;font-family:monospace;white-space:pre-wrap;border-bottom:2px solid #38bdf8;">Initial Debug Box</div>
<script>
'@ + "`n" + $js + "`n</script>`n</body>"

$htmlCombined = $htmlCombined.Replace('</body>', $bodyBottom)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\test_chrome_debug.html", $htmlCombined, $utf8NoBom)
Write-Host "Created test_chrome_debug.html cleanly with .Replace()."
