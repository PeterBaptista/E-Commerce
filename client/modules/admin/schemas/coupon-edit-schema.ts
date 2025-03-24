import { z } from "zod";

export const couponEditSchema = z
  .object({
    name: z.string().min(4),
    percentage: z.number(),
    expiration_date: z.date().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.expiration_date && values.expiration_date < new Date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A data de expiração não pode ser anterior à data atual",
        path: ["expiration_date"],
      });
    }
  });
