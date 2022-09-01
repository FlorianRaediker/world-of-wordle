import { DailyGame, Game, WORDLE } from ".";


function testWord(game: DailyGame, date: Date, id: number, word: string) {
  expect(game.getSolutionById(id)).toBe(word);
  expect(game.getDateById(id)).toEqual(date);
  expect(game.getIdOnDate(date)).toBe(id);
}

test("Wordle 419 on 2022-08-12 is 'label'", () => {
  testWord(WORDLE, new Date("2022-08-12"), 419, "label");
});

test("wordle.at 419 on 2022-08-12 is 'rodel'", () => {
  testWord(Game.byId("wordle_at") as DailyGame, new Date("2022-08-12"), 419, "rodel");
});

test("Taylordle 129 on 2022-06-06 is 'trouble'", () => {
  testWord(Game.byId("taylordle") as DailyGame, new Date("2022-06-06"), 129, "trouble");
});


function testNoWord(game: DailyGame, date: Date, id: number) {
  expect(game.getSolutionById(id)).toBeNull();
  expect(game.getDateById(id)).toBeNull();
  expect(game.getIdOnDate(date)).toBeNull();
  expect(game.getSolutionOnDate(date)).toBeNull();
}

test("No wordle.at before 2022-02-02", () => {
  testNoWord(Game.byId("wordle_at") as DailyGame, new Date("2022-02-01"), 227);
});

test("No Taylordle before 2022-01-28 and after 2022-06-27", () => {
  testNoWord(Game.byId("taylordle") as DailyGame, new Date("2022-01-27"), -1);
  testNoWord(Game.byId("taylordle") as DailyGame, new Date("2022-06-28"), 151);
});
