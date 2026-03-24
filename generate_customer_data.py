#!/usr/bin/env python
"""Generate random customer data for churn prediction."""

import pandas as pd
import numpy as np
import random

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Number of customers to generate
n_customers = 1000

# Generate customer data
data = {
    'CustomerID': [f'CUST{i:05d}' for i in range(1, n_customers + 1)],
    'Age': np.random.randint(18, 80, n_customers),
    'Tenure_Months': np.random.randint(1, 72, n_customers),  # 1 to 6 years
    'Monthly_Charges': np.random.uniform(20, 150, n_customers).round(2),
    'Total_Charges': np.random.uniform(100, 8000, n_customers).round(2),
    'Contract_Type': np.random.choice(['Month-to-month', 'One year', 'Two year'], n_customers),
    'Internet_Service': np.random.choice(['DSL', 'Fiber optic', 'No'], n_customers),
    'Online_Security': np.random.choice(['Yes', 'No', 'No internet'], n_customers),
    'Online_Backup': np.random.choice(['Yes', 'No', 'No internet'], n_customers),
    'Device_Protection': np.random.choice(['Yes', 'No', 'No internet'], n_customers),
    'Tech_Support': np.random.choice(['Yes', 'No', 'No internet'], n_customers),
    'Streaming_TV': np.random.choice(['Yes', 'No', 'No internet'], n_customers),
    'Streaming_Movies': np.random.choice(['Yes', 'No', 'No internet'], n_customers),
    'Paperless_Billing': np.random.choice(['Yes', 'No'], n_customers),
    'Payment_Method': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'], n_customers),
    'Churn': np.random.choice([0, 1], n_customers, p=[0.73, 0.27])  # 27% churn rate (realistic)
}

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
output_file = 'd:\\my websitecode\\customer_data.csv'
df.to_csv(output_file, index=False)

print(f"✓ Generated {n_customers} customer records")
print(f"✓ Saved to: {output_file}")
print(f"\nDataset Info:")
print(f"  - Shape: {df.shape}")
print(f"  - Churn Rate: {(df['Churn'].sum() / len(df) * 100):.1f}%")
print(f"\nFirst 5 rows:")
print(df.head())
print(f"\nDataset Summary:")
print(df.describe())
