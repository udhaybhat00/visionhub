import { defineField, defineType } from "sanity";

export const couponType = defineType({
  name: "coupon",
  title: "Coupons",
  type: "document",

  fields: [
    defineField({
      name: "code",
      title: "Coupon Code",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage", value: "percentage" },
          { title: "Fixed Amount", value: "fixed" },
        ],
      },
      validation: (Rule) =>
  Rule.required().custom((value) => {
    if (value?.trim() !== value) {
      return "No leading or trailing spaces allowed";
    }
    return true;
  }),
    }),

    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: "minimumOrderValue",
      title: "Minimum Order Value",
      type: "number",
      initialValue: 0,
    }),

    defineField({
      name: "expiryDate",
      title: "Expiry Date",
      type: "datetime",
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "usageLimit",
      title: "Usage Limit",
      type: "number",
      initialValue: 100,
    }),

    defineField({
      name: "timesUsed",
      title: "Times Used",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
  ],

preview: {
  select: {
    title: "code",
    discount: "discountValue",
    used: "timesUsed",
    limit: "usageLimit",
  },
  prepare(selection) {
    return {
      title: selection.title,
      subtitle: `₹${selection.discount} • Used ${selection.used}/${selection.limit}`,
    };
  },
},
});