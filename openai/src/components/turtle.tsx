import { OpenAI } from "langchain/llms/openai";


export const turtle = async ({prompt, apiKey}: {prompt: string, apiKey: string}) => {
   
    const llm = new OpenAI({
        temperature: 0.9,
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo"
    });
   
    const llmResult = await llm.predict(prompt);
    //console.log(llmResult);
    return llmResult
}
