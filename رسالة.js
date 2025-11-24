module.exports.config = {
  name: "رسالة",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "اليكسي",
  description: "ارسال رسالة لجميع المستخدمين والكروبات",
  commandCategory: "المطور",
  usages: "[النص]",
  cooldowns: 10
};

module.exports.run = async function({ api, event, args, Users, Threads }) {
  const { senderID, threadID, messageID } = event;
  const permission = ["61583947011416"];
  
  if (!permission.includes(senderID)) {
    return api.sendMessage("هذا الأمر مخصص للمطور فقط", threadID, messageID);
  }
  
  if (args.length === 0) {
    return api.sendMessage("⚠️ يرجى كتابة الرسالة المراد ارسالها\nمثال: .رسالة مرحبا بكم", threadID, messageID);
  }
  
  const message = args.join(" ");
  const broadcastMessage = `📢 رسالة من المطور:\n\n${message}`;
  
  api.sendMessage("⏳ جاري ارسال الرسالة لجميع المستخدمين والكروبات...", threadID, messageID);
  
  const allThreads = global.data.allThreadID || [];
  let successCount = 0;
  let failCount = 0;
  
  for (const tid of allThreads) {
    try {
      await new Promise((resolve, reject) => {
        api.sendMessage(broadcastMessage, tid, (err) => {
          if (err) {
            failCount++;
            reject(err);
          } else {
            successCount++;
            resolve();
          }
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`Failed to send to thread ${tid}:`, error);
    }
  }
  
  return api.sendMessage(
    `✅ تم ارسال الرسالة بنجاح\n\n📊 الاحصائيات:\n• نجح: ${successCount}\n• فشل: ${failCount}\n• المجموع: ${allThreads.length}`,
    threadID,
    messageID
  );
};
