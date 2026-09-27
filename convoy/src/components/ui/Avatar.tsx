import { View, Text, Image } from "react-native";
import { initials } from "../../lib/format";
import { Icon, Icons } from "./Icon";

interface Props {
  person?: { name: string; avatar: string } | null;
  size?: number;
  borderColor?: string;
  showStatus?: boolean;
}

const isIconName = (s?: string) =>
  !!s && Object.prototype.hasOwnProperty.call(Icons, s);

/** True when the string is any image URI we should render as an <Image>. */
const isImageUri = (s?: string) =>
  !!s &&
  (s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("data:") ||
    s.startsWith("file://") ||
    s.startsWith("content://") ||
    s.startsWith("ph://") ||
    s.startsWith("assets-library://"));

export function Avatar({ person, size = 48, borderColor, showStatus }: Props) {
  if (!person) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#1D242F",
        }}
        className="items-center justify-center"
      >
        <Icon name="user" size={size * 0.5} color="rgba(240,243,248,0.5)" />
      </View>
    );
  }

  const asImage = isImageUri(person.avatar);
  const asIcon = !asImage && isIconName(person.avatar);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: borderColor ? 2 : 0,
        borderColor: borderColor || "transparent",
        backgroundColor: "#1D242F",
      }}
      className="items-center justify-center overflow-hidden relative"
    >
      {asImage ? (
        <Image
          source={{ uri: person.avatar }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : asIcon ? (
        <Icon name={person.avatar} size={size * 0.5} color="#FF7B6B" strokeWidth={2.2} />
      ) : (
        <Text
          style={{
            fontSize: size * 0.42,
            color: "#F0F3F8",
            fontWeight: "800",
          }}
        >
          {person.avatar && !person.avatar.startsWith("file")
            ? person.avatar
            : initials(person.name)}
        </Text>
      )}
      {showStatus && (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#7CE5B0",
            position: "absolute",
            bottom: 0,
            right: 0,
            borderWidth: 2,
            borderColor: "#151A23",
          }}
        />
      )}
    </View>
  );
}