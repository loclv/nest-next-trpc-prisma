import { createHmac, timingSafeEqual } from "node:crypto";

export interface JwtPayload {
	sub: number;
	username: string;
	exp: number;
}

function base64UrlEncode(input: string): string {
	return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string): string {
	return Buffer.from(input, "base64url").toString("utf8");
}

export function signJwt(
	payload: Omit<JwtPayload, "exp">,
	secret: string,
	expiresInSeconds = 60 * 60 * 24 * 7,
): string {
	const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
	const fullPayload: JwtPayload = {
		...payload,
		exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
	};
	const body = base64UrlEncode(JSON.stringify(fullPayload));
	const signature = createHmac("sha256", secret)
		.update(`${header}.${body}`)
		.digest("base64url");

	return `${header}.${body}.${signature}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload | null {
	const parts = token.split(".");
	if (parts.length !== 3) {
		return null;
	}
	const [header, body, signature] = parts;
	if (!header || !body || !signature) {
		return null;
	}

	const expectedSignature = createHmac("sha256", secret)
		.update(`${header}.${body}`)
		.digest("base64url");

	const sigBuf = Buffer.from(signature);
	const expectedBuf = Buffer.from(expectedSignature);
	if (
		sigBuf.length !== expectedBuf.length ||
		!timingSafeEqual(sigBuf, expectedBuf)
	) {
		return null;
	}

	try {
		const decoded = JSON.parse(base64UrlDecode(body)) as JwtPayload;
		if (
			typeof decoded.sub !== "number" ||
			typeof decoded.username !== "string" ||
			typeof decoded.exp !== "number"
		) {
			return null;
		}
		if (decoded.exp < Math.floor(Date.now() / 1000)) {
			return null;
		}
		return decoded;
	} catch {
		return null;
	}
}
