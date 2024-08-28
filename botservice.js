const { ActivityHandler, MessageFactory } = require("botbuilder");
const { getChatCompletion } = require("./openaiservice");
const { searchDocuments } = require("./searchService");
const { getembeddingdata } = require("./textembeddingservice");
class MyBot extends ActivityHandler {
  constructor() {
    super();

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      const welcomeText = "Welcome to the bot! How can I assist you today?";

      for (let member of membersAdded) {
        // If the added member is not the bot itself, send a welcome message 
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
        }
      }

      // By calling next, you ensure that the bot continues processing events
      await next();
    });


    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text;

      const searchQuery = {
        search: userMessage,
      };

      try {
       
        const results = await getChatCompletion(userMessage);
        let replyText = "";

        if (results) {
          replyText = `${results}`;
        } else {
          replyText = "Sorry, I couldn't find any relevant information.";
        }

        await context.sendActivity(MessageFactory.text(replyText, replyText));
      } catch (error) {
        console.log(error, "yha h");
        await context.sendActivity(
          "Sorry, there was an error processing your request."
        );
      }

      await next();
    });
  }
}

module.exports.MyBot = MyBot;
