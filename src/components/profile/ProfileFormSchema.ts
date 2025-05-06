
import * as z from 'zod';

export const profileFormSchema = z.object({
  username: z.string()
    .min(3, { message: 'Имя пользователя должно содержать не менее 3 символов' })
    .max(20, { message: 'Имя пользователя должно содержать не более 20 символов' })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { 
      message: 'Имя пользователя должно начинаться с буквы и может содержать только латинские буквы, цифры и символ подчеркивания' 
    }),
  firstName: z.string().max(30).optional(),
  lastName: z.string().max(30).optional(),
  bio: z.string().max(500).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
