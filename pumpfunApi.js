async function fetchDexTrades(lowerInt, higherInt) {
   var fetchme = await fetch(
      `https://frontend-api-v2.pump.fun/coins?offset=${lowerInt}&limit=${higherInt}&sort=market_cap&order=DESC&includeNsfw=false`,
      {
         headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "if-none-match": 'W/"ff53-PVFS8vjUPnGXWpnjYIjNs6FUZ0A"',
            priority: "u=1, i",
            "sec-ch-ua":
               '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            Referer: "https://pump.fun/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
         },
         body: null,
         method: "GET",
      },
   );
   var res = await fetchme.json();
   //console.log(res);
   return res;
}

module.exports = {
   fetchDexTrades,
};
