/* ==========================================================================
   CSY3081: AI CONCEPTS AND APPLICATIONS - UNIVERSITY OF NORTHAMPTON
   COMPLETE APPLICATION & INTERACTIVE LAB LOGIC (`app.js`) - BULLETPROOF v4
   ========================================================================== */

// --- STATE MANAGEMENT ---
let activeTab = 'dashboard';
let examMode = 'practice'; // 'practice' or 'exam'
let activeFilter = 'all';
let timerInterval = null;
let secondsRemaining = 1800; // 30 minutes
let solvedState = {};
try {
    solvedState = JSON.parse(localStorage.getItem('csy3081_solved_v1') || '{}');
} catch (e) {
    solvedState = {};
}

// --- QUESTION BANK (30 COMPLETE CSY3081 EXAM PREP QUESTIONS) ---
const QUESTION_BANK = [
    // --- FILL IN THE BLANK (4) ---
    {
        id: 'q1',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 1: Decision Tree Splitting Concept',
        text: 'The process of dividing an internal node into two or more child nodes in a Decision Tree is called ____________.',
        correctAnswer: 'splitting',
        acceptableAnswers: ['splitting', 'split', 'node splitting'],
        explanation: 'From <strong>Handson on Decision Tree.pdf</strong>: "Splitting: The process of dividing a node into two or more sub-nodes." Root node starts with all data, and splitting recursively partitions samples based on feature thresholds.'
    },
    {
        id: 'q2',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 2: Apriori Market Basket Lift Metric',
        text: 'In Market Basket Analysis, if the <strong>Lift</strong> metric between two items is equal to ____________, it indicates that the two items are completely independent of each other.',
        correctAnswer: '1',
        acceptableAnswers: ['1', '1.0', 'one'],
        explanation: 'From <strong>tutorial unsupervised learning (1).docx</strong>: "If a lift value is close to 1 then both the rules were completely independent. Lift computes the ratio of observed support to expected support under independence." Lift > 1 indicates positive co-occurrence.'
    },
    {
        id: 'q3',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 3: Scikit-Learn KMeans Centroids Attribute',
        text: 'When using Scikit-Learn\'s `KMeans` class, the 2D numpy array containing the coordinates of the final cluster centroids can be accessed via the attribute `kmeans.____________`.',
        correctAnswer: 'cluster_centers_',
        acceptableAnswers: ['cluster_centers_', 'cluster_centers'],
        explanation: 'From <strong>tutorial unsupervised learning (1).docx (Example 2)</strong>: After calling `kmeans.fit(X)`, you access `kmeans.cluster_centers_` to retrieve the $(K \times \text{n\_features})$ coordinates of the cluster centers.'
    },
    {
        id: 'q4',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 4: Preventing Cross-Validation Data Leakage',
        text: 'To prevent <strong>Data Leakage</strong> during cross-validation, preprocessing transformers (such as `SimpleImputer` and `StandardScaler`) should be combined with the estimator using a Scikit-Learn ____________.',
        correctAnswer: 'Pipeline',
        acceptableAnswers: ['pipeline', 'Pipeline', 'sklearn.pipeline.Pipeline'],
        explanation: 'From <strong>Handson on Decision Tree.pdf</strong>: Putting imputers and classifiers inside a `Pipeline` guarantees that statistics (like median or mean) are calculated *only* on the training folds during cross-validation.'
    },

    // --- TRUE / FALSE (5) ---
    {
        id: 'q5',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 5: Feature Scaling in Decision Trees',
        text: 'Decision Tree classifiers require input features to be standardized (e.g., using `StandardScaler`) before training because distance metrics between features determine the node splitting rules.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: 'From <strong>Handson on Decision Tree.pdf</strong>: "Observation: Decision trees require <strong>no feature scaling</strong> (normalization/standardization) because they split based on feature thresholds, not distance metrics."'
    },
    {
        id: 'q6',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 6: Softmax Probability Sum Guarantee',
        text: 'Unlike One-vs-Rest (OvR) logistic regression, Softmax regression guarantees that the predicted class probabilities across all mutually exclusive classes sum to exactly 1.0.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'A',
        explanation: 'From <strong>logistic softmax.docx</strong>: "Softmax: Probabilities are normalized via the softmax function, guaranteeing they sum to exactly 1.0." In OvR, probabilities are independent binary Sigmoids.'
    },
    {
        id: 'q7',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 7: Adjusted Rand Index (ARI) Interpretation',
        text: 'In `KMeans` clustering, if the `Adjusted Rand Index (ARI)` score between the unsupervised clusters and true ground-truth labels is `-0.005`, it indicates a near-perfect clustering performance.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: 'From <strong>tutorial unsupervised learning (1).docx</strong>: Adjusted Rand Index (`adjusted_rand_score`) ranges from `-1.0` to `+1.0`. A score near `0.0` or negative indicates chance-level/random splitting across clusters. Perfect agreement is `+1.0`.'
    },
    {
        id: 'q8',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 8: Tree Overfitting with max_depth=None',
        text: 'Setting `max_depth=None` in a `DecisionTreeClassifier` typically leads to high bias (underfitting) because the tree is not allowed to grow sufficiently deep.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: 'From <strong>Handson on Decision Tree.pdf</strong>: `max_depth=None` lets the tree grow without bounds until every leaf is pure ($100\%$ training accuracy), causing <strong>High Variance (Overfitting)</strong>.'
    },
    {
        id: 'q9',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 9: Naive Bayes Conditional Independence',
        text: 'The Naive Bayes classifier makes the "naive" assumption that all features are strongly correlated and dependent on each other when calculating conditional probabilities.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: 'From the <strong>Naive Bayes Curriculum</strong>: The Naive Bayes algorithm assumes that all input features $x_i$ are <strong>conditionally independent</strong> of each other given the class label $y$.'
    },

    // --- MULTIPLE CHOICE (10) ---
    {
        id: 'q10',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 10: Leaf Node Probability Vector Math',
        text: 'In a trained `DecisionTreeClassifier`, a specific leaf node contains `samples = 200` with class distribution `values = [20, 150, 30]`. If a test instance lands in this leaf node, what is the predicted output probability vector (`predict_proba`) and the predicted class label?',
        options: [
            { letter: 'A', text: 'Probabilities: [0.20, 1.50, 0.30], Predicted Class: Class 1' },
            { letter: 'B', text: 'Probabilities: [0.10, 0.75, 0.15], Predicted Class: Class 1' },
            { letter: 'C', text: 'Probabilities: [0.10, 0.75, 0.15], Predicted Class: Class 0' },
            { letter: 'D', text: 'Probabilities: [0.05, 0.85, 0.10], Predicted Class: Class 2' }
        ],
        correctOption: 'B',
        explanation: 'To compute node probability, divide class counts by total `samples`: $20/200 = 0.10$, $150/200 = 0.75$, and $30/200 = 0.15$. The majority class ($0.75$) is <strong>Class 1</strong>.'
    },
    {
        id: 'q11',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 11: Evaluation Metric for Imbalanced Data',
        text: 'Which of the following evaluation metrics is <strong>most appropriate</strong> for assessing a classification model on a heavily imbalanced dataset (e.g., detecting rare fraudulent transactions where 99.8% of cases are legitimate)?',
        options: [
            { letter: 'A', text: 'Accuracy Score' },
            { letter: 'B', text: 'Mean Squared Error (MSE)' },
            { letter: 'C', text: 'F1-Score' },
            { letter: 'D', text: 'Adjusted Rand Index (ARI)' }
        ],
        correctOption: 'C',
        explanation: 'On a 99.8% legitimate dataset, predicting "not fraud" every time achieves 99.8% accuracy but catches zero frauds. <strong>F1-Score</strong> (harmonic mean of Precision & Recall) evaluates real classification utility.'
    },
    {
        id: 'q12',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 12: Classifier vs Regressor Tree Splitting',
        text: 'What is the primary difference in splitting criteria between a `DecisionTreeClassifier` and a `DecisionTreeRegressor`?',
        options: [
            { letter: 'A', text: 'Classifiers use Mean Squared Error (MSE), whereas Regressors use Gini Impurity.' },
            { letter: 'B', text: 'Classifiers use Gini Impurity or Entropy, whereas Regressors use Mean Squared Error (MSE) or Variance Reduction.' },
            { letter: 'C', text: 'Classifiers split on continuous thresholds, whereas Regressors can only split on categorical values.' },
            { letter: 'D', text: 'Both classifiers and regressors use Gini Impurity by default.' }
        ],
        correctOption: 'B',
        explanation: 'From <strong>Handson on Decision Tree.pdf</strong>: Classification trees split to maximize class purity (<strong>Gini</strong> or <strong>Entropy</strong>), while Regression trees split to minimize target variance (<strong>MSE</strong> or MAE).'
    },
    {
        id: 'q13',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 13: Purpose of train_test_split random_state',
        text: 'Why do we use the `train_test_split` function with the `random_state` parameter set to a fixed integer (e.g., `random_state=42`)?',
        options: [
            { letter: 'A', text: 'To automatically eliminate all missing values in the dataset.' },
            { letter: 'B', text: 'To ensure that the exact same random partition of training and testing data is generated every time the code is executed, allowing reproducible model evaluation.' },
            { letter: 'C', text: 'To force the model to convert unsupervised data into supervised classification data.' },
            { letter: 'D', text: 'To increase the total number of training samples by 42%.' }
        ],
        correctOption: 'B',
        explanation: 'Setting a fixed seed (`random_state=42`) guarantees exact reproducibility of the pseudo-random data split across different runs or across collaborative team members.'
    },
    {
        id: 'q14',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 14: 1D Decision Tree Regression Curve Shape',
        text: 'You train a `DecisionTreeRegressor` on the California Housing dataset using only the `Median Income` feature (`max_depth=3`). When you plot the prediction curve across a continuous range of income values (`X_plot`), what shape does the prediction line take?',
        options: [
            { letter: 'A', text: 'A smooth, continuous parabolic curve that extrapolates infinitely beyond the training data.' },
            { letter: 'B', text: 'A straight diagonal line representing the normal equation slope.' },
            { letter: 'C', text: 'A step function (series of flat horizontal segments) because every leaf node predicts the average target value of samples inside that leaf.' },
            { letter: 'D', text: 'A sinusoidal wave alternating between 0 and 1.' }
        ],
        correctOption: 'C',
        explanation: 'From <strong>Handson on Decision Tree.pdf (Activity 2)</strong>: "Visual Insight: The 1D plot reveals a core characteristic of decision tree regression: the predictions form a <strong>step function</strong>. It cannot extrapolate beyond training data bounds."'
    },
    {
        id: 'q15',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 15: Random Forest Bagging Mechanism',
        text: 'How does a `RandomForestClassifier` reduce the variance and overfitting typically associated with single Decision Trees?',
        options: [
            { letter: 'A', text: 'By forcing every tree in the ensemble to split on the exact same feature at every node.' },
            { letter: 'B', text: 'By training multiple uncorrelated decision trees on random bootstrap sample subsets (Bagging) and random feature subsets, then averaging their votes.' },
            { letter: 'C', text: 'By converting decision trees into linear regression equations using the normal equation.' },
            { letter: 'D', text: 'By automatically eliminating all categorical variables in the dataset.' }
        ],
        correctOption: 'B',
        explanation: 'From the <strong>Random Forest module</strong>: Random Forest uses Bootstrap Aggregation (Bagging) combined with random feature selection ($\sqrt{n\_features}$) at each split to create diverse trees whose errors cancel out when averaged.'
    },
    {
        id: 'q16',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 16: KNN Distance Sensitivity & Scaling',
        text: 'Why is feature scaling (`StandardScaler` or `MinMaxScaler`) considered strictly mandatory before applying K-Nearest Neighbours (`KNN`)?',
        options: [
            { letter: 'A', text: 'Because KNN calculates Euclidean or Manhattan distance between feature vectors; without scaling, features with large numerical ranges (e.g., Annual Income $100,000 vs Age 30) completely dominate the distance metric.' },
            { letter: 'B', text: 'Because Scikit-Learn will throw a fatal syntax error if unscaled data is passed to `KNeighborsClassifier`.' },
            { letter: 'C', text: 'Because KNN is an unsupervised clustering algorithm that requires probabilities summing to 1.0.' },
            { letter: 'D', text: 'Feature scaling is NOT required for KNN.' }
        ],
        correctOption: 'A',
        explanation: 'From the <strong>KNN module</strong>: Since KNN assigns classes based strictly on geometric distances ($\sqrt{\sum \Delta x^2}$), unscaled features with large magnitudes overshadow smaller numerical features.'
    },
    {
        id: 'q17',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 17: Support Vector Machine (SVM) Kernel Trick',
        text: 'In Support Vector Machines, what is the primary purpose of the <strong>Kernel Trick</strong> (`kernel="rbf"` or `kernel="poly"`) when dealing with non-linearly separable classification data?',
        options: [
            { letter: 'A', text: 'To delete all data points that fall inside the decision margin.' },
            { letter: 'B', text: 'To implicitly map 2D/3D non-linearly separable features into a higher-dimensional feature space where a linear separating hyperplane can easily divide the classes.' },
            { letter: 'C', text: 'To convert multiclass classification problems into unsupervised K-Means clusters.' },
            { letter: 'D', text: 'To speed up training by dropping 50% of the training dataset.' }
        ],
        correctOption: 'B',
        explanation: 'From the <strong>SVM module</strong>: The Kernel trick computes dot products in high-dimensional space without explicitly projecting the data, allowing linear hyperplanes to separate non-linear boundaries cleanly.'
    },
    {
        id: 'q18',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 18: Reinforcement Learning Exploration vs Exploitation',
        text: 'In Reinforcement Learning, an agent must balance <strong>Exploitation</strong> vs. <strong>Exploration</strong>. What does <strong>Exploration</strong> mean in this context?',
        options: [
            { letter: 'A', text: 'Executing the known action that currently yields the highest immediate reward.' },
            { letter: 'B', text: 'Trying new or lesser-tried actions to discover states that might yield much higher long-term cumulative rewards.' },
            { letter: 'C', text: 'Deleting the Q-table when negative rewards occur.' },
            { letter: 'D', text: 'Splitting the environment into supervised training and testing folds.' }
        ],
        correctOption: 'B',
        explanation: 'From the <strong>Reinforcement Learning module</strong>: Exploration means testing new actions to discover optimal paths, while Exploitation means leveraging currently known rewards.'
    },
    {
        id: 'q19',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 19: Core Limitations of Machine Learning',
        text: 'Which of the following is highlighted as one of the <strong>5 Core Limitations of Machine Learning</strong>?',
        options: [
            { letter: 'A', text: 'Machine learning algorithms cannot process numerical floating-point numbers.' },
            { letter: 'B', text: 'Absolute dependency on data quality ("Garbage In, Garbage Out"), algorithmic bias, and the lack of interpretability inside black-box models.' },
            { letter: 'C', text: 'Machine learning models always achieve 100% accuracy on unseen test data.' },
            { letter: 'D', text: 'Scikit-Learn models cannot be deployed on cloud servers.' }
        ],
        correctOption: 'B',
        explanation: 'From the <strong>Limitations of ML module</strong>: The course explicitly emphasizes data dependency, bias/fairness, black-box unexplainability, overfitting risks, and high computing cost as core industry limitations.'
    },

    // --- PYTHON & SCIKIT-LEARN CODE SYNTAX (6) ---
    {
        id: 'q20',
        type: 'code',
        category: 'code',
        points: 2,
        title: 'Question 20: Scikit-Learn Evaluation Generalization Data',
        text: 'Look at the following Python code using Scikit-Learn:\n\nIf your goal is to evaluate the trained model\'s generalization accuracy on the <strong>unseen evaluation data</strong>, what variable should replace the question mark `?` inside `model.predict(?)`?',
        codeSnippet: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression(multi_class='multinomial', solver='lbfgs')
model.fit(X_train, y_train)

y_pred = model.predict(?)`,
        options: [
            { letter: 'A', text: 'y_test' },
            { letter: 'B', text: 'X_train' },
            { letter: 'C', text: 'X_test' },
            { letter: 'D', text: 'y_train' }
        ],
        correctOption: 'C',
        explanation: 'To test how well a model generalizes after calling `.fit(X_train, y_train)`, you pass the testing feature set <strong>`X_test`</strong> into `.predict(X_test)` and compare against `y_test`.'
    },
    {
        id: 'q21',
        type: 'code',
        category: 'code',
        points: 2,
        title: 'Question 21: Softmax predict_proba Output Format',
        text: 'You train a Softmax regression model (`log_reg_softmax`) on the 3-class Iris flower dataset (Classes: 0=Setosa, 1=Versicolor, 2=Virginica). What is the expected shape and format of the output when you execute `print(log_reg_softmax.predict_proba([[5.1, 3.5, 1.4, 0.2]]))`?',
        options: [
            { letter: 'A', text: 'A 1D array containing a single integer class label: [0]' },
            { letter: 'B', text: 'A 2D array of 3 probabilities summing to 1.0: [[0.98, 0.01, 0.01]]' },
            { letter: 'C', text: 'A 2D array of 3 class indices: [[0, 1, 2]]' },
            { letter: 'D', text: 'A continuous numerical house price value: [[245.8]]' }
        ],
        correctOption: 'B',
        explanation: 'From <strong>logistic softmax.docx</strong>: `.predict_proba()` on a 3-class problem returns a $(1 \times 3)$ 2D numpy array containing softmax-normalized probabilities `[[P(c0), P(c1), P(c2)]]` which sum to `1.0`.'
    },
    {
        id: 'q22',
        type: 'code',
        category: 'code',
        points: 2,
        title: 'Question 22: Scikit-Learn KMeans Initialization Syntax',
        text: 'Which of the following Scikit-Learn code snippets correctly initializes an <strong>unsupervised clustering</strong> model to group the diabetes dataset features into <strong>4 distinct clusters</strong>?',
        options: [
            { letter: 'A', text: 'model = KMeans(n_clusters=4, random_state=0).fit(X)' },
            { letter: 'B', text: 'model = DecisionTreeClassifier(max_depth=4).fit(X, y)' },
            { letter: 'C', text: 'model = LogisticRegression(multi_class="ovr").fit(X, y)' },
            { letter: 'D', text: 'model = make_blobs(n_samples=100, centers=4)' }
        ],
        correctOption: 'A',
        explanation: 'Option A initializes `KMeans` with `n_clusters=4` and fits on features `X`. Options B & C are supervised classifiers requiring `y`. Option D generates synthetic sample data.'
    },
    {
        id: 'q23',
        type: 'code',
        category: 'code',
        points: 2,
        title: 'Question 23: ColumnTransformer Numerical Imputation',
        text: 'Look at the following `ColumnTransformer` definition from the `Handson on Decision Tree.pdf` pipeline:\n\nWhat does the `("num", SimpleImputer(strategy="median"), num_cols)` tuple instruct the preprocessor to do during training (`fit_transform`)?',
        codeSnippet: `preprocessor = ColumnTransformer(transformers=[
    ('num', SimpleImputer(strategy='median'), num_cols),
    ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)
])`,
        options: [
            { letter: 'A', text: 'It drops all columns listed in num_cols if they contain any median values.' },
            { letter: 'B', text: 'It replaces all missing (NaN) values inside the numerical columns (num_cols) with the median of each respective column.' },
            { letter: 'C', text: 'It converts numerical columns into categorical string variables.' },
            { letter: 'D', text: 'It computes the median of categorical columns and encodes them using one-hot encoding.' }
        ],
        correctOption: 'B',
        explanation: 'In `ColumnTransformer`, `(\'num\', SimpleImputer(strategy=\'median\'), num_cols)` targets the numerical features specified in `num_cols` and imputes any missing values (`NaN`) using the median of the respective column.'
    },
    {
        id: 'q24',
        type: 'code',
        category: 'code',
        points: 2,
        title: 'Question 24: Random Forest n_estimators Syntax',
        text: 'Which of the following Scikit-Learn statements correctly initializes a <strong>Random Forest Classifier</strong> composed of exactly <strong>150 bootstrap decision trees</strong> with a fixed random seed of `42`?',
        options: [
            { letter: 'A', text: 'rf = RandomForestClassifier(n_estimators=150, random_state=42)' },
            { letter: 'B', text: 'rf = DecisionTreeClassifier(max_depth=150, random_state=42)' },
            { letter: 'C', text: 'rf = KNeighborsClassifier(n_neighbors=150)' },
            { letter: 'D', text: 'rf = SVC(kernel="150", C=42)' }
        ],
        correctOption: 'A',
        explanation: 'In Scikit-Learn\'s `RandomForestClassifier`, the `n_estimators` parameter defines exactly how many decision trees are built inside the ensemble.'
    },
    {
        id: 'q25',
        type: 'code',
        category: 'code',
        points: 2,
        title: 'Question 25: KNN Distance Metric Specification',
        text: 'In Scikit-Learn\'s `KNeighborsClassifier`, which parameter value tuple correctly specifies using <strong>Euclidean distance ($L_2$)</strong> with $K=5$ neighbors?',
        options: [
            { letter: 'A', text: 'KNeighborsClassifier(n_neighbors=5, metric="minkowski", p=2)' },
            { letter: 'B', text: 'KNeighborsClassifier(n_neighbors=5, metric="manhattan", p=1)' },
            { letter: 'C', text: 'KNeighborsClassifier(n_clusters=5, criterion="gini")' },
            { letter: 'D', text: 'KNeighborsClassifier(n_neighbors=5, solver="lbfgs")' }
        ],
        correctOption: 'A',
        explanation: 'In `KNeighborsClassifier`, the default distance metric is `minkowski`. When `p=2`, Minkowski distance equals exact Euclidean distance ($\sqrt{\sum \Delta x^2}$). When `p=1`, it equals Manhattan distance.'
    },

    // --- MATCHING (2) ---
    {
        id: 'q26',
        type: 'matching',
        category: 'matching',
        points: 3,
        title: 'Question 26: Comprehensive Applied ML Paradigms Matching',
        text: 'Match each machine learning concept on the left with its exact real-world description or definition from your CSY3081 course on the right:',
        matchingPairs: [
            { id: 'm1', left: '1. Unsupervised Learning', correctRight: 'B. Grouping customers by purchasing habits without target labels.' },
            { id: 'm2', left: '2. Softmax Regression', correctRight: 'C. Multiclass model outputting normalized probabilities summing to 1.0.' },
            { id: 'm3', left: '3. Reinforcement Learning', correctRight: 'A. Robot learning to play games via interactions with environment.' },
            { id: 'm4', left: '4. Regression Task', correctRight: 'D. Predicting continuous numerical values like median house value.' },
            { id: 'm5', left: '5. Semi-Supervised Learning', correctRight: 'E. Training data includes a small portion of labeled data and lots of unlabeled data.' }
        ],
        rightOptions: [
            'A. Robot learning to play games via interactions with environment.',
            'B. Grouping customers by purchasing habits without target labels.',
            'C. Multiclass model outputting normalized probabilities summing to 1.0.',
            'D. Predicting continuous numerical values like median house value.',
            'E. Training data includes a small portion of labeled data and lots of unlabeled data.'
        ],
        explanation: 'These exact definitions form the core paradigm distinctions covered in <strong>Section 1 & 2</strong> of your CSY3081 curriculum!'
    },
    {
        id: 'q27',
        type: 'matching',
        category: 'matching',
        points: 3,
        title: 'Question 27: Supervised Algorithms & Math Matching',
        text: 'Match each supervised classification or regression algorithm with its core mathematical principle or splitting criterion:',
        matchingPairs: [
            { id: 'am1', left: '1. Decision Tree', correctRight: 'B. Splits internal nodes to maximize purity via Gini Impurity ($1 - \\sum p_i^2$).' },
            { id: 'am2', left: '2. K-Nearest Neighbours (KNN)', correctRight: 'C. Lazy learning that assigns class based on majority vote of $K$ closest geometric neighbors.' },
            { id: 'am3', left: '3. Naive Bayes Classifier', correctRight: 'A. Uses Bayes Theorem $P(y|X)$ assuming all features are conditionally independent.' },
            { id: 'am4', left: '4. Support Vector Machine (SVM)', correctRight: 'D. Finds the maximum margin hyperplane separating classes, using Kernel trick when non-linear.' }
        ],
        rightOptions: [
            'A. Uses Bayes Theorem $P(y|X)$ assuming all features are conditionally independent.',
            'B. Splits internal nodes to maximize purity via Gini Impurity ($1 - \\sum p_i^2$).',
            'C. Lazy learning that assigns class based on majority vote of $K$ closest geometric neighbors.',
            'D. Finds the maximum margin hyperplane separating classes, using Kernel trick when non-linear.'
        ],
        explanation: 'These core mathematical mechanisms define the 4 main supervised classification families (, , , and ).'
    },

    // --- DEBUGGING SCENARIOS (3) ---
    {
        id: 'q28',
        type: 'scenario',
        category: 'scenario',
        points: 4,
        title: 'Question 28 (4 Points): Supervised Pipeline Debugging Scenario',
        text: 'A junior data scientist attempts to build an end-to-end classification pipeline to predict customer churn using numerical (`num_cols`) and categorical (`cat_cols`) features. They write the following script using Scikit-Learn:\n\nIdentify the option that correctly lists the <strong>three major conceptual/methodological flaws</strong> in this code:',
        codeSnippet: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

df = pd.read_csv("customer_churn.csv")
X = df.drop("churn", axis=1)
y = df["churn"]

# Step A: Impute missing values on ENTIRE dataset before splitting
imputer = SimpleImputer(strategy="median")
X_imputed = imputer.fit_transform(X)

# Step B: Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.2, random_state=42)

# Step C: Train classifier and predict on training data
model = DecisionTreeClassifier(max_depth=None, random_state=42)
model.fit(X_train, y_train)

# Step D: Evaluate performance
y_pred = model.predict(y_test)
print(f"Accuracy: \${accuracy_score(X_test, y_pred)}")`,
        options: [
            { letter: 'A', text: '1. DecisionTreeClassifier requires feature scaling. 2. SimpleImputer cannot use strategy="median". 3. train_test_split should take y_imputed.' },
            { letter: 'B', text: '1. Data Leakage in Step A (`fit_transform` on whole dataset before splitting). 2. Wrong input inside predict() in Step D (`y_test` instead of `X_test`). 3. Wrong arguments inside accuracy_score() in Step D (`X_test` instead of `y_test`).' },
            { letter: 'C', text: '1. max_depth=None is illegal syntax in Scikit-Learn. 2. train_test_split requires test_size=0.8. 3. model.fit() must take X_test and y_test during training.' },
            { letter: 'D', text: '1. SimpleImputer can only be used inside unsupervised learning models. 2. DecisionTreeClassifier predicts continuous variables. 3. axis=1 in df.drop deletes rows instead of columns.' }
        ],
        correctOption: 'B',
        explanation: 'From <strong>Handson on Decision Tree.pdf</strong>: <strong>Flaw 1 (Leakage):</strong> Imputing before splitting leaks test data median into training. <strong>Flaw 2 (`predict` arg):</strong> `.predict(X_test)` takes feature vectors, not labels. <strong>Flaw 3 (`accuracy_score` args):</strong> `.accuracy_score(y_test, y_pred)` compares true vs predicted labels.'
    },
    {
        id: 'q29',
        type: 'scenario',
        category: 'scenario',
        points: 4,
        title: 'Question 29 (4 Points): K-Means & Unsupervised Evaluation Debugging',
        text: 'You are working with a retail company\'s transactions (`Online_Retail.xlsx`). Your manager asks you to run <strong>K-Means clustering</strong> to group customers by `Age` and `Annual Income`, and you write this code snippet:\n\nIdentify the <strong>two primary reasons</strong> why evaluating (`accuracy_score` against `Age`) is conceptually and mathematically wrong:',
        codeSnippet: `from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score

X_customers = customer_data[['Age', 'Annual_Income']]

# Initialize and fit K-Means without setting n_clusters
kmeans = KMeans()
kmeans.fit(X_customers)

# Evaluate accuracy against Age
clusters = kmeans.predict(X_customers)
acc = accuracy_score(customer_data['Age'], clusters)`,
        options: [
            { letter: 'A', text: '1. KMeans output cluster IDs (`0, 1, 2...`) are arbitrary group numbers and cannot be directly compared against continuous numerical features (`Age`) using accuracy_score. 2. To evaluate unsupervised clustering similarity against ground truth, you must use metrics like Adjusted Rand Index (ARI).' },
            { letter: 'B', text: '1. KMeans can only be trained on categorical one-hot encoded strings. 2. accuracy_score requires kmeans.cluster_centers_ as its first argument.' },
            { letter: 'C', text: '1. KMeans automatically performs regression, requiring MSE. 2. You must call train_test_split before running any unsupervised clustering algorithm.' },
            { letter: 'D', text: '1. KMeans requires target label y inside .fit(X_customers, y). 2. Age must be divided by Annual_Income before calculating accuracy.' }
        ],
        correctOption: 'A',
        explanation: 'From <strong>tutorial unsupervised learning (1).docx (Example 2)</strong>: Unsupervised cluster IDs (`labels_`) are arbitrary ($0, 1, ...$). Comparing them against continuous variables like `Age` with `accuracy_score()` is meaningless. You evaluate clustering similarity against true classes using <strong>Adjusted Rand Index (ARI)</strong> (`metrics.adjusted_rand_score`).'
    },
    {
        id: 'q30',
        type: 'scenario',
        category: 'scenario',
        points: 4,
        title: 'Question 30 (4 Points): KNN Distance Scaling Debugging Scenario',
        text: 'You build a `KNeighborsClassifier(n_neighbors=5)` to classify medical diagnosis records based on `White Blood Cell Count` (range: 4,000 to 11,000) and `Body Temperature` (range: 36.5 to 39.5). When evaluated, your model achieves poor accuracy because `White Blood Cell Count` dominates all Euclidean distance calculations.\n\nIdentify the exact Scikit-Learn solution required to fix this geometric dominance problem:',
        codeSnippet: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X = patient_data[['wbc_count', 'temperature']]
y = patient_data['diagnosis']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# MISSING STEP: Apply mandatory feature scaling before KNN training!
# How should scaler = StandardScaler() be correctly applied?`,
        options: [
            { letter: 'A', text: 'scaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train)\nX_test_scaled = scaler.transform(X_test)\nknn = KNeighborsClassifier(n_neighbors=5).fit(X_train_scaled, y_train)' },
            { letter: 'B', text: 'scaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\nX_train, X_test = train_test_split(X_scaled)' },
            { letter: 'C', text: 'knn = KNeighborsClassifier(n_neighbors=5, metric="gini").fit(X_train, y_train)' },
            { letter: 'D', text: 'Delete wbc_count from the dataset entirely.' }
        ],
        correctOption: 'A',
        explanation: 'Option A correctly fits `StandardScaler` only on `X_train` (`fit_transform`) and transforms `X_test` (`transform`), eliminating distance dominance without leaking validation fold statistics into training.'
    },
    {
        id: 'q31',
        type: 'true-false',
        category: 'true-false',
        points: 2,
        title: 'Question 31 (2 Points): Linear Regression Target Variable Type',
        text: `Linear regression can be used to predict continuous numerical values.`,
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'A',
        explanation: `Linear regression models the linear relationship between one or more independent features ($X$) and a continuous target variable ($Y$). Examples include predicting house prices, stock values, or temperature.<br><br><strong>💡 Exam & Interview Tip:</strong> Remember the rule of thumb: <strong>Regression $\\rightarrow$ Continuous output</strong> (numbers), <strong>Classification $\\rightarrow$ Categorical output</strong> (classes/labels).`
    },
    {
        id: 'q32',
        type: 'true-false',
        category: 'true-false',
        points: 2,
        title: 'Question 32 (2 Points): Logistic Regression Sigmoid Range',
        text: `In logistic regression, the sigmoid function outputs values between 0 and 1.`,
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'A',
        explanation: `The sigmoid (logistic) function is defined mathematically as $\\sigma(z) = \\frac{1}{1 + e^{-z}}$. No matter how large or small the input $z$ is ($-\\infty < z < +\\infty$), the output is squashed precisely into the open interval $(0, 1)$, allowing it to be interpreted directly as a probability in binary classification.<br><br><strong>💡 Exam & Interview Tip:</strong> If $z \\to +\\infty$, $\\sigma(z) \\to 1$. If $z \\to -\\infty$, $\\sigma(z) \\to 0$. If $z = 0$, $\\sigma(z) = 0.5$.`
    },
    {
        id: 'q33',
        type: 'true-false',
        category: 'true-false',
        points: 2,
        title: 'Question 33 (2 Points): Decision Trees Problem Scope',
        text: `Decision Trees can only be used for classification problems.`,
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: `Decision Trees can be used for both <strong>Classification</strong> (predicting categorical labels) and <strong>Regression</strong> (predicting continuous numerical averages). Together, they are known formally as <strong>CART</strong> (*Classification And Regression Trees*).<br><br><strong>💡 Exam & Interview Tip:</strong> When asked how splits are evaluated: Classification trees use <strong>Entropy/Information Gain or Gini Impurity</strong>, while Regression trees use <strong>Variance Reduction / Mean Squared Error (MSE)</strong>.`
    },
    {
        id: 'q34',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 34 (2 Points): K-Means Unsupervised Grouping Terminology',
        text: `In K-means clustering, the algorithm groups data into ______`,
        options: [
            { letter: 'A', text: 'Clusters' },
            { letter: 'B', text: 'Groups' },
            { letter: 'C', text: 'Class' },
            { letter: 'D', text: 'all of above' }
        ],
        correctOption: 'A',
        explanation: `K-means is an <strong>unsupervised learning</strong> algorithm whose primary purpose is to partition unlabeled data points into $K$ distinct <strong>clusters</strong> based on spatial feature similarity. ("Classes" are pre-labeled categories in supervised learning).<br><br><strong>💡 Exam & Interview Tip:</strong> Always distinguish terminology rigorously: <strong>Clusters</strong> = Unsupervised (discovered structure), <strong>Classes</strong> = Supervised (pre-defined labels).`
    },
    {
        id: 'q35',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 35 (2 Points): Linear Equation Regression Type',
        text: `The equation $y = wx + b$ represents ______ regression.`,
        options: [
            { letter: 'A', text: 'logistic' },
            { letter: 'B', text: 'polynomial' },
            { letter: 'C', text: 'softmax' },
            { letter: 'D', text: 'linear' }
        ],
        correctOption: 'D',
        explanation: `$y = wx + b$ is the algebraic equation of a straight line, representing <strong>Simple Linear Regression</strong> where $w$ is the Weight (Slope / Gradient coefficient) and $b$ is the Bias (Y-intercept).<br><br><strong>💡 Exam & Interview Tip:</strong> If you see higher powers/exponents on $x$ (e.g., $y = w_1x + w_2x^2 + b$), it becomes <strong>Polynomial Regression</strong>.`
    },
    {
        id: 'q36',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 36 (2 Points): Sigmoid Output at Zero Input',
        text: `What does the sigmoid function output for an input value of 0?`,
        options: [
            { letter: 'A', text: '0' },
            { letter: 'B', text: '0.5' },
            { letter: 'C', text: '1' },
            { letter: 'D', text: '-1' }
        ],
        correctOption: 'B',
        explanation: `Substituting $z = 0$ directly into the sigmoid formula: $\\sigma(0) = \\frac{1}{1 + e^{-0}} = \\frac{1}{1 + 1} = \\frac{1}{2} = 0.5$.<br><br><strong>💡 Exam & Interview Tip:</strong> $0.5$ is the standard <strong>decision threshold</strong> in binary logistic regression ($P \\ge 0.5 \\implies \\text{Class 1}$).`
    },
    {
        id: 'q37',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 37 (2 Points): Robotic Arm Reward & Penalty Paradigm',
        text: `A robotic arm learns to grasp objects by receiving a reward when it successfully picks up an item and a penalty when it drops it. This is an example of:`,
        options: [
            { letter: 'A', text: 'Supervised learning' },
            { letter: 'B', text: 'Unsupervised Learning' },
            { letter: 'C', text: 'Reinforcement learning' },
            { letter: 'D', text: 'Semi supervised learning' }
        ],
        correctOption: 'C',
        explanation: `<strong>Reinforcement Learning (RL)</strong> involves an <strong>agent</strong> taking dynamic actions inside an <strong>environment</strong> to maximize cumulative <strong>rewards</strong> through trial-and-error feedback signals.<br><br><strong>💡 Exam & Interview Tip:</strong> Look for classic keywords: *Agent, Environment, State, Action, Reward, Penalty, Policy, Trial-and-error*. If these appear together, the answer is almost always Reinforcement Learning.`
    },
    {
        id: 'q38',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 38 (2 Points): Multi-class Probability Vector Decision',
        text: `In a multi-class classification problem with 5 classes, if a model outputs the following probabilities for a sample: [0.45, 0.10, 0.30, 0.10, 0.05], what is the predicted class?`,
        options: [
            { letter: 'A', text: '0' },
            { letter: 'B', text: '1' },
            { letter: 'C', text: '2' },
            { letter: 'D', text: '3' }
        ],
        correctOption: 'A',
        explanation: `Classification models select the class corresponding to the highest probability slot ($\\arg\\max$). Comparing the values across each index: Index 0 has <strong>0.45 (Highest)</strong>, Index 1 is 0.10, Index 2 is 0.30, Index 3 is 0.10, and Index 4 is 0.05.<br><br><strong>💡 Exam & Interview Tip:</strong> Remember that Python arrays and Scikit-Learn class output probabilities are strictly <strong>0-indexed</strong>. The first item (index 0) corresponds to Class 0!`
    },
    {
        id: 'q39',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 39 (2 Points): Evaluation Metric for Imbalanced Classification',
        text: `Which of the following evaluation metrics is MOST appropriate for a classification problem with highly imbalanced classes?`,
        options: [
            { letter: 'A', text: 'Accuracy' },
            { letter: 'B', text: 'F1-Score' },
            { letter: 'C', text: 'Mean Squared Error' },
            { letter: 'D', text: 'R-squared' }
        ],
        correctOption: 'B',
        explanation: `In imbalanced datasets (e.g., 99% benign, 1% fraud), <strong>Accuracy</strong> is deeply deceptive because a naive model predicting only the majority class achieves 99% accuracy while missing every single fraud case. <strong>F1-Score</strong> is the harmonic mean of Precision and Recall, ensuring both false positives and false negatives on the critical minority class are accounted for.<br><br><strong>💡 Exam & Interview Tip:</strong> <strong>Never use Accuracy for imbalanced datasets.</strong> Always choose <strong>F1-Score</strong>, <strong>PR-AUC (Precision-Recall AUC)</strong>, or <strong>ROC-AUC</strong>.`
    },
    {
        id: 'q40',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 40 (2 Points): Binary Classification Precision Calculation',
        text: `In a binary classification problem, a model has True Positives = 80, False Positives = 20, True Negatives = 180, and False Negatives = 20. What is the Precision of the model?`,
        options: [
            { letter: 'A', text: '0.8' },
            { letter: 'B', text: '0.9' },
            { letter: 'C', text: '0.85' },
            { letter: 'D', text: '0.75' }
        ],
        correctOption: 'A',
        explanation: `$\\text{Precision} = \\frac{TP}{TP + FP} = \\frac{80}{80 + 20} = \\frac{80}{100} = 0.8$.<br><br><strong>💡 Exam & Interview Tip:</strong> <strong>Precision</strong> ($TP / (TP+FP)$) answers: Out of all *predicted* positives, how many were actually positive? <strong>Recall</strong> ($TP / (TP+FN)$) answers: Out of all *actual* positives, how many did our model catch?`
    },
    {
        id: 'q41',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 41 (2 Points): Centroid Initialization Sensitivity',
        text: `Which of the following algorithms is MOST sensitive to the initial placement of cluster centers?`,
        options: [
            { letter: 'A', text: 'Hierarchical Clustering' },
            { letter: 'B', text: 'DBSCAN' },
            { letter: 'C', text: 'K-means' },
            { letter: 'D', text: 'Gaussian Mixture Models' }
        ],
        correctOption: 'C',
        explanation: `Standard K-means initializes $K$ centroids uniformly at random. Poor random placement can cause the algorithm to get stuck in poor <strong>local minima</strong>, yielding suboptimal clustering results depending purely on initial seed placement.<br><br><strong>💡 Exam & Interview Tip:</strong> This exact weakness is why <strong>K-means++</strong> was developed! K-means++ spreads out the initial centroids using a probabilistic distance-weighted heuristic to guarantee fast convergence and optimal clustering.`
    },
    {
        id: 'q42',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 42 (2 Points): Within-Cluster Sum of Squares (WCSS) Minimization',
        text: `In K-means clustering, the Within-Cluster Sum of Squares (WCSS) is minimized when:`,
        options: [
            { letter: 'A', text: 'Clusters are as large as possible' },
            { letter: 'B', text: 'Clusters are as small and compact as possible' },
            { letter: 'C', text: 'All data points are in a single cluster' },
            { letter: 'D', text: 'Centroids are placed at infinity' }
        ],
        correctOption: 'B',
        explanation: `WCSS (also known as <strong>Inertia</strong>) measures the total sum of squared Euclidean distances between data points and their assigned cluster centroid: $\\text{WCSS} = \\sum_{k=1}^{K} \\sum_{x \\in C_k} \\|x - \\mu_k\\|^2$. Minimizing this variance ensures every cluster is tightly and compactly packed together around its center.<br><br><strong>💡 Exam & Interview Tip:</strong> WCSS strictly decreases as $K$ increases. At the extreme where $K = n$, WCSS reaches exactly $0$.`
    },
    {
        id: 'q43',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 43 (2 Points): Incompatible Distance Metrics for K-Means',
        text: `Which of the following distance metrics is NOT appropriate for K-means clustering?`,
        options: [
            { letter: 'A', text: 'Euclidean Distance' },
            { letter: 'B', text: 'Manhattan Distance' },
            { letter: 'C', text: 'Cosine Similarity' },
            { letter: 'D', text: 'Hamming Distance for categorical data' }
        ],
        correctOption: 'D',
        explanation: `The "means" in K-means requires computing the <strong>continuous arithmetic average</strong> of coordinate vectors at every iteration. Categorical data does not have a mathematical average (e.g., what is the "mean" of Red and Blue?). Therefore, Euclidean/continuous metrics work with K-means, while categorical data requires <strong>K-modes</strong> with Hamming distance.<br><br><strong>💡 Exam & Interview Tip:</strong> For datasets containing mixed features (both numerical and categorical columns), the standard algorithm to use is <strong>K-prototypes</strong>.`
    },
    {
        id: 'q44',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 44 (2 Points): R-Squared (R²) Metric Interpretation',
        text: `In linear regression, if a model has an R² value of 0.85, what does this indicate?`,
        options: [
            { letter: 'A', text: '85% of the variance in the target variable is explained by the model' },
            { letter: 'B', text: '15% of the variance in the target variable is explained by the model' },
            { letter: 'C', text: 'The model has 85% accuracy' },
            { letter: 'D', text: 'The model has 85% error rate' }
        ],
        correctOption: 'A',
        explanation: `The Coefficient of Determination ($R^2$) represents the exact proportion of total variance in the dependent variable ($Y$) that can be predicted from the independent feature(s) ($X$).<br><br><strong>💡 Exam & Interview Tip:</strong> $R^2$ ranges from $-\\infty$ (for arbitrarily bad regression models) to $1.0$ (perfect prediction). A dummy baseline model that simply predicts the average $\\bar{y}$ every time gets exactly $R^2 = 0$.`
    },
    {
        id: 'q45',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 45 (2 Points): High Polynomial Degree on Small Datasets',
        text: `In polynomial regression, if the degree is increased from 2 to 10 on a small dataset, what is MOST likely to happen?`,
        options: [
            { letter: 'A', text: 'Both training and test error decrease' },
            { letter: 'B', text: 'Training error decreases, test error increases' },
            { letter: 'C', text: 'Training error increases, test error decreases' },
            { letter: 'D', text: 'Both training and test error increase' }
        ],
        correctOption: 'B',
        explanation: `Increasing the polynomial degree to 10 gives the model extreme flexibility, causing it to <strong>overfit</strong> (memorizing random sample noise and exact outliers). This causes training error to drop toward zero while generalization error on unseen validation/test data spikes dramatically.<br><br><strong>💡 Exam & Interview Tip:</strong> High polynomial degree $\\rightarrow$ High model complexity $\\rightarrow$ <strong>High Variance / Low Bias</strong> (Overfitting).`
    },
    {
        id: 'q46',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 46 (2 Points): Value-Based RL Q-Value Q(s, a) Definition',
        text: `In value-based reinforcement learning, the Q-value Q(s, a) represents:`,
        options: [
            { letter: 'A', text: 'The immediate reward for taking action a in state s' },
            { letter: 'B', text: 'The expected cumulative reward for taking action a in state s and following the optimal policy thereafter' },
            { letter: 'C', text: 'The probability of taking action a in state s' },
            { letter: 'D', text: 'The number of times action a was taken in state s' }
        ],
        correctOption: 'B',
        explanation: `The <strong>Action-Value function</strong> $Q(s, a)$ evaluates the quality of executing action $a$ right now from state $s$, plus the total discounted future return ($\\gamma R$) expected if the agent acts optimally from the next state onward.<br><br><strong>💡 Exam & Interview Tip:</strong> $V(s)$ evaluates a <strong>State</strong> ("How good is being in this state?"), whereas $Q(s, a)$ evaluates a <strong>State-Action pair</strong> ("How good is taking this specific action from this state?").`
    },
    {
        id: 'q47',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 47 (2 Points): Policy-Based RL Representation',
        text: `In policy-based reinforcement learning, the policy is typically represented as:`,
        options: [
            { letter: 'A', text: 'A value function estimating expected rewards' },
            { letter: 'B', text: 'A probability distribution over actions given a state' },
            { letter: 'C', text: 'A Q-table of state-action pairs' },
            { letter: 'D', text: 'A reward function' }
        ],
        correctOption: 'B',
        explanation: `A stochastic policy $\\pi(a|s) = P(A_t = a | S_t = s)$ assigns a likelihood probability to every possible action when observing state $s$.<br><br><strong>💡 Exam & Interview Tip:</strong> Unlike Q-learning which deterministically picks $\\arg\\max Q$, policy-based methods directly parameterize and optimize $\\pi_\\theta(a|s)$ using policy gradient ascent.`
    },
    {
        id: 'q48',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 48 (2 Points): Advantage of Policy-Based over Value-Based Methods',
        text: `What is the main advantage of policy-based methods over value-based methods?`,
        options: [
            { letter: 'A', text: 'They are always more sample efficient' },
            { letter: 'B', text: 'They can handle continuous action spaces more naturally' },
            { letter: 'C', text: 'They require less computation' },
            { letter: 'D', text: 'They always converge to the global optimum' }
        ],
        correctOption: 'B',
        explanation: `Value-based methods (like Q-learning) require computing the maximum over all available actions ($\\max_a Q(s, a)$). If actions are continuous (such as steering wheel torque or torque on a robot joint), searching infinite continuous actions is computationally intractable. Policy-based methods directly output the mean and variance of a continuous distribution (e.g., Gaussian), solving continuous control naturally.<br><br><strong>💡 Exam & Interview Tip:</strong> Another major advantage of policy-based methods is their ability to learn <strong>stochastic policies</strong> (vital for non-deterministic environments or games like Rock-Paper-Scissors where fixed strategies fail).`
    },
    {
        id: 'q49',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 49 (2 Points): Q-Learning ε-Greedy Policy Strategy',
        text: `In Q-learning, the agent uses an ε-greedy policy for action selection. With ε = 0.1, the agent will:`,
        options: [
            { letter: 'A', text: 'Choose a random action 10% of the time and the best action 90% of the time' },
            { letter: 'B', text: 'Choose a random action 90% of the time and the best action 10% of the time' },
            { letter: 'C', text: 'Always choose the best action' },
            { letter: 'D', text: 'Always choose a random action' }
        ],
        correctOption: 'A',
        explanation: `$\\epsilon$-greedy balances the critical <strong>Exploration vs. Exploitation Trade-off</strong>: <strong>Exploration ($\\epsilon = 10\%$):</strong> Execute a completely random action to discover novel states and rewards. <strong>Exploitation ($1 - \\epsilon = 90\%$):</strong> Choose the action with the highest currently known Q-value to maximize reward.<br><br><strong>💡 Exam & Interview Tip:</strong> In production RL systems, we use <strong>$\\epsilon$-decay</strong> (starting with high $\\epsilon \\approx 1.0$ for pure exploration early on, and gradually decaying it toward $0.01$ as the agent masters the environment).`
    },
    {
        id: 'q50',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 50 (2 Points): Q-Learning High Learning Rate α Effects',
        text: `In Q-learning, if the learning rate α is set too high, what is MOST likely to occur?`,
        options: [
            { letter: 'A', text: 'The agent learns very slowly' },
            { letter: 'B', text: 'The agent may fail to converge or oscillate due to large updates' },
            { letter: 'C', text: 'The agent will always choose random actions' },
            { letter: 'D', text: 'The agent will ignore future rewards' }
        ],
        correctOption: 'B',
        explanation: `The Bellman update equation adjusts Q-values by step size $\\alpha$: $Q(s, a) \\leftarrow Q(s, a) + \\alpha [R + \\gamma \\max Q(s', a') - Q(s, a)]$. If $\\alpha$ is set too high (close to or exceeding 1), each new observation causes drastic jumps in the Q-table, causing the values to oscillate wildly without settling into convergence.<br><br><strong>💡 Exam & Interview Tip:</strong> $\\alpha$ controls <strong>speed vs. stability</strong>. Too small = extremely sluggish learning; Too large = divergence and instability.`
    },
    {
        id: 'q51',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 51 (2 Points): Decision Tree Information Gain Calculation',
        text: `In a Decision Tree, what would be the information gain if a split reduces the entropy from 0.9 to an average entropy of 0.6 across the child nodes?`,
        options: [
            { letter: 'A', text: '0.9' },
            { letter: 'B', text: '0.3' },
            { letter: 'C', text: '0.6' },
            { letter: 'D', text: '1.5' }
        ],
        correctOption: 'B',
        explanation: `$\\text{Information Gain} = \\text{Entropy}(\\text{Parent}) - \\text{Weighted Average Entropy}(\\text{Children}) = 0.9 - 0.6 = 0.3$.<br><br><strong>💡 Exam & Interview Tip:</strong> Higher Information Gain signifies a superior split that successfully separates mixed classes into clean, homogenous child nodes.`
    },
    {
        id: 'q52',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 52 (2 Points): True Property of Decision Trees',
        text: `Which of the following statements about Decision Trees is TRUE?`,
        options: [
            { letter: 'A', text: 'Decision Trees are "black-box" models that cannot be interpreted' },
            { letter: 'B', text: 'Decision Trees automatically perform feature selection during the splitting process' },
            { letter: 'C', text: 'Decision Trees require feature scaling before training' },
            { letter: 'D', text: 'Decision Trees are guaranteed to find the globally optimal tree' }
        ],
        correctOption: 'B',
        explanation: `At every candidate node, a decision tree evaluates all available features and chooses the exact feature and threshold that yields the highest Information Gain. Irrelevant features that don't reduce impurity are ignored entirely, providing automatic built-in feature selection.<br><br><strong>💡 Exam & Interview Tip:</strong> Why are the other options false? Trees are <strong>White-box</strong> models (highly interpretable), trees <strong>do NOT require feature scaling</strong>, and trees use <strong>Greedy heuristics</strong> so they are *not* guaranteed globally optimal.`
    },
    {
        id: 'q53',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 53 (2 Points): K-Means First Iteration Centroid Update',
        text: `A dataset has points A(1,1), B(1,2), C(2,1), D(5,5), E(5,6), F(6,5). Initial centroids are randomly chosen as (1,1) and (5,5). After the first iteration of K-means (assignment and update), what will be the new centroid for the first cluster?`,
        options: [
            { letter: 'A', text: '(1.33, 1.33)' },
            { letter: 'B', text: '(1, 1)' },
            { letter: 'C', text: '(2, 2)' },
            { letter: 'D', text: '(1.5, 1.5)' }
        ],
        correctOption: 'A',
        explanation: `1. <strong>Assignment step</strong> (Euclidean distance to $C_1(1,1)$ vs $C_2(5,5)$): A(1,1), B(1,2), and C(2,1) are closer to $C_1(1,1)$ $\\rightarrow$ <strong>Cluster 1</strong>. D(5,5), E(5,6), F(6,5) are closer to $C_2(5,5)$ $\\rightarrow$ <strong>Cluster 2</strong>.<br>2. <strong>Update step</strong> (average coordinates of Cluster 1 points A, B, C): $\\text{New } X = \\frac{1 + 1 + 2}{3} = \\frac{4}{3} \\approx 1.333$, $\\text{New } Y = \\frac{1 + 2 + 1}{3} = \\frac{4}{3} \\approx 1.333$.<br><br><strong>💡 Exam & Interview Tip:</strong> Always list out the exact points assigned to each cluster clearly before taking the arithmetic average so you don't make calculation errors under exam pressure!`
    },
    {
        id: 'q54',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 54 (2 Points): K-Means Extreme K=n Case',
        text: `In K-means clustering, if K is chosen to be equal to the number of samples (K = n), what will be the value of Within-Cluster Sum of Squares (WCSS)?`,
        options: [
            { letter: 'A', text: 'Maximum possible value' },
            { letter: 'B', text: 'Minimum possible value (zero)' },
            { letter: 'C', text: 'The average of all pairwise distances' },
            { letter: 'D', text: 'Cannot be determined' }
        ],
        correctOption: 'B',
        explanation: `When $K = n$, every individual data point becomes its own independent cluster centroid. Because every point sits exactly at its centroid coordinates, the Euclidean distance $\\|x_i - \\mu_i\\|$ is $0$ for all points. Therefore, $\\sum 0^2 = 0$.<br><br><strong>💡 Exam & Interview Tip:</strong> This illustrates exactly why you cannot simply pick the $K$ that minimizes WCSS-otherwise, you would always pick $K = n$, which provides zero insight into data grouping!`
    },
    {
        id: 'q55',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 55 (2 Points): Optimal K Selection via Silhouette Score',
        text: `A data scientist runs K-means with K=3, K=4, and K=5 on a dataset and obtains Silhouette Scores of 0.45, 0.52, and 0.41 respectively. Which value of K should be selected?`,
        options: [
            { letter: 'A', text: '3' },
            { letter: 'B', text: '4' },
            { letter: 'C', text: '5' },
            { letter: 'D', text: 'all are equally good' }
        ],
        correctOption: 'B',
        explanation: `The <strong>Silhouette Score</strong> ranges from $-1$ to $+1$: $+1$ indicates dense, perfectly separated clusters; $0$ indicates overlapping cluster boundaries; $-1$ indicates misclassified clustering. Therefore, the optimal $K$ corresponds to the <strong>highest Silhouette Score</strong>, which is $0.52$ at $K = 4$.<br><br><strong>💡 Exam & Interview Tip:</strong> Unlike WCSS (which monotonically decreases as $K$ increases), the Silhouette Score reaches a clear peak exactly at the optimal number of clusters.`
    },
    {
        id: 'q56',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 56 (2 Points): Narrow AI vs General AI Distinction',
        text: `Which of the following best describes the "Narrow AI" vs "General AI" distinction?`,
        options: [
            { letter: 'A', text: 'Narrow AI can perform any intellectual task that a human can, while General AI is limited to specific tasks' },
            { letter: 'B', text: 'Narrow AI is designed for specific tasks, while General AI would theoretically perform any intellectual task a human can' },
            { letter: 'C', text: 'Narrow AI uses neural networks, while General AI uses rule-based systems' },
            { letter: 'D', text: 'Narrow AI requires labelled data, while General AI does not' }
        ],
        correctOption: 'B',
        explanation: `<strong>Narrow AI (Weak AI):</strong> Systems engineered and trained for a single, well-defined task (e.g., Siri, AlphaGo, ChatGPT, facial recognition). <strong>Artificial General Intelligence (AGI / Strong AI):</strong> A theoretical system capable of general reasoning, learning across arbitrary unfamiliar domains, and adapting to any intellectual task at human or superhuman capacity.<br><br><strong>💡 Exam & Interview Tip:</strong> All existing real-world AI systems today-including GPT-4 and Claude 3.5-classify strictly as <strong>Narrow/Domain-Specific AI</strong>.`
    },
    {
        id: 'q57',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 57 (2 Points): Healthcare Multimodal AI (CV + NLP)',
        text: `Which of the following is an example of AI being used in healthcare that involves both computer vision and natural language processing?`,
        options: [
            { letter: 'A', text: 'Predicting patient readmission rates using tabular data' },
            { letter: 'B', text: 'Analyzing chest X-rays for pneumonia detection while also extracting relevant information from medical reports' },
            { letter: 'C', text: 'Clustering patients based on their medical history' },
            { letter: 'D', text: 'Using reinforcement learning to recommend treatment plans' }
        ],
        correctOption: 'B',
        explanation: `Analyzing chest X-rays (medical imaging) requires <strong>Computer Vision (CV)</strong>, while processing unstructured clinical medical reports requires <strong>Natural Language Processing (NLP)</strong>.<br><br><strong>💡 Exam & Interview Tip:</strong> Systems integrating multiple input streams such as text, vision, and audio are known as <strong>Multimodal AI architectures</strong>.`
    },
    {
        id: 'q58',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 58 (2 Points): Autonomous Vehicles Primary Challenge',
        text: `In the context of AI applications, what is the primary challenge in deploying autonomous vehicles?`,
        options: [
            { letter: 'A', text: 'Lack of sufficient training data' },
            { letter: 'B', text: 'The need to handle edge cases and make real-time decisions in unpredictable environments' },
            { letter: 'C', text: 'Inability to process visual information' },
            { letter: 'D', text: 'Lack of sensors in modern vehicles' }
        ],
        correctOption: 'B',
        explanation: `While closed highways are structured, open-world city driving presents an infinite "long tail" of unexpected events (e.g., fallen tree branches, construction workers using hand gestures, severe weather, jaywalkers). Making zero-latency, safety-critical decisions during rare <strong>edge cases</strong> is the ultimate bottleneck in autonomous driving.<br><br><strong>💡 Exam & Interview Tip:</strong> This is known as the <strong>Long-Tail Problem</strong> of generalization in Robotics and AI.`
    },
    {
        id: 'q59',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 59 (2 Points): Predictive Maintenance Data Characteristics',
        text: `Which of the following is a key challenge in using AI for predictive maintenance in manufacturing?`,
        options: [
            { letter: 'A', text: 'The data is always perfectly labelled' },
            { letter: 'B', text: 'Sensor data is often noisy, high-dimensional, and imbalanced (few failure events)' },
            { letter: 'C', text: 'Machines never fail unexpectedly' },
            { letter: 'D', text: 'Maintenance schedules are always optimal' }
        ],
        correctOption: 'B',
        explanation: `Industrial machines operate normally $>99.9\\%$ of their lifecycle. Because breakdowns are rare, datasets exhibit extreme <strong>class imbalance</strong> (millions of normal operational rows vs. dozens of failure events). Furthermore, sensor telemetry (vibration, acoustics, temperature) generates high-dimensional and electrically noisy time-series streams.<br><br><strong>💡 Exam & Interview Tip:</strong> When building predictive maintenance models, <strong>Anomaly Detection</strong> models (like Autoencoders, Isolation Forests, or One-Class SVMs) are often preferred over standard supervised classifiers.`
    },
    {
        id: 'q60',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 60 (2 Points): Turing Test Passing Criterion',
        text: `In the Turing Test, a machine passes if:`,
        options: [
            { letter: 'A', text: 'It can perfectly answer all questions correctly' },
            { letter: 'B', text: 'A human evaluator cannot distinguish between the machine and a human based on text-based conversation' },
            { letter: 'C', text: 'It achieves 100% accuracy on a benchmark dataset' },
            { letter: 'D', text: 'It can physically perform tasks like a human' }
        ],
        correctOption: 'B',
        explanation: `Proposed by Alan Turing in 1950 (the "Imitation Game"), a human judge engages in natural language text chat with both a hidden human and a hidden machine. If the judge cannot reliably tell which participant is the computer, the machine successfully passes the test.<br><br><strong>💡 Exam & Interview Tip:</strong> Notice that the original Turing Test requires only <strong>text-based</strong> interaction. The *Total Turing Test* extends this by requiring physical robotic abilities (computer vision and object manipulation).`
    },
    {
        id: 'q61',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 61 (2 Points): Turing Test Philosophical & Behavioral Limitation',
        text: `Which of the following is a limitation of the Turing Test as a measure of intelligence?`,
        options: [
            { letter: 'A', text: 'It requires physical interaction with the machine' },
            { letter: 'B', text: 'It measures human-like deception rather than true understanding or intelligence' },
            { letter: 'C', text: 'It is too difficult to implement' },
            { letter: 'D', text: 'It requires the machine to have visual capabilities' }
        ],
        correctOption: 'B',
        explanation: `To pass the Turing Test, a machine often must resort to <strong>deception</strong> (e.g., simulating typos, pretending not to know complex math, or feigning human emotions). Furthermore, <strong>John Searle\'s Chinese Room Argument</strong> demonstrates that a machine can pass a conversational test merely through syntactic pattern matching without any subjective understanding or consciousness.<br><br><strong>💡 Exam & Interview Tip:</strong> The Turing Test evaluates <strong>behavioral mimicry</strong>, not internal cognitive reasoning or problem-solving capability.`
    },
    {
        id: 'q62',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 62 (2 Points): Reactive Machines vs Limited Memory AI',
        text: `In the context of AI types, what is the key distinction between Reactive Machines and Limited Memory AI?`,
        options: [
            { letter: 'A', text: 'Reactive Machines have memory of past experiences; Limited Memory AI does not' },
            { letter: 'B', text: 'Reactive Machines cannot use past experiences to inform current decisions; Limited Memory AI can use past data for a short period' },
            { letter: 'C', text: 'Reactive Machines are more advanced than Limited Memory AI' },
            { letter: 'D', text: 'There is no distinction between them' }
        ],
        correctOption: 'B',
        explanation: `Based on Arend Hintze\'s 4 tiers of AI: <strong>Reactive Machines:</strong> Zero memory storage. They strictly observe the immediate input state and react (e.g., IBM\'s Deep Blue analyzing current chessboard positions). <strong>Limited Memory AI:</strong> Stores recent historical observations to improve current decisions (e.g., self-driving cars tracking the velocity and trajectory of surrounding vehicles over the past few seconds).<br><br><strong>💡 Exam & Interview Tip:</strong> The 4 tiers of AI from basic to advanced are: <strong>1. Reactive Machines $\\rightarrow$ 2. Limited Memory $\\rightarrow$ 3. Theory of Mind $\\rightarrow$ 4. Self-Awareness</strong>.`
    },
    {
        id: 'q63',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 63 (2 Points): Zero Metric on Imbalanced Dummy Prediction',
        text: `In an imbalanced binary classification problem where Class 0 represents 95% of the data and Class 1 represents 5%, a model predicts all samples as Class 0. Which metric will be 0?`,
        options: [
            { letter: 'A', text: 'Accuracy' },
            { letter: 'B', text: 'Recall for Class 1' },
            { letter: 'C', text: 'Precision for Class 0' },
            { letter: 'D', text: 'F1-Score for Class 0' }
        ],
        correctOption: 'B',
        explanation: `Let\'s analyze Class 1 (Positive class): $TP_1 = 0$ (Model predicted 0 instances of Class 1) and $FN_1 = 5\\%$ (All Class 1 instances were missed and predicted as Class 0). Therefore, $\\text{Recall}_1 = \\frac{TP_1}{TP_1 + FN_1} = \\frac{0}{0 + 5\\%} = 0$.<br><br><strong>💡 Exam & Interview Tip:</strong> What about the other metrics for this dummy model? Accuracy = $95\\%$, Precision for Class 0 = $95\\%$, Recall for Class 0 = $100\\%$.`
    },
    {
        id: 'q64',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 64 (2 Points): Harmonic Mean F1-Score Computation',
        text: `In binary classification, if a model has Precision = 0.9 and Recall = 0.8, what is the F1-Score? (Round to 3 decimal places)`,
        options: [
            { letter: 'A', text: '0.847' },
            { letter: 'B', text: '0.850' },
            { letter: 'C', text: '0.833' },
            { letter: 'D', text: '0.900' }
        ],
        correctOption: 'A',
        explanation: `The harmonic mean formula for F1-Score is: $\\text{F1} = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}} = 2 \\times \\frac{0.9 \\times 0.8}{0.9 + 0.8} = 2 \\times \\frac{0.72}{1.7} = \\frac{1.44}{1.7} \\approx 0.847058... \\implies 0.847$.<br><br><strong>💡 Exam & Interview Tip:</strong> The harmonic mean ($0.847$) is always closer to the <strong>smaller</strong> value between Precision ($0.8$) and Recall ($0.9$) compared to the standard arithmetic average ($0.850$). This penalizes models where one metric drops significantly!`
    },
    {
        id: 'q65',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 65 (2 Points): Ambiguous Elbow Plot K Selection',
        text: `You run K-means clustering on a dataset and obtain an elbow plot that is smooth with no clear knee point. What should you do to select K?`,
        options: [
            { letter: 'A', text: 'Choose K = 2 arbitrarily' },
            { letter: 'B', text: 'Use the Silhouette Score to select K' },
            { letter: 'C', text: 'Choose K = number of features' },
            { letter: 'D', text: 'Choose K = number of samples' }
        ],
        correctOption: 'B',
        explanation: `When the Elbow Method (WCSS plot) yields a smooth, gradual curve without a distinct sharp bend (knee/elbow point), visual interpretation becomes subjective and unreliable. In these scenarios, you must switch to quantitative mathematical validation metrics such as the <strong>Silhouette Score</strong>, <strong>Gap Statistic</strong>, or <strong>Davies-Bouldin Index</strong>.<br><br><strong>💡 Exam & Interview Tip:</strong> Never pick $K$ arbitrarily or equal to the number of features! If both Elbow and Silhouette are ambiguous, let <strong>domain expertise / business objectives</strong> dictate $K$ (e.g., clothing sizing requiring exactly $K=3$ for Small, Medium, Large).`
    },
    {
        id: 'q66',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 66 (2 Points): Decision Tree Maximum Entropy for 4 Equal Classes',
        text: `In a Decision Tree for classification, what is the exact entropy value when a node has a distribution of [25, 25, 25, 25] for 4 classes? (Round to 3 decimal places)`,
        options: [
            { letter: 'A', text: '1.000' },
            { letter: 'B', text: '2.000' },
            { letter: 'C', text: '0.500' },
            { letter: 'D', text: '4.000' }
        ],
        correctOption: 'B',
        explanation: `Total samples = $25 + 25 + 25 + 25 = 100$. Each class $i$ has equal probability $p_i = \\frac{25}{100} = \\frac{1}{4}$. Using the Shannon Entropy formula (base 2): $H(X) = -\\sum_{i=1}^{4} \\frac{1}{4} \\log_2\\left(\\frac{1}{4}\\right)$. Since $\\log_2(1/4) = \\log_2(2^{-2}) = -2$: $H(X) = -4 \\times \\left[\\frac{1}{4} \\times (-2)\\right] = -(-2) = 2.000$.<br><br><strong>💡 Exam & Interview Tip:</strong> For $C$ classes, maximum entropy occurs when classes are perfectly equal: $H_{\\max} = \\log_2(C)$. For 2 classes ($C=2$), maximum entropy = $\\log_2(2) = 1.0$. For 4 classes ($C=4$), maximum entropy = $\\log_2(4) = 2.0$. For 8 classes ($C=8$), maximum entropy = $\\log_2(8) = 3.0$.`
    },
    // --- 10 NEW USER-REQUESTED CORE MOCK EXAM QUESTIONS (q67 - q76) ---
    {
        id: 'q67',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 67 (1 Point): Clustering Paradigm',
        text: 'Clustering is a type of _______ learning.',
        correctAnswer: 'unsupervised',
        acceptableAnswers: ['unsupervised', 'unsupervised learning', 'unsupervised-learning'],
        explanation: `Clustering algorithms (such as <strong>K-Means</strong>, <strong>Hierarchical Clustering</strong>, and <strong>DBSCAN</strong>) discover inherent natural groupings (<em>clusters</em>) within data without relying on predefined ground-truth target labels ($y$). Therefore, clustering is a foundational pillar of <strong>unsupervised learning</strong>.<br><br><strong>💡 Official CSY3081 Theory:</strong> Unlike supervised algorithms (<em>regression and classification</em>) which optimize error against known target vectors, unsupervised clustering optimizes internal structural metrics such as minimizing <strong>within-cluster sum of squares (WCSS)</strong> or maximizing <strong>Silhouette Scores</strong>.`
    },
    {
        id: 'q68',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 68 (1 Point): Clustering Label Requirement',
        text: 'Clustering algorithms require labelled training data.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: `Clustering algorithms are strictly <strong>unsupervised</strong>, meaning they operate exclusively on input feature matrices ($X$) and <strong>do not require or utilize labeled training data ($y$)</strong>. They partition data by measuring geometric or probabilistic similarity across feature dimensions.<br><br><strong>💡 Exam & Interview Tip:</strong> If an algorithm requires labeled training data ($y$) to assign new instances to discrete classes, it is called <strong>Supervised Classification</strong> (<em>e.g., KNN Classifier, Decision Tree Classifier, Logistic Regression</em>), NOT clustering.`
    },
    {
        id: 'q69',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 69 (1 Point): Linear Regression Assumption',
        text: 'Linear regression assumes a linear relationship between input variables and the target.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'A',
        explanation: `Linear regression explicitly models the predicted target $\\hat{y}$ as a linear combination of input features: $\\hat{y} = w_0 + w_1 x_1 + w_2 x_2 + \\dots + w_n x_n$. Thus, its primary theoretical assumption is a <strong>linear relationship</strong> between independent variables ($X$) and the continuous dependent variable ($Y$).<br><br><strong>💡 Exam & Interview Tip:</strong> If the true underlying data generating process is highly non-linear (<em>e.g., quadratic or exponential</em>), a standard linear regression model will suffer from <strong>High Bias (Underfitting)</strong>. To fix this, you must apply <code>PolynomialFeatures</code> or non-linear models like Decision Trees / Neural Networks.`
    },
    {
        id: 'q70',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 70 (1 Point): Decision Tree Nonlinearity Requirement',
        text: 'Decision Trees require a nonlinear relationship between input variables and the target.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: `Decision Trees are highly versatile non-parametric models that can easily handle <strong>both linear and non-linear</strong> relationships! While they excel at partitioning complex non-linear feature spaces via recursive orthogonal (<em>axis-aligned</em>) threshold splits, they do *not* require a non-linear relationship to function.<br><br><strong>💡 Official CSY3081 Theory:</strong> If given a purely linear relationship, a Decision Tree will approximate the linear hyperplane using a staircase-like sequence of axis-aligned step splits.`
    },
    {
        id: 'q71',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 71 (2 Points): Selecting Tasks for Clustering',
        text: 'Which task is best suited for clustering?',
        options: [
            { letter: 'A', text: 'Spam detection (Predicting Spam vs Non-Spam emails)' },
            { letter: 'B', text: 'Image classification (Categorizing photos into predefined object classes)' },
            { letter: 'C', text: 'Customer segmentation (Grouping customers by purchasing habits without prior labels)' },
            { letter: 'D', text: 'Financial forecasting (Predicting future continuous stock or revenue values)' }
        ],
        correctOption: 'C',
        explanation: `<strong>Customer segmentation</strong> aims to group individuals into distinct cohorts (<em>e.g., budget shoppers, high-value loyalists, occasional buyers</em>) based on similarity across purchasing metrics without pre-existing category labels—making it the classic real-world application of <strong>Unsupervised Clustering</strong> (<em>e.g., K-Means</em>).<br><br><strong>💡 Task Breakdown:</strong><br>• <strong>Spam detection & Image classification:</strong> Supervised Classification (<em>discrete targets</em>).<br>• <strong>Financial forecasting:</strong> Supervised Regression / Time-Series (<em>continuous target</em>).`
    },
    {
        id: 'q72',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 72 (2 Points): Decision Tree Leaf Node Probability Calculation',
        text: 'In a Decision Tree, if a leaf node has total <code>samples = 100</code> and class distribution <code>values = [5, 85, 10]</code> across three classes, what should be the output probability vector <code>predict_proba()</code> of this leaf node?',
        options: [
            { letter: 'A', text: '0.85 (Only the probability of the majority class)' },
            { letter: 'B', text: '1 (Absolute prediction for the majority class)' },
            { letter: 'C', text: '[0.05, 0.85, 0.1] (Exact normalized class probabilities across all 3 classes)' },
            { letter: 'D', text: '[0, 1, 0] (One-hot argmax vector)' }
        ],
        correctOption: 'C',
        explanation: `In Scikit-Learn (and standard decision tree theory), when <code>predict_proba(X)</code> is evaluated for a test instance that lands in a specific leaf node, the model outputs the <strong>normalized relative frequency distribution</strong> of the training samples residing in that leaf: $$P(\\text{class } k) = \\frac{\\text{value}_k}{\\text{total samples in leaf}}$$ For this leaf node: <br>• Class 0 Probability: $\\frac{5}{100} = \\mathbf{0.05}$ <br>• Class 1 Probability: $\\frac{85}{100} = \\mathbf{0.85}$ <br>• Class 2 Probability: $\\frac{10}{100} = \\mathbf{0.10}$ <br>Therefore, the complete probability vector is <strong><code>[0.05, 0.85, 0.1]</code></strong>.<br><br><strong>💡 Note:</strong> Calling <code>.predict(X)</code> would apply <code>argmax</code> and output discrete label <code>1</code>, but <code>.predict_proba(X)</code> strictly outputs the full probability vector across all classes.`
    },
    {
        id: 'q73',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 73 (2 Points): Softmax Regression Characteristics',
        text: 'Which statement about <strong>Softmax Regression</strong> (Multinomial Logistic Regression) is correct?',
        options: [
            { letter: 'A', text: 'It produces a single continuous output value ($Y \\in \\mathbb{R}$)' },
            { letter: 'B', text: 'It is only used for continuous regression problems despite its name' },
            { letter: 'C', text: 'It cannot be evaluated using classification accuracy metrics' },
            { letter: 'D', text: 'It outputs probabilities across multiple mutually exclusive classes summing to 1.0' }
        ],
        correctOption: 'D',
        explanation: `Despite the historical name <strong>Softmax Regression</strong> (or Multinomial Logistic Regression), it is strictly a <strong>multiclass classification algorithm</strong>. The Softmax activation function converts raw linear logit scores $z_1, z_2, \\dots, z_K$ into a valid probability distribution across $K$ classes: $$\\hat{p}_k = \\sigma(z)_k = \\frac{e^{z_k}}{\\sum_{j=1}^{K} e^{z_j}}$$ This guarantees that $0 \\le \\hat{p}_k \\le 1$ for every class and $\\sum_{k=1}^{K} \\hat{p}_k = 1.0$.`
    },
    {
        id: 'q74',
        type: 'mcq',
        category: 'mcq',
        points: 3,
        title: 'Question 74 (3 Points): Softmax Regression Prediction Code Completion',
        text: 'If you want to predict the class labels of the test dataset (specifically inspecting the first ten samples), which of the following options should correctly replace the question mark `?` in the code below?\n\n```python\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX = iris_data[[\'petal length (cm)\', \'petal width (cm)\']].values\ny = iris_data[\'target\'].values\nX_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)\n\nsoftmax_reg = LogisticRegression(C=30)\nsoftmax_reg.fit(X_train, y_train)\n\n# What should replace the question mark to predict labels on the test set?\ny_pred = softmax_reg.predict(?)\n```',
        options: [
            { letter: 'A', text: 'y_test (Ground truth target vector)' },
            { letter: 'B', text: 'X_train (Training feature matrix)' },
            { letter: 'C', text: 'X_test (Test feature matrix, or X_test[:10] for first 10 rows)' },
            { letter: 'D', text: 'y_train (Training target vector)' }
        ],
        correctOption: 'C',
        explanation: `In Scikit-Learn, the <code>.predict(X)</code> method of any trained estimator strictly expects a <strong>feature matrix ($X$)</strong> (shape: <code>[n_samples, n_features]</code>), <strong>never target vectors ($y$)</strong>! <br><br>To generate predictions for the evaluation fold, you must pass the test feature matrix <strong><code>X_test</code></strong> (or <code>X_test[:10]</code> specifically to slice the first ten test instances). Passing <code>y_test</code> or <code>y_train</code> will raise a severe <code>ValueError</code> due to feature dimension mismatch, and passing <code>X_train</code> would evaluate training error rather than generalization performance.`
    },
    {
        id: 'q75',
        type: 'mcq',
        category: 'mcq',
        points: 3,
        title: 'Question 75 (3 Points): Interpreting Softmax `predict_proba` Output Array',
        text: 'You use softmax regression to classify Iris flowers into all 3 classes (<code>0: Setosa, 1: Versicolor, 2: Virginica</code>) using petal length and petal width. With the following code, what is a <strong>mathematically valid possible output</strong> when running <code>predict_proba</code> on a single sample <code>[[5, 2]]</code>?\n\n```python\nX_train, X_test, y_train, y_test = train_test_split(X, y)\nsoftmax_reg = LogisticRegression(C=30)\nsoftmax_reg.fit(X_train, y_train)\n\n# Evaluating class membership probabilities for a 2D sample [petal length=5, petal width=2]\nprint(softmax_reg.predict_proba([[5, 2]]))\n```',
        options: [
            { letter: 'A', text: '[[ 0.20, 0.03, 0.97 ]] (Sum = 1.20 - Invalid probability distribution)' },
            { letter: 'B', text: '[[0.97] [0] [2]] (Malformed 3x1 array with numbers > 1.0)' },
            { letter: 'C', text: '[2] (Discrete class label - returned by .predict(), not .predict_proba())' },
            { letter: 'D', text: '[[ 0, 0.03, 0.97 ]] (Valid 2D probability array summing exactly to 1.00)' }
        ],
        correctOption: 'D',
        explanation: `Let's analyze Scikit-Learn's <strong>Softmax <code>.predict_proba(X)</code></strong> return structure and mathematical properties: <br>1. <strong>Dimensionality:</strong> Because the input <code>[[5, 2]]</code> contains 1 sample (shape $1 \\times 2$), and there are 3 classes ($K=3$), <code>predict_proba()</code> returns a 2D array of shape <strong><code>(1, 3)</code></strong>: <code>[[P(Y=0), P(Y=1), P(Y=2)]]</code>. <br>2. <strong>Normalization Axiom:</strong> By definition of the Softmax equation, all probabilities must satisfy $0 \\le P_k \\le 1$ and <strong>must sum exactly to $1.00$</strong> across the row. <br><br>Let's check each option: <br>• Option A: $0.20 + 0.03 + 0.97 = 1.20 \\neq 1.0$ (<em>Mathematically impossible for softmax</em>). <br>• Option D: $0 + 0.03 + 0.97 = \\mathbf{1.00}$ (<strong>Valid Softmax Probability Vector where Class 2 / Virginica is predicted with 97% confidence</strong>).`
    },
    {
        id: 'q76',
        type: 'matching',
        category: 'matching',
        points: 3,
        title: 'Question 76 (3 Points): Machine Learning Paradigms vs Real-World Examples',
        text: 'Match each foundational <strong>Machine Learning Paradigm</strong> directly to its correct real-world application example:',
        matchingPairs: [
            { left: 'Unsupervised learning', right: 'Grouping customers by purchase habits without predefined category labels' },
            { left: 'Classification (Supervised)', right: 'Predicting discrete spam or non-spam email categories from text features' },
            { left: 'Semi-supervised learning', right: 'Training data includes a small portion of labeled data and lots of unlabeled data (e.g. medical scans)' },
            { left: 'Regression (Supervised)', right: 'Predicting a continuous numerical value (e.g., house price or stock revenue) given input features' },
            { left: 'Reinforcement learning', right: 'An autonomous robot or agent learns to play games from trial-and-error interactions with the environment' }
        ],
        rightOptions: [
            'Grouping customers by purchase habits without predefined category labels',
            'Predicting discrete spam or non-spam email categories from text features',
            'Training data includes a small portion of labeled data and lots of unlabeled data (e.g. medical scans)',
            'Predicting a continuous numerical value (e.g., house price or stock revenue) given input features',
            'An autonomous robot or agent learns to play games from trial-and-error interactions with the environment'
        ],
        correctMatches: [
            'Grouping customers by purchase habits without predefined category labels',
            'Predicting discrete spam or non-spam email categories from text features',
            'Training data includes a small portion of labeled data and lots of unlabeled data (e.g. medical scans)',
            'Predicting a continuous numerical value (e.g., house price or stock revenue) given input features',
            'An autonomous robot or agent learns to play games from trial-and-error interactions with the environment'
        ],
        explanation: `<strong>💡 CSY3081 Core Taxonomy Summary:</strong><br>• <strong>Supervised Classification:</strong> Discrete target labels $y \\in \\{0, 1, \\dots\\}$ (<em>e.g., Spam vs Non-Spam</em>).<br>• <strong>Supervised Regression:</strong> Continuous target values $y \\in \\mathbb{R}$ (<em>e.g., Price forecasting</em>).<br>• <strong>Unsupervised Clustering:</strong> No targets; grouping points purely by feature similarity (<em>e.g., Customer Segmentation</em>).<br>• <strong>Semi-Supervised Learning:</strong> Leverages a tiny labeled dataset along with a massive unlabeled dataset (<em>reduces expensive manual labeling costs in bioinformatics and computer vision</em>).<br>• <strong>Reinforcement Learning (RL):</strong> An agent executes actions $a_t$ in state $s_t$ inside an environment to maximize cumulative scalar reward $\\sum \\gamma^t r_t$ (<em>e.g., Robotics and Game AI</em>).`
    },
    // --- 22 NEW PREDICTED HIGH-YIELD MOCK POSSIBLE EXAM QUESTIONS (q77 - q98) TO REACH EXACTLY 32 QS ---
    {
        id: 'q77',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 77 (1 Point): K-Means Centroid Convergence',
        text: 'In K-Means clustering, the algorithm iteratively updates the geometric centers of each cluster, called _______, until their positions stabilize and stop moving.',
        correctAnswer: 'centroids',
        acceptableAnswers: ['centroids', 'centroid', 'cluster centroids', 'cluster centers'],
        explanation: `In <strong>K-Means clustering</strong>, each cluster is represented by its mean vector (center of mass across all dimensions), formally called the <strong>centroid</strong> $\\mu_k$. During iteration, each data point is assigned to its nearest centroid, after which new centroids are computed by taking the average of all points in that cluster: $$\\mu_k^{(t+1)} = \\frac{1}{|S_k|} \\sum_{x \\in S_k} x$$ This Expectation-Maximization loop repeats until the centroids converge (<em>stop shifting</em>).`
    },
    {
        id: 'q78',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 78 (1 Point): Regularized Linear Regression ($L_1$ Penalty)',
        text: 'The linear regression regularization technique that adds an $L_1$ norm penalty (sum of absolute weights) to the loss function to enforce sparsity and feature selection is called _______ regression.',
        correctAnswer: 'lasso',
        acceptableAnswers: ['lasso', 'lasso regression', 'l1', 'l1 regularization'],
        explanation: `<strong>LASSO (<em>Least Absolute Shrinkage and Selection Operator</em>)</strong> adds an $L_1$ penalty term to the residual sum of squares loss: $$J(w) = \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 + \\alpha \\sum_{j=1}^{p} |w_j|$$ Because the $L_1$ constraint geometry has sharp diamond corners on the axes, it drives non-informative feature weights exactly to <strong>zero ($0.0$)</strong>, performing built-in <strong>automatic feature selection</strong> (<em>unlike Ridge / L2 which shrinks weights toward zero but rarely exactly to zero</em>).`
    },
    {
        id: 'q79',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 79 (1 Point): Decision Tree Splitting Criterion',
        text: 'The default impurity metric used by Scikit-Learn\'s DecisionTreeClassifier (CART algorithm) to measure how mixed or impure the classes are within a node is called _______ impurity.',
        correctAnswer: 'gini',
        acceptableAnswers: ['gini', 'gini impurity', 'gini index'],
        explanation: `By default, Scikit-Learn uses <strong>Gini Impurity</strong> (<code>criterion='gini'</code>) to evaluate candidate splits. For a node with class probabilities $p_i$: $$I_G = 1 - \\sum_{i=1}^{C} p_i^2$$ A pure node (<em>containing 100% of one class</em>) achieves $I_G = 0.0$, while a maximally mixed binary split (<em>50/50</em>) reaches $I_G = 0.50$. Gini is preferred computationally over Entropy because it does not require calculating expensive logarithms ($\\log_2$).`
    },
    {
        id: 'q80',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 80 (1 Point): Classification Performance Metrics',
        text: 'In binary classification evaluation, the ratio of True Positives (TP) to the total number of actual positive instances (TP + FN) is formally known as _______ (also called Sensitivity or True Positive Rate).',
        correctAnswer: 'recall',
        acceptableAnswers: ['recall', 'sensitivity', 'true positive rate', 'tpr'],
        explanation: `<strong>Recall (<em>Sensitivity</em>)</strong> measures a classifier's ability to capture all true positive instances in a dataset without missing them (<em>minimizing False Negatives</em>): $$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$ <strong>💡 Exam Contrast:</strong> <strong>Precision</strong> measures exactness ($\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$), answering: *Out of all positive predictions made, what fraction were genuinely correct?*`
    },
    {
        id: 'q81',
        type: 'fill-blank',
        category: 'fill-blank',
        points: 1,
        title: 'Question 81 (1 Point): Reinforcement Learning Optimization Goal',
        text: 'In Reinforcement Learning (RL), an autonomous agent takes actions in an environment with the goal of maximizing the expected cumulative scalar _______ over time.',
        correctAnswer: 'reward',
        acceptableAnswers: ['reward', 'rewards', 'cumulative reward', 'return'],
        explanation: `The central objective of <strong>Reinforcement Learning (<em>Markov Decision Processes</em>)</strong> is to discover an optimal policy $\\pi^*(a|s)$ that maximizes the <strong>expected discounted cumulative reward</strong> (<em>return $G_t$</em>): $$G_t = \\sum_{k=0}^{\\infty} \\gamma^k r_{t+k+1}$$ where $\\gamma \\in [0, 1)$ is the discount factor ensuring future rewards converge.`
    },
    {
        id: 'q82',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 82 (1 Point): Softmax Regression Multiclass Capability',
        text: 'Softmax Regression (Multinomial Logistic Regression) is strictly limited to classifying instances into two classes (binary classification only).',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: `Softmax Regression (<em>Multinomial Logistic Regression</em>) is specifically designed to generalize standard binary logistic regression to <strong>multiclass classification problems ($K \\ge 3$ classes)</strong>! For $K$ classes, the Softmax activation normalizes $K$ linear logit scores into a valid $K$-element probability vector where all probabilities sum to $1.00$.`
    },
    {
        id: 'q83',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 83 (1 Point): Decision Tree Unconstrained Growth & Overfitting',
        text: 'Setting max_depth=None in a Scikit-Learn DecisionTreeClassifier without min_samples_split or min_samples_leaf constraints allows the tree to grow until all leaves are pure, often resulting in high variance and severe overfitting on noisy training data.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'A',
        explanation: `When <code>max_depth=None</code> (<em>default in Scikit-Learn</em>), a Decision Tree will continue expanding nodes recursively until every leaf node achieves pure 100% homogeneity ($I_G = 0.0$ or $H = 0.0$). While this yields <strong>0% training error</strong>, the tree memorizes every outlier and noise grain (<em>High Variance</em>), causing poor generalization on test data. <strong>Pruning (<em>setting max_depth or min_samples_split</em>)</strong> is essential.`
    },
    {
        id: 'q84',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 84 (1 Point): KNN Feature Magnitude Sensitivity',
        text: 'In K-Nearest Neighbours (KNN), feature scaling (such as using StandardScaler or MinMaxScaler) is critical because distance metrics like Euclidean distance are heavily dominated by features with large numeric scales (e.g. Salary in $100,000s vs Age in years).',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'A',
        explanation: `KNN is an instance-based distance algorithm relying on <strong>Euclidean distance</strong>: $$d(x, z) = \\sqrt{\\sum_{j=1}^{n} (x_j - z_j)^2}$$ If Feature 1 ranges from $10,000$ to $100,000$ (<em>e.g., Income</em>) and Feature 2 ranges from $18$ to $65$ (<em>e.g., Age</em>), any difference in Income will completely overpower Age in the distance calculation. <strong>Scaling (<em>StandardScaler</em>)</strong> equalizes all feature contributions.`
    },
    {
        id: 'q85',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 85 (1 Point): K-Means Centroid Initialization Guarantee',
        text: 'Standard K-Means clustering (Lloyd\'s algorithm) is mathematically guaranteed to always converge to the exact global minimum within-cluster sum of squares (WCSS), regardless of initial centroid locations.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'B',
        explanation: `K-Means (<em>Lloyd's algorithm</em>) optimizes a non-convex objective function and is <strong>only guaranteed to converge to a local minimum (<em>not the global minimum</em>)</strong>! If initial centroids start in poor locations (<em>e.g., two centroids trapped in one cluster</em>), the algorithm gets stuck. <br><br><strong>💡 Scikit-Learn Fix:</strong> This is precisely why Scikit-Learn uses <strong><code>init='k-means++'</code></strong> (<em>smart initialization spread across data points</em>) and defaults <code>n_init=10</code> (<em>running 10 random restarts and picking the lowest WCSS solution</em>).`
    },
    {
        id: 'q86',
        type: 'true-false',
        category: 'true-false',
        points: 1,
        title: 'Question 86 (1 Point): Gaussian Naive Bayes Independence Assumption',
        text: 'Gaussian Naive Bayes (GaussianNB) assumes that all input features $X_1, X_2, \\dots, X_n$ are conditionally independent of each other given the target class label $Y$.',
        options: [
            { letter: 'A', text: 'True' },
            { letter: 'B', text: 'False' }
        ],
        correctOption: 'A',
        explanation: `The fundamental assumption (<em>the 'Naive' assumption</em>) of all Naive Bayes classifiers is <strong>conditional feature independence given the class</strong>: $$P(X_1, X_2, \\dots, X_n | Y=c) = \\prod_{j=1}^{n} P(X_j | Y=c)$$ By assuming features do not interact, Naive Bayes dramatically reduces computational parameter estimation complexity from exponential $O(2^n)$ down to linear $O(n)$, making it extremely fast for high-dimensional text classification.`
    },
    {
        id: 'q87',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 87 (2 Points): Softmax Cross-Entropy Loss Function',
        text: 'What is the core loss function minimized when training a Softmax Regression (Multinomial Logistic Regression) classifier using maximum likelihood estimation across $n$ samples and $K$ classes?',
        options: [
            { letter: 'A', text: 'Mean Squared Error (MSE: average of squared residuals)' },
            { letter: 'B', text: 'Cross-Entropy Loss (Multinomial Log-Loss: sum of -y_ik log(p_ik))' },
            { letter: 'C', text: 'Hinge Loss (Max margin boundary optimization as in SVMs)' },
            { letter: 'D', text: 'Gini Impurity Loss (Quadratic class mixture minimization)' }
        ],
        correctOption: 'B',
        explanation: `Softmax Regression is trained by maximizing log-likelihood, which is mathematically equivalent to minimizing the <strong>Multinomial Cross-Entropy Loss (<em>Log-Loss</em>)</strong>: $$J(\\Theta) = -\\frac{1}{n} \\sum_{i=1}^{n} \\sum_{k=1}^{K} y_{i,k} \\log(\\hat{p}_{i,k})$$ where $y_{i,k}$ is the one-hot indicator (<em>1 if sample i has class k, else 0</em>) and $\\hat{p}_{i,k}$ is the predicted probability from the Softmax equation.`
    },
    {
        id: 'q88',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 88 (2 Points): Exact Gini Impurity Calculation',
        text: 'If a candidate split node in a binary classification tree contains exactly 10 positive class samples (+) and 10 negative class samples (-) (total samples = 20), what is the exact Gini impurity ($I_G$) of this node?',
        options: [
            { letter: 'A', text: '0.00 (Pure node containing only a single class)' },
            { letter: 'B', text: '0.25 (Quarter uncertainty threshold)' },
            { letter: 'C', text: '0.50 (Maximum impurity / 50-50 equal distribution across 2 classes)' },
            { letter: 'D', text: '1.00 (Absolute entropy bound)' }
        ],
        correctOption: 'C',
        explanation: `Let's calculate the exact Gini impurity using the definition: $$I_G = 1 - \\sum_{i=1}^{C} p_i^2$$ For this node: <br>• $p_+ = \\frac{10}{20} = 0.5$ <br>• $p_- = \\frac{10}{20} = 0.5$ <br><br>Substituting into the formula: $$I_G = 1 - (0.5^2 + 0.5^2) = 1 - (0.25 + 0.25) = 1 - 0.50 = \\mathbf{0.50}$$ A 50/50 split represents the maximum possible Gini impurity for a binary classification problem (<em>highest uncertainty</em>).`
    },
    {
        id: 'q89',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 89 (2 Points): Scikit-Learn Supervised Workflow Pipeline',
        text: 'Which sequence of Scikit-Learn method calls represents the exact correct industry-standard workflow for training, predicting, and evaluating a supervised classifier?',
        options: [
            { letter: 'A', text: 'model.predict(X_train) ➔ model.fit(X_test, y_test) ➔ model.score(y_pred)' },
            { letter: 'B', text: 'model.fit(X_train, y_train) ➔ model.predict(X_test) ➔ accuracy_score(y_test, y_pred)' },
            { letter: 'C', text: 'model.transform(y_train) ➔ model.predict_proba(X_train) ➔ model.fit(X_test)' },
            { letter: 'D', text: 'model.score(X_train, y_test) ➔ model.fit(X_test) ➔ model.predict(y_train)' }
        ],
        correctOption: 'B',
        explanation: `In the Scikit-Learn API, all supervised estimators adhere strictly to the <strong>Fit ➔ Predict ➔ Evaluate</strong> pattern: <br>1. <strong><code>model.fit(X_train, y_train)</code>:</strong> Fits parameters (<em>weights, split thresholds</em>) using the training fold. <br>2. <strong><code>y_pred = model.predict(X_test)</code>:</strong> Generates class predictions for unseen test feature instances. <br>3. <strong><code>accuracy_score(y_test, y_pred)</code>:</strong> Compares predicted vectors against ground-truth test labels to compute accuracy percentage.`
    },
    {
        id: 'q90',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 90 (2 Points): K-Means Elbow Method Interpretation',
        text: 'When using the Elbow Method to determine the optimal number of clusters ($k$) in K-Means, how do you identify the optimal $k$ from the evaluation curve plotted against Within-Cluster Sum of Squares (WCSS / Inertia)?',
        options: [
            { letter: 'A', text: 'Choose the exact value of k where WCSS reaches 0.0' },
            { letter: 'B', text: 'Select the point of maximum curvature (the elbow point) where adding another cluster yields diminishing returns in WCSS reduction' },
            { letter: 'C', text: 'Choose k = n_samples so every individual data point is its own centroid' },
            { letter: 'D', text: 'Select the lowest possible k (k=1) because simpler models always generalize better' }
        ],
        correctOption: 'B',
        explanation: `As you increase $k$, the <strong>Within-Cluster Sum of Squares (<em>Inertia / WCSS</em>)</strong> strictly decreases (<em>because more centroids mean data points are closer to their cluster center</em>). If $k = n$, WCSS becomes $0.0$, but that is useless overfitting! <br><br>The <strong>Elbow Method</strong> plots $k$ on the X-axis vs WCSS on the Y-axis and selects the <strong>'Elbow point' (<em>point of inflection / maximum curvature</em>)</strong>—where the rapid drop in WCSS levels off into a gradual plateau, indicating the optimal balance between cluster compactness and model simplicity.`
    },
    {
        id: 'q91',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 91 (2 Points): Random Forest Bagging vs Single Decision Tree',
        text: 'Why does a Random Forest Classifier (an ensemble of bagged decision trees) consistently outperform a single deeply grown Decision Tree in test set generalization and noise tolerance?',
        options: [
            { letter: 'A', text: 'Random Forest replaces non-linear step splits with linear hyperplanes inside leaf nodes' },
            { letter: 'B', text: 'By averaging predictions across many uncorrelated trees (trained on bootstrapped data subsets and random feature subsets), Random Forest drastically reduces variance without increasing bias' },
            { letter: 'C', text: 'Random Forest eliminates all training bias and guarantees zero false positives' },
            { letter: 'D', text: 'Random Forest requires zero hyperparameter tuning and trains in O(1) constant time' }
        ],
        correctOption: 'B',
        explanation: `A single deep Decision Tree suffers from <strong>High Variance (<em>Overfitting</em>)</strong>—it memorizes noisy training fluctuations. <strong>Random Forest</strong> solves this using <strong>Bootstrap Aggregating (<em>Bagging</em>) + Random Feature Selection</strong>: <br>• Each tree is trained on a random bootstrapped sample of the data. <br>• At every node split, only a random subset of features (<em>usually $\\sqrt{p}$</em>) is considered. <br><br>By averaging (<em>or majority voting</em>) dozens of uncorrelated, noisy trees, individual tree variances cancel out ($Var(\\bar{X}) = \\frac{\\sigma^2}{M}$), leaving a highly accurate, robust ensemble boundary.`
    },
    {
        id: 'q92',
        type: 'mcq',
        category: 'mcq',
        points: 2,
        title: 'Question 92 (2 Points): Diagnosing Overfitting & Variance Remedies',
        text: 'If a supervised classification model achieves 99.8% training accuracy but drops to 61.2% test accuracy, what learning pathology is occurring, and which remedy is most appropriate?',
        options: [
            { letter: 'A', text: 'High Bias (Underfitting); remedy: remove features and reduce model complexity' },
            { letter: 'B', text: 'High Variance (Overfitting); remedy: apply L1/L2 regularization, increase training data, or prune tree depth (max_depth)' },
            { letter: 'C', text: 'Model Equilibrium; remedy: deploy immediately without further tuning' },
            { letter: 'D', text: 'Data Leakage; remedy: train the model directly on the test evaluation set' }
        ],
        correctOption: 'B',
        explanation: `A massive gap between training accuracy (<em>99.8%</em>) and testing accuracy (<em>61.2%</em>) is the classic hallmark of <strong>High Variance (<em>Overfitting</em>)</strong>. The model has memorized the training set's specific noise and anomalies rather than learning generalizable decision boundaries. <br><br><strong>💡 Remedies:</strong><br>1. Apply <strong>Regularization</strong> (<em>$L_1$ Lasso or $L_2$ Ridge penalties</em>). <br>2. <strong>Prune complexity</strong> (<em>e.g., restrict max_depth or increase min_samples_split</em>). <br>3. <strong>Gather more training data</strong> (<em>or apply data augmentation</em>). <br>4. Switch to an <strong>Ensemble model</strong> (<em>Random Forest / Gradient Boosting</em>).`
    },
    {
        id: 'q93',
        type: 'mcq',
        category: 'mcq',
        points: 3,
        title: 'Question 93 (3 Points): Softmax predict_proba Array Shape & Slicing',
        text: 'Inspect the Scikit-Learn Softmax code below on the Iris dataset (which has 3 target classes: Setosa, Versicolor, Virginica). What is the exact NumPy array shape of y_probs returned by softmax_reg.predict_proba(X_test[:5])?\n\n```python\nfrom sklearn.linear_model import LogisticRegression\nsoftmax_reg = LogisticRegression(C=30)\nsoftmax_reg.fit(X_train, y_train)\n\n# Slicing the first 5 test samples:\ny_probs = softmax_reg.predict_proba(X_test[:5])\nprint(y_probs.shape)\n```',
        options: [
            { letter: 'A', text: '(5,) ➔ A 1D vector containing 5 discrete integer class labels' },
            { letter: 'B', text: '(3, 5) ➔ 3 rows representing classes and 5 columns representing instances' },
            { letter: 'C', text: '(5, 3) ➔ 2D array with 5 rows (one per test instance) and 3 columns (one probability per class)' },
            { letter: 'D', text: '(1, 15) ➔ A flattened 1D array of 15 probability numbers' }
        ],
        correctOption: 'C',
        explanation: `In Scikit-Learn, calling <strong><code>.predict_proba(X)</code></strong> on an input matrix $X$ with $n$ samples and a model trained across $K$ classes always returns a 2D probability matrix of exact shape <strong><code>(n_samples, n_classes)</code></strong>! <br><br>Here, because <code>X_test[:5]</code> passes exactly <strong>$5$ test samples</strong>, and the Iris dataset has <strong>$3$ classes</strong> (<em>Setosa, Versicolor, Virginica</em>), <code>predict_proba</code> outputs a 2D array of shape <strong><code>(5, 3)</code></strong>, where each of the 5 rows sums exactly to $1.00$.`
    },
    {
        id: 'q94',
        type: 'mcq',
        category: 'mcq',
        points: 3,
        title: 'Question 94 (3 Points): Code Completion - Decision Tree Feature Importances',
        text: 'If you want to inspect the relative importance scores of all features after training a DecisionTreeClassifier, which attribute should replace the question mark (?) in the code below?\n\n```python\nfrom sklearn.tree import DecisionTreeClassifier\ntree_clf = DecisionTreeClassifier(max_depth=3, random_state=42)\ntree_clf.fit(X_train, y_train)\n\n# What attribute retrieves the normalized feature importance scores?\nprint(tree_clf.?)\n```',
        options: [
            { letter: 'A', text: 'feature_importances_ (Scikit-Learn standard trailing underscore attribute for fitted parameters)' },
            { letter: 'B', text: 'get_params() (Returns constructor initialization hyperparameters, not learned weights)' },
            { letter: 'C', text: 'tree_importances() (Non-existent method)' },
            { letter: 'D', text: 'coef_ (Used by linear models like LogisticRegression or LinearRegression, not trees)' }
        ],
        correctOption: 'A',
        explanation: `In Scikit-Learn, any attribute learned from data during <code>.fit(X, y)</code> ends with a <strong>trailing underscore (<code>_</code>)</strong> by API convention! <br><br>For decision trees and random forests, the learned feature weights (<em>computed as the total normalized reduction in Gini impurity brought by splits on each feature</em>) are stored in the <strong><code>.feature_importances_</code></strong> attribute (<em>an array of shape [n_features] summing to 1.0</em>).`
    },
    {
        id: 'q95',
        type: 'mcq',
        category: 'mcq',
        points: 3,
        title: 'Question 95 (3 Points): Code Completion - K-Means Centroid Coordinates',
        text: 'In Scikit-Learn\'s KMeans class, which fitted attribute returns the exact numeric coordinates (multi-dimensional vectors) of the $k$ cluster centroids after fit(X) is executed?\n\n```python\nfrom sklearn.cluster import KMeans\nkmeans = KMeans(n_clusters=3, random_state=42, n_init=10)\nkmeans.fit(X)\n\n# Retrieve coordinates of the 3 cluster centroids:\ncentroids = kmeans.?\n```',
        options: [
            { letter: 'A', text: 'cluster_centers_ (2D NumPy array of shape [n_clusters, n_features])' },
            { letter: 'B', text: 'centroids_array_ (Non-existent attribute)' },
            { letter: 'C', text: 'labels_ (1D integer array assigning each data point to its cluster integer 0 to k-1)' },
            { letter: 'D', text: 'inertia_ (Scalar float returning total within-cluster sum of squares WCSS)' }
        ],
        correctOption: 'A',
        explanation: `In Scikit-Learn's <code>KMeans</code> clustering class: <br>• <strong><code>.cluster_centers_</code>:</strong> Returns a 2D array of shape <code>(n_clusters, n_features)</code> containing the exact geometric coordinates of each cluster's mean centroid. <br>• <strong><code>.labels_</code>:</strong> Returns the integer cluster assignment (<em>0 to k-1</em>) for every single point in the training matrix $X$. <br>• <strong><code>.inertia_</code>:</strong> Returns the final minimized Within-Cluster Sum of Squares (<em>WCSS</em>) scalar value.`
    },
    {
        id: 'q96',
        type: 'mcq',
        category: 'mcq',
        points: 3,
        title: 'Question 96 (3 Points): Code Analysis - Train-Test Split Random State',
        text: 'What is the exact mathematical and practical effect of specifying random_state=42 inside train_test_split(X, y, test_size=0.2, random_state=42) during Scikit-Learn data preprocessing?\n\n```python\nfrom sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n```',
        options: [
            { letter: 'A', text: 'It forces exactly 42% of the training instances to be allocated to X_train' },
            { letter: 'B', text: 'It seeds the pseudo-random number generator so that the exact same deterministic partition of training and testing samples is produced across every run and machine (Guarantees experimental reproducibility)' },
            { letter: 'C', text: 'It restricts the downstream learning solver to a maximum of 42 optimization iterations' },
            { letter: 'D', text: 'It shuffles the dataset exactly 42 times before cutting the 80/20 partition' }
        ],
        correctOption: 'B',
        explanation: `Computers generate pseudo-random numbers using deterministic algorithms controlled by an initial integer seed (<em>the <code>random_state</code></em>). <br><br>By explicitly specifying <strong><code>random_state=42</code></strong> (<em>or any fixed integer</em>), you guarantee <strong>100% scientific reproducibility</strong>—every time you or an examiner runs your code, <code>train_test_split</code> will shuffle and divide the dataset into the exact same 80% training rows and 20% testing rows. If <code>random_state=None</code>, a random system clock seed is used, creating different train/test splits every execution.`
    },
    {
        id: 'q97',
        type: 'matching',
        category: 'matching',
        points: 3,
        title: 'Question 97 (3 Points): Scikit-Learn Core Estimator Methods vs Functionality',
        text: 'Match each core <strong>Scikit-Learn Estimator & Preprocessing Method</strong> directly to its computational function:',
        matchingPairs: [
            { left: 'model.fit(X, y)', right: 'Calculates internal model parameters (weights, centroids, split thresholds) from training data' },
            { left: 'model.predict(X)', right: 'Outputs discrete class labels or continuous predicted values for input instances' },
            { left: 'model.predict_proba(X)', right: 'Outputs normalized 2D probability distributions across all K classes summing to 1.0' },
            { left: 'scaler.transform(X)', right: 'Applies learned scaling transformations (e.g. mean subtraction and variance division) to feature matrices' },
            { left: 'model.score(X, y)', right: 'Computes default evaluation metric (Accuracy for classifiers, R^2 coefficient of determination for regressors)' }
        ],
        rightOptions: [
            'Calculates internal model parameters (weights, centroids, split thresholds) from training data',
            'Outputs discrete class labels or continuous predicted values for input instances',
            'Outputs normalized 2D probability distributions across all K classes summing to 1.0',
            'Applies learned scaling transformations (e.g. mean subtraction and variance division) to feature matrices',
            'Computes default evaluation metric (Accuracy for classifiers, R^2 coefficient of determination for regressors)'
        ],
        correctMatches: [
            'Calculates internal model parameters (weights, centroids, split thresholds) from training data',
            'Outputs discrete class labels or continuous predicted values for input instances',
            'Outputs normalized 2D probability distributions across all K classes summing to 1.0',
            'Applies learned scaling transformations (e.g. mean subtraction and variance division) to feature matrices',
            'Computes default evaluation metric (Accuracy for classifiers, R^2 coefficient of determination for regressors)'
        ],
        explanation: `<strong>💡 Scikit-Learn API Master Summary:</strong><br>• <strong><code>.fit(X, y)</code>:</strong> Trains the model and stores learned weights in trailing underscore attributes (<code>.coef_</code>, <code>.cluster_centers_</code>).<br>• <strong><code>.predict(X)</code>:</strong> Applies argmax (<em>classifiers</em>) or regression equations to predict exact outputs.<br>• <strong><code>.predict_proba(X)</code>:</strong> Outputs raw probability vectors (<em>classifiers only</em>).<br>• <strong><code>.transform(X)</code> & <code>.fit_transform(X)</code>:</strong> Used by transformers (<code>StandardScaler</code>, <code>PCA</code>, <code>PolynomialFeatures</code>) to modify input matrices.<br>• <strong><code>.score(X, y)</code>:</strong> Quick evaluation shortcut computing accuracy (<em>classification</em>) or $R^2$ (<em>regression</em>).`
    },
    {
        id: 'q98',
        type: 'matching',
        category: 'matching',
        points: 3,
        title: 'Question 98 (3 Points): Machine Learning Algorithms vs Key Hyperparameters',
        text: 'Match each <strong>Supervised / Unsupervised Scikit-Learn Estimator</strong> to its primary regularization or structural hyperparameter:',
        matchingPairs: [
            { left: 'DecisionTreeClassifier', right: 'max_depth & min_samples_split (Controls tree depth and pruning to prevent overfitting)' },
            { left: 'LogisticRegression', right: 'C (Inverse of regularization strength; smaller C values enforce stronger L1/L2 penalty)' },
            { left: 'KMeans', right: 'n_clusters (k) & n_init (Specifies cluster count and number of random centroid restarts)' },
            { left: 'KNeighborsClassifier', right: 'n_neighbors (k) & metric (Number of voting neighbors and distance formula like Euclidean)' },
            { left: 'RandomForestClassifier', right: 'n_estimators (Total number of individual bagged decision trees combined in the ensemble)' }
        ],
        rightOptions: [
            'max_depth & min_samples_split (Controls tree depth and pruning to prevent overfitting)',
            'C (Inverse of regularization strength; smaller C values enforce stronger L1/L2 penalty)',
            'n_clusters (k) & n_init (Specifies cluster count and number of random centroid restarts)',
            'n_neighbors (k) & metric (Number of voting neighbors and distance formula like Euclidean)',
            'n_estimators (Total number of individual bagged decision trees combined in the ensemble)'
        ],
        correctMatches: [
            'max_depth & min_samples_split (Controls tree depth and pruning to prevent overfitting)',
            'C (Inverse of regularization strength; smaller C values enforce stronger L1/L2 penalty)',
            'n_clusters (k) & n_init (Specifies cluster count and number of random centroid restarts)',
            'n_neighbors (k) & metric (Number of voting neighbors and distance formula like Euclidean)',
            'n_estimators (Total number of individual bagged decision trees combined in the ensemble)'
        ],
        explanation: `<strong>💡 Hyperparameter Tuning Cheat Sheet:</strong><br>• <strong>Decision Tree (<code>max_depth=None</code>):</strong> Prone to overfitting; tune <code>max_depth</code> to 3-10.<br>• <strong>Logistic Regression (<code>C=1.0</code>):</strong> $C = \\frac{1}{\\lambda}$. If model overfits, reduce $C$ (<em>e.g. C=0.01</em>). If model underfits, increase $C$ (<em>e.g. C=100</em>).<br>• <strong>K-Means (<code>n_clusters=8</code>):</strong> Must be tuned via the Elbow Method or Silhouette analysis.<br>• <strong>KNN (<code>n_neighbors=5</code>):</strong> Small $k=1$ has high variance (<em>overfitting</em>); large $k=50$ has high bias (<em>underfitting</em>).<br>• <strong>Random Forest (<code>n_estimators=100</code>):</strong> Increasing trees (<em>e.g. 200 or 500</em>) improves variance reduction at the cost of training speed (<em>never overfits by adding trees</em>).`
    }
];

