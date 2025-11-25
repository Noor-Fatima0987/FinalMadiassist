import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// iPhone 13 base design (375 x 812)
const baseWidth = 375;
const baseHeight = 812;

export const scale = (size) => (width / baseWidth) * size;

export const verticalScale = (size) => (height / baseHeight) * size;

export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Platform font fix
export const platformFont = (size) =>
  Platform.OS === "android" ? moderateScale(size * 0.95) : size;
