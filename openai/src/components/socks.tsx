import { OpenAI } from "langchain/llms/openai";



export const socks = async () => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const llm = new OpenAI({
        temperature: 0.9,
        openAIApiKey: OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo"
    });
    const text = "What would be a good company name for a company that makes colorful socks?";
    const llmResult = await llm.predict(text);
    console.log(llmResult);
}