// --- CORE NAVIGATION ENGINE (GLOBAL FUNCTION FOR DOUBLE SAFETY) ---
function switchTabSection(tabId, anchorId = null) { setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);
    try {
        if (!document.getElementById(`section-${tabId}`)) {
            console.warn(`Target section section-${tabId} not found.`);
            return;
        }
        document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));

        const targetSection = document.getElementById(`section-${tabId}`);
        if (targetSection) targetSection.classList.add('active');

        const targetTabBtn = document.querySelector(`.nav-tab[data-target="${tabId}"]`);
        if (targetTabBtn) targetTabBtn.classList.add('active');

        if (tabId === 'test-1' && typeof renderTest1Questions === 'function') {
            renderTest1Questions(window.test1CurrentFilter || 'all');
        }
        if (tabId === 'test-2' && typeof renderTest2Questions === 'function') {
            renderTest2Questions(window.test2CurrentFilter || 'all');
        }
        if (tabId === 'mock-questions' && typeof renderMockQuestions === 'function') {
            renderMockQuestions();
        }

        activeTab = tabId;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const navDropdown = document.getElementById('nav-jump-select');
        if (navDropdown) {
            const desiredVal = anchorId ? `${tabId}|${anchorId}` : tabId;
            let optExists = Array.from(navDropdown.options).some(o => o.value === desiredVal);
            navDropdown.value = optExists ? desiredVal : tabId;
        }

        if (anchorId) {
            setTimeout(() => {
                const anchorEl = document.getElementById(anchorId);
                if (anchorEl) anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 120);
        }
    } catch (err) {
        console.error("Navigation error:", err);
    }
}
window.switchTabSection = switchTabSection;

