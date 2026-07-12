$c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)

$c = [regex]::Replace($c, 'University of Northampton.*?20-Credit Module Prep', 'University of Northampton | 20-Credit Module Prep')
$c = [regex]::Replace($c, '<span class="card-link">View Theory Section.*?<\/span>', '<span class="card-link">View Theory Section &rarr;</span>')
$c = [regex]::Replace($c, '<span class="card-link">View Process Workflow.*?<\/span>', '<span class="card-link">View Process Workflow &rarr;</span>')
$c = [regex]::Replace($c, '<span class="card-link">View Math & Code.*?<\/span>', '<span class="card-link">View Math & Code &rarr;</span>')
$c = [regex]::Replace($c, '<span class="card-link">Explore Tree Splitting.*?<\/span>', '<span class="card-link">Explore Tree Splitting &rarr;</span>')
$c = [regex]::Replace($c, '<span class="card-link">View Geometric Classifiers.*?<\/span>', '<span class="card-link">View Geometric Classifiers &rarr;</span>')
$c = [regex]::Replace($c, '<span class="card-link">View Clustering & Ethics.*?<\/span>', '<span class="card-link">View Clustering & Ethics &rarr;</span>')
$c = [regex]::Replace($c, '<strong>.*?Preventing Data Leakage:<\/strong>', '<strong>&bull; Preventing Data Leakage:</strong>')
$c = [regex]::Replace($c, 'Lab 0([1-4]).*?Course Segment\s*<\/span>', 'Lab 0$1 | Interactive Simulator</span>')
$c = [regex]::Replace($c, 'Timed Assessment Active.*?\)', 'Timed Assessment Active (30 Questions | 50 Total Points)')

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", $c, $utf8NoBom)
Write-Host "Updated csy3081_external.html. Checking remaining mojibake..."
$matches = [regex]::Matches($c, '\u00E2|\u00C3|\u00EF|\?\?').Count
Write-Host "Remaining mojibake in csy3081_external.html: $matches"
