import React, { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import Avatar from "boring-avatars";
import { colorPaletteFromId } from "../../utils/color-palette-from-id";
import { LoaderFunction, useLoaderData } from "remix";
import { axiosLoader } from "~/utils/loaders/axios";
import { redirectIfNeeded } from "~/utils/redirectIfNeeded";
import { presignedUrlLoader } from "~/utils/loaders/presigned-url";

interface SmartImageData {
  presignedUrl?: string;
}

export type AvatarPropsVariant =
  | "marble"
  | "beam"
  | "pixel"
  | "sunset"
  | "ring"
  | "bauhaus";

export interface SmartImageProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  presignedUrl: string;
  unsplashImageData?: any;
  placeholderKey: string;
  placeholderType: AvatarPropsVariant;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  presignedUrl,
  unsplashImageData,
  placeholderKey,
  placeholderType,
  style,
  className,
}: SmartImageProps) => {
  return (
    <>
      {!!presignedUrl && (
        <img className={className} style={style} src={presignedUrl} />
      )}
      {!!unsplashImageData && (
        <img
          className={className}
          style={style}
          src={unsplashImageData?.imageUrl}
        />
      )}

      {!presignedUrl && !unsplashImageData && (
        <div className={`placeholder ${className}`} style={style}>
          <Avatar
            size={250}
            square={true}
            variant={placeholderType}
            name={placeholderKey}
            colors={colorPaletteFromId(placeholderKey)}
          />
        </div>
      )}
    </>
  );
};
