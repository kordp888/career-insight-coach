import type { CapacitorConfig } from "@capacitor/cli";

/**
 * iOS 앱(가제 커리어 AI 웨이브)은 배포된 웹앱(/coach)을 그대로 띄우는 얇은 껍데기다. 화면과 저장 구조는 웹과 같다.
 * 네트워크가 끊기면 ios-shell/offline.html 을 보여 준다.
 * 번들 ID 는 App Store Connect 에 등록한 값과 같아야 한다(docs/ios/TESTFLIGHT.md).
 */
const config: CapacitorConfig = {
  appId: process.env.IOS_BUNDLE_ID || "com.kordp888.careercoach",
  appName: "커리어 AI 웨이브",
  webDir: "ios-shell",
  backgroundColor: "#f8fbff",
  server: {
    url: process.env.IOS_START_URL || "https://career-insight-coach.vercel.app/coach",
    errorPath: "offline.html",
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#f8fbff",
  },
};

export default config;
