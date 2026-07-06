@echo off
echo y | plink -ssh -pw "MISSMICHOU783450859@kwizera" root@93.127.186.217 "pm2 list; echo ===BREAK===; ls /var/www/ 2>/dev/null; echo ===BREAK===; ls /root/ 2>/dev/null; echo ===BREAK===; ls /opt/ 2>/dev/null; echo ===BREAK===; find / -name 'umunsi' -type d 2>/dev/null | head -5; echo ===DONE==="
