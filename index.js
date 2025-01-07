var express = require("express");
const app = express();
const cors = require("cors");
const { TwitterApi } = require("twitter-api-v2");
const { testervar } = require("./test.js");
const { fetchDexTrades } = require("./pumpfunApi.js");
const { ModelGeneration } = require("./openAiAPI.js");

const corsOption = {
  origin: [
    "https://38091a36-f5e0-4f69-abf4-8e2354cc1aee-00-1mt2da426qtul.riker.replit.dev:3001/",
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    "https://xbundle-dapp.replit.app",
    "https://xbundle.cloud",
  ],
  optionSucessStatus: 200,
};
//
app.use(express.static("public"), express.json());

var Twit = require("twit");
/*
var T = new Twit({
  consumer_key:         'Ia41luwThL9BZpOsMCUlkFWS2',
  consumer_secret:      'AhHDBbEwg2XOc7aVDs2kJY3PONOUlnj8hGrDFbqowJ7KQElIQ3',
  access_token:         '1802749947457986560-Vuyk9dET3pI3GX5KqnqEJAuxto69NE',
  access_token_secret:  'wCWT5bCGgJLwBTWkwqvqFHzNAOKRhYYRMb2UnUl1Fy1Oi',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})*/
const client = new TwitterApi({
  appKey: "CID4dLhk7zJgzPs6bpdof79p6",
  appSecret: "1jXwhmqJgBg9fRQeI2iJGJZIoy7ryKl9i7P9chp6Z0eezdozE1",
  accessToken: "1875940077186195456-vCbBganoLerVnNOFigYDyM4RYSJMNI",
  accessSecret: "O02Z6nseUjAdw80MlBn43lkH3KyZrv14ZgEYub5krOM5D",
  bearerToken:
    "AAAAAAAAAAAAAAAAAAAAAHnKxwEAAAAAiAYQF0q0kAtPlr5XHhpB80iDWjU%3DxPobpLg5tJAuTvpI1HcC8reaGKcDGqUYDTb8oeLPmIZ2fr97MO",
});
const rwClient = client.readWrite;
const textTweet = async () => {
  try {
    await rwClient.v2.tweet("#PONGO ON XRP");
    console.log("success");
  } catch (error) {
    console.error(error);
  }
};
var now = new Date();
console.log(now);
var sgs = "still very low if you choose to buy might achieve reasonable gains";
function generateFloatID(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateTweet(
  symbol,
  name,
  mcap,
  mintAddress,
  suggestions,
  description,
) {
  let TweetBody = `${description}\n\nsymbol:#${symbol}\nmint:${mintAddress}\nMCap:${mcap}`;

  return TweetBody;
}
const abbrNum = (number, decPlaces) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if (number == 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
};

const AIBuild = async () => {
  var lowerRandomInt = generateFloatID(0, 1000);
  var higherRandomInt = lowerRandomInt + 50;
  ///console.log("lower"+lowerRandomInt);
  var webResJson = await fetchDexTrades(lowerRandomInt, higherRandomInt);
  var selectedCoinIndex = generateFloatID(0, webResJson.length);
  //console.log("selcted"+selectedCoinIndex);
  var selectedCoin = webResJson[selectedCoinIndex];
  var symbol = selectedCoin.symbol;
  var name = selectedCoin.name;
  var mcap = abbrNum(selectedCoin.usd_market_cap, 3);
  var mintAddress = selectedCoin.mint;
  //console.log("no of des " + selectedCoin.description.split(" ").length);
  var suggest =
    selectedCoin.usd_market_cap > 10000000.96
      ? `with a high market cap and favourable trade activities with solid liquidity, we recommend you to buy`
      : selectedCoin.usd_market_cap < 10000000.96 &&
          selectedCoin.usd_market_cap > 500000.0
        ? `with less than 10m market cap moderate market cap and favourable trading activities,might be a wise choice to invest if you find the right dip to slurp`
        : `with less than 500K market cap might be interesting if looking for a pump and making quick money!`;
  var description =
    selectedCoin.description.split(" ").length < 10
      ? suggest
      : `say one about the description "${selectedCoin.description}"`;
  var AIGenSpeech = await ModelGeneration(symbol, suggest);
  var proceedDes = `${AIGenSpeech.split(".")[0]}.`;
  var tweetContent = generateTweet(
    symbol,
    name,
    mcap,
    mintAddress,
    suggest,
    proceedDes,
  );
  //console.log( selectedCoin.description+"EEEEEEND");
  console.log(tweetContent);
  //await rwClient.v2.tweet(tweetContent);
};

const AItweet = async () => {
  try {
    AIBuild();
  } catch (err) {
    console.log(err);
  }
};

const reoccuringTweet = async () => {
  await AItweet();
  //retweets every 5hours
  await delay(18000000);
  await reoccuringTweet();
};
reoccuringTweet();

//FetchPumpFunData();

//textTweet();
//
//  tweet 'hello world!'
//
/*
T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  console.log(data)
})*/

app.listen(8080, () => {
  console.log("server is running dick! at port 8080");
});
