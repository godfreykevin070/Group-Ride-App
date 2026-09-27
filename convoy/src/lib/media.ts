import * as ImagePicker from "expo-image-picker";

/** Take a photo with the camera. */
export async function pickMedia(): Promise<{ uri: string; type: "photo" | "video" } | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (perm.status !== "granted") {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (lib.status !== "granted") return null;
  }
  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images", "videos"],
    quality: 0.6,
    videoMaxDuration: 30,
    allowsEditing: false,
  });
  if (res.canceled || !res.assets?.length) return null;
  const asset = res.assets[0];
  return {
    uri: asset.uri,
    type: asset.type === "video" ? "video" : "photo",
  };
}

/** Pick a square image from the gallery — great for avatars & club icons. */
export async function pickImageFromLibrary(): Promise<string | null> {
  const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (lib.status !== "granted") return null;
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: true,
    aspect: [1, 1],
  });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0].uri;
}