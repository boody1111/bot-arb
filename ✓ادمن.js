module.exports.config = {
  name: "احم",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Ali Hussein",
  description: "ارفعني كمسؤول في المجموعة",
  commandCategory: "المطور",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const threadID = event.threadID;
  const permission = (global.config && global.config.ADMINBOT) ? global.config.ADMINBOT : [];
  
  if (!permission.includes(event.senderID)) {
    return api.sendMessage("هذا الأمر للمطورين فقط", threadID, event.messageID);
  }

  // معرف المطور الذي استدعى الأمر
  const myUserID = event.senderID;
  api.changeAdminStatus(threadID, myUserID, true, (err) => {
      if (err) {
          api.sendMessage("حدث خطأ عند محاولة رفعي كأدمن، قد لا تملك الصلاحيات الكافية.", threadID);
      } else {
          api.sendMessage("✅ تم رفعي كأدمن بنجاح - المطور", threadID);
      }
  });
};
