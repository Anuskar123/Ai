$html = Get-Content index.html -Raw
$ids = @('main-nav', 'btn-start-exam', 'btn-explore-labs', 'btn-jump-notes', 'btn-reset-stats', 'syllabus-directory', 'stat-answered', 'stat-accuracy', 'nav-readiness-val', 'nav-progress-fill', 'stat-status-text', 'exam-mode-toggle', 'filter-buttons', 'btn-grade-exam', 'quiz-questions-list', 'exam-timer-box', 'submit-exam-footer', 'timer-clock', 'btn-preset-exam', 'btn-preset-pure', 'slider-c0', 'slider-c1', 'slider-c2', 'slider-total', 'val-c0', 'val-c1', 'val-c2', 'val-total', 'out-samples', 'out-values', 'prob-c0', 'prob-c1', 'prob-c2', 'bar-c0', 'bar-c1', 'bar-c2', 'out-gini', 'out-pred-class', 'kmeans-canvas', 'kmeans-k-buttons', 'btn-run-kmeans', 'btn-gen-blobs', 'btn-clear-canvas', 'km-stat-points', 'km-stat-inertia', 'knn-canvas', 'knn-k-buttons', 'btn-run-knn', 'btn-gen-knn', 'knn-stat-coord', 'knn-stat-counts', 'knn-stat-pred', 'slider-rf-trees', 'slider-rf-noise', 'btn-sim-rf', 'val-rf-trees', 'val-rf-noise', 'rf-single-acc', 'rf-ensemble-acc', 'rf-tree-count-log', 'bar-rf-single', 'bar-rf-ens', 'bar-num-single', 'bar-num-ens', 'toast-notify', 'toast-text')

foreach ($i in $ids) {
    if ($html -notmatch "id=`"$i`"" -and $html -notmatch "id='$i'") {
        Write-Host "MISSING ID IN HTML: $i" -ForegroundColor Red
    }
}
Write-Host "ID Check Complete."
