import "reflect-metadata";
import { createConnection } from "typeorm";
import Telegraf from "telegraf";
import { CommandParser, CountDown, Memo as MemoCommand } from "./middleware";
import { Memo } from "./entity";

createConnection({
  type: "mongodb",
  host: process.env.MONGO_HOST || "localhost",
  database: "elnyan",
  entities: [Memo],
  synchronize: true,
  logging: false
})
  .then(_ => {
    console.log("MongoDB Connected.");
  })
  .catch(error => console.log(error));

const bot = new Telegraf(process.env.BOT_TOKEN, {
  username: process.env.BOT_NAME
});
bot.use(CommandParser());
bot.action("delmsg", async ctx => await ctx.deleteMessage());
bot.command("cnt", CountDown);
bot.hears(/^\/.*/, MemoCommand);
bot.launch();
