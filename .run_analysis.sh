#!/bin/bash
cd /Users/benzinho/Desktop/dodsbo
python3 -m pip install openpyxl --break-system-packages -q 2>/dev/null || true
python3 /tmp/direct_generate.py
