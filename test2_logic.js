/* ==========================================================================
   CSY3081: TEST 2 ASSESSMENT ENGINE (36 ADVANCED QUESTIONS & CODE LABS)
   ========================================================================== */

window.test2SolvedState = JSON.parse(localStorage.getItem('csy3081_test2_solved_v1') || '{}');
window.test2CurrentFilter = 'all';

window.test2Questions = [
    // === CATEGORY 1: REAL-WORLD CASE STUDIES (12 Questions, 2 Pts Each) ===
    {
        id: 1,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'A financial institution deploys a credit scoring machine learning model trained on historical data from 2015-2019. In 2023, the model begins rejecting creditworthy applicants and approving high-risk defaults at an alarming rate without any code modifications. Which of the following phenomena best explains this failure?',
        options: [
            'Concept Drift and Data Drift (`P(y|X)` and `P(X)` distribution shift due to macroeconomic inflation and interest rate changes over time)',
            'Gradient Vanishing inside the Decision Tree splitting logic over extended operating hours',
            'Overfitting caused by the `StandardScaler` transforming test samples differently than training samples',
            'Numerical instability caused by `random_state=42` expiring after three years of consecutive inference'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Diagnosis:</strong> Real-world distributions change over time ($P_{\\text{test}}(X, y) \\neq P_{\\text{train}}(X, y)$). This is formally known as <strong>Concept Drift / Data Drift</strong>. A model trained on pre-inflation economic data fails when macroeconomic conditions shift unless automated monitoring and retraining pipelines are implemented.'
    },
    {
        id: 2,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'An AI healthcare startup builds an oncology diagnostic classifier to detect rare early-stage tumors. Only 0.5% of patients in the dataset actually have the tumor (`class 1`), while 99.5% are healthy (`class 0`). A junior data scientist trains a model that achieves 99.5% overall accuracy on the test set, yet the medical director rejects the model immediately. Why?',
        options: [
            'The model has collapsed into a majority-class predictor (`always guessing class 0`), resulting in 0% Recall and missing 100% of true tumor cases',
            'The data scientist should have used $L_1$ regularized Linear Regression instead of a classification estimator',
            '99.5% accuracy indicates extreme bias (underfitting) on the training dataset',
            'The model required a minimum of 10,000 Support Vectors to achieve medical certification'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> In highly imbalanced datasets, overall accuracy is a misleading metric (`Accuracy Paradox`). A trivial dummy classifier predicting `class 0` for every patient achieves 99.5% accuracy but has $0\\%$ Sensitivity/Recall ($TP / (TP + FN) = 0 / (0 + FN) = 0$). Medical diagnosis requires optimizing <strong>Recall and F1-Score</strong> alongside stratified sampling.'
    },
    {
        id: 3,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'During a cross-validation experiment on a tabular real estate dataset, a student imputes missing values using `SimpleImputer(strategy="mean").fit_transform(X)` across the entire dataset $X$ before performing `train_test_split()`. Why is this experimental setup scientifically invalid?',
        options: [
            'It introduces severe Data Leakage because the overall mean computed across all samples includes information from the held-out test set',
            'Decision Trees and Random Forests are mathematically incompatible with mean imputed continuous values',
            '`fit_transform(X)` converts the pandas DataFrame into a sparse matrix that breaks downstream accuracy metrics',
            'The student should have applied `StandardScaler` before running `SimpleImputer` on the global dataset'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Computing preprocessing statistics (mean, median, standard deviation) across the entire dataset prior to splitting leaks test-set distributional knowledge into the training phase. To prevent leakage, preprocessing must be encapsulated inside a `Pipeline` where transformers are fitted solely on training folds.'
    },
    {
        id: 4,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'An e-commerce company uses an unsupervised `KMeans` clustering model to segment customers based on annual spending ($X_1 \in [100, 100000]$) and website visit frequency ($X_2 \in [1, 50]$). Without feature scaling, all resulting clusters are split exclusively along the annual spending axis while completely ignoring visit frequency. What is the geometric reason for this behavior?',
        options: [
            'Euclidean distance ($L_2$) squared is dominated by variables with larger numerical scale ($100,000^2 \gg 50^2$), making unscaled $K$-Means blind to smaller-scale features',
            '$K$-Means algorithm assumes that all input variables follow an exact Poisson distribution',
            'The centroid update rule ($\mu_k = \frac{1}{|C_k|} \sum x_i$) diverges if features have different units of measurement',
            'Annual spending is a continuous variable whereas visit frequency is discrete, which violates the $K$-Means objective function'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> $K$-Means minimizes Within-Cluster Sum of Squares (WCSS) using Euclidean distance: $d(u,v) = \\sqrt{(u_1 - v_1)^2 + (u_2 - v_2)^2}$. Because $(100000 - 100)^2$ is orders of magnitude larger than $(50 - 1)^2$, distance calculations are almost entirely dictated by $X_1$. Applying `StandardScaler` ($\mu=0, \sigma=1$) is mandatory prior to distance-based clustering.'
    },
    {
        id: 5,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'A machine learning engineer trains a deep `DecisionTreeClassifier` (`max_depth=None`) on an employee attrition dataset, achieving 100% accuracy on the training split. However, when evaluated on unseen validation data, the accuracy drops precipitously to 62%. What formal bias-variance diagnosis applies here?',
        options: [
            'High Variance and Low Bias (`Overfitting`: the tree memorized training noise, outliers, and exact sample quirks rather than generalizable decision boundaries)',
            'High Bias and Low Variance (`Underfitting`: the tree failed to capture linear separations in the data)',
            'Optimal Generalization (`The model has reached the Bayes error rate for tabular attrition datasets`)',
            'Collinearity Collapse (`Input variables share high correlation, forcing leaf nodes to evaluate to zero probability`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Unconstrained Decision Trees recursively split until every leaf node is pure ($\text{Gini}=0$), resulting in $100\%$ training accuracy. This creates hyper-complex, jagged decision boundaries (`High Variance`) that generalize poorly to unseen validation data. Mitigating overfitting requires hyperparameter regularization (`max_depth`, `min_samples_split`, `ccp_alpha`).'
    },
    {
        id: 6,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'In a fraud detection workflow where missing fraudulent transactions (`False Negatives`) cost $50,000 each, whereas false alarms (`False Positives`) cost only $10 in manual verification time, how should the decision threshold of a Logistic Regression classifier be adjusted from its default 0.50 cutoff?',
        options: [
            'Lower the classification threshold below 0.50 (`e.g., to 0.15`) to increase Recall and capture significantly more potential fraud cases at the expense of extra false alarms',
            'Raise the classification threshold above 0.50 (`e.g., to 0.90`) to ensure 100% Precision before triggering an expensive alert',
            'Maintain exact 0.50 threshold because logistic regression coefficients are calibrated specifically for symmetric log-odds',
            'Switch from `kernel="rbf"` to `kernel="linear"` to guarantee zero false negative rate across the test fold'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> By default, `predict()` assigns class 1 if $P(y=1|x) \ge 0.50$. When False Negatives carry catastrophic asymmetric costs compared to False Positives, lowering the probability threshold (`e.g., classifying as fraud if P >= 0.15`) maximizes Sensitivity/Recall, drastically reducing costly undetected fraud.'
    },
    {
        id: 7,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'An NLP engineer builds an email spam filter using a Multinomial Naive Bayes classifier. During test-time inference, an incoming email contains a brand new vocabulary word ("cryptoransomware") that never appeared anywhere in the training corpus. What mathematical issue occurs if Laplace smoothing (`alpha=0`) is disabled?',
        options: [
            'Zero-Probability Problem (`The conditional probability P("cryptoransomware" | Spam) = 0 causes the entire multiplicative posterior probability product to collapse to zero`)',
            'Logarithmic Overflow (`The sum of log probabilities exceeds double-precision floating point limits`)',
            'Centroid Divergence (`The feature vector cannot be mapped onto the prior probability distribution plane`)',
            'Kernel Matrix Singularization (`The Gram matrix determinant equals zero, preventing inverse matrix calculation`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Naive Bayes calculates class posterior probability via multiplication of conditional word probabilities: $P(\\text{Spam}|W) \\propto P(\\text{Spam}) \\times \\prod_{i=1}^n P(w_i|\\text{Spam})$. If a single word has zero frequency in training ($P(w_{\\text{new}}|\\text{Spam}) = 0$), the entire product becomes zero. Laplace smoothing (`alpha=1.0`) adds $+1$ count to every vocabulary term to guarantee non-zero probabilities.'
    },
    {
        id: 8,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'An autonomous driving team trains an image segmentation model using 50,000 daytime highway photos from California. When deployed on test vehicles in London during heavy winter fog and rain, the vision system frequently misclassifies pedestrians as guardrails. Which core machine learning limitation is demonstrated?',
        options: [
            'Sampling Bias & Domain Shift (`The training distribution lacked weather, lighting, and geographic diversity, violating the independent and identically distributed assumption`)',
            'Curse of Dimensionality (`High-resolution image pixels exceed the capacity of polynomial regression kernels`)',
            'Reinforcement Reward Exploitation (`The agent optimized for speed rather than safety reward penalties`)',
            'Linear Separability Collapse (`Fog images cannot be projected into higher-dimensional kernel space`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Machine learning models are bounded by the empirical distribution of their training datasets. If training data lacks domain coverage ($X_{\\text{fog}} \\notin X_{\\text{train}}$), the model relies on spurious correlations learned in clear weather, leading to dangerous out-of-distribution generalization failures.'
    },
    {
        id: 9,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'When tuning a Support Vector Classifier (`SVC`) with an RBF kernel, an engineer sets hyperparameter `gamma=100.0` and `C=1000.0`. What happens to the decision boundary and cross-validation performance?',
        options: [
            'The decision boundary breaks into isolated, microscopic islands around individual training points (`Extreme Overfitting`), yielding near-perfect training accuracy but terrible cross-validation score',
            'The decision boundary flattens into a rigid straight line (`Severe Underfitting`), causing high bias across both training and test sets',
            'The support vectors converge to the exact center of mass, resulting in $0.0\\%$ training error and maximum margin separation',
            'The kernel trick mathematically degrades into standard linear logistic regression due to high penalty weighting'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> In RBF kernel $K(x, x\') = \\exp(-\\gamma ||x - x\'||^2)$, the parameter $\\gamma$ (`gamma`) controls the radius of influence of each support vector. Very large $\\gamma$ means only samples immediately adjacent to a data point are influenced, creating complex islands around every training point. Coupled with large $C$ (zero tolerance for margin errors), the model severely overfits.'
    },
    {
        id: 10,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'A data science team needs to predict exact house sale prices in dollars ($y \in [100000, 5000000]$) using 45 continuous and categorical features. Which evaluation metric and Scikit-Learn estimator pair is mathematically correct for this task?',
        options: [
            '`RandomForestRegressor` evaluated via Root Mean Squared Error (`RMSE = sqrt(mean_squared_error(y_true, y_pred))`) and $R^2$ Score',
            '`RandomForestClassifier` evaluated via Log-Loss (`log_loss(y_true, y_pred)`) and Area Under the ROC Curve (`roc_auc_score`)',
            '`LogisticRegression` evaluated via Confusion Matrix (`confusion_matrix(y_true, y_pred)`) and F1-Score',
            '`KMeans` evaluated via Within-Cluster Sum of Squares (`kmeans.inertia_`) and Silhouette Coefficient'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Predicting a continuous scalar target value ($y \in \mathbb{R}$) is a <strong>Regression</strong> problem. Using classification metrics (ROC-AUC, F1-Score) or classification estimators on continuous targets causes type errors and invalid math. `RandomForestRegressor` optimized and evaluated via RMSE / $R^2$ is the industry standard for tabular regression.'
    },
    {
        id: 11,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'To evaluate a new recommendation model, an engineer performs 10-Fold Cross-Validation. What is the primary statistical advantage of 10-Fold Cross-Validation over a single static `train_test_split(test_size=0.20)`?',
        options: [
            'It utilizes 100% of the dataset for both training and testing across 10 non-overlapping validation folds, providing a much lower variance estimate of out-of-sample generalization performance',
            'It reduces total computational training time by 90% because each fold only trains on 10% of the data',
            'It automatically removes outliers and high-leverage data points from the dataset prior to model fitting',
            'It eliminates the need to set hyperparameters or run grid search optimization across different model choices'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> A single train-test split (`70/30` or `80/20`) can be highly sensitive to the random seed (`high variance`). In $K$-Fold CV ($K=10$), the data is split into 10 equal folds; the model is trained 10 times, each time using 9 folds for training and 1 fold for validation. Every sample is tested exactly once, ensuring robust statistical evaluation.'
    },
    {
        id: 12,
        category: 'case-studies',
        pts: 2,
        type: 'mcq',
        question: 'When explaining the difference between Artificial Intelligence (AI), Machine Learning (ML), and Deep Learning (DL) to executive stakeholders, which hierarchical definition is technically rigorous according to CSY3081 curriculum specifications?',
        options: [
            'AI is the overarching concept of machines mimicking cognitive behaviors; ML is a subset of AI where systems learn statistical patterns from data without explicit hardcoded rules; DL is a subset of ML utilizing multi-layered artificial neural networks',
            'DL is the broadest parent category containing both ML and AI as legacy sub-modules created prior to 2012',
            'ML refers exclusively to supervised regression algorithms, whereas AI refers exclusively to unsupervised clustering models like $K$-Means',
            'AI, ML, and DL are exact synonyms with identical mathematical foundations, differing only in commercial marketing terminology'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> From the **CSY3081 Core Introduction**: The strict concentric hierarchy is $\\text{DL} \\subset \\text{ML} \\subset \\text{AI}$. AI encompasses all intelligent systems (including symbolic logic and rule-based expert systems). ML is the data-driven subset optimizing parameters via loss functions. DL is the specialized subset of ML using deep multi-layer neural architectures.'
    },

    // === CATEGORY 2: SCIKIT-LEARN CODE DEBUGGING (10 Questions, 2 Pts Each) ===
    {
        id: 13,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.fit_transform(X_test) # <-- CHECK THIS LINE

model = LogisticRegression()
model.fit(X_train_scaled, y_train)
accuracy = model.score(X_test_scaled, y_test)`,
        question: 'Look at the Scikit-Learn code block above. Why is line 8 (`X_test_scaled = scaler.fit_transform(X_test)`) a severe methodology error?',
        options: [
            '`fit_transform()` re-estimates new mean ($\mu_{\text{test}}$) and variance ($\sigma_{\text{test}}^2$) on the test fold, causing Data Leakage and feature space misalignment. It should be `scaler.transform(X_test)`',
            '`StandardScaler` cannot be applied to `LogisticRegression` without first setting `with_std=False`',
            '`fit_transform()` on `X_test` will automatically overwrite the trained weights inside the `model` object',
            'The code should have called `model.fit_transform(X_train_scaled, y_train)` instead of separating scaling and training'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Calling `fit_transform()` on the test set (`X_test`) calculates a completely different mean and standard deviation from the training set. When `model.predict()` is called, the test features are mapped into an altered coordinate space. Test data must **always** be scaled using `scaler.transform(X_test)` using parameters learned during `scaler.fit(X_train)`.'
    },
    {
        id: 14,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.linear_model import LinearRegression
import numpy as np

# Single input feature (housing square footage)
X = np.array([1200, 1500, 1800, 2200, 2500])
y = np.array([250000, 310000, 380000, 450000, 520000])

model = LinearRegression()
model.fit(X, y) # <-- RAISES ValueError`,
        question: 'When running `model.fit(X, y)` in the code block above, Scikit-Learn raises `ValueError: Expected 2D array, got 1D array instead`. What is the exact syntax required to fix this bug?',
        options: [
            'Reshape `X` into a 2D column vector: `X = X.reshape(-1, 1)` or define as a 2D list `[[1200], [1500], [1800], ...]` before passing to `.fit()`',
            'Convert `y` into a 2D matrix using `y = y.reshape(-1, 1)` while leaving `X` as a 1D array',
            'Set hyperparameter `fit_intercept=False` when initializing `LinearRegression()` to accept 1D arrays',
            'Cast `X` into a standard Python dictionary (`{"sqft": X}`) before passing to `fit()`'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Scikit-Learn estimators strictly mandate that the feature matrix $X$ must be a **2D array-like** shape `(n_samples, n_features)`, even when there is only $1$ input variable. The target vector $y$ can be 1D `(n_samples,)`. Calling `X.reshape(-1, 1)` transforms `shape (5,)` into required `shape (5, 1)`.'
    },
    {
        id: 15,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

X = np.random.rand(100, 4) # 100 samples, 4 features
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)

# Attempting to get cluster labels for evaluation
labels = kmeans.labels
score = silhouette_score(X, labels)`,
        question: 'Why does line 9 (`labels = kmeans.labels`) throw an `AttributeError` or return `undefined`/`function object` when running this $K$-Means script?',
        options: [
            'In Scikit-Learn, attributes estimated after `fit()` end with a trailing underscore. It must be accessed as `kmeans.labels_` (`with trailing underscore`)',
            'The correct method to obtain training cluster assignments is `kmeans.get_labels(X)`',
            '`silhouette_score` requires passing the raw `kmeans` estimator object directly instead of numerical array labels',
            '`KMeans` clustering does not assign cluster labels until `kmeans.predict_proba(X)` is explicitly invoked'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> From Scikit-Learn API design conventions, any model attribute estimated from data during `.fit()` always ends with a **trailing underscore (`_`)**. This distinguishes estimated parameters (`labels_`, `cluster_centers_`, `inertia_`, `coef_`, `intercept_`) from user-provided hyperparameters (`n_clusters`, `random_state`).'
    },
    {
        id: 16,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('clf', SVC(kernel='rbf'))
])

# Attempting to tune SVC hyperparameter C and imputer strategy via GridSearchCV
param_grid = {
    'C': [0.1, 1, 10],
    'strategy': ['mean', 'median']
}
grid = GridSearchCV(pipe, param_grid, cv=5)
grid.fit(X_train, y_train) # <-- RAISES ValueError / Invalid parameter`,
        question: 'When executing `grid.fit(X_train, y_train)` in the code block above, `GridSearchCV` throws an error stating that `C` and `strategy` are invalid parameters for `Pipeline`. What is the exact syntax convention required inside `param_grid` for Pipeline step tuning?',
        options: [
            'Prefix each parameter with its step step name followed by double underscores (`__`): `{"clf__C": [0.1, 1, 10], "imputer__strategy": ["mean", "median"]}`',
            'Pass nested dictionaries inside `param_grid`: `{"clf": {"C": [0.1, 1, 10]}, "imputer": {"strategy": ["mean", "median"]}}`',
            'Prefix each parameter with single underscore (`_`): `{"clf_C": [0.1, 1, 10], "imputer_strategy": ["mean", "median"]}`',
            '`GridSearchCV` cannot tune parameters across multiple preprocessing steps simultaneously; two separate grid searches must be executed'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> When optimizing a `Pipeline` using `GridSearchCV`, Scikit-Learn uses a double underscore syntax (`step_name__parameter_name`) to route hyperparameters to the correct sub-estimator inside the pipeline. Using `clf__C` directs hyperparameter `C` to step `clf` (`SVC`).'
    },
    {
        id: 17,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

data = load_iris()
X, y = data.data, data.target

clf = DecisionTreeClassifier(criterion='gini', max_depth=3, random_state=42)
clf.fit(X, y)

# Retrieve probability distribution for sample 0
probs = clf.predict_proba(X[0]) # <-- RAISES ValueError`,
        question: 'Why does `clf.predict_proba(X[0])` raise a `ValueError` (`Expected 2D array, got 1D array instead`), and how should sample 0 be passed for inference?',
        options: [
            '`X[0]` extracts a 1D slice of shape `(n_features,)`. Pass slice `X[[0]]` (double brackets) or `X[0:1]` to preserve 2D shape `(1, n_features)`',
            '`predict_proba` only accepts pandas DataFrames; numpy arrays must be converted using `pd.DataFrame(X[0])`',
            '`DecisionTreeClassifier` does not implement `predict_proba` unless `probability=True` is passed during class initialization',
            '`X[0]` must be transposed using `X[0].T` before passing to `.predict_proba()`'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> In Python indexing, `X[0]` extracts the first row as a 1D vector of shape `(4,)`. Scikit-Learn inference methods (`predict`, `predict_proba`, `transform`) always require 2D input `(n_samples, n_features)`. Using slice notation `X[[0]]` or `X[0:1]` maintains 2D shape `(1, 4)`.'
    },
    {
        id: 18,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss

# Multi-class dataset with 3 classes: [0, 1, 2]
model = LogisticRegression(multi_class='multinomial', solver='lbfgs')
model.fit(X_train, y_train)

# Calculate cross-entropy loss on test set
preds = model.predict(X_test)
loss = log_loss(y_test, preds) # <-- RAISES ValueError / Invalid Input`,
        question: 'Why does line 10 (`loss = log_loss(y_test, preds)`) raise an error or produce mathematically invalid results when evaluating multi-class Logistic Regression?',
        options: [
            '`log_loss` (`Cross-Entropy`) requires predicted class probability distributions (`model.predict_proba(X_test)`), NOT discrete integer class predictions (`model.predict(X_test)`)',
            '`log_loss` can only be computed on binary classification ($y \in [0, 1]$); for multi-class problems, `mean_squared_error` must be used',
            '`solver="lbfgs"` does not optimize logarithmic loss; the model must be trained using `solver="sag"`',
            '`y_test` must be manually one-hot encoded using `pd.get_dummies()` before calling `log_loss()`'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Logarithmic loss (`log_loss`) evaluates the negative log-likelihood of the true class given the predicted probability distribution: $L = -\\frac{1}{N} \\sum_{i=1}^N \\sum_{k=1}^K y_{i,k} \\log(p_{i,k})$. Passing discrete hard predictions (`0, 1, 2`) from `predict()` assigns absolute $0.0$ or $1.0$ probabilities, causing $\\log(0) = -\\infty$. You must pass `model.predict_proba(X_test)`.'
    },
    {
        id: 19,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

rf = RandomForestClassifier(n_estimators=100, random_state=42)

# Evaluate 5-fold cross validation score using Mean Squared Error
scores = cross_val_score(rf, X, y, cv=5, scoring='mean_squared_error') # <-- RAISES ValueError`,
        question: 'Why does line 7 (`cross_val_score(..., scoring="mean_squared_error")`) throw a `ValueError: "mean_squared_error" is not a valid scoring value`?',
        options: [
            'In Scikit-Learn cross validation, loss metrics are maximized using negative values: the exact string name is `"neg_mean_squared_error"`',
            '`RandomForestClassifier` cannot be evaluated with `cross_val_score`; you must use `KFold()` directly inside a for-loop',
            'The string name must be written in camelCase: `"meanSquaredError"` without underscores',
            '`cv=5` requires `scoring="accuracy"`; regression loss metrics cannot be passed to any `cross_val_score` function call'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> Scikit-Learn\'s model selection tools (`cross_val_score`, `GridSearchCV`) follow a strict convention where **higher scores are always better**. Because Mean Squared Error is a loss (`lower is better`), Scikit-Learn negates the metric so optimizer maximization works correctly. The required string is `"neg_mean_squared_error"`.'
    },
    {
        id: 20,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.preprocessing import OneHotEncoder
import pandas as pd

df = pd.DataFrame({
    'City': ['London', 'Paris', 'Berlin', 'London'],
    'Salary': [65000, 72000, 58000, 81000]
})

encoder = OneHotEncoder()
encoded_cities = encoder.fit_transform(df['City']) # <-- RAISES ValueError / Reshape required`,
        question: 'Why does `encoder.fit_transform(df["City"])` raise a `ValueError` in the code block above?',
        options: [
            '`df["City"]` returns a 1D pandas Series of shape `(4,)`. `OneHotEncoder` mandates 2D DataFrame input `df[["City"]]` (`double square brackets`) of shape `(4, 1)`',
            '`OneHotEncoder` only works on integer numerical IDs; strings must be pre-transformed using `LabelEncoder` first',
            '`df["City"]` must be converted to a Python tuple `tuple(df["City"])` before one-hot encoding can execute',
            '`OneHotEncoder` requires `sparse=False` inside constructor `OneHotEncoder(sparse=False)` to accept pandas series'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> In pandas, single bracket indexing `df["City"]` returns a 1D `pd.Series`. Double brackets `df[["City"]]` returns a 2D `pd.DataFrame`. Because `OneHotEncoder` expects 2D tabular features where columns represent categorical variables, `df[["City"]]` (`shape (n_samples, 1)`) is strictly required.'
    },
    {
        id: 21,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

knn = KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)
knn.fit(X_train, y_train)

# Predict accuracy
y_pred = knn.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print("Accuracy:", acc)

# Check distance metric used by inspecting model attributes
print("Fitted metric:", knn.effective_metric_) # <-- Returns 'euclidean' instead of 'minkowski'`,
        question: 'In the code above, we initialized `KNeighborsClassifier` with `metric="minkowski"` and `p=2`. Why does `knn.effective_metric_` evaluate to `"euclidean"` after fitting?',
        options: [
            'Minkowski distance with power $p=2$ ($D = (\sum |x_i - y_i|^2)^{1/2}$) is mathematically and identically the definition of **Euclidean distance ($L_2$)**',
            'Scikit-Learn encountered a memory overflow while computing Minkowski weights and fell back to Euclidean distance automatically',
            'Setting `p=2` overrides any custom string passed to `metric` and forces Manhattan distance ($L_1$)',
            '`effective_metric_` is a deprecated attribute that returns the hardcoded default metric of the operating system'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> The generalized Minkowski distance formula is $D(x, y) = \\left( \\sum_{i=1}^n |x_i - y_i|^p \\right)^{1/p}$. When $p=1$, this simplifies to Manhattan/City-Block distance ($L_1$). When $p=2$, this simplifies to Euclidean distance ($L_2$). Scikit-Learn optimizes execution by mapping `metric="minkowski", p=2` directly to `"euclidean"`.'
    },
    {
        id: 22,
        category: 'code-debug',
        pts: 2,
        type: 'mcq',
        code: `from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

clf = DecisionTreeClassifier(max_depth=2, random_state=42)
clf.fit(X_train, y_train)

plt.figure(figsize=(12, 8))
plot_tree(clf, filled=True, feature_names=feature_cols, class_names=['Negative', 'Positive'])
# Figure window opens or exports as a blank white canvas without rendering trees!`,
        question: 'When running `plot_tree(clf, ...)` in the script above inside a standard Python script or IDE, why does the saved or displayed plot sometimes appear entirely blank, and what line must be added immediately after `plot_tree()`?',
        options: [
            'Add `plt.show()` (`or plt.savefig("tree.png")` before `plt.close()`) because `plot_tree` draws onto the active matplotlib axes without automatically flushing the graphics buffer',
            'Add `clf.render_graphviz()` because `plot_tree` requires GraphViz binary compilation to display node colors',
            'Change `filled=True` to `filled=False` because matplotlib cannot render RGBA hex colors inside decision tree boxes',
            'Call `plt.draw_tree(clf)` prior to setting `figsize` to initialize canvas memory allocation'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation:</strong> `sklearn.tree.plot_tree` uses `matplotlib.pyplot` underlying rendering engine to draw nodes and splitting arrows onto the current figure object (`plt.gca()`). Unlike interactive Jupyter notebooks that auto-display return objects, standard Python scripts strictly require calling `plt.show()` or `plt.savefig()` to trigger rendering.'
    },

    // === CATEGORY 3: MATH & IMPURITY FORMULAS (8 Questions, 2 Pts Each) ===
    {
        id: 23,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'A `DecisionTreeClassifier` evaluates a candidate split that creates a child node containing `[10 Setosa, 10 Versicolor, 20 Virginica]` samples (`Total N = 40`). Using the exact Scikit-Learn Gini Impurity formula $\\text{Gini} = 1 - \\sum_{i=1}^C p_i^2$, what is the precise Gini impurity of this node?',
        options: [
            '`0.625` (`computed as 1 - [ (10/40)^2 + (10/40)^2 + (20/40)^2 ] = 1 - [ 0.0625 + 0.0625 + 0.25 ] = 1 - 0.375 = 0.625`)',
            '`0.500` (`computed as 1 - [ 1/3 + 1/3 + 1/3 ]`)',
            '`0.375` (`computed as the sum of squared class probabilities without subtracting from 1`)',
            '`0.750` (`maximum possible impurity for a 3-class distribution`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong><br>1. Calculate class probabilities: $p_0 = \\frac{10}{40} = 0.25$, $p_1 = \\frac{10}{40} = 0.25$, $p_2 = \\frac{20}{40} = 0.50$.<br>2. Square probabilities: $p_0^2 = 0.0625$, $p_1^2 = 0.0625$, $p_2^2 = 0.25$.<br>3. Sum squares: $\\sum p_i^2 = 0.0625 + 0.0625 + 0.25 = 0.375$.<br>4. Subtract from 1: $\\text{Gini} = 1 - 0.375 = \\mathbf{0.625}$.'
    },
    {
        id: 24,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'Calculate the **Shannon Entropy ($H$)** using base-2 logarithm ($H = -\\sum p_i \\log_2 p_i$) for a binary classification leaf node split evenly with `[32 positive, 32 negative]` samples (`Total N = 64`).',
        options: [
            '`1.000` (`Since p_0 = 0.5 and p_1 = 0.5: -[0.5*log2(0.5) + 0.5*log2(0.5)] = -[0.5*(-1) + 0.5*(-1)] = -(-1.0) = 1.000`)',
            '`0.500` (`Entropy equals exactly half of the sample distribution size`)',
            '`0.000` (`An equal split represents maximum purity under Shannon entropy rules`)',
            '`2.000` (`Computed as log2(64) divided by binary classes C=2`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong> For any $C$-class problem, Shannon Entropy is maximized when all classes are equally likely (`uniform distribution`). For a binary node ($p_0=0.5, p_1=0.5$), $H = -[0.5\\log_2(0.5) + 0.5\\log_2(0.5)] = -[0.5(-1) + 0.5(-1)] = \\mathbf{1.000}$. Maximum entropy for $C$ classes is $\\log_2(C)$.'
    },
    {
        id: 25,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'Compute the **Euclidean Distance ($L_2$)** between two patient medical feature vectors in 3D coordinate space: Patient A $u = (1, 4, 2)$ and Patient B $v = (4, 8, 2)$.',
        options: [
            '`5.00` (`computed as sqrt[ (4-1)^2 + (8-4)^2 + (2-2)^2 ] = sqrt[ 3^2 + 4^2 + 0 ] = sqrt[ 9 + 16 ] = sqrt(25) = 5.00`)',
            '`7.00` (`computed via Manhattan L1 distance: |4-1| + |8-4| + |2-2| = 3 + 4 + 0 = 7.00`)',
            '`25.00` (`computed as the sum of squared differences before applying the square root`)',
            '`3.50` (`computed as the arithmetic average coordinate difference across all 3 axes`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong> The Euclidean ($L_2$) distance formula in $N$-dimensions is $d(u,v) = \\sqrt{\\sum_{i=1}^n (u_i - v_i)^2}$. Substituting values: $\\Delta x = 4-1=3$, $\\Delta y = 8-4=4$, $\\Delta z = 2-2=0$. Thus, $d = \\sqrt{3^2 + 4^2 + 0^2} = \\sqrt{9+16} = \\sqrt{25} = \\mathbf{5.00}$.'
    },
    {
        id: 26,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'Compute the **Manhattan Distance ($L_1$)** between the same two patient vectors: Patient A $u = (1, 4, 2)$ and Patient B $v = (4, 8, 2)$.',
        options: [
            '`7.00` (`computed via absolute coordinate differences: |4-1| + |8-4| + |2-2| = 3 + 4 + 0 = 7.00`)',
            '`5.00` (`Euclidean distance result`)',
            '`14.00` (`computed by doubling the absolute differences across active axes`)',
            '`2.33` (`computed by dividing total Manhattan distance by 3 spatial dimensions`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong> Manhattan ($L_1$) distance, also known as City-Block distance, measures the sum of absolute differences along each axis: $d_{L1}(u,v) = \\sum_{i=1}^n |u_i - v_i|$. Substituting values: $|4-1| + |8-4| + |2-2| = 3 + 4 + 0 = \\mathbf{7.00}$. Notice $L_1 \\ge L_2$ always holds.'
    },
    {
        id: 27,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'In a Simple Linear Regression model $\hat{y} = w x + b$, what is the exact **Mean Squared Error (MSE)** if the model makes the following predictions across $N=4$ test samples:<br>`y_true = [10, 20, 30, 40]` and `y_pred = [12, 18, 33, 37]`?',
        options: [
            '`6.50` (`squared errors: (10-12)^2=4, (20-18)^2=4, (30-33)^2=9, (40-37)^2=9; sum=26; MSE = 26 / 4 = 6.50`)',
            '`2.55` (`computed as the Root Mean Squared Error RMSE = sqrt(6.50)`)',
            '`26.00` (`computed as the Residual Sum of Squares RSS without dividing by N=4`)',
            '`2.25` (`computed via Mean Absolute Error MAE: [2 + 2 + 3 + 3] / 4 = 10 / 4 = 2.50`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong> Mean Squared Error is defined as $\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$.<br>1. Calculate residuals $(y_i - \\hat{y}_i)$: $-2, +2, -3, +3$.<br>2. Square residuals: $4, 4, 9, 9$.<br>3. Sum squared residuals (`RSS`): $4 + 4 + 9 + 9 = 26$.<br>4. Divide by sample count $N=4$: $\\text{MSE} = \\frac{26}{4} = \\mathbf{6.50}$.'
    },
    {
        id: 28,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'A logistic regression model produces a raw linear log-odds output score of $z = w^T x + b = 0.00$. Using the exact Sigmoid activation formula $\\sigma(z) = \\frac{1}{1 + e^{-z}}$, what is the predicted output probability $P(y=1|x)$?',
        options: [
            '`0.500` (`Since e^(-0) = e^0 = 1.0, sigma(0) = 1 / (1 + 1) = 1 / 2 = 0.500`)',
            '`1.000` (`Zero log-odds indicates 100% confidence in class 1 boundary alignment`)',
            '`0.000` (`An intercept of zero evaluates to zero probability under exponential curves`)',
            '`0.731` (`Sigmoid value corresponding to input z = +1.0`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong> The Sigmoid activation curve maps any real number $z \in (-\infty, +\infty)$ to $(0, 1)$. When the linear combination $z = 0$, substituting yields $\\sigma(0) = \\frac{1}{1 + e^{-0}} = \\frac{1}{1 + 1} = \\mathbf{0.500}$. Geometrically, $z=0$ represents the exact decision boundary where both classes are equally probable.'
    },
    {
        id: 29,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'In a multi-class neural network or `LogisticRegression(multi_class="multinomial")`, three output neurons produce raw unnormalized logit scores: $z_1 = 2.0$, $z_2 = 1.0$, $z_3 = 0.0$. Using the exact **Softmax formula** $P(y=k) = \\frac{e^{z_k}}{\\sum_{j=1}^3 e^{z_j}}$, what is the approximate probability assigned to Class 1 ($z_1 = 2.0$)? (`Use e^2 ≈ 7.389, e^1 ≈ 2.718, e^0 = 1.000`)',
        options: [
            '`0.665` (`Sum of exponentials = 7.389 + 2.718 + 1.000 = 11.107; P(Class 1) = 7.389 / 11.107 ≈ 0.665`)',
            '`0.333` (`Since there are 3 classes, Softmax assigns equal 1/3 probability`)',
            '`0.850` (`Computed as z_1 / sum(z) = 2.0 / 3.0 = 0.667 before applying exponentiation`)',
            '`0.245` (`Softmax probability corresponding to Class 2 where z_2 = 1.0`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong> Softmax exponentiates logits to ensure positivity and normalizes across all classes so $\\sum P_k = 1.0$.<br>1. Exponentials: $e^{2.0} \\approx 7.389$, $e^{1.0} \\approx 2.718$, $e^{0.0} = 1.000$.<br>2. Denominator sum: $7.389 + 2.718 + 1.000 = 11.107$.<br>3. Class 1 Probability: $\\frac{7.389}{11.107} \\approx \\mathbf{0.665}$ (`66.5% confidence`).'
    },
    {
        id: 30,
        category: 'math-formulas',
        pts: 2,
        type: 'mcq',
        question: 'Compute the exact **R-squared ($R^2$) Coefficient of Determination** using formula $R^2 = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}$ for a regression model where the Residual Sum of Squares is $\\text{SS}_{\\text{res}} = 20$ and the Total Variance Sum of Squares around the mean $\\bar{y}$ is $\\text{SS}_{\\text{tot}} = 100$.',
        options: [
            '`0.800` (`computed as 1 - (20 / 100) = 1 - 0.20 = 0.800, explaining exactly 80% of target variance`)',
            '`0.200` (`computed as SS_res divided by SS_tot without subtracting from 1`)',
            '`1.200` (`computed as 1 + (SS_res / SS_tot)`)',
            '`5.000` (`computed as SS_tot / SS_res = 100 / 20 = 5.0`)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Explanation & Math Proof:</strong> The $R^2$ score measures how much better the regression line explains target variance compared to a horizontal baseline predicting mean $\\bar{y}$. With $\\text{SS}_{\\text{res}} = \\sum (y_i - \\hat{y}_i)^2 = 20$ and $\\text{SS}_{\\text{tot}} = \\sum (y_i - \\bar{y})^2 = 100$: $R^2 = 1 - \\frac{20}{100} = 1 - 0.20 = \\mathbf{0.800}$ (`80% variance explained`).'
    },

    // === CATEGORY 4: MATCHING PAIRS & SCENARIOS (6 Questions, 2 Pts Each) ===
    {
        id: 31,
        category: 'matching',
        pts: 2,
        type: 'matching',
        question: 'Match each foundational **Machine Learning Learning Paradigm** with its exact official definition and representative Scikit-Learn algorithm:',
        matchingTable: [
            { colA: 'Supervised Learning (Classification)', colB: 'Predicts discrete categorical labels from labeled training data; evaluated via Confusion Matrix (`e.g., LogisticRegression, SVC`)' },
            { colA: 'Supervised Learning (Regression)', colB: 'Predicts continuous numerical target quantities from labeled data; evaluated via MSE / R2 (`e.g., LinearRegression, RandomForestRegressor`)' },
            { colA: 'Unsupervised Learning (Clustering)', colB: 'Discovers inherent groupings and structural patterns in unlabeled datasets (`e.g., KMeans, DBSCAN, Hierarchical Clustering`)' },
            { colA: 'Unsupervised Learning (Dimensionality Reduction)', colB: 'Compresses high-dimensional feature spaces while preserving maximum variance (`e.g., Principal Component Analysis PCA`)' },
            { colA: 'Reinforcement Learning (RL)', colB: 'An autonomous agent learns optimal decision policies through trial-and-error reward feedback inside a Markov Decision Process' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (2 Points)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Course Taxonomy (` - `):</strong> Supervised models mandate labeled target column $y$. Unsupervised models operate strictly on feature matrix $X$ to find latent patterns ($K$-Means clusters, PCA components). Reinforcement Learning ($Q$-Learning) dynamically interacts with an environment without static datasets.'
    },
    {
        id: 32,
        category: 'matching',
        pts: 2,
        type: 'matching',
        question: 'Match each **Decision Tree & Ensemble Hyperparameter** with its exact mathematical regularizing mechanism:',
        matchingTable: [
            { colA: 'max_depth', colB: 'Hard limit on the maximum vertical depth (`path length from root to leaf`) to prevent hyper-complex jagged boundaries' },
            { colA: 'min_samples_split', colB: 'The minimum number of internal samples required inside a node before splitting is permitted (`e.g., min_samples_split=20`)' },
            { colA: 'min_samples_leaf', colB: 'The minimum mandatory number of samples that must exist in any newly created child leaf node after a split' },
            { colA: 'criterion', colB: 'The mathematical impurity function evaluated to select optimal splitting features (`"gini"` vs `"entropy"`)' },
            { colA: 'n_estimators (`RandomForest`)', colB: 'The total number of independent bootstrap decision trees aggregated via majority voting inside the ensemble' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (2 Points)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Hyperparameter Reference (`Handson on Decision Tree.pdf`):</strong> Unconstrained trees (`max_depth=None`, `min_samples_leaf=1`) overfit $100\%$ (`High Variance`). Increasing `min_samples_leaf` (`e.g., to 5 or 10`) guarantees smooth, statistically significant regional leaf predictions.'
    },
    {
        id: 33,
        category: 'matching',
        pts: 2,
        type: 'matching',
        question: 'Match each **Classification Evaluation Metric** with its exact formula derived from True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN):',
        matchingTable: [
            { colA: 'Precision (`Positive Predictive Value`)', colB: 'Formula: TP / (TP + FP) | Measures exactness: when the classifier alerts positive, what fraction is genuinely positive?' },
            { colA: 'Recall (`Sensitivity / True Positive Rate`)', colB: 'Formula: TP / (TP + FN) | Measures completeness: what fraction of true ground-truth positive cases were successfully detected?' },
            { colA: 'F1-Score (`Harmonic Mean`)', colB: 'Formula: 2 * (Precision * Recall) / (Precision + Recall) | Balances precision and recall, severely penalizing extreme imbalances' },
            { colA: 'Overall Accuracy', colB: 'Formula: (TP + TN) / (TP + TN + FP + FN) | Percentage of total correct predictions across both positive and negative classes' },
            { colA: 'Specificity (`True Negative Rate`)', colB: 'Formula: TN / (TN + FP) | Measures how accurately the classifier identifies and rejects true negative / healthy samples' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (2 Points)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Metric Derivations:</strong> In medical and fraud detection tasks, Recall and Precision are inversely coupled (`Precision-Recall Tradeoff`). The F1-Score uses the harmonic mean rather than arithmetic average ($2PR / (P+R)$) so that if either Precision or Recall drops near $0$, the F1-Score drops near $0$.'
    },
    {
        id: 34,
        category: 'matching',
        pts: 2,
        type: 'matching',
        question: 'Match each **Support Vector Machine (SVM) Kernel** with its mathematical transformation and geometric use case:',
        matchingTable: [
            { colA: 'kernel="linear"', colB: 'Transformation: K(x, z) = x^T z + c | Constructs a flat hyperdimensional separating plane; ideal for text classification and linearly separable data' },
            { colA: 'kernel="poly" (`Polynomial`)', colB: 'Transformation: K(x, z) = (gamma * x^T z + coef0)^degree | Projects features into polynomial combinations of degree d' },
            { colA: 'kernel="rbf" (`Radial Basis Function`)', colB: 'Transformation: K(x, z) = exp(-gamma * ||x - z||^2) | Infinite-dimensional Gaussian radial kernel; industry standard for non-linear boundaries' },
            { colA: 'kernel="sigmoid"', colB: 'Transformation: K(x, z) = tanh(gamma * x^T z + coef0) | Emulates a two-layer neural network perceptron activation curve' },
            { colA: 'Support Vectors', colB: 'The exact subset of data points ($0 < \alpha_i \le C$) touching or violating the soft margin bounds that solely define the hyperplane position' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (2 Points)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Kernel Trick Proof:</strong> Computing non-linear boundaries by explicitly mapping vectors $\Phi(x)$ to infinite dimensions requires infinite RAM. The Mercer Kernel Trick computes the inner dot-product $\langle \Phi(x), \Phi(z) \rangle$ directly inside the original feature space via closed-form functions like RBF (`Gaussian Kernel`).'
    },
    {
        id: 35,
        category: 'matching',
        pts: 2,
        type: 'matching',
        question: 'Match each **Scikit-Learn Preprocessing & Validation Transformer** with its exact data transformation formula:',
        matchingTable: [
            { colA: 'StandardScaler (`Z-Score Normalization`)', colB: 'Formula: z = (x - mean) / std | Centers features to mean 0.0 and variance 1.0; required for KNN, KMeans, SVM, and Neural Nets' },
            { colA: 'MinMaxScaler (`Range Normalization`)', colB: 'Formula: x_scaled = (x - x_min) / (x_max - x_min) | Compresses feature values bounded strictly between [0.0, 1.0]' },
            { colA: 'SimpleImputer(strategy="median")', colB: 'Replaces missing `NaN` / `null` values with the statistical median (`50th percentile`) computed solely on the fitted training fold' },
            { colA: 'OneHotEncoder(drop="first")', colB: 'Converts categorical strings into binary indicator columns (`0 or 1`) while dropping the first category to eliminate multicollinearity' },
            { colA: 'StratifiedKFold(n_splits=5)', colB: 'Splits data into 5 cross-validation folds while guaranteeing that each fold maintains the exact class ratio distribution of the original dataset' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (2 Points)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Preprocessing Checklist:</strong> `StandardScaler` is sensitive to extreme outliers (`which skew mean and std`). For datasets with massive outliers (`e.g., billionaire incomes`), `RobustScaler` (`using median and Interquartile Range IQR`) or `MinMaxScaler` should be selected depending on downstream distance assumptions.'
    },
    {
        id: 36,
        category: 'matching',
        pts: 2,
        type: 'matching',
        question: 'Match each **Core AI Ethics & Production Limitation** directly tested in CSY3081 exams with its diagnostic mitigation:',
        matchingTable: [
            { colA: '1. Data Dependence (`Garbage In / Garbage Out`)', colB: 'If historical training data reflects societal or sampling bias, models amplify those disparities (`Mitigation: Stratified sampling & fairness auditing`)' },
            { colA: '2. Lack of Causality (`Correlation != Causation`)', colB: 'ML algorithms discover statistical correlations, not cause-and-effect (`Mitigation: Randomized Controlled Trials RCTs & causal inference models`)' },
            { colA: '3. Concept Drift (`Distribution Shift over Time`)', colB: 'Real-world environments evolve, rendering historical models obsolete (`Mitigation: Continuous monitoring pipelines & automated rolling retraining`)' },
            { colA: '4. Interpretability Tradeoff (`Black-Box vs White-Box`)', colB: 'Deep neural networks achieve high accuracy but lack transparency (`Mitigation: SHAP / LIME explainability frameworks or white-box Decision Trees`)' },
            { colA: '5. Adversarial Vulnerability (`Security & Perturbations`)', colB: 'Imperceptible noise added to inputs can fool deep learning classifiers into catastrophic misclassifications (`Mitigation: Adversarial training & input sanitization`)' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (2 Points)'
        ],
        correctIndex: 0,
        explanation: '<strong>💡 Official Exam Guarantee:</strong> In the final exam case study essay, examiners specifically grade whether candidates identify at least one of these 5 core limitations before recommending an AI deployment to a commercial client!'
    }
];

// --- TEST 2 RENDERING ENGINE ---
function renderTest2Questions(filter = 'all', btnEl = null) {
    try {
        if (btnEl) {
            document.querySelectorAll('.test2-filter-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
        }
        window.test2CurrentFilter = filter;

        const container = document.getElementById('test2-questions-container');
        if (!container) return;

        const filtered = window.test2Questions.filter(q => filter === 'all' || q.category === filter);

        let html = '';
        filtered.forEach((q) => {
            const solved = window.test2SolvedState[q.id];
            const statusBadge = solved
                ? (solved.status === 'correct' ? '<span class="badge" class="status-badge status-active">✓ Solved (+2 Pts)</span>' : '<span class="badge" class="status-badge status-alert">× Incorrect</span>')
                : '<span class="badge" class="status-badge status-neutral">Unanswered</span>';

            html += `
            <div class="test1-card" id="test2-card-${q.id}" style="border-left: 4px solid var(--primary);">
                <div class="test1-card-head">
                    <div>
                        <span class="test1-num" class="badge badge-primary">Question ${q.id} | ${q.category.toUpperCase()}</span>
                        <span class="test1-pts" class="badge badge-purple">${q.pts} Points</span>
                    </div>
                    <div>${statusBadge}</div>
                </div>
                <div class="test1-question" style="font-size:1.05rem;line-height:1.65;margin-top:1rem;">${q.question}</div>
                ${q.code ? `<div class="test1-code-block" class="code-box"><code class="code-text">${q.code}</code></div>` : ''}
                ${q.type === 'matching' ? `
                    <table class="test1-match-table" class="data-table">
                        <thead>
                            <tr class="table-header"><th class="table-cell-th">Column A (Concept / Parameter)</th><th class="table-cell-th">Column B (Official CSY3081 Definition & Formula)</th></tr>
                        </thead>
                        <tbody>
                            ${q.matchingTable.map(row => `<tr class="table-row"><td class="table-cell-colA">${row.colA}</td><td class="table-cell-colB">${row.colB}</td></tr>`).join('')}
                        </tbody>
                    </table>
                ` : ''}
                <div class="test1-options">
                    ${q.options.map((opt, optIdx) => {
                        let btnClass = 'test1-opt-btn';
                        if (solved && solved.selectedIndex === optIdx) {
                            btnClass += solved.status === 'correct' ? ' correct' : ' incorrect';
                        } else if (solved && solved.status !== 'correct' && optIdx === q.correctIndex) {
                            btnClass += ' correct';
                        }
                        return `<button class="${btnClass}" onclick="if(window.checkTest2Option) checkTest2Option(${q.id}, ${optIdx}, this)">
                            <span>${q.type === 'matching' ? '🎯 ' : String.fromCharCode(65 + optIdx) + '. '}${opt}</span>
                            ${solved && solved.selectedIndex === optIdx ? (solved.status === 'correct' ? '<span>[Correct]</span>' : '<span>[Incorrect]</span>') : ''}
                        </button>`;
                    }).join('')}
                </div>
                <div class="test1-explanation ${solved ? 'show' : ''}" id="test2-exp-${q.id}" style="border-left:4px solid var(--primary);">
                    <div class="test1-exp-title" style="color:var(--primary);font-weight:700;">💡 Official CSY3081 Detailed Solution & Proof (${q.pts} Pts):</div>
                    <div style="color:var(--text-primary);line-height:1.6;">${q.explanation}</div>
                </div>
            </div>
            `;
        });

        container.innerHTML = html; setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
        updateTest2ProgressUI(); setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
    } catch (err) {
        console.error("renderTest2Questions error:", err); window._lastRenderError = err.toString() + " at test2";
    }
}
window.renderTest2Questions = renderTest2Questions;

function checkTest2Option(qId, optIdx, btnEl) { setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);
    try {
        const q = window.test2Questions.find(x => x.id === qId);
        if (!q) return;

        const isCorrect = (optIdx === q.correctIndex);
        window.test2SolvedState[qId] = {
            status: isCorrect ? 'correct' : 'incorrect',
            selectedIndex: optIdx,
            pts: isCorrect ? q.pts : 0
        };
        localStorage.setItem('csy3081_test2_solved_v1', JSON.stringify(window.test2SolvedState));

        const card = document.getElementById(`test2-card-${qId}`);
        if (card) {
            const btns = card.querySelectorAll('.test1-opt-btn');
            btns.forEach((b, idx) => {
                b.classList.remove('correct', 'incorrect');
                if (idx === q.correctIndex) b.classList.add('correct');
                else if (idx === optIdx && !isCorrect) b.classList.add('incorrect');
            });

            const exp = document.getElementById(`test2-exp-${qId}`);
            if (exp) exp.classList.add('show');
        }

        updateTest2ProgressUI(); setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
        if (typeof showToast === 'function') {
            showToast(isCorrect ? `Spot on! +${q.pts} Points added to your Test 2 Assessment Score` : "× Incorrect. Review the code syntax / math proof below!");
        }
    } catch (err) {
        console.error("checkTest2Option error:", err);
    }
}
window.checkTest2Option = checkTest2Option;

function filterTest2Questions(filter, btnEl) {
    renderTest2Questions(filter, btnEl);
}
window.filterTest2Questions = filterTest2Questions;

function toggleAllTest2Explanations() {
    try {
        const exps = document.querySelectorAll('#test2-questions-container .test1-explanation');
        let anyHidden = false;
        exps.forEach(e => {
            if (!e.classList.contains('show')) anyHidden = true;
        });

        exps.forEach(e => {
            if (anyHidden) e.classList.add('show');
            else e.classList.remove('show');
        });

        const toggleBtn = document.getElementById('btn-toggle-test2-exp');
        if (toggleBtn) {
            toggleBtn.innerText = anyHidden ? "Hide All Solutions" : "Reveal All Explanations";
        }
        if (typeof showToast === 'function') {
            showToast(anyHidden ? "💡 Revealed all 36 Test 2 code fixes, math proofs, and answers!" : "Hidden Test 2 solutions.");
        }
    } catch (err) {
        console.error("toggleAllTest2Explanations error:", err);
    }
}
window.toggleAllTest2Explanations = toggleAllTest2Explanations;

function resetTest2Progress() {
    try {
        if (confirm("Are you sure you want to reset all solved Test 2 case studies & debugging scores back to 0?")) {
            window.test2SolvedState = {};
            localStorage.removeItem('csy3081_test2_solved_v1');
            renderTest2Questions(window.test2CurrentFilter || 'all');
            if (typeof showToast === 'function') showToast("Test 2 assessment score reset to 0/72 Pts!");
        }
    } catch (err) {
        console.error("resetTest2Progress error:", err);
    }
}
window.resetTest2Progress = resetTest2Progress;

function updateTest2ProgressUI() {
    try {
        const solvedCount = Object.keys(window.test2SolvedState || {}).length;
        let totalScore = 0;
        Object.values(window.test2SolvedState || {}).forEach(s => {
            if (s && s.status === 'correct') totalScore += (s.pts || 0);
        });

        const solvedVal = document.getElementById('test2-solved-val');
        const scoreVal = document.getElementById('test2-score-val');
        if (solvedVal) solvedVal.innerText = `${solvedCount}/36`;
        if (scoreVal) scoreVal.innerText = `${totalScore}/72 Pts`;
    } catch (err) {
        console.error("updateTest2ProgressUI error:", err);
    }
}
window.updateTest2ProgressUI = updateTest2ProgressUI;
