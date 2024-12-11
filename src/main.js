import TelegramBot from "node-telegram-bot-api";

const { TELEGRAM_API_TOKEN, WORSHOP_ORDERS_URL } = process.env;

const bot = new TelegramBot(TELEGRAM_API_TOKEN, {polling: true});

bot.onText(/\/track (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  console.log('Tracking order:', match[1], 'from:', chatId)

  const response = await fetch(`${WORSHOP_ORDERS_URL}/v1/trackings/${match[1]}`)
  if (response.ok) {
    const result = await response.json();
    bot.sendMessage(chatId, `Order status: ${result.status}`);
  } else if (response.status == 404) {
    bot.sendMessage(chatId, 'Order not found');
  } else {
    bot.sendMessage(chatId, 'Error in your tracking request. Try later or in the web page.');
  }
});
