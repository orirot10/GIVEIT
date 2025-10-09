<# 
Build-AAB.ps1
בונה, חותם, מאמת ומעתיק את ה-AAB ל-dist עם שם גרסה/תאריך.
הפעלה:  powershell -ExecutionPolicy Bypass -File .\scripts\Build-AAB.ps1
פרמטרים:
    -FrontendPath   ברירת מחדל: .. (תיקיית הפרויקט שמכילה את android/)
    -Variant        ברירת מחדל: release
#>

param(
    [string]$FrontendPath = "..",
    [string]$Variant = "release"
)

$ErrorActionPreference = "Stop"

function Require-Cmd($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "לא נמצא '$name' ב-PATH. התקן/הוסף ל-PATH והרץ שוב."
    }
}

Write-Host "🔎 בדיקות סביבה..." -ForegroundColor Cyan
Require-Cmd node
Require-Cmd npm
Require-Cmd keytool

# gradlew קיים תחת android/
$AndroidPath = Join-Path $FrontendPath "android"
$Gradlew = Join-Path $AndroidPath "gradlew"
if (-not (Test-Path $Gradlew)) { throw "לא נמצא gradlew ב: $AndroidPath" }

# בדיקת keystore.properties
$KeystoreProps = Join-Path $AndroidPath "keystore.properties"
if (-not (Test-Path $KeystoreProps)) { throw "חסר keystore.properties ב: $AndroidPath" }

# קריאת גרסה מ-build.gradle (versionName, versionCode)
$AppGradle = Join-Path $AndroidPath "app\build.gradle"
if (-not (Test-Path $AppGradle)) { $AppGradle = Join-Path $AndroidPath "app\build.gradle.kts" }
if (-not (Test-Path $AppGradle)) { throw "לא נמצא build.gradle/gradle.kts תחת android/app" }

$gradleText = Get-Content $AppGradle -Raw
$versionName = ($gradleText | Select-String -Pattern 'versionName\s+"([^"]+)"' -AllMatches).Matches.Value `
    -replace 'versionName\s+"','' -replace '"',''
if (-not $versionName) { $versionName = "0.0.0" }

Write-Host "🧩 Sync Capacitor → Android" -ForegroundColor Cyan
Push-Location $FrontendPath
npx cap sync android | Out-Null
Pop-Location

Write-Host "🧹 Gradle clean" -ForegroundColor Cyan
Push-Location $AndroidPath
& $Gradlew clean | Out-Null

Write-Host "📦 Gradle bundle ($Variant)" -ForegroundColor Cyan
& $Gradlew "bundle$($Variant.Substring(0,1).ToUpper()+$Variant.Substring(1))"

# מיקום תוצר
$OutDir = Join-Path $AndroidPath "app\build\outputs\bundle\$Variant"
$AabPath = Join-Path $OutDir "app-$Variant.aab"
if (-not (Test-Path $AabPath)) {
    # גרסאות ישנות/חדשות: לפעמים השם app-release.aab
    $AabPath = Join-Path $OutDir "app-release.aab"
}
if (-not (Test-Path $AabPath)) {
    throw "לא נמצא קובץ AAB ב: $OutDir"
}

# יצירת dist ושם קובץ עם גרסה ותאריך
$Dist = Join-Path $FrontendPath "dist"
if (-not (Test-Path $Dist)) { New-Item -ItemType Directory -Path $Dist | Out-Null }
$Stamp = Get-Date -Format "yyyyMMdd-HHmm"
$FinalAab = Join-Path $Dist ("app-$versionName-$Variant-$Stamp.aab")
Copy-Item $AabPath $FinalAab -Force

Write-Host "🔐 בדיקת keystore (fingerprints):" -ForegroundColor Cyan
$KeystoreFile = (Get-Content $KeystoreProps | Where-Object { $_ -match '^storeFile=' }) -replace '^storeFile=',''
$KeystoreFile = Join-Path $AndroidPath $KeystoreFile
$keytoolOut = & keytool -list -v -keystore $KeystoreFile 2>$null
$keytoolOut | Select-String 'MD5:|SHA1:|SHA-256:' | ForEach-Object { $_.ToString().Trim() } | ForEach-Object { Write-Host "   $_" }

Write-Host ""
Write-Host "✅ ה-AAB מוכן:" -ForegroundColor Green
Write-Host "   $FinalAab" -ForegroundColor Green
Write-Host ""
Write-Host "➡️ העלה את הקובץ ל-Google Play Console (Production → Create new release)." -ForegroundColor Yellow
Pop-Location
