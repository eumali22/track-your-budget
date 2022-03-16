import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID as string,
    clientId: process.env.APP_CLIENT_ID as string,
});

export const checkAccessToken = async (token: string) => {
    try {
        const payload = await verifier.verify(token, {tokenUse: "access"});
        console.log("Token is valid. Payload:", payload);
        return payload;
    } catch {
        console.log("Token not valid!");
        return null;
    }
}

export const checkIdToken = async (token: string) => {
    try {
        const payload = await verifier.verify(token, {tokenUse: "id"});
        console.log("Token is valid. Payload:", payload);
        return payload;
    } catch {
        console.log("Token not valid!");
        return null;
    }
}
