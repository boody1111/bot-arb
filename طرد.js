module.exports.config = {
  name: "طرد",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "اليكسي",
  description: "طرد عضو من المجموعة بالرد على رسالته",
  commandCategory: "مسؤولي المجموعات",
  usages: "[رد على رسالة]",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, messageReply } = event;
  
  if (!messageReply) {
    return api.sendMessage("يرجى الرد على رسالة الشخص المراد طرده", threadID, messageID);
  }
  
  api.getThreadInfo(threadID, (err, info) => {
    if (err) {
      return api.sendMessage("حدث خطأ أثناء الحصول على معلومات المجموعة", threadID, messageID);
    }
    
    const adminIDs = info.adminIDs.map(admin => admin.id);
    
    if (!adminIDs.includes(api.getCurrentUserID())) {
      return api.sendMessage("البوت يحتاج صلاحيات الادمن لطرد الأعضاء", threadID, messageID);
    }
    
    const userToKick = messageReply.senderID;
    
    if (userToKick === api.getCurrentUserID()) {
      return api.sendMessage("لا يمكنني طرد نفسي", threadID, messageID);
    }
    
    if (adminIDs.includes(userToKick)) {
      return api.sendMessage("لا يمكن طرد مسؤول المجموعة", threadID, messageID);
    }
    
    api.removeUserFromGroup(userToKick, threadID, (err) => {
      if (err) {
        console.log(err);
        return api.sendMessage("حدث خطأ أثناء طرد العضو", threadID, messageID);
      }
      api.sendMessage("✅ تم طرد العضو من المجموعة", threadID, messageID);
    });
  });
};
