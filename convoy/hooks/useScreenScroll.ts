import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export function useScreenScroll() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  return { scrollY, scrollHandler };
}