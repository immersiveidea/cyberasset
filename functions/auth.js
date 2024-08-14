const workos = new WorkOS(env.WORKOS_SECRET);
const org = 'org_01J58ZZ8RPA6AF3B6717PHSVA8';
export function onRequest(context) {
    const url = workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        redirectUri: 'https://www.cybersecshield.com/callback',
        clientId
    })
    return Response.redirect(url, 301);
}