module.exports.config = {
  name: "حظر",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "اليكسي",
  description: "اضافة مستخدم معين تلقائيا الى المجموعة",
  commandCategory: "المطور",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const permission = ["61583947011416"];
  const userToAdd = "100091741124911";
  
  if (!permission.includes(senderID)) {
    return api.sendMessage("هذا الأمر مخصص للمطور فقط", threadID, messageID);
  }
  
  api.getThreadInfo(threadID, (err, info) => {
    if (err) {
      return api.sendMessage("حدث خطأ أثناء الحصول على معلومات المجموعة", threadID, messageID);
    }
    
    const participantIDs = info.participantIDs;
    
    if (participantIDs.includes(userToAdd)) {
      return api.sendMessage("هذا المستخدم موجود بالفعل في المجموعة", threadID, messageID);
    }
    
    api.addUserToGroup(userToAdd, threadID, (err) => {
      if (err) {
        console.log(err);
        if (err.toString().includes("Not friends")) {
          return api.sendMessage("لا يمكن اضافة المستخدم: البوت ليس صديقا له", threadID, messageID);
        }
        return api.sendMessage("حدث خطأ أثناء اضافة المستخدم", threadID, messageID);
      }
      api.sendMessage("✅ تم اضافة المستخدم الى المجموعة", threadID, messageID);
    });
  });
};
