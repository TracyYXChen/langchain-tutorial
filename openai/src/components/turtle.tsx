import { OpenAI } from "langchain/llms/openai";

interface Turtle {
    prompt: string,
    apiKey: string
}

export const turtle = async ({prompt, apiKey}: Turtle) => {
    const llm = new OpenAI({
        temperature: 0.9,
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo"
    });
   
    const llmResult = await llm.predict(prompt);
    return llmResult
}
