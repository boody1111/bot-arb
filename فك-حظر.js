module.exports.config = {
  name: "فك-حظر",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "اليكسي",
  description: "طرد مستخدم معين من المجموعة",
  commandCategory: "المطور",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const permission = ["61583947011416"];
  const userToKick = "100091741124911";
  
  if (!permission.includes(senderID)) {
    return api.sendMessage("هذا الأمر مخصص للمطور فقط", threadID, messageID);
  }
  
  api.getThreadInfo(threadID, (err, info) => {
    if (err) {
      return api.sendMessage("حدث خطأ أثناء الحصول على معلومات المجموعة", threadID, messageID);
    }
    
    const participantIDs = info.participantIDs;
    const adminIDs = info.adminIDs.map(admin => admin.id);
    
    if (!adminIDs.includes(api.getCurrentUserID())) {
      return api.sendMessage("البوت يحتاج صلاحيات الادمن لطرد الأعضاء", threadID, messageID);
    }
    
    if (!participantIDs.includes(userToKick)) {
      return api.sendMessage("هذا المستخدم غير موجود في المجموعة", threadID, messageID);
    }
    
    api.removeUserFromGroup(userToKick, threadID, (err) => {
      if (err) {
        console.log(err);
        return api.sendMessage("حدث خطأ أثناء طرد المستخدم", threadID, messageID);
      }
      api.sendMessage("✅ تم طرد المستخدم من المجموعة", threadID, messageID);
    });
  });
};
