import { z } from 'zod'

export const yookassaWebhookSchema = z.object({
  type: z.string(),
  event: z.string(),
  object: z.object({
    id: z.string(),
    status: z.string(),
    paid: z.boolean(),
    amount: z.object({
      value: z.string(),
      currency: z.string(),
    }),
    description: z.string().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
    payment_method: z.object({
      type: z.string(),
    }).optional(),
    captured_at: z.string().optional(),
    expires_at: z.string().optional(),
  }),
})

export type YooKassaWebhookPayload = z.infer<typeof yookassaWebhookSchema>
