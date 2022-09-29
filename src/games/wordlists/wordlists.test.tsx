/**
 * @jest-environment node
 */

import { SOLUTIONS as WORDLE_SOLUTIONS } from "./wordle";
import axios from "axios";


function testResourceContains(url, contains) {
  return axios.get(url).then((response: { data: string }) => expect(response.data as string).toContain(contains));
}


/* Wordle wordlists are handled by fetch_wordlists.py */

test("Taylordle is discontinued, redirecting to lilithfund.org", () => {
  return testResourceContains("https://www.taylordle.com", `<script>console.log('Thanks for playing Taylordle!'); window.location = 'https://lilithfund.org';</script><title>Taylordle</title><script defer="defer" src="/static/js/main.c89356ea.js"></script><link href="/static/css/main.2be11170.css" rel="stylesheet">`);
});

/* wordle.at is kinda hard to test; code is obscured */
