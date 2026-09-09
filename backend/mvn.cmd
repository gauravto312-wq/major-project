@echo off
if exist "C:\Users\Gaurav Mishra\.jdks\ms-17.0.20.1" (
    set "JAVA_HOME=C:\Users\Gaurav Mishra\.jdks\ms-17.0.20.1"
) else if defined JAVA_HOME (
    set "JAVA_HOME=%JAVA_HOME:"=%"
)

set "MVN_EXEC=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd"

if exist "%MVN_EXEC%" (
    "%MVN_EXEC%" %*
) else (
    mvn %*
)
