$html = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html")
$sCount = [regex]::Matches($html, "<style>").Count
$cCount = [regex]::Matches($html, "<script>").Count
Write-Host "Count of <style> : $sCount"
Write-Host "Count of <script> : $cCount"
