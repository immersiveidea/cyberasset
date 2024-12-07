import OpenAI from "openai";
const openai = new OpenAI({apiKey: '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'});

async function enrichIcons() {
    const completion= await openai.chat.completions.create({
        model: 'gpt-4-32k-0613',
        messages: [
            {role: 'system', content: 'You are a helpful assistant that can only emit javascript arrays of strings'},
            {role: 'user', content: `Create an array of phrases a person might use to find the following icon.  
                      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-teams"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7h10v10h-10z" /><path d="M6 10h4" /><path d="M8 10v4" /><path d="M8.104 17c.47 2.274 2.483 4 4.896 4a5 5 0 0 0 5 -5v-7h-5" /><path d="M18 18a4 4 0 0 0 4 -4v-5h-4" /><path d="M13.003 8.83a3 3 0 1 0 -1.833 -1.833" /><path d="M15.83 8.36a2.5 2.5 0 1 0 .594 -4.117" /></svg>
                        please pick 10 different search concepts for this icon.`}]});
    console.log(completion.choices[0].message.content);
}
async function selectIcon() {
    const completion= await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 1,
        messages: [
            {role: 'system', content: 'You are a helpful assistant that can only emit javascript arrays of strings representing react Icons from the tabler icon set'},
            {role: 'user', content: `Pick the top 10 icon names for a service that does the following:
                translates a message from one language to another
               
            `}]});
    console.log(completion.choices[0].message.content);
}
selectIcon();