import jwt from "express-jwt"
import jwksRsa from "jwks-rsa"
import jwtDecode, { JwtPayload } from "jwt-decode";

export const authorizeAccessToken = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

export const getCurrentUserId = (req: any) => {
  const authHeader = req?.headers?.authorization;
  const accessToken = authHeader ? parseAuthHeader(authHeader) : "";
  const payload = jwtDecode<JwtPayload>(accessToken);
  
  return payload.sub || '';
}

const parseAuthHeader = (authHeader: string): string => {
  const [code, token] = authHeader.split(' ');
  if (code.toUpperCase() !== 'BEARER') {
    return '';
  }
  return token || '';
}

export default authorizeAccessToken;

