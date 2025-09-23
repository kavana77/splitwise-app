import {z} from 'zod'

export const signupSchema = z.object({
    name: z.string().min(2, 'Fullname is required'),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password is required")
})

export const addExpenseSchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.number().positive("Amount must be positive"),
    paidUserId: z.string(),
    groupId: z.string(),
    splitType: z.enum([
        "equally",
        "exact",
        "percentage",
        "shares",
        "adjustment",
        "reimbursement"
    ]),
    splitDetails: z.record(z.string(),z.number()).optional(),
        date: z.string()
})

export type SignUpType = z.infer<typeof signupSchema>
export type LoginType = z.infer<typeof loginSchema>
export type AddExpenseBody = z.infer<typeof addExpenseSchema>