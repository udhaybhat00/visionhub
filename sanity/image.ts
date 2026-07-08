import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function image(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

export function productImageUrl(
  source: SanityImageSource,
  width = 600,
  height = 600
) {
  return builder
    .image(source)
    .ignoreImageParams()
    .fit("max")
    .width(width)
    .height(height)
    .auto("format")
    .quality(85)
    .url();
}
