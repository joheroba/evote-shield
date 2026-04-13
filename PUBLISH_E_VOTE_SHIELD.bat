@echo off
title PUBLISH TO GITHUB - INNOVACION 2026
echo ----------------------------------------------------
echo SISTEMA DE PUBLICACION AUTOMATICA - PORTAFOLIO TECH
echo [!] RECUERDA: CREA EL REPOSITORIO COMO PRIVADO [!]
echo ----------------------------------------------------
echo.

:: Inicializar Git si no existe
if not exist .git (
    echo [1/4] Inicializando Repositorio Git...
    git init
) else (
    echo [1/4] Git ya inicializado.
)

:: Añadir archivos y primer commit
echo [2/4] Añadiendo archivos y creando commit profesional...
git add .
git commit -m "Initial commit for E-Vote Shield - Decentralized Sovereign Voting Protocol"
git branch -M main

:: Pedir el nombre del repositorio al usuario
echo.
echo [!] PASO REQUERIDO: Crea un repositorio PRIVADO en github.com/joheroba
set /p reponame=">> Escribe solo el NOMBRE del repositorio (ej: evote-shield): "

:: Añadir remoto y subir
echo [3/4] Vinculando a https://github.com/joheroba/%reponame%.git...
git remote add origin https://github.com/joheroba/%reponame%.git
echo [4/4] Subiendo codigo de forma PRIVADA a la rama Main...
git push -u origin main

echo.
echo ----------------------------------------------------
echo [OK] ¡PROYECTO PUBLICADO CON EXITO! 🚀📈
echo Revisa tu perfil: https://github.com/joheroba/%reponame%
echo ----------------------------------------------------
pause
