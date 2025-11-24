module.exports.config = {
  name: "autoMod",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "اليكسي",
  description: "نظام الردود التلقائية والحماية من السبام",
  commandCategory: "نظام",
  usages: "",
  cooldowns: 0
};

const spamTracking = new Map();
const warningTracking = new Map();
const profanityWords = [
  "كلب", "حمار", "غبي", "احمق", "متخلف", "وسخ", "قذر", 
  "لعنة", "تفو", "عاهرة", "شرموطة", "كس", "زب"
];

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  
  if (!body || senderID === api.getCurrentUserID()) return;
  
  const lowerBody = body.toLowerCase().trim();
  
  const autoReplies = {
    'اربرت': 'احســــــن تتـــرك زوجـــــي بحاله 😡🥦',
    'اليكسي': 'احســــــن تتـــرك زوجـــــي بحاله 😡🥦',
    'اربرتة': 'احســــــن تتـــرك زوجـــــي بحاله 😡🥦',
    'اليكسيه': 'احســــــن تتـــرك زوجـــــي بحاله 😡🥦',
    'السلام عليكم': 'وعليكم السلام يخوي نورت💮😼',
    'سلام عليكم': 'وعليكم السلام يخوي نورت💮😼',
    'مين مطوره': 'روح اســـــــأل المطور اليـكسي😼💮',
    'مطور البوت': 'روح اســـــــأل المطور اليـكسي😼💮',
    'كيفك': 'الحمد لله تمام، وانت كيفك؟ 💮',
    'شلونك': 'زين الحمد لله، شلونك انت؟ 💮',
    'صباح الخير': 'صباح النور والسرور 🌅💮',
    'مساء الخير': 'مساء الفل والياسمين 🌙💮',
    'تصبح على خير': 'وانت من اهله، نوم العوافي 😴💮',
    'شكرا': 'العفو حبيبي 💮😊',
    'هلا': 'هلا فيك نورت 💮',
    'ها': 'تفضل يا غالي 💮',
    'بوت حلو': 'انت الأحلى 💮😊',
    'حبيبي': 'حياك الله 💮😊',
    'وين المطور': 'المطور اليكسي، روح اسأله 😼💮'
  };
  
  for (const [keyword, response] of Object.entries(autoReplies)) {
    if (lowerBody.includes(keyword)) {
      return api.sendMessage(response, threadID, messageID);
    }
  }
  
  if (lowerBody.includes('البوت')) {
    return api.sendMessage('روح اســـــــأل المطور اليـكسي😼💮', threadID, messageID);
  }
  
  if (checkProfanity(lowerBody)) {
    const warningKey = `${threadID}_${senderID}`;
    const warnings = warningTracking.get(warningKey) || 0;
    
    if (warnings === 0) {
      warningTracking.set(warningKey, 1);
      setTimeout(() => warningTracking.delete(warningKey), 300000);
      return api.sendMessage(
        "⚠️ تحذير: لا يسمح بالسب او الكلام السيئ في المجموعة\nالمرة القادمة سيتم طردك من الكروب",
        threadID,
        messageID
      );
    } else {
      warningTracking.delete(warningKey);
      api.getThreadInfo(threadID, (err, info) => {
        if (err) return;
        const adminIDs = info.adminIDs.map(admin => admin.id);
        if (!adminIDs.includes(api.getCurrentUserID())) return;
        if (adminIDs.includes(senderID)) return;
        
        api.sendMessage("🚫 تم طردك بسبب السب والكلام السيئ", threadID, () => {
          api.removeUserFromGroup(senderID, threadID);
        });
      });
    }
    return;
  }
  
  const spamKey = `${threadID}_${senderID}`;
  const now = Date.now();
  const userSpam = spamTracking.get(spamKey) || { messages: [], lastMessage: "" };
  
  userSpam.messages = userSpam.messages.filter(time => now - time < 10000);
  userSpam.messages.push(now);
  
  const isRepeating = userSpam.lastMessage === body && userSpam.messages.length >= 3;
  const isFastSpam = userSpam.messages.length >= 5;
  
  userSpam.lastMessage = body;
  spamTracking.set(spamKey, userSpam);
  
  if (isRepeating || isFastSpam) {
    const warningKey = `spam_${threadID}_${senderID}`;
    const warnings = warningTracking.get(warningKey) || 0;
    
    if (warnings === 0) {
      warningTracking.set(warningKey, 1);
      setTimeout(() => warningTracking.delete(warningKey), 300000);
      return api.sendMessage(
        "⚠️ تحذير: لا يسمح بالاسبام (الرسائل المتكررة)\nالمرة القادمة سيتم طردك من الكروب",
        threadID,
        messageID
      );
    } else {
      warningTracking.delete(warningKey);
      api.getThreadInfo(threadID, (err, info) => {
        if (err) return;
        const adminIDs = info.adminIDs.map(admin => admin.id);
        if (!adminIDs.includes(api.getCurrentUserID())) return;
        if (adminIDs.includes(senderID)) return;
        
        api.sendMessage("🚫 تم طردك بسبب الاسبام", threadID, () => {
          api.removeUserFromGroup(senderID, threadID);
        });
      });
    }
  }
};

function checkProfanity(text) {
  return profanityWords.some(word => text.includes(word));
}

module.exports.run = async function() {
  return;
};
