@echo off
echo 編譯後端應用程式...
go build -o backend.exe .

IF %ERRORLEVEL% NEQ 0 (
  echo 編譯失敗，錯誤碼: %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)

echo 啟動後端服務...
backend.exe

IF %ERRORLEVEL% NEQ 0 (
  echo 程式執行失敗，錯誤碼: %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
