const workos = new WorkOS(env.WORKOS_SECRET);

export function onRequest(context) {
    console.log(context);

}