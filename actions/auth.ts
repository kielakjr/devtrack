import { SignupFormSchema, FormState, LoginFormSchema } from '@/lib/definitions'
import { createUser } from '@/lib/services/user'

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data
  try {
    const user = await createUser(name, email, password)
    return { user }
  } catch (error) {
    return {
      errors: {
        form: ["Failed to create user"],
      },
    }
  }
}

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  try {
    const user = await findUserByEmail(email)
    if (!user) {
      return {
        errors: {
          form: ["User not found"],
        },
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return {
        errors: {
          form: ["Invalid password"],
        },
      }
    }

    return { user }
  } catch (error) {
    return {
      errors: {
        form: ["Failed to login"],
      },
    }
  }
}
