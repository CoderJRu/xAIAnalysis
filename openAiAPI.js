//import OpenAI from "openai";
const { OpenAI } = require("openai");
const openAISecret = process.env["OPEN_AI"];
const openai = new OpenAI({
    apiKey: openAISecret,
});

const ModelGeneration = async (sym,prompt) => {
    const stream = openai.beta.chat.completions.stream({
        model: "gpt-4o",
        messages: [{ role: "user", content: `generate a tweet in less than 20 words about ${sym} a solana crypto project ${prompt}, speak in a lively manner, witty and clever, could be playful or serious, formal and infromal and also economical` }],
        stream: true,
    });

    const chatCompletion = await stream.finalChatCompletion();
    //console.log(chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content;
 // {id: "…", choices: […], …}
};

module.exports = {
    ModelGeneration,
};
