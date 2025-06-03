import { db } from "../db";
import { messages } from "../db/schema";
import logger from "../utils/winston.logger";

const messagesArr = [
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Hi",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Hello",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "How's it going?",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Pretty good!",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Nice to hear",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "What's up?",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Just chilling",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Cool",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 9",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 10",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 11",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 12",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 13",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 14",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 15",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 16",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 17",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 18",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 19",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 20",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 21",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 22",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 23",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 24",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 25",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 26",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 27",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 28",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 29",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 30",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 31",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 32",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 33",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 34",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 35",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 36",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 37",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 38",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 39",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 40",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 41",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 42",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 43",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 44",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 45",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 46",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 47",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 48",
  },
  {
    senderId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    receiverId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    content: "Message 49",
  },
  {
    senderId: "6b4de906-0312-4963-b64d-ef0c16745f65",
    receiverId: "6dcfe5f7-1c86-4da4-bbfb-5299f2f3bebc",
    content: "Message 50",
  },
];

const messagesSeeds = async () => {
  let i: number = 0;
  try {
    const timer = setInterval(async () => {
        await db.insert(messages).values(messagesArr[i])
        i++
        if(i >= 50){
            clearInterval(timer)
        }
        logger.info(`seeded message no : ${i}`)
    }, 1000);
  } catch (error) {
    logger.error("error while seeding messages", error);
  } 
};

messagesSeeds();
