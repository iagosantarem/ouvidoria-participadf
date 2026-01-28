"use client";

import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { TextInput } from "@/components/inputs/text-input";
import { AudioInput } from "@/components/inputs/audio-input";
import { ImageInput } from "@/components/inputs/image-input";
import { VideoInput } from "@/components/inputs/video-input";

export function ContentStep() {
  const { content } = useManifestationForm();

  switch (content.channel) {
    case "text":
      return <TextInput />;
    case "audio":
      return <AudioInput />;
    case "image":
      return <ImageInput />;
    case "video":
      return <VideoInput />;
    default:
      return <TextInput />;
  }
}
