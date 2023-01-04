var letter_probability = 41;
var word = "L";
var difficulty = "Easy";

var easy_words = ["CAT", "EAT", "NET", "RED", "BIG", "NOW", "GET", "AIR", "ANY", "HOT", "JET", "SUN", "ZOO", "RUN",
"DIG", "FAR", "ANT", "PET", "MAX", "BED"];
var medium_words = ["BETTER", "MARKET", "HEALTH", "CREATE", "BRANCH", "BOTTOM", "EXPAND", "MANAGE", "CASUAL", "DEMAND",
"FORGET", "AWARD", "THERE", "ALLOW", "LIGHT", "DRIVE", "ALIVE", "CHAIR", "EARTH", "GRASS", "METAL", "SHAPE"];
var hard_words = ["ABHORRENT", "CHILDHOOD", "TEXTBOOK", "ABILITIES", "EXPERTISE", "RECOGNIZE", "TECHNIQUE",
"MOSQUITOES", "MINIMIZE", "DIFFICULT", "SENTENCES", "CHOCOLATE", "ADVANTAGE", "STRENGTHS"];
var extreme_words = ["PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSIS", "ANTIDISESTABLISHMENTARIANISM", "INCOMPREHENSIBILITY",
"HIPPOPOTOMONSTROSESQUIPPEDALIOPHOBIA", "INCONSEQUENTIAL", "HYPOTHETICALLY"];

var users = ["Alpha", "Valiant", "Chief", "Stormy", "Starry", "Lucky", "Golden", "Raven", "West", "Elite", "Phoenix", "Titan",
"Blaze"];
var available_users = ["Alpha", "Chief", "Stormy", "Lucky", "Golden", "West", "Elite", "Phoenix", "Titan",
"Blaze"];

var leaderboard = {};
var leaderboard_copy = {};
var rankings = [];
var num_users = 0;

var current_user = users[Math.floor(Math.random()*users.length)];
var mouseX;
var mouseY;

var spacer_width = 10;
const max_confetti = 100;
const confetti_probability = 3;