function resetProgress() {
    try {
        if (confirm("Are you sure you want to reset ALL solved CSY3081 exam answers across Dashboard, Test 1, and Test 2?")) {
            solvedState = {};
            localStorage.removeItem('csy3081_solved_v1');
            if (window.test1SolvedState) {
                window.test1SolvedState = {};
                localStorage.removeItem('csy3081_test1_solved_v1');
            }
            if (window.test2SolvedState) {
                window.test2SolvedState = {};
                localStorage.removeItem('csy3081_test2_solved_v1');
            }
            if (typeof updateProgressUI === 'function') updateProgressUI();
            if (typeof renderQuizList === 'function') renderQuizList();
            if (typeof updateTest1ProgressUI === 'function') updateTest1ProgressUI();
            if (typeof renderTest1Questions === 'function' && document.getElementById('test1-questions-container')) renderTest1Questions(window.test1CurrentFilter || 'all');
            if (typeof updateTest2ProgressUI === 'function') updateTest2ProgressUI();
            if (typeof renderTest2Questions === 'function' && document.getElementById('test2-questions-container')) renderTest2Questions(window.test2CurrentFilter || 'all');
            showToast("\uD83D\uDD04 All CSY3081 study progress (Dashboard, Test 1, and Test 2) reset to 0%");
            setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
        }
    } catch (err) {
        console.error("Reset error:", err);
    }
}
window.resetProgress = resetProgress;

