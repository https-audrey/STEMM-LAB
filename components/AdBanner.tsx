// components/AdBanner.tsx
import { Platform, View } from "react-native";

let adMob: any = null;
try {
  // Try to load the AdMob library. This will fail in Expo Go.
  adMob = require("react-native-google-mobile-ads");
} catch {
  // If it fails (e.g., in Expo Go), we just log a warning and adMob stays null.
  console.warn("AdMob library not available. Ads will not be shown.");
}

export const AdBanner = () => {
  // If the library didn't load, don't render anything.
  if (!adMob) {
    return null;
  }

  const { BannerAd, BannerAdSize, TestIds } = adMob;

  // Use test ads in development, and your real ad unit ID in production.
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        android: "YOUR_ANDROID_BANNER_UNIT_ID",
        ios: "YOUR_IOS_BANNER_UNIT_ID",
      });

  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
};