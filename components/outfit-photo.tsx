"use client";

import Image from "next/image";
import { getOutfitPhoto } from "@/lib/outfit-photos";

type OutfitPhotoProps = {
  outfitId: string;
  title: string;
  priority?: boolean;
  showCredit?: boolean;
};

export function OutfitPhoto({
  outfitId,
  title,
  priority = false,
  showCredit = false,
}: OutfitPhotoProps) {
  const photo = getOutfitPhoto(outfitId);

  if (!photo) {
    return (
      <div className="missing-photo">
        <span>{title}</span>
        <style jsx>{`
          .missing-photo {
            width: 100%;
            height: 100%;
            display: grid;
            place-items: center;
            background: #e9e2d8;
            color: #766d67;
            font-size: 13px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="outfit-photo">
      <Image
        src={photo.imageUrl}
        alt={`${title} outfit inspiration`}
        fill
        sizes="(max-width: 720px) 100vw, 50vw"
        priority={priority}
        unoptimized
        style={{ objectPosition: photo.objectPosition || "50% 50%" }}
      />
      {showCredit && (
        <a
          className="credit"
          href={photo.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Photo inspiration · {photo.sourceName}
        </a>
      )}

      <style jsx>{`
        .outfit-photo {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #e9e2d8;
        }
        .outfit-photo :global(img) {
          object-fit: cover;
        }
        .credit {
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 2;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(23,20,18,.72);
          color: #fffdf9;
          font-size: 9px;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}