// --- SINGLE QUESTION RESET & RE-ATTEMPT ENGINE ---
window.resetSingleQuestion = function(qid, section) {
    setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
    try {
        if (section === 'dashboard' || section === 'bank' || section === 'mock') {
            if (solvedState && solvedState[qid]) {
                delete solvedState[qid];
                localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
            }
            if (typeof renderQuizList === 'function') renderQuizList();
            if (typeof renderMockQuestions === 'function') renderMockQuestions();
            if (typeof updateProgressUI === 'function') updateProgressUI();
            if (typeof showToast === 'function') showToast("\uD83D\uDD04 Question " + qid + " cleared. Type or select your new answer!");
        } else if (section === 'test1') {
            if (window.test1SolvedState && window.test1SolvedState[qid]) {
                delete window.test1SolvedState[qid];
                localStorage.setItem('csy3081_test1_solved_v1', JSON.stringify(window.test1SolvedState));
            }
            if (typeof renderTest1Questions === 'function') renderTest1Questions(window.test1CurrentFilter || 'all');
            if (typeof updateTest1ProgressUI === 'function') updateTest1ProgressUI();
            if (typeof showToast === 'function') showToast("\uD83D\uDD04 Test 1 Question " + qid + " cleared. Try again!");
        } else if (section === 'test2') {
            if (window.test2SolvedState && window.test2SolvedState[qid]) {
                delete window.test2SolvedState[qid];
                localStorage.setItem('csy3081_test2_solved_v1', JSON.stringify(window.test2SolvedState));
            }
            if (typeof renderTest2Questions === 'function') renderTest2Questions(window.test2CurrentFilter || 'all');
            if (typeof updateTest2ProgressUI === 'function') updateTest2ProgressUI();
            if (typeof showToast === 'function') showToast("\uD83D\uDD04 Test 2 Question " + qid + " cleared. Try again!");
        }
    } catch (e) {
        console.error("resetSingleQuestion error:", e);
    }
};

