import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import {
  GenerativeAgentMemory,
  GenerativeAgent,
} from "langchain/experimental/generative_agents";

export const simulation = async (apiKey: string) => {
  console.log("Simulation started", apiKey);
  const userName = "Tracy";
  const llm = new OpenAI({
    temperature: 0.9,
    maxTokens: 1500,
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo"
  });

  const createNewMemoryRetriever = async () => {
    // Create a new, demo in-memory vector store retriever unique to the agent.
    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({
        openAIApiKey: apiKey,
      }));
    const retriever = new TimeWeightedVectorStoreRetriever({
      vectorStore,
      otherScoreKeys: ["importance"],
      k: 15,
    });
    return retriever;
  };

  // Initializing Tracy's memory
  const TracyMemory: GenerativeAgentMemory = new GenerativeAgentMemory(
    llm,
    await createNewMemoryRetriever(),
    { reflectionThreshold: 8 }
  );

  const Tracy: GenerativeAgent = new GenerativeAgent(llm, TracyMemory, {
    name: "Tracy",
    age: 100,
    traits: "fearless, wise, adventurous",
    status: "looking for an adventure in the DMV area",
  });

  // Let's give Tracy some memories!
  const tracyObservations = [
    "Tracy lives in College Park, Maryland",
    "Tracy remembers her favorite restaurant in College Park: Pho D'lite was closed",
    "Tracy remembers she and her friend Ricky will have lunch together today",
    "Tracy is hungry now"
  ];
  for (const observation of tracyObservations) {
    await Tracy.addMemory(observation, new Date());
  }

  console.log(
    "Tracy's summary:\n",
    await Tracy.getSummary({ forceRefresh: true })
  );
};

