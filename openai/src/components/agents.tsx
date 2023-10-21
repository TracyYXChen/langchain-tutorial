import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import {
  GenerativeAgentMemory,
  GenerativeAgent,
} from "langchain/experimental/generative_agents";

import { AliceObservations, BobObservations } from "./constants";

export const simulation = async (apiKey: string) => {
  const llm = new OpenAI({
    temperature: 0.9,
    maxTokens: 1500,
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo"
  });

  const createNewMemoryRetriever = async () => {
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

 

  // Initializing Alice's memory
  const userName = "Alice";
  const AliceMemory: GenerativeAgentMemory = new GenerativeAgentMemory(
    llm,
    await createNewMemoryRetriever(),
    { reflectionThreshold: 8 }
  );

  //Initializing Alice the agent
  const Alice: GenerativeAgent = new GenerativeAgent(llm, AliceMemory, {
    name: "Alice",
    age: 20,
    traits: "adventurous, curious, and friendly",
    status: "hungry",
  });

  // Let's give Alice some memories!

  for (const observation of AliceObservations) {
    await Alice.addMemory(observation, new Date());
  }

  //make sure Alice's memory is working
  // console.log(
  //   "Alice's summary:\n",
  //   await Alice.getSummary({ forceRefresh: true })
  // );

//   Alice's summary:
//  Name: Alice (age: 20)
// Innate traits: adventurous, curious, and friendly
// Alice is a person who lives in College Park, Maryland. She enjoys eating at different restaurants in the area, 
// including Hanami, Sweetgreen, Pho D'Lite, and Board and Brew. 
// She has a lunch date with her friend Bob today and is currently feeling hungry. 
// She remembers that she ate at Hanami yesterday and wants to try a different restaurant this time. 
// Alice also recalls that Pho D'Lite was closed last year.

  //let's introduce bob
  const BobMemory: GenerativeAgentMemory = new GenerativeAgentMemory(
    llm,
    await createNewMemoryRetriever(),
    { reflectionThreshold: 8 }
  );

  const Bob: GenerativeAgent = new GenerativeAgent(llm, BobMemory, {
    name: "Bob",
    age: 21,
    traits: "shy, humorous, and goofy",
    status: "hungry"
  });


  for (const observation of BobObservations) {
    await Bob.addMemory(observation, new Date());
  }

  // console.log(
  //   "Bob's summary:\n",
  //   await Bob.getSummary({ forceRefresh: true })
  // );
  //   Bob's summary:
  //  Name: Bob (age: 21)
  // Innate traits: shy, humorous, and goofy
  // Bob is a vegetarian who remembers he has lunch plans with Alice today. 
  // He has a favorite restaurant but wants to try something different because he ate at 
  // Sweetgreen yesterday. Bob is currently feeling hungry and 
  // lives in Hyattsville, Maryland.

  let allConversations = [];
  const runConversation = async (
    agents: GenerativeAgent[],
    initialObservation: string
  ): Promise<void> => {
    // Starts the conversation bewteen two agents
    let [, observation] = await agents[1].generateReaction(initialObservation);
    console.log("Initial reply:", observation);
    allConversations.push(observation);
    const numTurns = 5;
    let i = 0;
    while ( i < numTurns) {
      for (const agent of agents) {
        const [stayInDialogue, agentObservation] =
          await agent.generateDialogueResponse(observation);
        console.log("Next reply:", agentObservation);
        allConversations.push(agentObservation);
        i += 1;
        observation = agentObservation;
        if (!stayInDialogue) {
          console.log("Conversation ended by the agent");
          allConversations.push("Conversation ended by the agent")
          return;
        }
    }
    if (i >= numTurns) {
      console.log("Conversation reached the turn limit");
      allConversations.push("Conversation reached the turn limit")
    }
  };
  }

  //Initial reply: Bob said "How about trying Jodeem African Cuisine today? I've heard great things about their vegetarian options!"
  //Next reply: Alice said "Oh, I've never been to Jodeem African Cuisine before. That sounds interesting! I do enjoy trying new places. What kind of vegetarian options do they have? Have you been there before?"
  //Next reply: Bob said "Oh, awesome! I'm glad you're up for trying something new. I've actually been to Jodeem African Cuisine before, and they have some really delicious vegetarian options. They have this flavorful vegetable stew called Ndole that I absolutely love. They also have a tasty okra soup and a variety of veggie stir-fries. Plus, their plantain dishes are always a hit. I think you'll enjoy it!"
  //Next reply: Alice said "Oh, that all sounds amazing! I love a good vegetable stew, and the okra soup and veggie stir-fries sound delicious too. And I've never tried plantain dishes before, so I'm definitely excited to give them a try. Thanks for the recommendation, Bob! I'm really looking forward to lunch today at Jodeem African Cuisine. What time should we meet?"
  //Next reply: Bob said "Great! How about we meet at 12:30 PM? That should give us enough time to fully enjoy our lunch at Jodeem African Cuisine. I'm really excited to try some new dishes with you, Alice! See you then!"
  // Next reply: Alice said "Sounds perfect! 12:30 PM works for me. I can't wait to try the delicious vegetarian options at Jodeem African Cuisine. See you then, Bob!"

  const parties: GenerativeAgent[] = [Alice, Bob];
  allConversations.push("Alice said: Hey Bob, where should we have lunch, how about sweetgreen?");
  await runConversation(
    parties,
    "Alice said: Hey Bob, where should we have lunch, how about sweetgreen?"
  );

  const interviewAgent = async (
    agent: GenerativeAgent,
    message: string
  ): Promise<string> => {
    // Simple wrapper helping the user interact with the agent
    const newMessage = `${userName} says ${message}`;
    const response = await agent.generateDialogueResponse(newMessage);
    return response[1];
  };

  //let's check Alice's memory
  const interviewAlice: string = await interviewAgent(
    Alice,
    "Where are you going to have lunch with Bob?"
  );
  allConversations.push("Host: after the discussion, where do you and Bob decide to have lunch?");
  allConversations.push(interviewAlice);

  //let's check Bob's memory
  const interviewBob: string = await interviewAgent(
    Bob,
    "Where are you going to have lunch with Alice?"
  );

  allConversations.push("Host: after the discussion, where do you and Alice decide to have lunch?");
  allConversations.push(interviewBob);
  return allConversations;
};