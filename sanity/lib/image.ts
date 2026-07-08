import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

export const productImageUrl = (
  source: SanityImageSource,
  width = 600,
  height = 600
) => {
  return builder
    .image(source)
    .ignoreImageParams()
    .fit("max")
    .width(width)
    .height(height)
    .auto("format")
    .quality(85)
    .url();
};
