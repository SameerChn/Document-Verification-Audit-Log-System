import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(user: { email: string; name: string; role: "admin" | "user" }): Promise<string> {
  const token = await new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(
  token: string,
): Promise<{ email: string; name: string; role: "admin" | "user" } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { email: string; name: string; role: "admin" | "user" }
  } catch (error) {
    return null
  }
}
