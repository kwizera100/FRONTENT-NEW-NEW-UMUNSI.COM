$ErrorActionPreference = "Stop"

$serverHost = "93.127.186.217"
$user = "root"
$pass = "MISSMICHOU783450859@kwizera"

# Use .NET SSH approach via process
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "ssh"
$psi.Arguments = "-o StrictHostKeyChecking=no -o ConnectTimeout=15 $user@$serverHost"
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $true

$proc = New-Object System.Diagnostics.Process
$proc.StartInfo = $psi

$scriptBlock = {
    param($proc, $pass)
    Start-Sleep -Seconds 3
    $proc.StandardInput.WriteLine($pass)
    Start-Sleep -Seconds 2
    
    $commands = @(
        "echo CONNECTED_OK",
        "uname -a",
        "ls /var/www/ 2>/dev/null",
        "ls /home/ 2>/dev/null",
        "ls /opt/ 2>/dev/null",
        "find /var/www -name '.env' 2>/dev/null | head -10",
        "find /var/www -name 'wp-config.php' 2>/dev/null | head -5",
        "find /var/www -name 'docker-compose.yml' 2>/dev/null | head -5",
        "find / -maxdepth 4 -name '.env' 2>/dev/null | head -10",
        "find / -maxdepth 4 -name 'docker-compose.yml' 2>/dev/null | head -5",
        "docker ps 2>/dev/null",
        "ls -la /var/www/html/ 2>/dev/null | head -20",
        "cat /var/www/html/.env 2>/dev/null",
        "cat /var/www/html/wp-config.php 2>/dev/null | head -30",
        "cat /var/www/umunsi/.env 2>/dev/null",
        "ls -la /var/www/umunsi/ 2>/dev/null | head -20",
        "find /var/www -maxdepth 3 -type d 2>/dev/null | head -30",
        "ls -la /etc/nginx/sites-enabled/ 2>/dev/null",
        "cat /etc/nginx/sites-enabled/* 2>/dev/null | head -50",
        "psql -l 2>/dev/null",
        "mysql -e 'SHOW DATABASES;' 2>/dev/null",
        "docker exec -it $(docker ps -q --filter ancestor=postgres 2>/dev/null | head -1) psql -U postgres -l 2>/dev/null",
        "exit"
    )
    
    foreach ($cmd in $commands) {
        $proc.StandardInput.WriteLine($cmd)
        Start-Sleep -Seconds 1
    }
}

$proc.Start() | Out-Null

# Start reading output in background
$outputJob = Start-Job -ScriptBlock {
    param($procId)
    $p = Get-Process -Id $procId
    while (-not $p.HasExited) {
        $line = $p.StandardOutput.ReadLine()
        if ($line) { Write-Output $line }
    }
} -ArgumentList $proc.Id

# Send password and commands
Start-Sleep -Seconds 3
$proc.StandardInput.WriteLine($pass)
Start-Sleep -Seconds 2

$commands = @(
    "echo CONNECTED_OK",
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
    "exit"
)

foreach ($cmd in $commands) {
    $proc.StandardInput.WriteLine($cmd)
    Start-Sleep -Seconds 1
}

Start-Sleep -Seconds 3

# Read all available output
while (-not $proc.StandardOutput.EndOfStream) {
    $line = $proc.StandardOutput.ReadLine()
    if ($line) { Write-Output $line }
}

$proc.WaitForExit(5000) | Out-Null
exit 0
