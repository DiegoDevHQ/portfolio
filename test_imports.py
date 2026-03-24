#!/usr/bin/env python
"""Test script to verify pandas and numpy are properly installed and working."""

import sys
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")
print()

# Import and test pandas
try:
    import pandas as pd
    print("✓ pandas imported successfully")
    # Create a simple DataFrame to test functionality
    df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})
    print("✓ pandas DataFrame created successfully")
    print(df)
    print()
except ImportError as e:
    print(f"✗ Failed to import pandas: {e}")
    sys.exit(1)

# Import and test numpy
try:
    import numpy as np
    print("✓ numpy imported successfully")
    # Create a simple array to test functionality
    arr = np.array([1, 2, 3, 4, 5])
    print("✓ numpy array created successfully")
    print(f"Array: {arr}")
    print(f"Mean: {np.mean(arr)}")
    print()
except ImportError as e:
    print(f"✗ Failed to import numpy: {e}")
    sys.exit(1)

print("✓ All imports and tests passed!")
