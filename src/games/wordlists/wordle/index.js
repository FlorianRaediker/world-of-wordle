import solutions from "./solutions.json";
import words from "./words.json";


/* 
copied from https://web.archive.org/web/20211015045445/https://www.powerlanguage.co.uk/wordle/ from 2021-10-15
used at most until 2021-11-16 (https://web.archive.org/web/20211116211214/https://www.powerlanguage.co.uk/wordle/ has different words),
but might have been replaced earlier
*/
const legacy_solutions = [
  "cigar", "rebut", "sissy", "humph", "awake", "blush", "focal", "evade", "naval", "serve", "heath", "dwarf", "model", "karma", "stink", "grade", "quiet", "bench", "abate", "feign", "major", "death", "fresh", "crust", "stool", "colon", "abase", "marry", "react", "batty", "pride", "floss", "helix", "croak", "staff", "paper", "mined", "whelp", "idled", "outdo", "adobe", "crazy", "sower", "repay", "digit", "crate", "cluck", "spike", "mimic", "pound", "maxim", "linen", "torah", "flesh", "booby", "forth", "first", "stand", "belly", "ivory", "seedy", "print", "yearn", "drain", "bribe", "stout", "panel", "crass", "flume", "squaw", "agree", "error", "swirl", "argue", "bleed", "delta", "flick", "totem", "wooer", "front", "shrub", "parry", "agone", "lapel", "start", "greet", "kelly", "moped", "lusty", "aimer", "round", "audit", "lying", "gamma", "labor", "islet", "civic", "forge", "corny", "moult", "basic", "salad", "bated", "spicy", "spray", "essay", "fjord", "spend", "dived", "guild", "dozed", "motor", "alone", "hatch", "solum", "thumb", "dowry", "ought", "baked", "dutch", "pilot", "tweed", "comet", "jaunt", "blest", "steed", "abyss", "growl", "fling", "dozen", "lived", "gaped", "world", "gouge", "click", "briar", "great", "altar", "pulpy", "blurt", "coast", "duchy", "groin", "fixer", "group", "rogue", "badly", "smart", "pithy", "gaudy", "chill", "heron", "vodka", "finer", "surer", "radio", "rouge", "perch", "passe", "wrote", "clock", "tilde", "store", "prove", "bring", "solve", "cheat", "grime", "exult", "usher", "epoch", "triad", "break", "vowed", "posed", "conic", "masse", "ached", "vital", "trace", "using", "peach", "champ", "baton", "brake", "pluck", "craze", "gripe", "weary", "morse", "acute", "ferry", "aside", "raced", "troll", "franc", "raved", "boost", "truss", "siege", "tiger", "banal", "slump", "crank", "gorge", "query", "drink", "favor", "abbey", "dared", "panic", "solar", "shire", "proxy", "point", "towed", "prick", "wince", "crimp", "knoll", "sugar", "whack", "mount", "owned", "could", "oozed", "light", "those", "moist", "glace", "bazar", "aloft", "skill", "elder", "frame", "humor", "pause", "ulcer", "ultra", "robin", "cynic", "agora", "aroma", "fired", "shake", "typed", "dodge", "swill", "tacit", "other", "thorn", "trove", "bloke", "vivid", "spill", "chant", "choke", "rupee", "nasty", "mourn", "ahead", "brine", "cloth", "hoard", "sweet", "month", "lapse", "watch", "today", "unsay", "smelt", "tease", "cater", "movie", "lynch", "saute", "allow", "renew", "their", "bitch", "purge", "chest", "depot", "dinge", "nymph", "found", "shall", "harry", "stove", "lowly", "snout", "acted", "fewer", "shawl", "natal", "filed", "comma", "foray", "scare", "stair", "black", "squad", "royal", "chunk", "mince", "slave", "shame", "cheek", "ample", "flair", "foyer", "cargo", "oxide", "plant", "olive", "inert", "askew", "timed", "shown", "deary", "hasty", "trash", "fella", "larva", "forgo", "story", "hairy", "train", "homer", "badge", "midst", "canny", "pared", "butch", "farce", "slung", "tipsy", "metal", "yield", "delve", "being", "scour", "glass", "jambe", "scrap", "money", "hinge", "album", "vouch", "asset", "tiara", "crept", "bayou", "atoll", "manor", "creak", "showy", "phase", "froth", "depth", "gloom", "flood", "trait", "girth", "piety", "payer", "goose", "float", "donor", "atone", "primo", "apron", "blown", "cacao", "loser", "cured", "gloat", "awful", "brink", "smite", "beady", "rusty", "retro", "droll", "gawky", "taxed", "pinto", "gaily", "hated", "lilac", "sever", "field", "fluff", "hydro", "flack", "agape", "wench", "voice", "stead", "stalk", "berth", "madam", "night", "bland", "liver", "wedge", "augur", "roomy", "ruled", "flock", "angry", "bobby", "trite", "riled", "tryst", "erred", "power", "elope", "cinch", "motto", "moved", "upset", "bluff", "cramp", "quart", "coyly", "youth", "rhyme", "buggy", "alien", "smear", "unfit", "patty", "cling", "glean", "label", "doted", "khaki", "poker", "gruel", "twice", "twang", "shrug", "treat", "unlit", "waste", "merit", "woven", "tired", "needy", "clown", "widow", "irony", "ruder", "gauze", "chief", "onset", "prize", "fungi", "charm", "gully", "inter", "whoop", "taunt", "ebbed", "class", "theme", "lofty", "tibia", "booze", "alpha", "thyme", "eclat", "doubt", "parer", "chute", "stick", "trice", "alike", "sooth", "pawed", "saint", "liege", "glory", "grate", "admit", "brisk", "soggy", "usurp", "scald", "scorn", "leave", "twine", "sting", "bough", "marsh", "sloth", "dandy", "vigor", "howdy", "enjoy", "valid", "ionic", "equal", "natty", "floor", "catch", "spade", "stein", "exist", "wired", "sized", "grove", "spiel", "mummy", "fault", "foggy", "flout", "carry", "sneak", "libel", "waltz", "aptly", "piney", "inept", "aloud", "photo", "dream", "stale", "vomit", "ombre", "fanny", "unite", "snarl", "baker", "there", "poked", "sewed", "hippy", "spell", "folly", "louse", "gulch", "vault", "godly", "threw", "fleet", "grave", "inane", "shock", "crave", "spite", "valve", "chink", "claim", "rainy", "musty", "pique", "daddy", "quasi", "arise", "aging", "valet", "opium", "avert", "stuck", "recut", "liker", "genre", "plume", "rifle", "count", "incur", "total", "wrest", "mocha", "roved", "study", "lover", "safer", "rivet", "funny", "smoke", "mound", "undue", "sedan", "pagan", "swine", "guile", "gusty", "equip", "tough", "canoe", "toyed", "covet", "human", "udder", "lunch", "blast", "stray", "manga", "melee", "waved", "quick", "paste", "given", "ceded", "risen", "groan", "leaky", "grind", "carve", "loose", "sadly", "spilt", "apple", "slack", "honey", "final", "sheen", "eerie", "edged", "slick", "derby", "wharf", "spelt", "coach", "molly", "singe", "price", "spawn", "fairy", "jiffy", "filmy", "stack", "chose", "sleep", "ardor", "nanny", "niece", "dixit", "handy", "grace", "ditto", "stank", "cream", "usual", "marly", "valor", "angle", "mated", "muddy", "chase", "reply", "prone", "spoil", "heart", "shade", "diner", "arson", "onion", "sleet", "motte", "couch", "palsy", "bowel", "smile", "evoke", "creek", "lance", "eagle", "idiot", "siren", "built", "jaded", "award", "dross", "annul", "goody", "frown", "patio", "laden", "humid", "elite", "lymph", "edify", "might", "reset", "visit", "gusto", "purse", "vapor", "crock", "write", "sunny", "loath", "pilar", "slide", "queer", "venom", "stamp", "sorry", "still", "acorn", "aping", "glued", "tamer", "hater", "mania", "awoke", "brawn", "swift", "exile", "birch", "lucky", "freer", "risky", "ghost", "plier", "lunar", "winch", "snare", "nurse", "house", "borax", "nicer", "lurch", "exalt", "about", "pussy", "laced", "tunic", "pried", "doled", "chump", "lanky", "cress", "eater", "elude", "cycle", "kitty", "fined", "cupid", "tenet", "place", "lobby", "plush", "vigil", "index", "blink", "clung", "qualm", "croup", "clink", "juicy", "stage", "decay", "nerve", "flier", "shaft", "crook", "clean", "china", "ridge", "vowel", "gnome", "oiled", "icing", "spiny", "rigor", "snail", "flown", "rabid", "prose", "thank", "poppy", "budge", "fiber", "moldy", "dowdy", "kneel", "track", "caddy", "quell", "dumpy", "paler", "swore", "loved", "muted", "fumed", "flyer", "horny", "mason", "doing", "ozone", "amply", "molar", "ovary", "beset", "queue", "cliff", "magic", "truce", "sport", "fritz", "edict", "twirl", "verse", "llama", "eaten", "range", "whisk", "hovel", "naked", "raked", "sigma", "spout", "verve", "cared", "dying", "fetid", "brain", "buddy", "thump", "scion", "candy", "chord", "basin", "march", "crowd", "arbor", "gayly", "musky", "stain", "dally", "bless", "bravo", "stung", "title", "ruler", "kiosk", "blond", "ennui", "layer", "fluid", "robed", "score", "muley", "zebra", "barge", "matey", "bluer", "aider", "shook", "river", "privy", "betel", "frisk", "piled", "begun", "azure", "weave", "genie", "sound", "glove", "braid", "scope", "raged", "rover", "gazed", "ocean", "bloom", "irate", "later", "galop", "silky", "wreck", "dwelt", "slate", "smack", "solid", "amaze", "hazel", "wrist", "jolly", "globe", "flint", "rouse", "civil", "vista", "relax", "cover", "alive", "beech", "jetty", "bliss", "vocal", "often", "dolly", "eight", "joker", "since", "event", "ensue", "sawed", "diver", "poser", "worst", "sweep", "alley", "creed", "anime", "leafy", "bosom", "dunce", "stare", "pudgy", "waive", "choir", "stood", "spoke", "bowed", "delay", "gored", "ideal", "clasp", "seize", "hotly", "laugh", "sieve", "block", "meant", "grape", "noose", "hardy", "shied", "drawl", "daisy", "putty", "strut", "burnt", "tulip", "crick", "idyll", "vixen", "furor", "piped", "cough", "naive", "shoal", "stork", "bathe", "aunty", "check", "prime", "brass", "outer", "furry", "razor", "elect", "dazed", "imply", "demur", "quota", "haven", "cavil", "swear", "crump", "dough", "gavel", "wagon", "salon", "nudge", "harem", "pitch", "sworn", "pupil", "excel", "stony", "cabin", "sowed", "queen", "trout", "hired", "earth", "storm", "until", "taper", "enter", "child", "adopt", "minor", "fatty", "husky", "brave", "filet", "slime", "glint", "baste", "pored", "quest", "willy", "eject", "grope", "butte", "reedy", "agent", "weird", "spasm", "booth", "clash", "truth", "sixty", "guppy", "clout", "leapt", "array", "crime", "began", "tumor", "spree", "rural", "balmy", "cocoa", "junta", "conch", "mammy", "burly", "frond", "waist", "cheap", "teach", "blank", "scarf", "usage", "slice", "plait", "forty", "cheer", "sandy", "clang", "faint", "joyed", "pinch", "mango", "uncut", "tench", "video", "guest", "stern", "erect", "volta", "biddy", "tulle", "curse", "olden", "bulky", "knife", "early", "umbra", "roost", "chess", "steal", "nosey", "grant", "serum", "sinew", "drone", "trone", "talon", "nobly", "mayor", "skulk", "crawl", "elbow", "stump", "shalt", "mogul", "grunt", "debut", "chide", "stint", "sheep", "forte", "green", "grass", "roach", "polka", "waver", "yeast", "wring", "lunge", "flank", "dizzy", "clank", "curve", "vying", "widen", "waxen", "verge", "gypsy", "avoid", "grain", "alloy", "myrrh", "comic", "route", "cooed", "weigh", "crown", "sheik", "graft", "mower", "adult", "finch", "tasty", "quite", "mouse", "cease", "prune", "envoy", "staid", "lasso", "tower", "alter", "crisp", "frock", "agile", "spire", "idiom", "cache", "tidal", "squat", "bleak", "style", "scowl", "diced", "slept", "known", "sweat", "lyric", "terse", "smote", "bared", "small", "caged", "dined", "hoped", "empty", "poise", "slash", "havoc", "tamed", "mouth", "defer", "along", "elfin", "joked", "amass", "deity", "seven", "icily", "exact", "rapid", "lemon", "creme", "right", "debit", "viper", "frill", "sniff", "fifty", "prank", "stiff", "hippo", "worse", "named", "fugue", "hotel", "phone", "torso", "snipe", "teeth", "lumpy", "aisle", "allay", "court", "swoon", "build", "dogma", "shirt", "gleam", "heady", "fraud", "owner", "ovate", "refit", "gazer", "width", "apply", "erase", "ethic", "ditty", "shady", "music", "tiled", "fleck", "large", "spank", "cloak", "flute", "skirt", "bided", "elegy", "roast", "pedal", "toddy", "which", "swept", "fried", "fruit", "prior", "ripen", "stock", "fancy", "arena", "rebel", "truly", "fight", "pence", "adore", "flake", "resin", "mewed", "lorry", "truck", "crack", "shore", "brace", "audio", "borne", "cruel", "shack", "trump", "puppy", "devil", "creep", "swell", "clump", "repel", "oddly", "going", "crony", "giver", "tight", "droit", "lured", "whine", "diary", "joint", "grimy", "slang", "horse", "third", "amiss", "pivot", "bacon", "viola", "brief", "tally", "broom", "think", "brunt", "niche", "dosed", "fared", "cable", "sober", "crepe", "kappa", "curly", "tepee", "rowed", "blare", "scrub", "caste", "cabby", "gloss", "level", "broad", "bully", "bride", "savoy", "curry", "slyly", "clack", "regal", "shear", "thick", "thong", "ninth", "shale", "leper", "probe", "speak", "radii", "swarm", "verso", "tenor", "paved", "sulky", "thief", "surge", "obese", "papal", "clear", "rider", "tubal", "spice", "razed", "drape", "ditch", "flask", "leger", "stark", "felon", "plank", "maker", "cubic", "tonga", "above", "hewed", "rugby", "circa", "holly", "wiser", "dilly", "shoot", "abode", "leant", "quack", "puffy", "wooed", "these", "aware", "grown", "cased", "glade", "amble", "quail", "bulge", "ounce", "wrack", "giant", "smock", "token", "blaze", "liner", "blind", "milky", "infer", "aimed", "color", "sally", "nosed", "saner", "dryly", "draft", "fated", "otter", "endow", "adorn", "hoist", "chirp", "issue", "bugle", "piper", "wager", "local", "cleft", "merry", "strip", "opera", "wiped", "guise", "close", "brawl", "deign", "mused", "crude", "swiss", "blunt", "taffy", "steam", "nomad", "pasty", "affix", "shyly", "lever", "lithe", "raise", "vizor", "hound", "fiord", "clerk", "plane", "south", "twixt", "angel", "three", "shark", "burst", "waxed", "weedy", "wordy", "beget", "waked", "racer", "spurn", "agony", "swung", "frank", "snake", "petal", "mealy", "greed", "vapid", "poesy", "screw", "sleek", "feast", "allot", "flora", "habit", "remit", "overt", "throw", "welsh", "entry", "bigot", "judge", "worry", "sheet", "semen", "penal", "oaken", "ready", "demon", "party", "pigmy", "fluke", "grill", "adage", "trend", "salve", "relic", "brown", "anger", "patsy", "cited", "neigh", "whale", "whiff", "trial", "brook", "vicar", "dimly", "scene", "tutor", "bible", "bound", "silly", "share", "crypt", "topaz", "sully", "scout", "elate", "mamma", "flour", "fishy", "paint", "voila", "domed", "clamp", "credo", "shine", "halve", "lingo", "mangy", "quoth", "steer", "livid", "twist", "blood", "trunk", "noble", "armor", "coral", "under", "toxic", "craft", "shrew", "smith", "ralph", "soapy", "towel", "sauce", "decry", "axiom", "snoop", "drier", "caper", "dusky", "fuzzy", "bison", "dirge", "terra", "eying", "filer", "arose", "blase", "realm", "pearl", "annoy", "strap", "visor", "table", "polar", "posse", "swish", "cross", "giddy", "riser", "cameo", "quake", "harsh", "union", "shone", "lease", "omega", "fumer", "urban", "grasp", "canal", "glare", "hedge", "porch", "heard", "tried", "juice", "slimy", "pulse", "plied", "venge", "duped", "blend", "daunt", "stoke", "crush", "stone", "dealt", "tooth", "maize", "bushy", "speck", "wheel", "spear", "fully", "hyena", "baron", "jerky", "snaky", "shove", "puree", "flush", "fable", "dicky", "aglow", "among", "titan", "shank", "harpy", "miner", "brood", "dairy", "toast", "acrid", "guilt", "irked", "trail", "folio", "noted", "hitch", "jelly", "slope", "broil", "baggy", "sight", "peace", "latch", "golly", "never", "opine", "tommy", "knack", "carol", "covey", "suave", "anvil", "quill", "sated", "rough", "shell", "belie", "horde", "sling", "salsa", "young", "knelt", "friar", "mercy", "asked", "brand", "limbo", "glide", "mixed", "patch", "white", "sewer", "crane", "refer", "stoop", "aloof", "fused", "roger", "yacht", "voter", "dummy", "drunk", "trade", "optic", "jumbo", "suite", "skunk", "pesky", "shift", "groom", "every", "scoff", "false", "amber", "occur", "nasal", "abuse", "tread", "armed", "batch", "water", "punch", "scent", "odder", "welch", "where", "pinky", "worth", "annex", "chalk", "shelf", "blitz", "coupe", "churl", "cause", "feral", "rumor", "fatal", "boded", "leash", "dirty", "frost", "modem", "media", "recur", "madly", "pined", "gummy", "grief", "lousy", "drift", "uncle", "cadet", "sided", "saucy", "wreak", "would", "plaza", "split", "briny", "idler", "slunk", "pouch", "adept", "sperm", "skull", "camel", "junto", "limit", "plead", "crumb", "wafer", "women", "dress", "loyal", "gamut", "shaky", "mauve", "rinse", "waded", "medal", "whose", "grail", "caved", "swash", "touch", "actor", "paddy", "plate", "brick", "ashen", "tract", "troop", "droop", "parka", "femme", "whirl", "savor", "crash", "heavy", "waned", "noisy", "wheat", "afoot", "meted", "plain", "breed", "ether", "mural", "banjo", "sense", "tying", "lathe", "snore", "scold", "while", "gauge", "mover", "caked", "dingy", "fixed", "plaid", "yoked", "voted", "vexed", "alibi", "riper", "board", "vaunt", "cobra", "taboo", "hymen", "aided", "booty", "canon", "dated", "throb", "untie", "faced", "undid", "prism", "scant", "angst", "timid", "randy", "gravy", "chair", "witty", "famed", "dense", "least", "chain", "short", "lumen", "roped", "steep", "bored", "mossy", "alarm", "thing", "waged", "proud", "smoky", "peril", "gaunt", "ranch", "birth", "mange", "chili", "fiend", "billy", "extol", "skiff", "drive", "venue", "expel", "rowdy", "squib", "stall", "ankle", "woman", "hobby", "organ", "rocky", "spine", "liken", "swoop", "vogue", "easel", "paled", "flash", "lined", "plumb", "ledge", "begin", "keyed", "reach", "tempo", "topic", "graph", "fetch", "glaze", "quote", "blade", "antic", "shave", "amend", "churn", "boned", "sharp", "jewel", "teddy", "abide", "hilly", "prude", "spunk", "urged", "gross", "egged", "basal", "amuse", "older", "moody", "maybe", "steak", "slant", "scalp", "apart", "alert", "filth", "stave", "piece", "spick", "datum", "joust", "taken", "cedar", "space", "rival", "wield", "drove", "bunch", "woody", "syrup", "force", "gland", "sneer", "email", "tuned", "wound", "spent", "enact", "piano", "snowy", "spare", "ascot", "rated", "avail", "fauna", "dread", "gnash", "theft", "tepid", "tabby", "broke", "guard", "maple", "boxed", "befit", "manly", "speed", "chuck", "guide", "state", "freak", "added", "crone", "meter", "witch", "press", "flare", "igloo", "cloud", "etude", "berry", "revue", "penny", "bread", "merge", "boxer", "fussy", "tense", "novel", "spark", "spurt", "enemy", "daily", "murky", "taint", "again", "trick", "dusty", "drake", "learn", "bevel", "smirk", "below", "fifth", "wrong", "adapt", "rayon", "foamy", "unity", "extra", "logic", "scoop", "swede", "fiery", "drank", "knave", "impel", "juror", "heave", "ninny", "rigid", "shape", "parse", "sixth", "leech", "north", "dwell", "raven", "surly", "snuff", "filly", "slain", "drama", "whore", "shred", "snort", "attic", "fence", "match", "pansy", "revel", "legal", "druid", "satin", "dried", "offer", "wider", "hover", "based", "taste", "basil", "graze", "lough", "munch", "guess", "knock", "haute", "caput", "steel", "honor", "shout", "suing", "lucid", "haste", "hence", "proof", "ladle", "decoy", "super", "buxom", "drill", "prate", "chick", "spoon", "hurry", "forum", "chasm", "skate", "spook", "drawn", "deuce", "stunt", "tramp", "drown", "purer", "mecca", "cower", "quilt", "tithe", "bingo", "notch", "aired", "lower", "happy", "buyer", "spore", "stole", "inner", "liked", "urine", "relay", "beach", "froze", "broth", "fudge", "value", "hello", "psalm", "toned", "lurid", "sooty", "salty", "after", "scamp", "truer", "image", "upper", "fever", "shorn", "biped", "beard", "spied", "arrow", "ebony", "stake", "mirth", "swing", "abhor", "rarer", "smell", "crier", "moose", "owing", "knead", "stuff", "trust", "sware", "tribe", "motif", "straw", "miser", "flung", "moral", "tenth", "lager", "bunny", "scale", "eased", "freed", "eager", "reign", "shirk", "abbot", "boast", "grand", "noise", "tardy", "blame", "hussy", "sprig", "imbue", "clove", "chime", "swamp", "brush", "ended", "sheer", "gruff", "torch", "vague", "utter", "geese", "smash", "foist", "cried", "climb", "stoic", "newly", "thigh", "scaly", "belle", "boney", "whole", "chafe", "dance", "beast", "missy", "lodge", "tripe", "testy", "frail", "prowl", "villa", "flame", "spool", "login", "navel", "snack", "rabbi", "petty", "await", "slink", "gayer", "slush", "wrath", "rally", "cider", "flirt", "hunch", "bleat", "gourd", "order", "tawny", "faith", "flaky", "faded", "inlet", "orbit", "cairn", "mowed", "saved", "ratio", "windy", "chart", "tonic", "melon", "brute", "newer", "shiny", "flail", "sword", "exert", "downy"
];


console.assert(legacy_solutions[149] === solutions[149] && solutions[149] === "gaudy");
console.assert(solutions[150] === "chill");

export const SOLUTIONS =
  legacy_solutions.slice(0, 150).concat( /* 2021-06-19 (0, "cigar") to 2021-11-15 (149, "gaudy") */
  solutions.slice(150)) /* 2021-11-16 ("chill") to ... */;

export const WORDS = words;
