#!/usr/bin/env bash
# iOS 앱을 수동 서명으로 아카이브하고 App Store Connect 업로드용 IPA 를 만든다.
# 업로드는 하지 않는다. 만든 IPA 는 Transporter 로 직접 올린다(docs/ios/TESTFLIGHT.md).
#
# 필수 환경 변수 (값은 저장소에 적지 않는다)
#   IOS_TEAM_ID        Apple 개발자 팀 ID (10자)
#   IOS_PROFILE        App Store 배포 프로비저닝 프로파일 이름
#   IOS_SIGN_IDENTITY  배포 인증서 SHA-1 (같은 이름의 인증서가 둘이면 이름 대신 SHA-1 로 고정)
# 선택
#   IOS_BUNDLE_ID      기본 com.kordp888.careercoach
#   IOS_BUILD_NUMBER   기본은 지금 시각(yyyymmddHHMM). 올릴 때마다 커져야 한다
set -euo pipefail
cd "$(dirname "$0")/.."

: "${IOS_TEAM_ID:?IOS_TEAM_ID 가 필요합니다}"
: "${IOS_PROFILE:?IOS_PROFILE 이 필요합니다}"
: "${IOS_SIGN_IDENTITY:?IOS_SIGN_IDENTITY(인증서 SHA-1) 가 필요합니다}"
BUNDLE_ID="${IOS_BUNDLE_ID:-com.kordp888.careercoach}"
BUILD_NUMBER="${IOS_BUILD_NUMBER:-$(date +%Y%m%d%H%M)}"
OUT="${IOS_OUT:-$HOME/Desktop/CareerCoach-ios}"
ARCHIVE="$OUT/CareerCoach-$BUILD_NUMBER.xcarchive"
mkdir -p "$OUT"

echo "1/4 웹 자산 동기화"
npx cap sync ios

echo "2/4 아카이브 (빌드 번호 $BUILD_NUMBER)"
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$ARCHIVE" archive \
  CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM="$IOS_TEAM_ID" \
  PRODUCT_BUNDLE_IDENTIFIER="$BUNDLE_ID" PROVISIONING_PROFILE_SPECIFIER="$IOS_PROFILE" \
  CODE_SIGN_IDENTITY="$IOS_SIGN_IDENTITY" CURRENT_PROJECT_VERSION="$BUILD_NUMBER"

echo "3/4 IPA 내보내기"
PLIST="$OUT/ExportOptions.plist"
cat > "$PLIST" <<PLIST_EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>method</key><string>app-store-connect</string>
<key>destination</key><string>export</string>
<key>teamID</key><string>$IOS_TEAM_ID</string>
<key>signingStyle</key><string>manual</string>
<key>signingCertificate</key><string>$IOS_SIGN_IDENTITY</string>
<key>provisioningProfiles</key><dict><key>$BUNDLE_ID</key><string>$IOS_PROFILE</string></dict>
<key>uploadSymbols</key><true/>
</dict></plist>
PLIST_EOF
xcodebuild -exportArchive -archivePath "$ARCHIVE" -exportPath "$OUT/export-$BUILD_NUMBER" -exportOptionsPlist "$PLIST"
IPA="$(ls "$OUT/export-$BUILD_NUMBER"/*.ipa)"

echo "4/4 검증"
APP="$ARCHIVE/Products/Applications/App.app"
codesign -dvvv "$APP" 2>&1 | grep -E "^Authority=|^TeamIdentifier=" 
codesign -vvv --deep --strict "$APP"
python3 - "$IPA" <<'PY'
import sys, zipfile
bad = [n for n in zipfile.ZipFile(sys.argv[1]).namelist() if not n.isascii()]
print("IPA 안 비ASCII 경로:", bad)
sys.exit(1 if bad else 0)
PY
echo "완료: $IPA"
