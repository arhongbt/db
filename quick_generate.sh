#!/bin/bash
cd /Users/benzinho/Desktop/dodsbo
python3 << 'EOFPYTHON'
import subprocess, sys, random
from datetime import datetime
subprocess.run([sys.executable, '-m', 'pip', 'install', 'openpyxl', '-q', '--break-system-packages'], capture_output=True)
exec(open('/tmp/generate_xlsx_final.py').read())
EOFPYTHON