function updateProgressUI() {
    try {
        const totalQuestionsCount = typeof QUESTION_BANK !== 'undefined' && QUESTION_BANK.length ? QUESTION_BANK.length : 66;
        const totalCount = Object.keys(solvedState).length;
        const correctCount = Object.values(solvedState).filter(s => s.status === 'correct').length;

        const answeredEl = document.getElementById('stat-answered');
        if (answeredEl) answeredEl.innerText = `${totalCount} / ${totalQuestionsCount}`;

        const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        const accEl = document.getElementById('stat-accuracy');
        if (accEl) accEl.innerText = `${accuracy}%`;

        let readiness = Math.round((totalCount / totalQuestionsCount) * accuracy);
        if (totalCount === 0) readiness = 0;

        const navVal = document.getElementById('nav-readiness-val');
        if (navVal) navVal.innerText = `${readiness}%`;

        const navFill = document.getElementById('nav-progress-fill');
        if (navFill) navFill.style.width = `${readiness}%`;

        const statusBadge = document.getElementById('stat-status-text');
        if (statusBadge) {
            if (totalCount === 0) {
                statusBadge.className = 'status-badge status-pending';
                statusBadge.innerText = 'Not Started';
            } else if (totalCount < totalQuestionsCount) {
                statusBadge.className = 'status-badge status-active';
                statusBadge.innerText = 'In Progress';
            } else {
                statusBadge.className = 'status-badge status-completed';
                statusBadge.innerText = `Completed (${accuracy}% Avg)`;
            }
        }
    } catch (err) {
        console.error("Progress UI update error:", err);
    }
}
window.updateProgressUI = updateProgressUI;

function showToast(msg) {
    try {
        const toast = document.getElementById('toast-notify');
        const text = document.getElementById('toast-text');
        if (!toast || !text) return;

        text.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2800);
    } catch (err) {
        console.error("Toast error:", err);
    }
}
window.showToast = showToast;


// --- DOM READY MASTER INITIALIZER ---
document.addEventListener('DOMContentLoaded', () => {
    try { initNavigation(); } catch (e) { console.error("initNavigation error:", e); }
    try { initDashboardHandlers(); } catch (e) { console.error("initDashboardHandlers error:", e); }
    try { initExamHandlers(); } catch (e) { console.error("initExamHandlers error:", e); }
    try { initLab1Handlers(); } catch (e) { console.error("initLab1Handlers error:", e); }
    try { initLab2Handlers(); } catch (e) { console.error("initLab2Handlers error:", e); }
    try { initLab3Handlers(); } catch (e) { console.error("initLab3Handlers error:", e); }
    try { initLab4Handlers(); } catch (e) { console.error("initLab4Handlers error:", e); }
    try { initCopyCodeHandlers(); } catch (e) { console.error("initCopyCodeHandlers error:", e); }
    
    try { updateProgressUI(); } catch (e) { console.error("updateProgressUI error:", e); }
    try { updateTest1ProgressUI(); } catch (e) { console.error("updateTest1ProgressUI error:", e); }
    try { updateTest2ProgressUI(); } catch (e) { console.error("updateTest2ProgressUI error:", e); }
    try { renderQuizList(); } catch (e) { console.error("renderQuizList error:", e); }
    try { runTreeSimulation(); } catch (e) { console.error("runTreeSimulation error:", e); }
    try { runKMeansSimulation(); } catch (e) { console.error("runKMeansSimulation error:", e); }
    try { runKNNSimulation(); } catch (e) { console.error("runKNNSimulation error:", e); }
    try { runRFSimulation(); } catch (e) { console.error("runRFSimulation error:", e); }
});

// --- 1. NAVIGATION TABS ---
function initNavigation() {
    const navBar = document.getElementById("main-nav");
    if (!navBar || navBar._hasInit) return;
    navBar._hasInit = true;

    navBar.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.nav-tab');
        if (!tabBtn) return;
        const targetId = tabBtn.dataset.target;
        if (targetId) switchTabSection(targetId);
    });
}

// --- 2. DASHBOARD HANDLERS ---
function initDashboardHandlers() {
    if (window._hasInitDashboard) return;
    window._hasInitDashboard = true;
    const startBtn = document.getElementById("btn-start-exam");
    if (startBtn) startBtn.addEventListener('click', () => switchTabSection('exam-simulator'));

    const exploreBtn = document.getElementById('btn-explore-labs');
    if (exploreBtn) exploreBtn.addEventListener('click', () => switchTabSection('interactive-visualizer'));

    const jumpNotesBtn = document.getElementById('btn-jump-notes');
    if (jumpNotesBtn) jumpNotesBtn.addEventListener('click', () => switchTabSection('study-notes'));

    const resetBtn = document.getElementById('btn-reset-stats');
    if (resetBtn) resetBtn.addEventListener('click', resetProgress);

    const syllabusWrap = document.getElementById('syllabus-directory');
    if (syllabusWrap) {
        syllabusWrap.addEventListener('click', (e) => {
            const card = e.target.closest('.syllabus-card');
            if (!card) return;
            const tab = card.dataset.jumpTab;
            const anchor = card.dataset.jumpAnchor;
            if (tab) switchTabSection(tab, anchor);
        });
    }
}

// --- 3. EXAM SIMULATOR ENGINE ---
function initExamHandlers() {
    const modeToggle = document.getElementById('exam-mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', (e) => {
            const btn = e.target.closest('.toggle-item');
            if (!btn) return;
            setTestingMode(btn.dataset.mode);
        });
    }

    const filterGroup = document.getElementById('filter-buttons');
    if (filterGroup) {
        filterGroup.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.category;
            renderQuizList();
        });
    }

    const gradeBtn = document.getElementById('btn-grade-exam');
    if (gradeBtn) gradeBtn.addEventListener('click', submitTimedExam);

    document.body.addEventListener('click', (e) => {
        const optItem = e.target.closest('.option-item');
        if (optItem && !optItem.classList.contains('disabled')) {
            const qid = optItem.dataset.qid;
            const letter = optItem.dataset.letter;
            if (qid && letter && window.handleOptionClick) {
                window.handleOptionClick(qid, letter, optItem);
                return;
            }
        }

        const checkBtn = e.target.closest('.btn-check-blank');
        if (checkBtn) {
            const qid = checkBtn.dataset.qid;
            if (qid && window.handleBlankSubmission) {
                window.handleBlankSubmission(qid);
                return;
            }
        }

        const matchBtn = e.target.closest('.btn-check-match');
        if (matchBtn) {
            const qid = matchBtn.dataset.qid;
            if (qid && window.handleMatchingSubmission) {
                window.handleMatchingSubmission(qid);
                return;
            }
        }
    });
}

function cleanTextForDisplay(str) {
    if (!str || typeof str !== 'string') return '';
    let cleaned = str.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return cleaned;
}
window.cleanTextForDisplay = cleanTextForDisplay;


