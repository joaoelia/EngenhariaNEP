# Script para configurar e iniciar o banco de dados MySQL do AeroGestor
# PowerShell Script

function Show-Menu {
    Clear-Host
    Write-Host "========================================"
    Write-Host "  AeroGestor - Configuracao do MySQL   "
    Write-Host "========================================"
    Write-Host ""
    Write-Host "1. Iniciar MySQL via Docker"
    Write-Host "2. Parar MySQL Docker"
    Write-Host "3. Conectar ao MySQL (Docker)"
    Write-Host "4. Executar script de schema"
    Write-Host "5. Executar script de dados de exemplo"
    Write-Host "6. Backup do banco de dados"
    Write-Host "7. Ver logs do MySQL"
    Write-Host "8. Reset completo (apagar dados)"
    Write-Host "9. Verificar status"
    Write-Host "10. Sair"
    Write-Host ""
}

function Start-MySQL {
    Write-Host "`nIniciando MySQL via Docker..." -ForegroundColor Cyan
    docker-compose up -d mysql
    Write-Host "`nAguardando MySQL inicializar..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    Write-Host "`nMySQL iniciado!" -ForegroundColor Green
    Write-Host "Conecte em: localhost:3306"
    Write-Host "Usuario: root"
    Write-Host "Senha: rootpassword"
    Write-Host "Banco: aerogestor"
    Pause
}

function Stop-MySQL {
    Write-Host "`nParando MySQL Docker..." -ForegroundColor Cyan
    docker-compose down
    Write-Host "`nMySQL parado!" -ForegroundColor Green
    Pause
}

function Connect-MySQL {
    Write-Host "`nConectando ao MySQL..." -ForegroundColor Cyan
    docker exec -it aerogestor-mysql mysql -uroot -prootpassword aerogestor
    Pause
}

function Execute-Schema {
    Write-Host "`nExecutando script de schema..." -ForegroundColor Cyan
    Get-Content "backend\src\main\resources\db\schema.sql" | docker exec -i aerogestor-mysql mysql -uroot -prootpassword aerogestor
    Write-Host "`nSchema criado com sucesso!" -ForegroundColor Green
    Pause
}

function Execute-SampleData {
    Write-Host "`nExecutando script de dados de exemplo..." -ForegroundColor Cyan
    Get-Content "backend\src\main\resources\db\sample-data.sql" | docker exec -i aerogestor-mysql mysql -uroot -prootpassword aerogestor
    Write-Host "`nDados de exemplo inseridos com sucesso!" -ForegroundColor Green
    Pause
}

function Create-Backup {
    Write-Host "`nCriando backup do banco de dados..." -ForegroundColor Cyan
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "backup_aerogestor_$timestamp.sql"
    docker exec aerogestor-mysql mysqldump -uroot -prootpassword aerogestor | Out-File -FilePath $backupFile -Encoding UTF8
    Write-Host "`nBackup criado: $backupFile" -ForegroundColor Green
    Pause
}

function Show-Logs {
    Write-Host "`nExibindo logs do MySQL (Ctrl+C para sair)..." -ForegroundColor Cyan
    docker logs -f aerogestor-mysql
    Pause
}

function Reset-Database {
    Write-Host "`nATENCAO: Esta acao vai APAGAR TODOS OS DADOS do banco!" -ForegroundColor Red
    $confirma = Read-Host "Digite 'SIM' para confirmar"
    
    if ($confirma -eq "SIM") {
        Write-Host "`nParando containers..." -ForegroundColor Cyan
        docker-compose down
        Write-Host "`nRemovendo volume de dados..." -ForegroundColor Cyan
        docker volume rm aerogestor_mysql_data -ErrorAction SilentlyContinue
        Write-Host "`nReiniciando MySQL..." -ForegroundColor Cyan
        docker-compose up -d mysql
        Write-Host "`nAguardando MySQL inicializar..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        Write-Host "`nReset completo! O banco esta vazio." -ForegroundColor Green
    } else {
        Write-Host "`nOperacao cancelada." -ForegroundColor Yellow
    }
    Pause
}

function Check-Status {
    Write-Host "`nVerificando status..." -ForegroundColor Cyan
    Write-Host "`nContainers em execucao:" -ForegroundColor Yellow
    docker ps | Select-String "aerogestor"
    Write-Host "`nVolumes:" -ForegroundColor Yellow
    docker volume ls | Select-String "aerogestor"
    Pause
}

# Main loop
do {
    Show-Menu
    $opcao = Read-Host "Digite o numero da opcao"
    
    switch ($opcao) {
        "1" { Start-MySQL }
        "2" { Stop-MySQL }
        "3" { Connect-MySQL }
        "4" { Execute-Schema }
        "5" { Execute-SampleData }
        "6" { Create-Backup }
        "7" { Show-Logs }
        "8" { Reset-Database }
        "9" { Check-Status }
        "10" { Write-Host "`nAte logo!" -ForegroundColor Cyan; exit }
        default { Write-Host "`nOpcao invalida!" -ForegroundColor Red; Pause }
    }
} while ($true)
