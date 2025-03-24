import { z } from "zod";

export const productEditSchema = z
  .object({
    id: z.string(),
    name: z.string().min(4),
    description: z.string().min(10),
    price: z.number(),
    stock_quantity: z.number(),
    discount: z.number(),
    image_url: z.string(),
    is_active: z.boolean(),
    category_id: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.price < values.discount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O preço não pode ser menor que o desconto",
        path: ["price"],
      });
    }
  });