function setTestingMode(mode) {
    try {
        examMode = mode;
        document.querySelectorAll('#exam-mode-toggle .toggle-item').forEach(btn => {
            if (btn.dataset.mode === mode) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        const timerBox = document.getElementById('exam-timer-box');
        const submitFooter = document.getElementById('submit-exam-footer');

        if (mode === 'exam') {
            if (timerBox) timerBox.classList.remove('hidden');
            if (submitFooter) submitFooter.classList.remove('hidden');
            startCountdown();
            showToast("⏱️ Timed Exam Mode Started! 30 minutes on the clock.");
        } else {
            if (timerBox) timerBox.classList.add('hidden');
            if (submitFooter) submitFooter.classList.add('hidden');
            clearInterval(timerInterval);
            showToast("💡 Practice Mode Active (Instant grading & solutions)");
        }
        renderQuizList();
    } catch (err) {
        console.error("Set testing mode error:", err);
    }
}
window.setTestingMode = setTestingMode;

function startCountdown() {
    clearInterval(timerInterval);
    secondsRemaining = 1800;
    updateTimerText();

    timerInterval = setInterval(() => {
        secondsRemaining--;
        updateTimerText();
        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            alert("⏰ Time has expired! Automatically grading your exam now.");
            submitTimedExam();
        }
    }, 1000);
}

function updateTimerText() {
    const clock = document.getElementById('timer-clock');
    if (!clock) return;
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    clock.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function renderQuizList() {
    try {
        const listWrap = document.getElementById('quiz-questions-list');
        if (!listWrap) return;
        listWrap.innerHTML = '';

        const practiceBank = QUESTION_BANK.slice(0, 66);
        const filtered = activeFilter === 'all' 
            ? practiceBank 
            : practiceBank.filter(q => q.category === activeFilter);

        filtered.forEach(q => {
            const isSolved = solvedState[q.id];
            let cardStatusClass = '';
            if (examMode === 'practice' && isSolved) {
                cardStatusClass = isSolved.status === 'correct' ? ' status-solved-correct' : ' status-solved-wrong';
            }

            let html = `
                <div class="question-card${cardStatusClass}" id="card-${q.id}">
                    <div class="question-head">
                        <span class="question-meta">${q.type.toUpperCase()} | ${q.title}</span>
                        <span class="question-pts">${q.points} ${q.points === 1 ? 'Point' : 'Points'}</span>
                    </div>
                    <div class="question-body">${cleanTextForDisplay(q.text)}</div>
            `;

            if (q.codeSnippet) {
                html += `<pre class="code-box"><code>${q.codeSnippet}</code></pre>`;
            }

            if (q.options) {
                html += `<div class="options-list">`;
                q.options.forEach(opt => {
                    let optState = '';
                    if (examMode === 'practice' && isSolved) {
                        optState = 'disabled';
                        if (opt.letter === q.correctOption) optState += ' correct';
                        else if (isSolved.selected === opt.letter) optState += ' wrong';
                    }
                    html += `
                        <div class="option-item ${optState}" data-qid="${q.id}" data-letter="${opt.letter}" onclick="if(window.handleOptionClick) window.handleOptionClick('${q.id}', '${opt.letter}', this)">
                            <span class="opt-key">${opt.letter}</span>
                            <span>${cleanTextForDisplay(opt.text)}</span>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            if (q.type === 'fill-blank') {
                const userText = (isSolved && isSolved.selected && isSolved.selected !== 'exam_submitted') ? isSolved.selected : '';
                let statusBadgeText = '';
                if (isSolved) {
                    if (isSolved.status === 'correct') statusBadgeText = '<span style="color:#10b981;font-weight:700;margin-left:8px;">✓ Correct (+1 Pt)</span>';
                    else if (isSolved.status === 'wrong') statusBadgeText = '<span style="color:#ef4444;font-weight:700;margin-left:8px;">✕ Incorrect</span>';
                    else if (isSolved.status === 'revealed') statusBadgeText = '<span style="color:#38bdf8;font-weight:700;margin-left:8px;">💡 Answer Revealed</span>';
                }
                html += `
                    <div class="input-row" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;">
                        <input type="text" id="input-${q.id}" class="input-text" placeholder="Optional: Type your answer or click check..." value="${userText}" style="flex:1;min-width:220px;padding:8px 12px;border:2px solid var(--border-color);border-radius:6px;background:var(--card-bg);color:var(--text-primary);font-size:0.95rem;">
                        <button class="btn btn-primary btn-sm btn-check-blank" data-qid="${q.id}" onclick="if(window.handleBlankSubmission) window.handleBlankSubmission('${q.id}')" style="background:#4f46e5;color:#fff;font-weight:600;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;">${isSolved ? '🔄 Check / Update' : '💡 Check / Reveal Answer'}</button>
                        ${isSolved ? `<button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion('${q.id}', 'dashboard')" style="background:#3b82f6;color:#fff;font-weight:600;padding:8px 14px;border-radius:6px;border:none;cursor:pointer;">🔄 Reset Blank</button>` : ''}
                        ${statusBadgeText}
                    </div>
                `;
            }

            if (q.type === 'matching') {
                html += `<div class="matching-table">`;
                q.matchingPairs.forEach((pair, idx) => {
                    const isDisabled = (examMode === 'practice' && isSolved) ? 'disabled' : '';
                    html += `
                        <div class="matching-item">
                            <strong>${pair.left}</strong>
                            <select id="sel-${q.id}-${idx}" class="matching-select" ${isDisabled}>
                                <option value="">Choose matching option...</option>
                                ${q.rightOptions.map(r => `<option value="${r}">${r}</option>`).join('')}
                            </select>
                        </div>
                    `;
                });
                html += `</div>`;
                if (examMode === 'practice' && !isSolved) {
                    html += `<button class="btn btn-primary btn-sm btn-check-match" data-qid="${q.id}" onclick="if(window.handleMatchingSubmission) window.handleMatchingSubmission('${q.id}')">Verify Matching Pairs</button>`;
                }
            }

            if (examMode === 'practice' && isSolved) {
                let visibleAnsHtml = '';
                if (q.correctOption) {
                    const optObj = q.options && q.options.find(o => o.letter === q.correctOption);
                    const optText = optObj ? optObj.text : '';
                    visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Answer:</strong> <div><span class="answer-highlight">Option ${q.correctOption}${optText ? ' — ' + cleanTextForDisplay(optText) : ''}</span></div></div>`;
                } else if (q.correctAnswer) {
                    visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Answer:</strong> <div><span class="answer-highlight">${cleanTextForDisplay(q.correctAnswer)}</span></div></div>`;
                } else if (q.correctMatches || q.matchingPairs) {
                    const pairs = q.matchingPairs || [];
                    visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Matching Pairs:</strong><ul class="matching-answer-list">${pairs.map(p => `<li><span class="match-left">${p.left}</span> ➔ <span class="match-right">${p.right}</span></li>`).join('')}</ul></div>`;
                }

                html += `
                    <div style="margin-top:14px;margin-bottom:8px;">
                        <button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion('${q.id}', 'dashboard')" style="background:#3b82f6;color:#fff;font-weight:600;padding:6px 14px;border-radius:6px;border:1px solid #60a5fa;cursor:pointer;">🔄 Reset Question & Try Again</button>
                    </div>
                    <div class="solution-box">
                        ${visibleAnsHtml}
                        <strong>💡 CSY3081 Solution & Course Documentation Reference:</strong>
                        <div style="line-height:1.65;">${cleanTextForDisplay(q.explanation)}</div>
                    </div>
                `;
            }

            html += `</div>`;
            listWrap.innerHTML += html;
        });
    } catch (err) {
        console.error("renderQuizList error:", err);
    }
}
window.renderQuizList = renderQuizList;

function renderMockQuestions() {
    try {
        const listWrap = document.getElementById('mock-questions-container');
        if (!listWrap) return;
        listWrap.innerHTML = '';

        const mockBank = QUESTION_BANK.slice(66);
        mockBank.forEach(q => {
            const isSolved = solvedState[q.id];
            let cardStatusClass = '';
            if (isSolved) {
                cardStatusClass = isSolved.status === 'correct' ? ' status-solved-correct' : ' status-solved-wrong';
            }

            let html = `
                <div class="question-card${cardStatusClass}" id="card-${q.id}">
                    <div class="question-head">
                        <span class="question-meta">${q.type.toUpperCase()} | ${q.title}</span>
                        <span class="question-pts">${q.points} ${q.points === 1 ? 'Point' : 'Points'}</span>
                    </div>
                    <div class="question-body">${cleanTextForDisplay(q.text)}</div>
            `;

            if (q.codeSnippet) {
                html += `<pre class="code-box"><code>${q.codeSnippet}</code></pre>`;
            }

            if (q.options) {
                html += `<div class="options-list">`;
                q.options.forEach(opt => {
                    let optState = '';
                    if (isSolved) {
                        optState = 'disabled';
                        if (opt.letter === q.correctOption) optState += ' correct';
                        else if (isSolved.selected === opt.letter) optState += ' wrong';
                    }
                    html += `
                        <div class="option-item ${optState}" data-qid="${q.id}" data-letter="${opt.letter}" onclick="if(window.handleOptionClick) window.handleOptionClick('${q.id}', '${opt.letter}', this)">
                            <span class="opt-key">${opt.letter}</span>
                            <span>${cleanTextForDisplay(opt.text)}</span>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            if (q.type === 'fill-blank') {
                const userText = (isSolved && isSolved.selected && isSolved.selected !== 'exam_submitted') ? isSolved.selected : '';
                let statusBadgeText = '';
                if (isSolved) {
                    if (isSolved.status === 'correct') statusBadgeText = '<span style="color:#10b981;font-weight:700;margin-left:8px;">✓ Correct (+1 Pt)</span>';
                    else if (isSolved.status === 'wrong') statusBadgeText = '<span style="color:#ef4444;font-weight:700;margin-left:8px;">✕ Incorrect</span>';
                    else if (isSolved.status === 'revealed') statusBadgeText = '<span style="color:#38bdf8;font-weight:700;margin-left:8px;">💡 Answer Revealed</span>';
                }
                html += `
                    <div class="input-row" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;">
                        <input type="text" id="input-${q.id}" class="input-text" placeholder="Optional: Type your answer or click check..." value="${userText}" style="flex:1;min-width:220px;padding:8px 12px;border:2px solid var(--border-color);border-radius:6px;background:var(--card-bg);color:var(--text-primary);font-size:0.95rem;">
                        <button class="btn btn-primary btn-sm btn-check-blank" data-qid="${q.id}" onclick="if(window.handleBlankSubmission) window.handleBlankSubmission('${q.id}')" style="background:#4f46e5;color:#fff;font-weight:600;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;">${isSolved ? '🔄 Check / Update' : '💡 Check / Reveal Answer'}</button>
                        ${isSolved ? `<button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion('${q.id}', 'mock')" style="background:#3b82f6;color:#fff;font-weight:600;padding:8px 14px;border-radius:6px;border:none;cursor:pointer;">🔄 Reset Blank</button>` : ''}
                        ${statusBadgeText}
                    </div>
                `;
            }

            if (q.type === 'matching') {
                html += `<div class="matching-table">`;
                q.matchingPairs.forEach((pair, idx) => {
                    const isDisabled = isSolved ? 'disabled' : '';
                    html += `
                        <div class="matching-item">
                            <strong>${pair.left}</strong>
                            <select id="sel-${q.id}-${idx}" class="matching-select" ${isDisabled}>
                                <option value="">Choose matching option...</option>
                                ${q.rightOptions.map(r => `<option value="${r}">${r}</option>`).join('')}
                            </select>
                        </div>
                    `;
                });
                html += `</div>`;
                if (!isSolved) {
                    html += `<button class="btn btn-primary btn-sm btn-check-match" data-qid="${q.id}" onclick="if(window.handleMatchingSubmission) window.handleMatchingSubmission('${q.id}')">Verify Matching Pairs</button>`;
                }
            }

            if (isSolved) {
                let visibleAnsHtml = '';
                if (q.correctOption) {
                    const optObj = q.options && q.options.find(o => o.letter === q.correctOption);
                    const optText = optObj ? optObj.text : '';
                    visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Answer:</strong> <div><span class="answer-highlight">Option ${q.correctOption}${optText ? ' — ' + cleanTextForDisplay(optText) : ''}</span></div></div>`;
                } else if (q.correctAnswer) {
                    visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Answer:</strong> <div><span class="answer-highlight">${cleanTextForDisplay(q.correctAnswer)}</span></div></div>`;
                } else if (q.correctMatches || q.matchingPairs) {
                    const pairs = q.matchingPairs || [];
                    visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Matching Pairs:</strong><ul class="matching-answer-list">${pairs.map(p => `<li><span class="match-left">${p.left}</span> ➔ <span class="match-right">${p.right}</span></li>`).join('')}</ul></div>`;
                }

                html += `
                    <div style="margin-top:14px;margin-bottom:8px;">
                        <button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion('${q.id}', 'mock')" style="background:#3b82f6;color:#fff;font-weight:600;padding:6px 14px;border-radius:6px;border:1px solid #60a5fa;cursor:pointer;">🔄 Reset Question & Try Again</button>
                    </div>
                    <div class="solution-box mock-explanation">
                        ${visibleAnsHtml}
                        <strong>💡 CSY3081 Solution & Course Documentation Reference:</strong>
                        <div style="line-height:1.65;">${cleanTextForDisplay(q.explanation)}</div>
                    </div>
                `;
            }

            html += `</div>`;
            listWrap.innerHTML += html;
        });

        setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
    } catch (err) {
        console.error("renderMockQuestions error:", err);
    }
}
window.renderMockQuestions = renderMockQuestions;

function toggleAllMockExplanations() {
    try {
        const exps = document.querySelectorAll('#mock-questions-container .mock-explanation');
        if (exps.length === 0) {
            QUESTION_BANK.slice(66).forEach(q => {
                if (!solvedState[q.id]) {
                    if (q.correctOption) solvedState[q.id] = { status: 'correct', selected: q.correctOption };
                    else if (q.correctAnswer) solvedState[q.id] = { status: 'correct', selected: q.correctAnswer };
                    else solvedState[q.id] = { status: 'correct', selected: 'match_graded' };
                }
            });
            localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
            renderMockQuestions();
            updateProgressUI();
            const btnText = document.getElementById('btn-toggle-mock-exp-text');
            if (btnText) btnText.textContent = "Hide All 32 Answers & Explanations";
            return;
        }
        let anyHidden = false;
        exps.forEach(e => {
            if (!e.classList.contains('show') && e.style.display === 'none') anyHidden = true;
        });
        const btnText = document.getElementById('btn-toggle-mock-exp-text');
        exps.forEach(e => {
            if (anyHidden || e.style.display === 'none') {
                e.style.display = 'block';
                if (btnText) btnText.textContent = "Hide All 32 Answers & Explanations";
            } else {
                e.style.display = 'none';
                if (btnText) btnText.textContent = "Reveal All 32 Answers & Explanations";
            }
        });
    } catch (err) {
        console.error("toggleAllMockExplanations error:", err);
    }
}
window.toggleAllMockExplanations = toggleAllMockExplanations;

function resetMockExam() {
    try {
        if (confirm("Reset all answers in the Mock Possible Questions section?")) {
            QUESTION_BANK.slice(66).forEach(q => {
                delete solvedState[q.id];
            });
            localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
            renderMockQuestions();
            updateProgressUI();
            showToast("🔄 Mock Possible Questions section reset!");
        }
    } catch (err) {
        console.error("resetMockExam error:", err);
    }
}
window.resetMockExam = resetMockExam;

function handleOptionClick(qid, letter, optionEl) {
    try {
        if (examMode === 'practice' && solvedState[qid]) return;

        const q = QUESTION_BANK.find(item => item.id === qid);
        const isCorrect = (letter === q.correctOption);

        if (examMode === 'practice') {
            solvedState[qid] = { status: isCorrect ? 'correct' : 'wrong', selected: letter };
            localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
            updateProgressUI();
            renderQuizList();
            if (typeof renderMockQuestions === 'function') renderMockQuestions();
            showToast(isCorrect ? "✓ Correct! Spot on." : "✕ Incorrect. Review solution below.");
        } else {
            const card = document.getElementById(`card-${qid}`);
            if (card) {
                card.querySelectorAll('.option-item').forEach(item => item.classList.remove('selected'));
                optionEl.classList.add('selected');
                optionEl.dataset.selectedVal = letter;
            }
        }
    } catch (err) {
        console.error("handleOptionClick error:", err);
    }
}

function handleBlankSubmission(qid) {
    try {
        const inputEl = document.getElementById(`input-${qid}`);
        if (!inputEl) return;
        const val = inputEl.value.trim().toLowerCase();
        if (!val) {
            showToast("⚠️ Please type your answer keyword first.");
            return;
        }

        const q = QUESTION_BANK.find(item => item.id === qid);
        const isCorrect = q.acceptableAnswers.map(a => a.toLowerCase()).includes(val);

        solvedState[qid] = { status: isCorrect ? 'correct' : 'wrong', selected: inputEl.value.trim() };
        localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
        updateProgressUI();
        renderQuizList();
        if (typeof renderMockQuestions === 'function') renderMockQuestions();
        showToast(isCorrect ? "✓ Correct answer!" : "✕ Incorrect keyword. See solution below.");
    } catch (err) {
        console.error("handleBlankSubmission error:", err);
    }
}

function handleMatchingSubmission(qid) {
    try {
        const q = QUESTION_BANK.find(item => item.id === qid);
        let allCorrect = true;

        q.matchingPairs.forEach((pair, idx) => {
            const selEl = document.getElementById(`sel-${qid}-${idx}`);
            if (!selEl || selEl.value !== pair.right) {
                allCorrect = false;
            }
        });

        solvedState[qid] = { status: allCorrect ? 'correct' : 'wrong', selected: 'match_graded' };
        localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
        updateProgressUI();
        renderQuizList();
        if (typeof renderMockQuestions === 'function') renderMockQuestions();
        showToast(allCorrect ? "✓ Perfect matching accuracy!" : "✕ One or more pairs were incorrect.");
    } catch (err) {
        console.error("handleMatchingSubmission error:", err);
    }
}

function submitTimedExam() {
    try {
        clearInterval(timerInterval);
        let totalScore = 0;
        const maxScore = typeof QUESTION_BANK !== 'undefined' && QUESTION_BANK.length ? QUESTION_BANK.reduce((sum, q) => sum + (q.points || 0), 0) : 122;

        QUESTION_BANK.forEach(q => {
            const card = document.getElementById(`card-${q.id}`);
            if (!card) return;
            let status = 'wrong';

            if (q.options) {
                const selItem = card.querySelector('.option-item.selected');
                if (selItem && selItem.dataset.selectedVal === q.correctOption) {
                    status = 'correct';
                    totalScore += q.points;
                }
            } else if (q.type === 'fill-blank') {
                const inpEl = document.getElementById(`input-${q.id}`);
                if (inpEl) {
                    const val = inpEl.value.trim().toLowerCase();
                    if (q.acceptableAnswers.map(a => a.toLowerCase()).includes(val)) {
                        status = 'correct';
                        totalScore += q.points;
                    }
                }
            }

            solvedState[q.id] = { status: status, selected: 'exam_submitted' };
        });

        localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
        updateProgressUI();
        setTestingMode('practice');
        const totalQuestionsCount = typeof QUESTION_BANK !== 'undefined' ? QUESTION_BANK.length : 66;
        alert(`🏆 CSY3081 Exam Graded! Your final score is ${totalScore} out of ${maxScore} possible points across all ${totalQuestionsCount} questions.`);
    } catch (err) {
        console.error("submitTimedExam error:", err);
    }
}
window.submitTimedExam = submitTimedExam;


// --- 4. INTERACTIVE LAB 1: DECISION TREE SPLIT SIMULATOR ---
function initLab1Handlers() {
    const sliders = ['slider-c0', 'slider-c1', 'slider-c2', 'slider-total'];
    sliders.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', runTreeSimulation);
    });

    const presetExam = document.getElementById('btn-preset-exam');
    if (presetExam) presetExam.addEventListener('click', () => setTreePreset(5, 85, 10));

    const presetPure = document.getElementById('btn-preset-pure');
    if (presetPure) presetPure.addEventListener('click', () => setTreePreset(100, 0, 0));
}

function setTreePreset(c0, c1, c2) {
    try {
        const c0El = document.getElementById('slider-c0');
        const c1El = document.getElementById('slider-c1');
        const c2El = document.getElementById('slider-c2');
        const totEl = document.getElementById('slider-total');
        if (c0El) c0El.value = c0;
        if (c1El) c1El.value = c1;
        if (c2El) c2El.value = c2;
        if (totEl) totEl.value = c0 + c1 + c2;
        runTreeSimulation();
        showToast(`🌳 Loaded preset distribution: [${c0}, ${c1}, ${c2}]`);
    } catch (err) {
        console.error("setTreePreset error:", err);
    }
}
window.setTreePreset = setTreePreset;

function runTreeSimulation() {
    try {
        const c0El = document.getElementById('slider-c0');
        const c1El = document.getElementById('slider-c1');
        const c2El = document.getElementById('slider-c2');
        const totalEl = document.getElementById('slider-total');
        if (!c0El || !c1El || !c2El || !totalEl) return;

        const c0 = parseInt(c0El.value);
        const c1 = parseInt(c1El.value);
        const c2 = parseInt(c2El.value);
        const total = parseInt(totalEl.value);

        const sumCounts = Math.max(1, c0 + c1 + c2);
        const p0 = c0 / sumCounts;
        const p1 = c1 / sumCounts;
        const p2 = c2 / sumCounts;

        const vC0 = document.getElementById('val-c0');
        const vC1 = document.getElementById('val-c1');
        const vC2 = document.getElementById('val-c2');
        const vTot = document.getElementById('val-total');
        if (vC0) vC0.innerText = c0;
        if (vC1) vC1.innerText = c1;
        if (vC2) vC2.innerText = c2;
        if (vTot) vTot.innerText = total;

        const outS = document.getElementById('out-samples');
        const outV = document.getElementById('out-values');
        if (outS) outS.innerText = total;
        if (outV) outV.innerText = `${c0}, ${c1}, ${c2}`;

        const pC0 = document.getElementById('prob-c0');
        const pC1 = document.getElementById('prob-c1');
        const pC2 = document.getElementById('prob-c2');
        if (pC0) pC0.innerText = p0.toFixed(3);
        if (pC1) pC1.innerText = p1.toFixed(3);
        if (pC2) pC2.innerText = p2.toFixed(3);

        const bC0 = document.getElementById('bar-c0');
        const bC1 = document.getElementById('bar-c1');
        const bC2 = document.getElementById('bar-c2');
        if (bC0) bC0.style.width = `${p0 * 100}%`;
        if (bC1) bC1.style.width = `${p1 * 100}%`;
        if (bC2) bC2.style.width = `${p2 * 100}%`;

        const gini = 1 - (p0 * p0 + p1 * p1 + p2 * p2);
        const outG = document.getElementById('out-gini');
        if (outG) outG.innerText = gini.toFixed(4);

        const predEl = document.getElementById('out-pred-class');
        if (predEl) {
            if (c1 >= c0 && c1 >= c2) {
                predEl.className = 'class-pill pill-c1';
                predEl.innerText = 'Class 1 (Versicolor)';
            } else if (c0 >= c1 && c0 >= c2) {
                predEl.className = 'class-pill pill-c0';
                predEl.innerText = 'Class 0 (Setosa)';
            } else {
                predEl.className = 'class-pill pill-c2';
                predEl.innerText = 'Class 2 (Virginica)';
            }
        }
    } catch (err) {
        console.error("runTreeSimulation error:", err);
    }
}
window.runTreeSimulation = runTreeSimulation;


// --- 5. INTERACTIVE LAB 2: K-MEANS 2D CLUSTERING CANVAS ---
let kmeansPoints = [];
let kmeansK = 3;
let kmeansCentroids = [];
const clusterPalette = ['#2563eb', '#059669', '#d97706', '#dc2626'];

function initLab2Handlers() {
    const canvas = document.getElementById('kmeans-canvas');
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            kmeansPoints.push({ x, y, cluster: -1 });
            runKMeansSimulation();
        });
    }

    const kBtnWrap = document.getElementById('kmeans-k-buttons');
    if (kBtnWrap) {
        kBtnWrap.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-k');
            if (!btn) return;
            document.querySelectorAll('#kmeans-k-buttons .btn-k').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            kmeansK = parseInt(btn.dataset.k);
            runKMeansSimulation();
        });
    }

    const runBtn = document.getElementById('btn-run-kmeans');
    if (runBtn) runBtn.addEventListener('click', runKMeansSimulation);

    const genBtn = document.getElementById('btn-gen-blobs');
    if (genBtn) genBtn.addEventListener('click', generateSyntheticBlobs);

    const clearBtn = document.getElementById('btn-clear-canvas');
    if (clearBtn) clearBtn.addEventListener('click', clearKMeansCanvas);

    generateSyntheticBlobs();
}

function generateSyntheticBlobs() {
    try {
        kmeansPoints = [];
        const centers = [{ x: 110, y: 90 }, { x: 350, y: 110 }, { x: 230, y: 250 }];
        centers.forEach(c => {
            for (let i = 0; i < 22; i++) {
                kmeansPoints.push({
                    x: Math.max(15, Math.min(465, c.x + (Math.random() - 0.5) * 80)),
                    y: Math.max(15, Math.min(325, c.y + (Math.random() - 0.5) * 80)),
                    cluster: -1
                });
            }
        });
        runKMeansSimulation();
        showToast("🎯 Generated 66 synthetic data points across 3 blobs!");
    } catch (err) {
        console.error("generateSyntheticBlobs error:", err);
    }
}
window.generateSyntheticBlobs = generateSyntheticBlobs;

function clearKMeansCanvas() {
    try {
        kmeansPoints = [];
        kmeansCentroids = [];
        drawKMeansCanvas();
        const ptsEl = document.getElementById('km-stat-points');
        const inEl = document.getElementById('km-stat-inertia');
        if (ptsEl) ptsEl.innerText = '0';
        if (inEl) inEl.innerText = '0.00';
    } catch (err) {
        console.error("clearKMeansCanvas error:", err);
    }
}
window.clearKMeansCanvas = clearKMeansCanvas;

function runKMeansSimulation() {
    try {
        if (kmeansPoints.length === 0) {
            drawKMeansCanvas();
            return;
        }

        kmeansCentroids = [];
        for (let i = 0; i < kmeansK; i++) {
            const randPt = kmeansPoints[Math.floor(Math.random() * kmeansPoints.length)];
            kmeansCentroids.push({ x: randPt.x + (Math.random() - 0.5) * 8, y: randPt.y + (Math.random() - 0.5) * 8 });
        }

        for (let iter = 0; iter < 12; iter++) {
            kmeansPoints.forEach(pt => {
                let minDist = Infinity;
                let bestIdx = 0;
                kmeansCentroids.forEach((cent, cIdx) => {
                    const dist = Math.hypot(pt.x - cent.x, pt.y - cent.y);
                    if (dist < minDist) {
                        minDist = dist;
                        bestIdx = cIdx;
                    }
                });
                pt.cluster = bestIdx;
            });

            kmeansCentroids.forEach((cent, cIdx) => {
                const clusterPts = kmeansPoints.filter(p => p.cluster === cIdx);
                if (clusterPts.length > 0) {
                    cent.x = clusterPts.reduce((sum, p) => sum + p.x, 0) / clusterPts.length;
                    cent.y = clusterPts.reduce((sum, p) => sum + p.y, 0) / clusterPts.length;
                }
            });
        }

        let inertia = 0;
        kmeansPoints.forEach(pt => {
            if (pt.cluster >= 0) {
                const cent = kmeansCentroids[pt.cluster];
                inertia += Math.pow(pt.x - cent.x, 2) + Math.pow(pt.y - cent.y, 2);
            }
        });

        const ptsEl = document.getElementById('km-stat-points');
        const inEl = document.getElementById('km-stat-inertia');
        if (ptsEl) ptsEl.innerText = kmeansPoints.length;
        if (inEl) inEl.innerText = (inertia / 100).toFixed(2);

        drawKMeansCanvas();
    } catch (err) {
        console.error("runKMeansSimulation error:", err);
    }
}
window.runKMeansSimulation = runKMeansSimulation;

function drawKMeansCanvas() {
    try {
        const canvas = document.getElementById('kmeans-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        kmeansPoints.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = pt.cluster >= 0 ? clusterPalette[pt.cluster % clusterPalette.length] : '#94a3b8';
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        });

        kmeansCentroids.forEach((cent, idx) => {
            ctx.beginPath();
            ctx.arc(cent.x, cent.y, 11, 0, Math.PI * 2);
            ctx.fillStyle = clusterPalette[idx % clusterPalette.length];
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`C${idx}`, cent.x, cent.y);
        });
    } catch (err) {
        console.error("drawKMeansCanvas error:", err);
    }
}


// --- 6. INTERACTIVE LAB 3: KNN DISTANCE SIMULATOR ---
let knnTrainingPoints = [];
let knnTestPoint = { x: 240, y: 170 };
let knnK = 1;

function initLab3Handlers() {
    const canvas = document.getElementById('knn-canvas');
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            knnTestPoint = {
                x: Math.max(15, Math.min(465, e.clientX - rect.left)),
                y: Math.max(15, Math.min(325, e.clientY - rect.top))
            };
            runKNNSimulation();
        });
    }

    const kButtons = document.getElementById('knn-k-buttons');
    if (kButtons) {
        kButtons.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-k');
            if (!btn) return;
            document.querySelectorAll('#knn-k-buttons .btn-k').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            knnK = parseInt(btn.dataset.knn);
            runKNNSimulation();
        });
    }

    const runBtn = document.getElementById('btn-run-knn');
    if (runBtn) runBtn.addEventListener('click', runKNNSimulation);

    const resetBtn = document.getElementById('btn-gen-knn');
    if (resetBtn) resetBtn.addEventListener('click', generateKNNTrainingPoints);

    generateKNNTrainingPoints();
}

function generateKNNTrainingPoints() {
    try {
        knnTrainingPoints = [];
        for (let i = 0; i < 25; i++) {
            knnTrainingPoints.push({
                x: 60 + Math.random() * 180,
                y: 50 + Math.random() * 220,
                label: 'Class A (Blue)',
                color: '#2563eb'
            });
        }
        for (let i = 0; i < 25; i++) {
            knnTrainingPoints.push({
                x: 230 + Math.random() * 190,
                y: 70 + Math.random() * 220,
                label: 'Class B (Orange)',
                color: '#d97706'
            });
        }
        runKNNSimulation();
    } catch (err) {
        console.error("generateKNNTrainingPoints error:", err);
    }
}
window.generateKNNTrainingPoints = generateKNNTrainingPoints;

function runKNNSimulation() {
    try {
        if (knnTrainingPoints.length === 0) return;

        const scored = knnTrainingPoints.map(pt => {
            const dist = Math.hypot(pt.x - knnTestPoint.x, pt.y - knnTestPoint.y);
            return { ...pt, dist };
        });

        scored.sort((a, b) => a.dist - b.dist);
        const neighbors = scored.slice(0, knnK);

        let countA = 0;
        let countB = 0;
        neighbors.forEach(n => {
            if (n.label === 'Class A (Blue)') countA++;
            else countB++;
        });

        const predLabel = countA >= countB ? 'Class A (Blue)' : 'Class B (Orange)';
        const predColor = countA >= countB ? '#2563eb' : '#d97706';

        const coordEl = document.getElementById('knn-stat-coord');
        const countsEl = document.getElementById('knn-stat-counts');
        const predEl = document.getElementById('knn-stat-pred');
        if (coordEl) coordEl.innerText = `(${Math.round(knnTestPoint.x)}, ${Math.round(knnTestPoint.y)})`;
        if (countsEl) countsEl.innerText = `Class A: ${countA} | Class B: ${countB}`;
        if (predEl) {
            predEl.innerText = predLabel;
            predEl.style.backgroundColor = predColor;
            predEl.style.color = '#ffffff';
        }

        drawKNNCanvas(neighbors);
    } catch (err) {
        console.error("runKNNSimulation error:", err);
    }
}
window.runKNNSimulation = runKNNSimulation;

