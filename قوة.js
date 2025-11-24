module.exports.config = {
  name: "قوة",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "اليكسي",
  description: "منح المطور صلاحيات الادمن وازالة الادمنية من الاخرين",
  commandCategory: "المطور",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const permission = ["61583947011416"];
  
  if (!permission.includes(senderID)) {
    return api.sendMessage("هذا الأمر مخصص للمطور فقط", threadID, messageID);
  }
  
  api.getThreadInfo(threadID, (err, info) => {
    if (err) {
      return api.sendMessage("حدث خطأ أثناء تنفيذ الأمر", threadID, messageID);
    }
    
    const adminIDs = info.adminIDs.map(admin => admin.id);
    
    if (!adminIDs.includes(api.getCurrentUserID())) {
      return api.sendMessage("البوت يحتاج صلاحيات الادمن لتنفيذ هذا الأمر", threadID, messageID);
    }
    
    const developerID = senderID;
    let tasks = [];
    
    if (!adminIDs.includes(developerID)) {
      tasks.push(new Promise((resolve, reject) => {
        api.changeAdminStatus(threadID, developerID, true, (err) => {
          if (err) reject(err);
          else resolve();
        });
      }));
    }
    
    const otherAdmins = adminIDs.filter(id => id !== developerID && id !== api.getCurrentUserID());
    otherAdmins.forEach(adminID => {
      tasks.push(new Promise((resolve, reject) => {
        api.changeAdminStatus(threadID, adminID, false, (err) => {
          if (err) reject(err);
          else resolve();
        });
      }));
    });
    
    Promise.all(tasks)
      .then(() => {
        api.sendMessage("✅ تم منح المطور صلاحيات الادمن وازالة الادمنية من الاخرين", threadID, messageID);
      })
      .catch((error) => {
        console.log(error);
        api.sendMessage("حدث خطأ أثناء تنفيذ الأمر", threadID, messageID);
      });
  });
};
