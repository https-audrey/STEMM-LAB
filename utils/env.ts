// utils/env.ts
import Constants from "expo-constants";

export const isExpoGo =
  Constants.executionEnvironment === "storeClient";

export const isNativeApp =
  Constants.executionEnvironment !== "storeClient";