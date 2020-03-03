import { Middleware } from "telegraf";
import { ContextMessageUpdateWithState } from "../CommandParser";
import Api, { AnimeEntity } from "./Api";
import { DateTime } from "luxon";
import { KeyboardBuilder } from "../../util";

const weekTable = ["일", "월", "화", "수", "목", "금", "토"];
const makeText = (data: AnimeEntity[], weekNum: number) => `${
  weekTable[weekNum]
}요일 애니 편성표\n\n${data.reduce(
  (acc, cur) => acc + `${cur.time.toFormat("HH:mm")} │ ${cur.subtitle}\n`,
  ""
)}
  `;
const Anitable: Middleware<ContextMessageUpdateWithState> = async ctx => {
  let currentWeek = Number.parseInt(ctx.state.command.args);
  if (Number.isNaN(currentWeek)) currentWeek = DateTime.local().weekday % 7;
  const data = await Api.list(currentWeek);
  const options = {
    reply_markup: new KeyboardBuilder()
      .addRow([
        ["이전", `/anitable ${(currentWeek - 1) % 7}`],
        ["다음", `/anitable ${(currentWeek + 1) % 7}`]
      ])
      .addRow(
        weekTable.map((w, i) => [
          i === currentWeek ? `*${w}` : w,
          `/anitable ${i}`
        ])
      )
      .addRow([["메시지 지우기", "delmsg"]])
      .build()
  };
  if (!ctx.callbackQuery) {
    ctx.reply(makeText(data, currentWeek), options);
  } else {
    ctx.editMessageText(makeText(data, currentWeek), options);
  }
};

export default Anitable;
