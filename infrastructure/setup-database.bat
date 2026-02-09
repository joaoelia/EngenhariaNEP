@echo off
REM Script para configurar e iniciar o banco de dados MySQL do AeroGestor
REM Windows Batch Script

echo ========================================
echo   AeroGestor - Configuracao do MySQL
echo ========================================
echo.

:menu
echo Escolha uma opcao:
echo.
echo 1. Iniciar MySQL via Docker
echo 2. Parar MySQL Docker
echo 3. Conectar ao MySQL (Docker)
echo 4. Executar script de schema
echo 5. Executar script de dados de exemplo
echo 6. Backup do banco de dados
echo 7. Ver logs do MySQL
echo 8. Reset completo (apagar dados)
echo 9. Sair
echo.

set /p opcao="Digite o numero da opcao: "

if "%opcao%"=="1" goto start_docker
if "%opcao%"=="2" goto stop_docker
if "%opcao%"=="3" goto connect
if "%opcao%"=="4" goto schema
if "%opcao%"=="5" goto sample_data
if "%opcao%"=="6" goto backup
if "%opcao%"=="7" goto logs
if "%opcao%"=="8" goto reset
if "%opcao%"=="9" goto end

echo Opcao invalida!
pause
cls
goto menu

:start_docker
echo.
echo Iniciando MySQL via Docker...
docker-compose up -d mysql
echo.
echo Aguardando MySQL inicializar (30 segundos)...
timeout /t 30 /nobreak
echo.
echo MySQL iniciado! Conecte em localhost:3306
echo Usuario: root
echo Senha: rootpassword
echo Banco: aerogestor
echo.
pause
cls
goto menu

:stop_docker
echo.
echo Parando MySQL Docker...
docker-compose down
echo.
echo MySQL parado!
echo.
pause
cls
goto menu

:connect
echo.
echo Conectando ao MySQL...
docker exec -it aerogestor-mysql mysql -uroot -prootpassword aerogestor
pause
cls
goto menu

:schema
echo.
echo Executando script de schema...
docker exec -i aerogestor-mysql mysql -uroot -prootpassword aerogestor < backend\src\main\resources\db\schema.sql
echo.
echo Schema criado com sucesso!
echo.
pause
cls
goto menu

:sample_data
echo.
echo Executando script de dados de exemplo...
docker exec -i aerogestor-mysql mysql -uroot -prootpassword aerogestor < backend\src\main\resources\db\sample-data.sql
echo.
echo Dados de exemplo inseridos com sucesso!
echo.
pause
cls
goto menu

:backup
echo.
echo Criando backup do banco de dados...
set backup_file=backup_aerogestor_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set backup_file=%backup_file: =0%
docker exec aerogestor-mysql mysqldump -uroot -prootpassword aerogestor > %backup_file%
echo.
echo Backup criado: %backup_file%
echo.
pause
cls
goto menu

:logs
echo.
echo Exibindo logs do MySQL (Ctrl+C para sair)...
echo.
docker logs -f aerogestor-mysql
pause
cls
goto menu

:reset
echo.
echo ATENCAO: Esta acao vai APAGAR TODOS OS DADOS do banco!
set /p confirma="Digite 'SIM' para confirmar: "
if not "%confirma%"=="SIM" (
    echo Operacao cancelada.
    pause
    cls
    goto menu
)
echo.
echo Parando containers...
docker-compose down
echo.
echo Removendo volume de dados...
docker volume rm aerogestor_mysql_data
echo.
echo Reiniciando MySQL...
docker-compose up -d mysql
echo.
echo Aguardando MySQL inicializar...
timeout /t 30 /nobreak
echo.
echo Reset completo! O banco esta vazio.
echo.
pause
cls
goto menu

:end
echo.
echo Ate logo!
exit /b 0
