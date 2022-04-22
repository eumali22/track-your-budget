import { Request, Response } from 'express';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID as string,
  clientId: process.env.APP_CLIENT_ID as string,
  scope: "read"
});


export const checkAccessToken = async (token: string) => {
  try {
    const payload = await verifier.verify(token, { tokenUse: "access" });
    // console.log("Token is valid. Payload:", payload);
    return payload;
  } catch {
    // console.log("Token not valid!");
    return null;
  }
}

export const checkIdToken = async (token: string) => {
  try {
    const payload = await verifier.verify(token, { tokenUse: "id" });
    // console.log("Token is valid. Payload:", payload);
    return payload;
  } catch {
    // console.log("Token not valid!");
    return null;
  }
}

export function authMware(scope:string = "") {
  return (req: Request, res: Response, next: () => void) => {
    const accessToken = req.header("authorization") || "";
    const payload = verifier.verifySync(accessToken, { tokenUse: "access", scope: scope })
    if (payload) {
      console.log("middleware: valid token!");
      next();
    } else {
      console.log("middleware: Invalid token!");
      return res.status(401).end();
    }
  }
}

export const authMiddleware = async (req: Request, resp: Response, next: () => void) => {
  const accessToken = req.header("authorization");

  if (!accessToken) return resp.status(401).end();
  const payload = await checkAccessToken(accessToken);
  if (payload) {
    // console.log("middleware: valid token!");
    next();
  } else {
    // console.log("middleware: INvalid token!");
    return resp.status(401).end();
  }
}

type FnOnSuccess = (s: CognitoUserSession) => void;
type FnOnFailure = (e: Error) => void;

export const authenticate = (email: string, password: string, handleSuccess: FnOnSuccess, handleFailure: FnOnFailure) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });
  const userPool = new CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID as string,
    ClientId: process.env.APP_CLIENT_ID as string,
  });
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
    
  });

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: handleSuccess,
    onFailure: handleFailure,
  });
}
