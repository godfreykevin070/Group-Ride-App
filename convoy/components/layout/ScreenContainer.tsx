import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  scroll?: boolean;
  bottomPad?: number;
}

export function ScreenContainer({
  children,
  scroll = true,
  bottomPad = 120,
}: Props) {
  const content = <View style={{ paddingBottom: bottomPad }}>{children}</View>;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}