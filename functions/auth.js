const workos = new WorkOS(env.WORKOS_SECRET);
const organization = 'org_01J58ZZ8RPA6AF3B6717PHSVA8';
const clientId = env.WORKOS_CLIENTID;
const auth = async (context) => {
      const url = workos.sso.getAuthorizationUrl({
          organization,
          provider: 'authkit',
          redirectUri: 'https://www.cybersecshield.com/callback',
          clientId
      })
      return Response.redirect(url, 301);
}
export const onRequest = [auth];