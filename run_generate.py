#!/usr/bin/env python3
import subprocess, sys, os
os.chdir('/Users/benzinho/Desktop/dodsbo')
subprocess.run([sys.executable, '-m', 'pip', 'install', 'openpyxl', '-q', '--break-system-packages'], capture_output=True)
exec(open('/tmp/direct_generate.py').read())
