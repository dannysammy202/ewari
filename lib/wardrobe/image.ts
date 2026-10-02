"use client";

export type PreparedWardrobeImage = {
  dataUrl: string;
  base64: string;
  mimeType: string;
};

export async function prepareWardrobeImage(file: File): Promise<PreparedWardrobeImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }

  const source = await fileToDataUrl(file);
  const image = await loadImage(source);

  const maxWidth = 520;
  const maxHeight = 650;
  const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing failed");

  context.fillStyle = "#F7F3EC";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
  const [, base64 = ""] = dataUrl.split(",");

  return {
    dataUrl,
    base64,
    mimeType: "image/jpeg",
  };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to process image"));
    image.src = src;
  });
}
