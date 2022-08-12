import { DailyGame, Game, WORDLE } from "./games";


test("Wordle 419 on 2022-08-12 is 'LABEL'", () => {
  expect(WORDLE.getSolutionById(419).toLowerCase()).toBe("label");
  expect(WORDLE.getDateById(419)).toEqual(new Date("2022-08-12"));
  expect(WORDLE.getIdOnDate(new Date("2022-08-12"))).toBe(419);
});

test("Wördl 419 on 2022-08-12 is 'RODEL'", () => {
  const WORDLE_AT = Game.byId("wordle_at") as DailyGame;
  expect(WORDLE_AT.getSolutionById(419).toLowerCase()).toBe("rodel");
  expect(WORDLE_AT.getDateById(419)).toEqual(new Date("2022-08-12"));
  expect(WORDLE_AT.getIdOnDate(new Date("2022-08-12"))).toBe(419);
});

test("Taylordle 129 on 2022-06-06 is 'TROUBLE'", () => {
  const TAYLORDLE = Game.byId("taylordle") as DailyGame;
  expect(TAYLORDLE.getSolutionById(129).toLowerCase()).toBe("trouble");
  expect(TAYLORDLE.getDateById(129)).toEqual(new Date("2022-06-06"));
  expect(TAYLORDLE.getIdOnDate(new Date("2022-06-06"))).toBe(129);
});
