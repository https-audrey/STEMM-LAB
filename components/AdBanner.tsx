import { View, Platform } from "react-native";
import { useEffect, useState } from "react";
import { isExpoGo } from "../utils/env";

let BannerAd: any;
let BannerAdSize: any;
let TestIds: any;
let mobileAds: any;

if (!isExpoGo) {
  try {
    const ads = require("react-native-google-mobile-ads");
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
    TestIds = ads.TestIds;
    mobileAds = ads.default;
  } catch (e) {}
}

export const AdBanner = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mobileAds) return;

    mobileAds()
      .initialize()
      .then(() => setReady(true))
      .catch(() => {});
  }, []);

  if (isExpoGo || !BannerAd || !ready) return null;

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
      />
    </View>
  );
};