#!/usr/bin/env python
"""Customer Churn Prediction Model."""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Load the generated customer data
df = pd.read_csv('d:\\my websitecode\\customer_data.csv')

print("=" * 60)
print("CUSTOMER CHURN PREDICTION MODEL")
print("=" * 60)
print(f"\nDataset loaded: {df.shape[0]} customers, {df.shape[1]} features")
print(f"Churn Rate: {(df['Churn'].sum() / len(df) * 100):.1f}%\n")

# Data Preprocessing
# Drop CustomerID (not needed for prediction)
df_model = df.drop('CustomerID', axis=1)

# Identify categorical columns
categorical_cols = df_model.select_dtypes(include=['object']).columns
numerical_cols = df_model.select_dtypes(include=['int64', 'float64']).columns

print(f"Categorical Features: {list(categorical_cols)}")
print(f"Numerical Features: {list(numerical_cols)}\n")

# Encode categorical variables
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df_model[col] = le.fit_transform(df_model[col])
    label_encoders[col] = le

# Separate features and target
X = df_model.drop('Churn', axis=1)
y = df_model['Churn']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training set: {X_train.shape}")
print(f"Testing set: {X_test.shape}\n")

# Train Random Forest Model
print("Training Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate model
accuracy = accuracy_score(y_test, y_pred)
print(f"\n{'=' * 60}")
print(f"MODEL RESULTS")
print(f"{'=' * 60}")
print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)\n")

print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=['No Churn', 'Churn']))

print("Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(f"  True Negatives: {cm[0][0]}, False Positives: {cm[0][1]}")
print(f"  False Negatives: {cm[1][0]}, True Positives: {cm[1][1]}\n")

# Feature Importance
print(f"{'=' * 60}")
print("TOP 10 IMPORTANT FEATURES FOR CHURN PREDICTION")
print(f"{'=' * 60}")
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

for idx, row in feature_importance.head(10).iterrows():
    print(f"{row['Feature']:.<30} {row['Importance']:.4f}")

print(f"\n✓ Model training complete!")
