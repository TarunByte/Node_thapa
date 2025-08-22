import https from "https";
import readline from "readline";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiKey = "1eeccfb59edc61c8c944107e"; // Replace with a real API key
const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

const convertCurrency = (amount, rate) => {
  return (amount * rate).toFixed(2);
};

https.get(url, (response) => {
  let data = "";

  response.on("data", (chunk) => {
    data += chunk;
  });

  response.on("end", () => {
    const rates = JSON.parse(data).conversion_rates;

    // amount = 90;
    // currency = inr;
    // 90usd = how much inr
    // 1usd = 84.9667 inr
    // 90usd = ?

    // 90 * 84.9667

    rl.question("Enter the amound in USD: ", (amount) => {
      rl.question(
        "Enter the target currency (e.g., INR, EUR, NPR): ",
        (currency) => {
          const rate = rates[currency.toUpperCase()];
          if (rate) {
            console.log(
              chalk.blue.bgRed.bold(
                `${amount} USD is approximately ${convertCurrency(
                  amount,
                  rate
                )}`
              )
            );
          } else {
            console.log(`Invalid Currency Code`);
          }
          rl.close();
        }
      );
    });
  });
});
