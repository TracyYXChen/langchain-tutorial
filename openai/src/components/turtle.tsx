import { OpenAI } from "langchain/llms/openai";


export const turtle = async (prompt: string) => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const llm = new OpenAI({
        temperature: 0.9,
        openAIApiKey: OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo"
    });
   
    const llmResult = await llm.predict(prompt);
    //console.log(llmResult);
    return llmResult
}