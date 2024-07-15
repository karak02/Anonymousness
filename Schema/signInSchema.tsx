import { z } from "zod";


export const signInSchem = z.object({
    email:z.string(),
    password: z.string()
})