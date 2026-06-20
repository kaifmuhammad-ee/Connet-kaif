import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET || "kaif_enquiry_hub_super_secret_jwt_sign_key_2026";
const secretKey = new TextEncoder().encode(secret);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h") // Session valid for 12 hours
    .sign(secretKey);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}
