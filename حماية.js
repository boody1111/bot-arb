const fs = require("fs"),
  path = __dirname + "/cache/namebox.json";

module.exports.config = {
name: "حماية",
version: "1.1.0",
hasPermssion: 1,
credits: "نوت دفاين",
description: "حماية اسم مجموعتك",
commandCategory: "مسؤولي المجموعات",
usages: "تشغيل/ايقاف",
cooldowns: 3
};
module.exports.languages = {
"vi": {},
"en": {}
};
module.exports.onLoad = () => {   
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
};

module.exports.handleEvent = async function ({ api, event, Threads, permssion }) {
const { threadID, messageID, senderID, isGroup, author, logMessageType } = event;

if (isGroup == true && logMessageType == "log:thread-name") {
let data = JSON.parse(fs.readFileSync(path))

if (!data[threadID] || data[threadID].status !== true) return;

let dataThread = (await Threads.getData(threadID)).threadInfo
const threadName = dataThread.threadName;

if (threadName != data[threadID].namebox) {
return api.setTitle(
 data[threadID].namebox,
   threadID, () => {
     api.sendMessage(
  `⚠️ تم استعادة اسم المجموعة المحمي: ${data[threadID].namebox}`,
   threadID)
   });
  }
}
};

module.exports.run = async function ({ api, event, permssion, Threads }) {
const { threadID, messageID } = event;
let data = JSON.parse(fs.readFileSync(path))
let dataThread = (await Threads.getData(threadID)).threadInfo
const threadName = dataThread.threadName;

if (!data[threadID]) {
   data[threadID] = {
     namebox: threadName,
     status: false
   }
}

if (data[threadID].status == false) {
   data[threadID].namebox = threadName
   data[threadID].status = true
   fs.writeFileSync(path, JSON.stringify(data, null, 2));
   return api.sendMessage(
    `✅ تم تشغيل وضع حماية اسم المجموعة\n📌 الاسم المحمي: ${threadName}\n💡 سيتم استعادة هذا الاسم تلقائياً عند أي محاولة تغيير`,
    threadID)
} else {
   data[threadID].status = false
   fs.writeFileSync(path, JSON.stringify(data, null, 2));
   return api.sendMessage(
    `⏸️ تم إيقاف وضع حماية اسم المجموعة`,
    threadID)
}
}
