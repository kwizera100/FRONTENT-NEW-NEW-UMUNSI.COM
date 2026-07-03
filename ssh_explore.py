import paramiko
import sys

host = "93.127.186.217"
user = "root"
password = "MISSMICHOU783450859@kwizera"

try:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=password, timeout=15)
    print("CONNECTED_OK")
    
    commands = [
        "uname -a",
        "ls /var/www/ 2>/dev/null",
        "ls /home/ 2>/dev/null",
        "ls /opt/ 2>/dev/null",
        "find /var/www -maxdepth 3 -type d 2>/dev/null | head -30",
        "find /var/www -name '.env' 2>/dev/null | head -10",
        "find /var/www -name 'wp-config.php' 2>/dev/null | head -5",
        "find /var/www -name 'docker-compose.yml' 2>/dev/null | head -5",
        "find / -maxdepth 4 -name '.env' 2>/dev/null | head -10",
        "find / -maxdepth 4 -name 'docker-compose.yml' 2>/dev/null | head -5",
        "docker ps 2>/dev/null",
        "ls -la /var/www/html/ 2>/dev/null | head -20",
        "cat /var/www/html/.env 2>/dev/null",
        "cat /var/www/umunsi/.env 2>/dev/null",
        "ls -la /var/www/umunsi/ 2>/dev/null | head -20",
        "ls -la /etc/nginx/sites-enabled/ 2>/dev/null",
        "cat /etc/nginx/sites-enabled/* 2>/dev/null | head -80",
        "psql -l 2>/dev/null",
        "mysql -e 'SHOW DATABASES;' 2>/dev/null",
        "docker ps --format '{{.Names}} {{.Image}}' 2>/dev/null",
    ]
    
    for cmd in commands:
        print(f"\n=== CMD: {cmd} ===")
        stdin, stdout, stderr = client.exec_command(cmd, timeout=10)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        if out.strip():
            print(out.strip())
        if err.strip():
            print(f"STDERR: {err.strip()}")
    
    client.close()
    print("\nDONE")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
