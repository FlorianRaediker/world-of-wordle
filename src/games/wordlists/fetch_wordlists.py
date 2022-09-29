import json
import os
import re
import requests


def save_wordlist(wordlist_str, game_name, wordlist_name):
    wordlist = [word.strip().removeprefix('"').removesuffix('"') for word in wordlist_str.split(",")]
    with open(os.path.join(game_name, wordlist_name+".json"), "w") as f:
        json.dump(wordlist, f, indent=2)


def fetch_wordlists(game_name, url, wordlists_regex):
    r = requests.get(url)
    match = re.search(wordlists_regex, r.text)
    save_wordlist(match.group(1), game_name, "solutions")
    save_wordlist(match.group(2), game_name, "words")


if __name__ == "__main__":
    # Wordle
    r = requests.get("https://www.nytimes.com/games/wordle/index.html")
    script_url = re.search(r"https:\/\/www.nytimes.com\/games-assets\/v2\/wordle.\w+.js", r.text).group(0)
    fetch_wordlists("wordle", script_url, r'\[((?:"\w{5}",)+"\w{5}")\],\w+=\[((?:"\w{5}",)+"\w{5}")\]')

    # Wordle Deutsch
    fetch_wordlists("wordledeutsch", "https://wordledeutsch.org/main.js", r"var SOLUTION_LIST = \[(.*?)\],\s*WORD_LIST = \[(.*?)\]")
