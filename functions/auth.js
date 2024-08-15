import WorkOS from '@workos-inc/node';

const organization = 'org_01J58ZZ8RPA6AF3B6717PHSVA8';

const auth = async (context) => {
    const workos = new WorkOS(context.env.WORKOS_SECRET);
    const clientId = context.env.WORKOS_CLIENTID;
      const url = workos.sso.getAuthorizationUrl({
          organization,
          provider: 'authkit',
          redirectUri: 'https://www.cybersecshield.com/callback',
          clientId
      })
    console.log(url);
    console.log(clientId);
      const response = new Response(null, {status: 301, headers: {Location: url}});
      return response;
}
export const onRequest = [auth];