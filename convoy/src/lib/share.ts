import { Linking, Share } from "react-native";

export async function shareRideJournal(
  title: string,
  distance: number,
  riders: number,
  moments: number,
  platform: "whatsapp" | "twitter" | "instagram" | "native" = "native"
) {
  const text = `🏍️ Just finished ${title} — ${distance} km with ${riders} riders and ${moments} moments captured on Convoy!`;
  const url = "https://convoy.app";

  if (platform === "whatsapp") {
    const enc = encodeURIComponent(`${text} ${url}`);
    await Linking.openURL(`https://wa.me/?text=${enc}`);
    return;
  }
  if (platform === "twitter") {
    const enc = encodeURIComponent(`${text} ${url}`);
    await Linking.openURL(`https://twitter.com/intent/tweet?text=${enc}`);
    return;
  }
  if (platform === "instagram") {
    await Share.share({ message: `${text} ${url}` });
    return;
  }
  await Share.share({ title, message: `${text} ${url}`, url });
}