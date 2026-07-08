import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
  name: "highlights",
  title: "Product Highlights",
  type: "array",
  of: [{ type: "string" }],
}),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
  name: "frameMaterial",
  title: "Frame Material",
  type: "string",
}),

defineField({
  name: "lensType",
  title: "Lens Type",
  type: "string",
}),

defineField({
  name: "gender",
  title: "Gender",
  type: "string",
}),

defineField({
  name: "frameShape",
  title: "Frame Shape",
  type: "string",
}),

defineField({
  name: "uvProtection",
  title: "UV Protection",
  type: "string",
}),

defineField({
  name: "warranty",
  title: "Warranty",
  type: "string",
}),
defineField({
  name: "frameSize",
  title: "Frame Size",
  type: "string",
}),

defineField({
  name: "lensWidth",
  title: "Lens Width",
  type: "string",
}),

defineField({
  name: "bridgeWidth",
  title: "Bridge Width",
  type: "string",
}),

defineField({
  name: "templeLength",
  title: "Temple Length",
  type: "string",
}),

defineField({
  name: "lensColor",
  title: "Lens Color",
  type: "string",
}),

defineField({
  name: "prescriptionAvailable",
  title: "Prescription Available",
  type: "boolean",
  initialValue: false,
}),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "sortOrder",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first in product lists.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Sunglasses", value: "sunglasses" },
          { title: "Computer Glasses", value: "computer-glasses" },
          { title: "Prescription", value: "prescription" },
          { title: "Premium", value: "premium" },
          { title: "Sports", value: "sports" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
    defineField({
      name: "averageRating",
      title: "Average Rating",
      type: "number",
      readOnly: true,
      description: "Calculated average rating from approved reviews",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "totalReviews",
      title: "Total Reviews",
      type: "number",
      readOnly: true,
      initialValue: 0,
      description: "Total number of approved reviews",
    }),
    defineField({
      name: "ratingDistribution",
      title: "Rating Distribution",
      type: "object",
      readOnly: true,
      description: "Distribution of ratings (1-5 stars)",
      fields: [
        defineField({
          name: "fiveStars",
          title: "5 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "fourStars",
          title: "4 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "threeStars",
          title: "3 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "twoStars",
          title: "2 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "oneStar",
          title: "1 Star",
          type: "number",
          initialValue: 0,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `₹${subtitle}`,
        media: image,
      };
    },
  },
});
