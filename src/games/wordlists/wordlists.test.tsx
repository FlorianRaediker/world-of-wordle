/**
 * @jest-environment node
 */

import { SOLUTIONS as WORDLE_SOLUTIONS } from "./wordle";
import axios from "axios";

function testUrlContains(url, contains) {
  return axios.get(url).then((response: {data: string}) => expect(response.data as string).toContain(contains));
}


test("Wordle solutions are up-to-date", () => {
  return testUrlContains("https://www.nytimes.com/games-assets/v2/wordle.19b5277c6325a73d19caf8cabd2b672d80428ccb.js", "_e=" + JSON.stringify(WORDLE_SOLUTIONS));
});

test("Taylordle redirects to lilithfund.org", () => {
  return testUrlContains("https://www.taylordle.com", `<script>console.log('Thanks for playing Taylordle!'); window.location = 'https://lilithfund.org';</script><title>Taylordle</title><script defer="defer" src="/static/js/main.c89356ea.js"></script><link href="/static/css/main.2be11170.css" rel="stylesheet">`);
});

/* wordle.at is kinda hard to test; code is obscured */