function drawKNNCanvas(neighbors) {
    try {
        const canvas = document.getElementById('knn-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        neighbors.forEach(n => {
            ctx.beginPath();
            ctx.moveTo(knnTestPoint.x, knnTestPoint.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
        });

        knnTrainingPoints.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        });

        ctx.beginPath();
        ctx.arc(knnTestPoint.x, knnTestPoint.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#dc2626';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', knnTestPoint.x, knnTestPoint.y);
    } catch (err) {
        console.error("drawKNNCanvas error:", err);
    }
}


// --- 7. INTERACTIVE LAB 4: RANDOM FOREST COMPARATOR ---
function initLab4Handlers() {
    const treesEl = document.getElementById('slider-rf-trees');
    const noiseEl = document.getElementById('slider-rf-noise');
    if (treesEl) treesEl.addEventListener('input', runRFSimulation);
    if (noiseEl) noiseEl.addEventListener('input', runRFSimulation);

    const simBtn = document.getElementById('btn-sim-rf');
    if (simBtn) simBtn.addEventListener('click', runRFSimulation);
}

function runRFSimulation() {
    try {
        const treesEl = document.getElementById('slider-rf-trees');
        const noiseEl = document.getElementById('slider-rf-noise');
        if (!treesEl || !noiseEl) return;

        const M = parseInt(treesEl.value);
        const noise = parseInt(noiseEl.value);

        const valTrees = document.getElementById('val-rf-trees');
        const valNoise = document.getElementById('val-rf-noise');
        if (valTrees) valTrees.innerText = M;
        if (valNoise) valNoise.innerText = `${noise}%`;

        const singleAcc = Math.max(45, 95 - noise * 1.35);
        const ensembleAcc = Math.min(96, singleAcc + Math.min(22, Math.log2(M + 1) * 4.2));

        const sAccEl = document.getElementById('rf-single-acc');
        const eAccEl = document.getElementById('rf-ensemble-acc');
        const tCountEl = document.getElementById('rf-tree-count-log');
        if (sAccEl) sAccEl.innerText = `${singleAcc.toFixed(1)}%`;
        if (eAccEl) eAccEl.innerText = `${ensembleAcc.toFixed(1)}%`;
        if (tCountEl) tCountEl.innerText = M;

        const bSingle = document.getElementById('bar-rf-single');
        const bEns = document.getElementById('bar-rf-ens');
        const numSingle = document.getElementById('bar-num-single');
        const numEns = document.getElementById('bar-num-ens');

        if (bSingle) bSingle.style.width = `${singleAcc}%`;
        if (bEns) bEns.style.width = `${ensembleAcc}%`;
        if (numSingle) numSingle.innerText = `${singleAcc.toFixed(1)}%`;
        if (numEns) numEns.innerText = `${ensembleAcc.toFixed(1)}%`;
    } catch (err) {
        console.error("runRFSimulation error:", err);
    }
}
window.runRFSimulation = runRFSimulation;


// --- 8. COPY CODE HANDLERS ---
function initCopyCodeHandlers() {
    document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.btn-copy');
        if (!copyBtn) return;
        const targetId = copyBtn.dataset.copyTarget;
        const codeEl = document.getElementById(targetId);
        if (codeEl && navigator.clipboard) {
            navigator.clipboard.writeText(codeEl.innerText).then(() => {
                showToast("📋 Scikit-Learn code copied to clipboard!");
            });
        }
    });
}


// --- 9. TEST 1 COMPREHENSIVE ASSESSMENT ENGINE (46 Questions - 84 Points) ---
window.test1CurrentFilter = 'all';
window.test1SolvedState = JSON.parse(localStorage.getItem('csy3081_test1_solved_v1') || '{}');

