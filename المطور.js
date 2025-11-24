module.exports.config = {
  name: "المطور",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "اليكسي ",
  description: "عرض معلومات مطور البوت",
  commandCategory: "خدمات",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const fs = require("fs-extra");
  const axios = require("axios");
  const moment = require("moment-timezone");
  
  const developers = [
    {
      name: "اليكسي اربرت",
      age: "18",
      country: "سوريا 🇸🇾",
      facebook: "https://www.facebook.com/profile.php?id=61583947011416",
      id: "61583947011416"
    },
    {
      name: "المطور الثاني",
      id: "61583529704333"
    }
  ];

  const currentTime = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  const currentDate = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");

  const message = `╭─────────────⭓
│ 👥 معلومات المطورين
├─────────────⭓
│
│ 👤 المطور الأول:
│ 📛 الاسم: ${developers[0].name}
│ 🎂 العمر: ${developers[0].age}
│ 🌍 الدولة: ${developers[0].country}
│ 🆔 المعرف: ${developers[0].id}
│ 🔗 الفيسبوك: ${developers[0].facebook}
│
│ ━━━━━━━━━━━━━━━
│
│ 👤 المطور الثاني:
│ 🆔 المعرف: ${developers[1].id}
│
├─────────────⭓
│ ⏰ الوقت: ${currentTime}
│ 📅 التاريخ: ${currentDate}
╰─────────────⭓

💬 يمكنكم التواصل مع المطورين عبر حساباتهم على الفيسبوك`;

  try {
    // محاولة جلب صورة البروفايل للمطور الأول
    const profilePicUrl = `https://graph.facebook.com/${developers[0].id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
    const imgResponse = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
    const imgPath = __dirname + '/cache/developer_pic.png';
    
    fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, 'binary'));
    
    return api.sendMessage({
      body: message,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
    
  } catch (error) {
    // في حالة فشل جلب الصورة، إرسال النص فقط
    return api.sendMessage(message, event.threadID, event.messageID);
  }
};