window.test1Questions = [
    // --- 1-POINT QUESTIONS (1 to 34) ---
    {
        id: 1,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'AI stands for',
        options: [
            'Artificial Intelligence',
            'Automated Inference',
            'Algorithmic Integration',
            'Applied Information'
        ],
        correctIndex: 0,
        explanation: 'Artificial Intelligence (AI) is the broad interdisciplinary field of computer science dedicated to building systems capable of performing tasks that typically require human cognitive functions, such as reasoning, problem-solving, perception, and natural language understanding.'
    },
    {
        id: 2,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In K-means clustering, K stands for',
        options: [
            'The number of distinct clusters (or centroids) pre-specified before partitioning the dataset',
            'The exact distance metric used during iteration',
            'The maximum iterations allowed before convergence',
            'The kernel coefficient applied to non-linear boundaries'
        ],
        correctIndex: 0,
        explanation: 'In the K-means clustering algorithm, K is a user-chosen hyperparameter representing the exact number of non-overlapping clusters into which the N data points will be grouped. The algorithm aims to minimize the within-cluster sum of squares (inertia) around K centroids.'
    },
    {
        id: 3,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'The ______ function is used in logistic regression to map predictions to probabilities between 0 and 1.',
        options: [
            'Sigmoid',
            'ReLU',
            'Tanh',
            'Linear'
        ],
        correctIndex: 0,
        explanation: 'The Sigmoid (or logistic) function, defined mathematically as \\(\\sigma(z) = \\frac{1}{1 + e^{-z}}\\), takes any continuous real-valued input \\(z \\in (-\\infty, +\\infty)\\) and compresses it into the open interval \\((0, 1)\\). This makes it ideal for binary classification where the output represents probability \\(P(y=1|x)\\).'
    },
    {
        id: 4,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Softmax regression is an extension of logistic regression used for ______ classification problems.',
        options: [
            'Multi-class',
            'Binary',
            'Continuous regression',
            'Unsupervised clustering'
        ],
        correctIndex: 0,
        explanation: 'While binary logistic regression uses the sigmoid function to distinguish between 2 classes, Softmax regression (also known as Multinomial Logistic Regression) generalizes this to \\(K > 2\\) mutually exclusive classes by computing normalized exponential probabilities that sum to exactly 1.0.'
    },
    {
        id: 5,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In a Decision Tree, the final nodes that contain the output predictions are called ______ nodes.',
        options: [
            'Leaf',
            'Root',
            'Internal decision',
            'Split'
        ],
        correctIndex: 0,
        explanation: 'In a Decision Tree hierarchy, root and internal decision nodes test specific feature conditions (e.g., \\(X_j \\le \\text{threshold}\\)), while the terminal or Leaf nodes represent the final predicted class label (in classification) or numerical average (in regression). Leaf nodes cannot be split further.'
    },
    {
        id: 6,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'K-means is a type of ______ learning algorithm.',
        options: [
            'Unsupervised',
            'Supervised',
            'Reinforcement',
            'Weakly supervised'
        ],
        correctIndex: 0,
        explanation: 'K-means clustering operates entirely without target labels (\\(y\\)). It discovers intrinsic geometric patterns and natural groupings inside unlabelled input data (\\(X\\)) solely based on Euclidean distance similarities, making it a foundational Unsupervised learning algorithm.'
    },
    {
        id: 7,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Polynomial regression can model non-linear relationships by adding higher-degree terms to the equation.',
        options: [
            'True',
            'False'
        ],
        correctIndex: 0,
        explanation: 'True. Polynomial regression transforms linear features into polynomial combinations (\\(x, x^2, x^3, \\dots\\)). Although the model remains linear with respect to the estimated weights (\\(w_0 + w_1 x + w_2 x^2\\)), the resulting decision boundary or regression curve is strictly non-linear in the original feature space.'
    },
    {
        id: 8,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In logistic regression, the output is always a continuous value representing probability.',
        options: [
            'True',
            'False'
        ],
        correctIndex: 1,
        explanation: 'False. Although logistic regression internally computes a continuous probability between 0 and 1 using the sigmoid function \\(\\sigma(z) = \\frac{1}{1 + e^{-z}}\\), its primary function as a supervised classification algorithm (`model.predict(X)`) is to apply a decision threshold (typically \\(0.5\\)) and output discrete categorical class labels (`0 or 1`). Therefore, the final prediction of the classifier is discrete class labels, not always a continuous probability value.'
    },
    {
        id: 9,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Reinforcement learning requires labelled training data with input-output pairs.',
        options: [
            'True',
            'False'
        ],
        correctIndex: 1,
        explanation: 'False. Reinforcement Learning (RL) does NOT use static labelled input-output pairs (\\(x_i, y_i\\)). Instead, an autonomous agent interacts dynamically with an environment, executing actions and learning optimal policies through evaluative feedback signals known as scalar rewards (+1) or penalties (-1).'
    },
    {
        id: 10,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Softmax regression outputs probabilities that sum to 1 across all classes.',
        options: [
            'True',
            'False'
        ],
        correctIndex: 0,
        explanation: 'True. The Softmax formula \\(P(y=k|x) = \\frac{e^{z_k}}{\\sum_{j=1}^K e^{z_j}}\\) explicitly divides the exponentiated raw score of class \\(k\\) by the sum of exponentiated scores across all \\(K\\) classes. Consequently, the resulting output vector forms a valid probability distribution whose components always sum to exactly 1.0.'
    },
    {
        id: 11,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Decision Trees can only be used for classification problems, not regression.',
        options: [
            'True',
            'False'
        ],
        correctIndex: 1,
        explanation: 'False. Decision Trees are general CART (Classification and Regression Tree) algorithms. For classification (`DecisionTreeClassifier`), leaf nodes vote on categorical class labels using Gini Impurity or Entropy. For regression (`DecisionTreeRegressor`), leaf nodes predict numerical continuous values by averaging training samples inside the leaf to minimize Mean Squared Error (MSE).'
    },
    {
        id: 12,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Supervised learning algorithms require labelled datasets for training.',
        options: [
            'Yes',
            'No'
        ],
        correctIndex: 0,
        explanation: 'Yes. The defining characteristic of Supervised Learning is that the model is trained using ground-truth labels (\\(y_i\\)) paired with every input feature vector (\\(x_i\\)). The algorithm adjusts its parameters by comparing its predictions \\(\\hat{y}_i\\) directly against the provided true labels \\(y_i\\).'
    },
    {
        id: 13,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'K-means clustering is sensitive to the initial random selection of centroids.',
        options: [
            'True',
            'False'
        ],
        correctIndex: 0,
        explanation: 'True. Because K-means uses greedy local optimization (Lloyd\'s algorithm), poorly initialized starting centroids can cause the algorithm to converge into suboptimal local minima. This sensitivity is precisely why modern implementations use K-means++ initialization, which selects initial centroids that are maximally distant from one another.'
    },
    {
        id: 14,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Semi-supervised learning uses both labelled and unlabelled data during training.',
        options: [
            'True',
            'False'
        ],
        correctIndex: 0,
        explanation: 'True. Semi-supervised learning bridges the gap between supervised and unsupervised paradigms by combining a small, expensive set of labelled training samples with a massive, readily available pool of unlabelled data to significantly boost generalization performance.'
    },
    {
        id: 15,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Which of the following is NOT a type of machine learning?',
        options: [
            'linear Learning',
            'reinforcement learning',
            'Supervised learning',
            'Unsupervised Learning'
        ],
        correctIndex: 0,
        explanation: '\'Linear learning\' is not a recognized fundamental machine learning paradigm. The core overarching paradigms of machine learning are Supervised Learning, Unsupervised Learning, Reinforcement Learning, and Self/Semi-supervised Learning.'
    },
    {
        id: 16,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In linear regression, what does the slope (w) represent?',
        options: [
            'the rate of change in y for a unit change in x',
            'The point where the line crosses the y axis',
            'the error in prediction',
            'the number of features'
        ],
        correctIndex: 0,
        explanation: 'In the linear equation \\(y = w \\cdot x + b\\), the slope weight \\(w\\) quantifies the exact rate of change: for every 1.0 unit increase in the feature \\(x\\), the predicted target value \\(y\\) changes exactly by \\(w\\) units.'
    },
    {
        id: 17,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Which algorithm is used for binary classification problems?',
        options: [
            'logistic regression',
            'polynomial regression',
            'linear regression',
            'k means'
        ],
        correctIndex: 0,
        explanation: 'Logistic regression applies the sigmoid activation function to linear combination scores to output bounded probabilities \\(P(y=1|x) \\in (0, 1)\\), making it the standard foundational algorithm for binary classification tasks.'
    },
    {
        id: 18,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'What is the primary goal of K-means clustering?',
        options: [
            'to partition data into k distinct groups based on similartiy',
            'to find the best linear fit',
            'to classify data into predefined categories',
            'to predict continous values'
        ],
        correctIndex: 0,
        explanation: 'The sole objective of K-means clustering is to partition an unlabelled dataset into \\(K\\) coherent, distinct clusters such that data points within the same cluster share high geometric similarity (minimum intra-cluster Euclidean distance).'
    },
    {
        id: 19,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Which learning type uses trial and error to learn optimal actions?',
        options: [
            'reinforcement learning',
            'supervised learning',
            'unsupervised learning',
            'semi supervised learning'
        ],
        correctIndex: 0,
        explanation: 'Reinforcement Learning (RL) operates via an active agent exploring an unknown state space through trial-and-error experimentation, discovering which sequences of actions maximize long-term cumulative reward.'
    },
    {
        id: 20,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'What does the sigmoid function output for very large positive inputs?',
        options: [
            '1',
            '0',
            '0.5',
            'infinity'
        ],
        correctIndex: 0,
        explanation: 'As \\(z \\to +\\infty\\), the term \\(e^{-z} \\to 0\\). Substituting this into the sigmoid formula \\(\\sigma(z) = \\frac{1}{1 + e^{-z}}\\) yields \\(\\frac{1}{1 + 0} = 1.0\\). Thus, large positive inputs asymptotically approach 1.0.'
    },
    {
        id: 21,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In a Decision Tree, which metric is commonly used for splitting at each node?',
        options: [
            'Gini impurity or entropy',
            'MSE',
            'accuracy',
            'R squared'
        ],
        correctIndex: 0,
        explanation: 'To determine the optimal splitting feature and threshold at any classification node, Decision Trees evaluate impurity reduction (Information Gain) calculated using either Gini Impurity (\\(1 - \\sum p_i^2\\)) or Shannon Entropy (\\(-\\sum p_i \\log_2 p_i\\)).'
    },
    {
        id: 22,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'which of the following is an example of unsupervised learning?',
        options: [
            'customer segmentation',
            'handwitten digit recognition',
            'spam detection',
            'house price prediction'
        ],
        correctIndex: 0,
        explanation: 'Customer segmentation clusters a company\'s user base into natural behavioral personas (e.g., high-spending vs budget buyers) without pre-existing category labels, making it a classic Unsupervised Learning clustering application.'
    },
    {
        id: 23,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Polynomial regression is suitable when:',
        options: [
            'the relationship between variables is non linear',
            'the data has no patterns',
            'the relationship between variables is linear',
            'there is only one feature'
        ],
        correctIndex: 0,
        explanation: 'When a scatter plot exhibits curvature, parabolas, or polynomial waves, a standard straight line (\\(y = wx+b\\)) severely underfits. Polynomial regression captures these non-linear patterns accurately by including higher powers (\\(x^2, x^3\\)).'
    },
    {
        id: 24,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'What is the main difference between logistic regression and linear regression?',
        options: [
            'logistic regression is for classification while linear regression is for regression',
            'logistic regression uses different equation',
            'linear regression uses sigmoid function',
            'there is no difference'
        ],
        correctIndex: 0,
        explanation: 'Linear regression predicts continuous numerical quantities (\\(y \\in \\mathbb{R}\\)) by fitting a straight hyperplane, whereas Logistic regression predicts discrete categorical class membership probabilities using the bounded sigmoid link function.'
    },
    {
        id: 25,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In K-means clustering, the algorithm iteratively performs which two steps?',
        options: [
            'assign and update',
            'classify and predict',
            'split and merge',
            'train and test'
        ],
        correctIndex: 0,
        explanation: 'K-means iterates between two alternating steps: (1) Assignment Step: assigning every data point \\(x_i\\) to its nearest centroid \\(C_k\\), and (2) Update Step: recalculating each centroid \\(C_k\\) as the exact arithmetic mean of all data points currently assigned to cluster \\(k\\).'
    },
    {
        id: 26,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Which of the following best describes weakly supervised learning?',
        options: [
            'uses noisy, limited or imprecis labels',
            'uses completly unlabelled data',
            'uses reinforcement signals',
            'uses only positive examples'
        ],
        correctIndex: 0,
        explanation: 'Weakly Supervised Learning constructs models when ground-truth labels are imperfect, noisy, coarse-grained (e.g., image-level tags instead of pixel masks), or generated by heuristics and crowdsourcing rather than expert annotation.'
    },
    {
        id: 27,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In softmax regression, the output for each class represents:',
        options: [
            'the probability that the instnce belongs to that class',
            'the binary classification result',
            'the distance to the class centroid',
            'the raw score for that class'
        ],
        correctIndex: 0,
        explanation: 'Softmax transforms unbounded logit scores (\\(z_k\\)) into normalized conditional probabilities \\(P(y=k|x) \\in (0,1)\\), representing the exact confidence likelihood that the given sample belongs to class \\(k\\).'
    },
    {
        id: 28,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Which of the following tasks would use self-supervised learning?',
        options: [
            'Predicting the next word in a sentence',
            'Classifying images of cats and dogstion 2',
            'Grouping customers by purchasing behaviour',
            'Playing chess against an opponent4'
        ],
        correctIndex: 0,
        explanation: 'Self-supervised learning generates pseudo-labels automatically from the structure of the input data itself without manual human annotation. Predicting the next word in a sentence (or masked word modeling in BERT/GPT) uses the surrounding text as its own supervision signal.'
    },
    {
        id: 29,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Overfitting in polynomial regression can be reduced by:',
        options: [
            'Using regularization techniques',
            'Increasing the degree of the polynomial',
            'Decreasing the amount of training data',
            'Ignoring the validation set'
        ],
        correctIndex: 0,
        explanation: 'High-degree polynomial regressions fit wild curves through noise (overfitting). Regularization techniques such as Ridge (\\(L_2\\) penalty: \\(\\lambda \\sum w_i^2\\)) or Lasso (\\(L_1\\) penalty: \\(\\lambda \\sum |w_i|\\)) penalize large coefficient weights, forcing the curve to remain smooth and generalize well.'
    },
    {
        id: 30,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'In a Decision Tree, what does the root node represent?',
        options: [
            'The feature that best splits the data at the top',
            'A leaf node',
            'The error in prediction',
            'The final prediction'
        ],
        correctIndex: 0,
        explanation: 'The Root Node sits at the absolute top of the decision tree structure (depth = 0), containing the entire training dataset. It evaluates and selects the single most informative feature condition (highest Information Gain) to perform the initial partition.'
    },
    {
        id: 31,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'The decision boundary in logistic regression is:',
        options: [
            'Linear or non-linear depending on features',
            'Always non-linear',
            'Always linear',
            'A circle'
        ],
        correctIndex: 0,
        explanation: 'If logistic regression is trained on raw linear features (\\(x_1, x_2\\)), its decision boundary (\\(w_1 x_1 + w_2 x_2 + b = 0\\)) is strictly linear (a straight line or hyperplane). However, if feature engineering introduces non-linear terms (like \\(x_1^2, x_2^2\\)), the decision boundary in the original coordinate space becomes non-linear (such as a circle or ellipse).'
    },
    {
        id: 32,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'The distance metric commonly used in K-means clustering is',
        options: [
            'Euclidean distance',
            'Hamming distance',
            'Cosine similarity',
            'Manhattan distance'
        ],
        correctIndex: 0,
        explanation: 'Standard K-means clustering minimizes the within-cluster sum of squared Euclidean distances (\\(L_2\\) norm: \\(d(x, c) = \\sqrt{\\sum (x_i - c_i)^2}\\)) between data points and their respective centroids.'
    },
    {
        id: 33,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'Which technique can be used to reduce overfitting in Decision Trees?',
        options: [
            'Pruning the tree (removing unnecessary branches)',
            'Adding more features',
            'Using more training data only',
            'Increasing the maximum depth'
        ],
        correctIndex: 0,
        explanation: 'Unconstrained decision trees grow until every leaf is pure, memorizing noise (overfitting). Pruning (either pre-pruning via max_depth / min_samples_leaf or post-pruning via cost-complexity \\(\\alpha\\) pruning) strips away over-specific branches to improve validation accuracy.'
    },
    {
        id: 34,
        pts: 1,
        category: '1pt',
        type: 'mcq',
        question: 'What is the potential issue when a Decision Tree grows too deep with many splits?',
        options: [
            'Overfitting',
            'Underfitting',
            'Better generalization',
            'Faster training'
        ],
        correctIndex: 0,
        explanation: 'As max_depth increases without bounds, the tree creates highly fragmented decision rules (\\(N=1\\) per leaf) that memorize idiosyncratic training set noise, leading to severe Overfitting and poor performance on unseen test data.'
    },

    // --- 3-POINT ADVANCED SCIKIT-LEARN & MATH QUESTIONS (35 to 44) ---
    {
        id: 35,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'Which of the following would correctly replace the question mark to predict labels for the first 5 samples in the test set?',
        code: 'X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(?[:5])',
        options: [
            'X_test',
            'y_test',
            'y_train',
            'X_train'
        ],
        correctIndex: 0,
        explanation: 'The model.predict(X) method in Scikit-Learn expects a 2D feature matrix containing input feature columns (X_test[:5]), not target labels (y). Passing X_test[:5] outputs the predicted class labels for those first 5 unseen test samples.'
    },
    {
        id: 36,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'You use softmax regression to classify iris flowers into 3 classes using petal length and petal width. Given the code below, what is a possible output?',
        code: 'X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)\nsoftmax_reg = LogisticRegression(C=10, multi_class=\'multinomial\', solver=\'lbfgs\')\nsoftmax_reg.fit(X_train, y_train)\nprint(softmax_reg.predict([[4.5, 1.2]]), softmax_reg.predict_proba([[4.5, 1.2]]).round(2))',
        options: [
            '[1] [[0.85 0.10 0.05]]',
            '[0] [[0.85 0.10 0.05]]',
            '[0.85] [[0 1 2]]',
            '[3] [[0.85 0.10 0.05]]'
        ],
        correctIndex: 0,
        explanation: 'In Scikit-Learn, predict() outputs the class label corresponding to argmax of predict_proba(). In the probability array [[0.85, 0.10, 0.05]], the highest probability is 0.85 which corresponds to class index 1 (or 0 depending on label encoding). Because predict() must match the highest probability slot (0.85), [1] [[0.85 0.10 0.05]] (or [0]) is the only mathematically valid probability distribution pair.'
    },
    {
        id: 37,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'Which statement about Decision Trees is FALSE?',
        options: [
            'Decision Trees require feature normalization before training',
            'Decision Trees can be used for both classification and regression',
            'Decision Trees are prone to overfitting if not constrained',
            'Decision Trees can handle missing values through surrogate splits'
        ],
        correctIndex: 0,
        explanation: 'Decision Trees are completely invariant to monotonic transformations and scale differences. Because node splits evaluate single features independently against threshold splits (\\(X_j \\le t\\)), feature normalization, standard scaling, or min-max scaling (Z-score) is completely unnecessary.'
    },
    {
        id: 38,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'Given the code below, what would be the shape of y_pred_proba if X_test contains 50 samples and the model is trained to classify data into 4 classes?',
        code: 'model = LogisticRegression(multi_class=\'multinomial\', solver=\'lbfgs\')\nmodel.fit(X_train, y_train)\ny_pred_proba = model.predict_proba(X_test)',
        options: [
            '(50, 4)',
            '(50, 1)',
            '(4, 50)',
            '(50, )'
        ],
        correctIndex: 0,
        explanation: 'The predict_proba(X) method returns a 2D NumPy array of shape (n_samples, n_classes). With n_samples = 50 test rows and n_classes = 4 distinct categories, the output shape is exactly (50, 4), containing the probability of each class for every sample.'
    },
    {
        id: 39,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'In a Decision Tree, what does the Gini Impurity value of 0 indicate at a node?',
        options: [
            'The node is perfectly pure, containing samples from only one class',
            'The node contains samples from multiple classes equally distributed',
            'The node has the maximum possible impurity',
            'The node should be split further'
        ],
        correctIndex: 0,
        explanation: 'Gini Impurity is defined as \\(1 - \\sum_{i=1}^K p_i^2\\). If all samples inside a node belong to a single class \\(k\\), then \\(p_k = 1.0\\) and all other \\(p_j = 0\\). Substituting this yields \\(1 - (1^2 + 0) = 0.0\\), which signifies a perfectly pure node requiring zero further splits.'
    },
    {
        id: 40,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'Which of the following is a valid stopping criterion for growing a Decision Tree?',
        options: [
            'All of the above',
            'Maximum depth of the tree is reached',
            'Minimum number of samples per leaf is achieved',
            'All samples at a node belong to the same class'
        ],
        correctIndex: 0,
        explanation: 'A decision tree halts node splitting when any stopping condition is satisfied: max_depth reached, min_samples_split / min_samples_leaf bounds met, impurity is zero (Gini = 0.0 or pure class), or no remaining features yield positive information gain.'
    },
    {
        id: 41,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'What is the first step in the K-means algorithm after selecting the number of clusters K?',
        options: [
            'Randomly initialize K centroids',
            'Assign each point to the nearest centroid',
            'Update centroids by taking the mean of assigned points',
            'Calculate the distance between all pairs of points'
        ],
        correctIndex: 0,
        explanation: 'Once K is chosen, the immediate first algorithmic step is initializing the exact coordinates of the K initial cluster centroids (either via uniform random sampling from data points or K-means++ seeding) before any distance calculations occur.'
    },
    {
        id: 42,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'What happens during the "update" step of the K-means algorithm?',
        options: [
            'Centroids are recalculated as the mean of all points in each cluster',
            'Data points are randomly reassigned to clusters',
            'The value of K is adjusted',
            'The distance metric is changed'
        ],
        correctIndex: 0,
        explanation: 'During the Update (Centroid Recalculation) step, each centroid coordinate vector \\(\\mu_k\\) is shifted to the exact center of mass (arithmetic mean) of all data points \\(x_i\\) currently assigned to cluster \\(k\\): \\(\\mu_k = \\frac{1}{|S_k|} \\sum_{x \\in S_k} x\\).'
    },
    {
        id: 43,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'In linear regression, what does the R-squared (R2) value represent?',
        options: [
            'The proportion of variance in the target variable explained by the model',
            'The slope of the regression line',
            'The error rate of predictions',
            'The intercept of the regression line'
        ],
        correctIndex: 0,
        explanation: 'The Coefficient of Determination (\\(R^2 = 1 - \\frac{SSR}{SST}\\)) measures goodness-of-fit: exactly what percentage (proportion) of the total variation in the target variable \\(y\\) is captured and explained by the linear model\'s input features.'
    },
    {
        id: 44,
        pts: 3,
        category: '3pt',
        type: 'mcq',
        question: 'What is the purpose of the C parameter in LogisticRegression from scikit-learn?',
        options: [
            'It is the inverse of regularization strength',
            'It controls the learning rate',
            'It determines the number of iterations',
            'It sets the intercept term'
        ],
        correctIndex: 0,
        explanation: 'In Scikit-Learn\'s LogisticRegression, the parameter C represents inverse regularization strength (\\(C = \\frac{1}{\\lambda}\\)). Smaller values of C (e.g., C=0.01) apply heavy penalty constraints to prevent overfitting, whereas larger values of C (e.g., C=1000) apply minimal regularization.'
    },

    // --- 5-POINT COLUMN MATCHING ASSESSMENTS (45 and 46) ---
    {
        id: 45,
        pts: 5,
        category: '5pt',
        type: 'matching',
        question: 'Match each machine learning algorithm in Column A with its correct description in Column B.',
        matchingTable: [
            { colA: 'Linear Regression', colB: 'Fits a straight line to model the continuous relationship between variables' },
            { colA: 'Logistic Regression', colB: 'Predicts the probability of a binary outcome using a bounded sigmoid function' },
            { colA: 'K-means Clustering', colB: 'Partitions data into K distinct unsupervised groups based on geometric similarity' },
            { colA: 'Decision Trees', colB: 'Creates a model that predicts target values by learning hierarchical if-then decision rules' },
            { colA: 'Softmax Regression', colB: 'Predicts normalized probabilities across K > 2 mutually exclusive classes using exponential softmax' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (5 Points)'
        ],
        correctIndex: 0,
        explanation: 'Each of the 5 foundational models serves a specialized purpose: Linear Regression minimizes continuous numerical errors; Logistic Regression applies sigmoid for binary (0,1) classification; K-Means discovers unsupervised spatial clusters; Decision Trees build recursive if-then decision hierarchies; and Softmax Regression computes multi-class normalized probability distributions.'
    },
    {
        id: 46,
        pts: 5,
        category: '5pt',
        type: 'matching',
        question: 'Match each machine learning concept in Column A with its correct definition in Column B.',
        matchingTable: [
            { colA: 'Intercept (b)', colB: 'The point where the regression line crosses the y-axis when all input features are zero' },
            { colA: 'Slope (w)', colB: 'The exact rate of change in the target variable for a unit change in the input feature' },
            { colA: 'R-squared (R2)', colB: 'The proportion of variance in the target variable explained by the model (0 <= R2 <= 1)' },
            { colA: 'Sigmoid Function', colB: 'A continuous function \\(\\sigma(z) = 1 / (1 + e^{-z})\\) that maps any real input between 0 and 1' },
            { colA: 'Softmax Output', colB: 'The probability distribution across all multi-class categories, summing exactly to 1.0' }
        ],
        options: [
            'Confirm & Verify Correct Column A vs Column B Matching Pairs (5 Points)'
        ],
        correctIndex: 0,
        explanation: 'Understanding mathematical notation is essential: b is the baseline y-intercept when all X_j=0; w is the gradient/slope coefficient; R2 is overall model explanatory power; \\(\\sigma(z)\\) is the binary compression curve; and Softmax ensures multi-class probability preservation (\\(\\sum P = 1.0\\)).'
    }
];

function renderTest1Questions(filter = 'all', btnEl = null) {
    try {
        if (btnEl) {
            document.querySelectorAll('.test1-filter-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
        }
        window.test1CurrentFilter = filter;

        const container = document.getElementById('test1-questions-container');
        if (!container) return;

        const filtered = window.test1Questions.filter(q => filter === 'all' || q.category === filter);

        let html = '';
        filtered.forEach((q, idx) => {
            const solved = window.test1SolvedState[q.id];
            const statusBadge = solved
                ? (solved.status === 'correct' ? '<span class="badge" style="background:#d1fae5;color:#065f46;">✓ Solved (Full Points)</span>' : '<span class="badge" style="background:#fee2e2;color:#991b1b;">× Incorrect</span>')
                : '';
            const cardStatusClass = solved ? (solved.status === 'correct' ? ' status-solved-correct' : ' status-solved-wrong') : '';

            html += `
            <div class="test1-card${cardStatusClass}" id="test1-card-${q.id}">
                <div class="test1-card-head">
                    <div>
                        <span class="test1-num">Question ${q.id}</span>
                        <span class="test1-pts">${q.pts} ${q.pts === 1 ? 'Point' : 'Points'}</span>
                    </div>
                    <div>${statusBadge}</div>
                </div>
                <div class="test1-question">${q.question}</div>
                ${q.code ? `<div class="test1-code-block">${q.code}</div>` : ''}
                ${q.type === 'matching' ? `
                    <table class="test1-match-table">
                        <thead>
                            <tr><th>Column A (Algorithm / Concept)</th><th>Column B (Official Definition & Description)</th></tr>
                        </thead>
                        <tbody>
                            ${q.matchingTable.map(row => `<tr><td>${row.colA}</td><td>${row.colB}</td></tr>`).join('')}
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
                        return `<button class="${btnClass}" onclick="if(window.checkTest1Option) checkTest1Option(${q.id}, ${optIdx}, this)">
                            <span>${String.fromCharCode(65 + optIdx)}. ${opt}</span>
                            ${solved && solved.selectedIndex === optIdx ? (solved.status === 'correct' ? '<span>[Correct]</span>' : '<span>[Incorrect]</span>') : ''}
                        </button>`;
                    }).join('')}
                </div>
            `;

            let visibleAnsHtml = '';
            if (q.type === 'matching' && q.matchingTable) {
                visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Matching Pairs:</strong><ul class="matching-answer-list">${q.matchingTable.map(p => `<li><span class="match-left">${p.colA}</span> ➔ <span class="match-right">${p.colB}</span></li>`).join('')}</ul></div>`;
            } else if (typeof q.correctIndex === 'number' && q.options && q.options[q.correctIndex]) {
                visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Answer:</strong> <div><span class="answer-highlight">Option ${String.fromCharCode(65 + q.correctIndex)} — ${q.options[q.correctIndex]}</span></div></div>`;
            }

            html += `
                ${solved ? `<div style="margin-top:12px;margin-bottom:8px;"><button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion('${q.id}', 'test1')" style="background:#3b82f6;color:#fff;font-weight:600;padding:6px 14px;border-radius:6px;border:1px solid #60a5fa;cursor:pointer;">🔄 Reset Question & Try Again</button></div>` : ''}
                <div class="test1-explanation ${solved ? 'show' : ''}" id="test1-exp-${q.id}">
                    <div class="test1-exp-title">💡 Official CSY3081 Detailed Explanation & Proof (${q.pts} Pts):</div>
                    ${visibleAnsHtml}
                    <div style="line-height:1.65;">${cleanTextForDisplay(q.explanation)}</div>
                </div>
            </div>
            `;
        });

        container.innerHTML = html; setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
        updateTest1ProgressUI();
    } catch (err) {
        console.error("renderTest1Questions error:", err); window._lastRenderError = err.toString() + " at test1";
    }
}
window.renderTest1Questions = renderTest1Questions;

function checkTest1Option(qId, optIdx, btnEl) { setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);
    try {
        const q = window.test1Questions.find(x => x.id === qId);
        if (!q) return;

        const isCorrect = (optIdx === q.correctIndex);
        window.test1SolvedState[qId] = {
            status: isCorrect ? 'correct' : 'incorrect',
            selectedIndex: optIdx,
            pts: isCorrect ? q.pts : 0
        };
        localStorage.setItem('csy3081_test1_solved_v1', JSON.stringify(window.test1SolvedState));

        const card = document.getElementById(`test1-card-${qId}`);
        if (card) {
            card.classList.remove('status-solved-correct', 'status-solved-wrong');
            card.classList.add(isCorrect ? 'status-solved-correct' : 'status-solved-wrong');
            const btns = card.querySelectorAll('.test1-opt-btn');
            btns.forEach((b, idx) => {
                b.classList.remove('correct', 'incorrect');
                if (idx === q.correctIndex) b.classList.add('correct');
                else if (idx === optIdx && !isCorrect) b.classList.add('incorrect');
            });

            const exp = document.getElementById(`test1-exp-${qId}`);
            if (exp) exp.classList.add('show');
        }

        updateTest1ProgressUI();
        if (typeof showToast === 'function') {
            showToast(isCorrect ? `✓ Correct! +${q.pts} ${q.pts === 1 ? 'Point' : 'Points'} added to your Test 1 Score` : "× Incorrect. Review the detailed explanation box!");
        }
    } catch (err) {
        console.error("checkTest1Option error:", err);
    }
}
window.checkTest1Option = checkTest1Option;

function filterTest1Questions(filter, btnEl) {
    renderTest1Questions(filter, btnEl);
}
window.filterTest1Questions = filterTest1Questions;

function toggleAllTest1Explanations() {
    try {
        const exps = document.querySelectorAll('.test1-explanation');
        let anyHidden = false;
        exps.forEach(e => {
            if (!e.classList.contains('show')) anyHidden = true;
        });

        exps.forEach(e => {
            if (anyHidden) e.classList.add('show');
            else e.classList.remove('show');
        });

        const toggleText = document.getElementById('btn-toggle-exp-text');
        if (toggleText) {
            toggleText.innerText = anyHidden ? "Hide All Answers & Explanations" : "Reveal All Answers & Explanations";
        }
        if (typeof showToast === 'function') {
            showToast(anyHidden ? "💡 Revealed all 46 detailed mathematical explanations & answers!" : "Hidden all explanations.");
        }
    } catch (err) {
        console.error("toggleAllTest1Explanations error:", err);
    }
}
window.toggleAllTest1Explanations = toggleAllTest1Explanations;

function resetTest1Progress() {
    try {
        if (confirm("Are you sure you want to reset all solved Test 1 answers and point scores back to 0?")) {
            window.test1SolvedState = {};
            localStorage.removeItem('csy3081_test1_solved_v1');
            renderTest1Questions(window.test1CurrentFilter || 'all');
            if (typeof showToast === 'function') showToast("✓ Test 1 progress and score reset to 0/84 Pts!");
        }
    } catch (err) {
        console.error("resetTest1Progress error:", err);
    }
}
window.resetTest1Progress = resetTest1Progress;

function updateTest1ProgressUI() {
    try {
        const solvedCount = Object.keys(window.test1SolvedState).length;
        let totalScore = 0;
        Object.values(window.test1SolvedState).forEach(s => {
            if (s && s.status === 'correct') totalScore += (s.pts || 0);
        });

        const solvedVal = document.getElementById('test1-solved-val');
        const scoreVal = document.getElementById('test1-score-val');
        if (solvedVal) solvedVal.innerText = `${solvedCount}/46`;
        if (scoreVal) scoreVal.innerText = `${totalScore}/84 Pts`;
    } catch (err) {
        console.error("updateTest1ProgressUI error:", err);
    }
}
window.updateTest1ProgressUI = updateTest1ProgressUI;



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
        explanation: '<strong>💡 Official Explanation:</strong> From the <strong>CSY3081 Core Introduction</strong>: The strict concentric hierarchy is $\\text{DL} \\subset \\text{ML} \\subset \\text{AI}$. AI encompasses all intelligent systems (including symbolic logic and rule-based expert systems). ML is the data-driven subset optimizing parameters via loss functions. DL is the specialized subset of ML using deep multi-layer neural architectures.'
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
        explanation: '<strong>💡 Official Explanation:</strong> Calling `fit_transform()` on the test set (`X_test`) calculates a completely different mean and standard deviation from the training set. When `model.predict()` is called, the test features are mapped into an altered coordinate space. Test data must <strong>always</strong> be scaled using `scaler.transform(X_test)` using parameters learned during `scaler.fit(X_train)`.'
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
        explanation: '<strong>💡 Official Explanation:</strong> Scikit-Learn estimators strictly mandate that the feature matrix $X$ must be a <strong>2D array-like</strong> shape `(n_samples, n_features)`, even when there is only $1$ input variable. The target vector $y$ can be 1D `(n_samples,)`. Calling `X.reshape(-1, 1)` transforms `shape (5,)` into required `shape (5, 1)`.'
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
        explanation: '<strong>💡 Official Explanation:</strong> From Scikit-Learn API design conventions, any model attribute estimated from data during `.fit()` always ends with a <strong>trailing underscore (`_`)</strong>. This distinguishes estimated parameters (`labels_`, `cluster_centers_`, `inertia_`, `coef_`, `intercept_`) from user-provided hyperparameters (`n_clusters`, `random_state`).'
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
        explanation: '<strong>💡 Official Explanation:</strong> Scikit-Learn\'s model selection tools (`cross_val_score`, `GridSearchCV`) follow a strict convention where <strong>higher scores are always better</strong>. Because Mean Squared Error is a loss (`lower is better`), Scikit-Learn negates the metric so optimizer maximization works correctly. The required string is `"neg_mean_squared_error"`.'
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
            'Minkowski distance with power $p=2$ ($D = (\sum |x_i - y_i|^2)^{1/2}$) is mathematically and identically the definition of <strong>Euclidean distance ($L_2$)</strong>',
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
        question: 'Calculate the <strong>Shannon Entropy ($H$)</strong> using base-2 logarithm ($H = -\\sum p_i \\log_2 p_i$) for a binary classification leaf node split evenly with `[32 positive, 32 negative]` samples (`Total N = 64`).',
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
        question: 'Compute the <strong>Euclidean Distance ($L_2$)</strong> between two patient medical feature vectors in 3D coordinate space: Patient A $u = (1, 4, 2)$ and Patient B $v = (4, 8, 2)$.',
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
        question: 'Compute the <strong>Manhattan Distance ($L_1$)</strong> between the same two patient vectors: Patient A $u = (1, 4, 2)$ and Patient B $v = (4, 8, 2)$.',
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
        question: 'In a Simple Linear Regression model $\hat{y} = w x + b$, what is the exact <strong>Mean Squared Error (MSE)</strong> if the model makes the following predictions across $N=4$ test samples:<br>`y_true = [10, 20, 30, 40]` and `y_pred = [12, 18, 33, 37]`?',
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
        question: 'In a multi-class neural network or `LogisticRegression(multi_class="multinomial")`, three output neurons produce raw unnormalized logit scores: $z_1 = 2.0$, $z_2 = 1.0$, $z_3 = 0.0$. Using the exact <strong>Softmax formula</strong> $P(y=k) = \\frac{e^{z_k}}{\\sum_{j=1}^3 e^{z_j}}$, what is the approximate probability assigned to Class 1 ($z_1 = 2.0$)? (`Use e^2 ≈ 7.389, e^1 ≈ 2.718, e^0 = 1.000`)',
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
        question: 'Compute the exact <strong>R-squared ($R^2$) Coefficient of Determination</strong> using formula $R^2 = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}$ for a regression model where the Residual Sum of Squares is $\\text{SS}_{\\text{res}} = 20$ and the Total Variance Sum of Squares around the mean $\\bar{y}$ is $\\text{SS}_{\\text{tot}} = 100$.',
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
        question: 'Match each foundational <strong>Machine Learning Learning Paradigm</strong> with its exact official definition and representative Scikit-Learn algorithm:',
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
        question: 'Match each <strong>Decision Tree & Ensemble Hyperparameter</strong> with its exact mathematical regularizing mechanism:',
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
        question: 'Match each <strong>Classification Evaluation Metric</strong> with its exact formula derived from True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN):',
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
        question: 'Match each <strong>Support Vector Machine (SVM) Kernel</strong> with its mathematical transformation and geometric use case:',
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
        question: 'Match each <strong>Scikit-Learn Preprocessing & Validation Transformer</strong> with its exact data transformation formula:',
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
        question: 'Match each <strong>Core AI Ethics & Production Limitation</strong> directly tested in CSY3081 exams with its diagnostic mitigation:',
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
            const cardStatusClass = solved ? (solved.status === 'correct' ? ' status-solved-correct' : ' status-solved-wrong') : '';

            html += `
            <div class="test1-card${cardStatusClass}" id="test2-card-${q.id}" style="border-left: 4px solid var(--primary);">
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
            `;

            let visibleAnsHtml = '';
            if (q.type === 'matching' && q.matchingTable) {
                visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Matching Pairs:</strong><ul class="matching-answer-list">${q.matchingTable.map(p => `<li><span class="match-left">${p.colA}</span> ➔ <span class="match-right">${p.colB}</span></li>`).join('')}</ul></div>`;
            } else if (typeof q.correctIndex === 'number' && q.options && q.options[q.correctIndex]) {
                visibleAnsHtml = `<div class="official-answer-banner"><strong>✅ Official Verified Answer:</strong> <div><span class="answer-highlight">Option ${String.fromCharCode(65 + q.correctIndex)} — ${q.options[q.correctIndex]}</span></div></div>`;
            }

            html += `
                ${solved ? `<div style="margin-top:12px;margin-bottom:8px;"><button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion('${q.id}', 'test2')" style="background:#3b82f6;color:#fff;font-weight:600;padding:6px 14px;border-radius:6px;border:1px solid #60a5fa;cursor:pointer;">🔄 Reset Question & Try Again</button></div>` : ''}
                <div class="test1-explanation ${solved ? 'show' : ''}" id="test2-exp-${q.id}" style="border-left:4px solid var(--primary);">
                    <div class="test1-exp-title" style="color:var(--primary);font-weight:700;">💡 Official CSY3081 Detailed Solution & Proof (${q.pts} Pts):</div>
                    ${visibleAnsHtml}
                    <div style="color:var(--text-primary);line-height:1.65;">${cleanTextForDisplay(q.explanation)}</div>
                </div>
            </div>
            `;
        });

        container.innerHTML = html; setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
        updateTest2ProgressUI();
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
            card.classList.remove('status-solved-correct', 'status-solved-wrong');
            card.classList.add(isCorrect ? 'status-solved-correct' : 'status-solved-wrong');
            const btns = card.querySelectorAll('.test1-opt-btn');
            btns.forEach((b, idx) => {
                b.classList.remove('correct', 'incorrect');
                if (idx === q.correctIndex) b.classList.add('correct');
                else if (idx === optIdx && !isCorrect) b.classList.add('incorrect');
            });

            const exp = document.getElementById(`test2-exp-${qId}`);
            if (exp) exp.classList.add('show');
        }

        updateTest2ProgressUI();
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

/* ==========================================================================
   THEME TOGGLE & PROFESSIONAL WORKBENCH INITIALIZATION
   ========================================================================== */
window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('csy3081_theme_preference', newTheme);
    updateThemeToggleUI(newTheme);
    if (typeof showToast === 'function') {
        showToast(newTheme === 'dark' ? "Switched to Midnight Studio Dark Theme" : "Switched to Executive Light Academic Theme");
    }
};

window.updateThemeToggleUI = function(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    const text = document.getElementById('theme-toggle-text');
    if (icon && text) {
        if (theme === 'dark') {
            icon.innerText = '\u2600\uFE0F';
            text.innerText = 'Executive Light';
        } else {
            icon.innerText = '\uD83C\uDF19';
            text.innerText = 'Dark Studio';
        }
    }
};

// Initialize saved theme on script load & DOMContentLoaded
(function() {
    try {
        const savedTheme = localStorage.getItem('csy3081_theme_preference');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        window.addEventListener('DOMContentLoaded', function() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            if (window.updateThemeToggleUI) updateThemeToggleUI(current);
        });
        // Also run immediately if DOM is already ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            if (window.updateThemeToggleUI) updateThemeToggleUI(current);
        }
    } catch(e) {
        console.error("Theme init error:", e);
    }
})();
/* ==========================================================================
   MATHEMATICAL FORMULA RENDERING ENGINE (KaTeX + OFFLINE FALLBACK)
   ========================================================================== */
window.formatMathFallback = function(container) {
    if (!container) return;
    if (container.querySelectorAll('.katex').length > 0) return;

    function cleanLatexString(str) {
        return str
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-fraction"><span class="math-num">$1</span><span class="math-den">$2</span></span>')
            .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '<span class="math-op-box"><span class="math-limit-top">$2</span><span class="math-op-sym">&sum;</span><span class="math-limit-bot">$1</span></span>')
            .replace(/\\sum_\{([^}]+)\}/g, '<span class="math-op-box"><span class="math-op-sym">&sum;</span><span class="math-limit-bot">$1</span></span>')
            .replace(/\\sum/g, '<span class="math-op-sym">&sum;</span>')
            .replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, '<span class="math-op-box"><span class="math-limit-top">$2</span><span class="math-op-sym">&prod;</span><span class="math-limit-bot">$1</span></span>')
            .replace(/\\prod/g, '<span class="math-op-sym">&prod;</span>')
            .replace(/\\log_([0-9a-zA-Z]+)/g, 'log<sub>$1</sub>')
            .replace(/\\log_\{([^}]+)\}/g, 'log<sub>$1</sub>')
            .replace(/\\ln/g, 'ln')
            .replace(/\\exp/g, 'exp')
            .replace(/\\arg\\max_\{([^}]+)\}/g, 'arg max<sub>$1</sub>')
            .replace(/\\arg\\min_\{([^}]+)\}/g, 'arg min<sub>$1</sub>')
            .replace(/\\theta/g, '&theta;')
            .replace(/\\sigma/g, '&sigma;')
            .replace(/\\mu/g, '&mu;')
            .replace(/\\eta/g, '&eta;')
            .replace(/\\alpha/g, '&alpha;')
            .replace(/\\beta/g, '&beta;')
            .replace(/\\gamma/g, '&gamma;')
            .replace(/\\Delta/g, '&Delta;')
            .replace(/\\nabla/g, '&nabla;')
            .replace(/\\lambda/g, '&lambda;')
            .replace(/\\epsilon/g, '&epsilon;')
            .replace(/\\omega/g, '&omega;')
            .replace(/\\partial/g, '&part;')
            .replace(/\\infty/g, '&infin;')
            .replace(/\\sqrt\{([^}]+)\}/g, '<span class="math-sqrt">&radic;<span class="math-sqrt-content">$1</span></span>')
            .replace(/\\left\(|\\right\)/g, '')
            .replace(/\\left\||\\right\|/g, '|')
            .replace(/\\left\[|\\right\]/g, '')
            .replace(/\\mid/g, '|')
            .replace(/\\quad|\\qquad/g, ' &nbsp;&nbsp; ')
            .replace(/\\text\{([^}]+)\}/g, '<span style="font-family:var(--font-sans);font-weight:600;color:var(--primary);">$1</span>')
            .replace(/\\in/g, '&isin;')
            .replace(/\\mathbb\{R\}/g, '&#8477;')
            .replace(/\\approx/g, '&approx;')
            .replace(/\\ge/g, '&ge;')
            .replace(/\\le/g, '&le;')
            .replace(/\\rightarrow|\\to/g, '&rarr;')
            .replace(/\\Rightarrow/g, '&rArr;')
            .replace(/\\cdot/g, '&middot;')
            .replace(/\\times/g, '&times;')
            .replace(/\\dots|\\ldots/g, '...')
            .replace(/\\mathbf\{([^}]+)\}/g, '<b>$1</b>')
            .replace(/\\mathcal\{([^}]+)\}/g, '<span style="font-family:serif;font-style:italic;">$1</span>')
            .replace(/\^([0-9A-Za-z]+)/g, '<sup>$1</sup>')
            .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
            .replace(/_([0-9A-Za-z]+)/g, '<sub>$1</sub>')
            .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    }

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement && !['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(node.parentElement.tagName)) {
            if (node.nodeValue && (node.nodeValue.includes('$') || node.nodeValue.includes('\\(') || node.nodeValue.includes('\\['))) {
                textNodes.push(node);
            }
        }
    }

    textNodes.forEach(node => {
        let text = node.nodeValue;
        let modified = false;

        if (/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/.test(text)) {
            text = text.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (match, p1, p2) => {
                const mathContent = p1 || p2;
                return `<div class="display-math-fallback">${cleanLatexString(mathContent)}</div>`;
            });
            modified = true;
        }

        if (/\$([^\$]+?)\$|\\\(([^\)]+?)\\\)/.test(text)) {
            text = text.replace(/\$([^\$]+?)\$|\\\(([^\)]+?)\\\)/g, (match, p1, p2) => {
                const mathContent = p1 || p2;
                return `<span class="inline-math-fallback">${cleanLatexString(mathContent)}</span>`;
            });
            modified = true;
        }

        if (modified) {
            const span = document.createElement('span');
            span.innerHTML = text;
            node.parentNode.replaceChild(span, node);
        }
    });
};

window.renderAllMath = function(containerEl) {
    const el = containerEl || document.body;
    if (typeof renderMathInElement === 'function') {
        try {
            renderMathInElement(el, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false,
                strict: 'ignore'
            });
            return;
        } catch(e) {
            console.warn("KaTeX render error:", e);
        }
    }
    if (window.formatMathFallback) {
        window.formatMathFallback(el);
    }
};

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);
    setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 600);
});