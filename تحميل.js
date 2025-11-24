module.exports.config = {
  name: "تحميل",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "عمر",
  description: "تحميل جميع ملفات البوت كملف مضغوط عبر رابط",
  commandCategory: "المطور",
  usages: "تحميل",
  cooldowns: 60
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const fs = require('fs-extra');
  const { exec } = require('child_process');
  const path = require('path');
  const axios = require('axios');
  const FormData = require('form-data');
  
  try {
    console.log("تحميل: بدء العملية");
    
    api.sendMessage("⏳ جاري ضغط ملفات البوت... الرجاء الانتظار", threadID, messageID);
    
    const rootPath = path.resolve(__dirname, '../../');
    const cachePath = path.join(__dirname, 'cache');
    const zipPath = path.join(cachePath, 'bot_files.zip');
    
    // إنشاء مجلد cache إذا لم يكن موجوداً
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }
    
    // حذف ملف ZIP قديم إن وجد
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    
    console.log("تحميل: ضغط الملفات باستخدام tar");
    
    // استخدام أداة tar (متوفرة دائماً، أسرع وأكفأ)
    // استثناء المجلدات والملفات الثقيلة لتقليل الحجم
    const zipCommand = `cd "${rootPath}" && tar -czf "${zipPath}" \
      --exclude='node_modules' \
      --exclude='*.mp4' \
      --exclude='*.mkv' \
      --exclude='*.avi' \
      --exclude='*/cache/*.jpg' \
      --exclude='*/cache/*.png' \
      --exclude='*/cache/*.gif' \
      .`;
    
    exec(zipCommand, { maxBuffer: 1024 * 1024 * 50 }, async (error, stdout, stderr) => {
      if (error) {
        console.error("تحميل: خطأ في الضغط", error);
        return api.sendMessage(`❌ حدث خطأ أثناء ضغط الملفات: ${error.message}`, threadID, messageID);
      }
      
      try {
        // التحقق من وجود الملف وحجمه
        if (!fs.existsSync(zipPath)) {
          throw new Error('فشل إنشاء الملف المضغوط');
        }
        
        const stats = fs.statSync(zipPath);
        const fileSizeInMB = stats.size / (1024 * 1024);
        
        console.log(`تحميل: حجم الملف ${fileSizeInMB.toFixed(2)} ميجابايت`);
        
        api.sendMessage(`📤 تم الضغط! جاري رفع الملف (${fileSizeInMB.toFixed(2)} ميجابايت)...`, threadID);
        
        console.log("تحميل: بدء الرفع على GoFile");
        
        // الحصول على سيرفر GoFile
        let server = 'store1';
        try {
          const serverRes = await axios.get('https://api.gofile.io/servers');
          if (serverRes.data && serverRes.data.data && serverRes.data.data.servers && serverRes.data.data.servers.length > 0) {
            server = serverRes.data.data.servers[0].name;
          }
        } catch (e) {
          console.log("تحميل: استخدام السيرفر الافتراضي");
        }
        
        // رفع الملف
        const form = new FormData();
        form.append('file', fs.createReadStream(zipPath));
        
        const uploadRes = await axios.post(`https://${server}.gofile.io/contents/uploadfile`, form, {
          headers: form.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 300000
        });
        
        console.log("تحميل: استجابة الرفع:", uploadRes.data);
        
        if (uploadRes.data && uploadRes.data.status === 'ok' && uploadRes.data.data) {
          const downloadLink = uploadRes.data.data.downloadPage;
          
          // حذف الملف المؤقت
          fs.unlinkSync(zipPath);
          console.log("تحميل: تم حذف الملف المؤقت");
          
          const message = `✅ تم ضغط ورفع ملفات البوت بنجاح!\n\n` +
                         `📦 حجم الملف: ${fileSizeInMB.toFixed(2)} ميجابايت\n` +
                         `📁 يحتوي على: جميع ملفات البوت (بدون ملفات الكاش الثقيلة)\n` +
                         `🔗 رابط التحميل:\n${downloadLink}\n\n` +
                         `⏰ الرابط سيبقى متاحاً لفترة محدودة`;
          
          api.sendMessage(message, threadID, messageID);
          
        } else {
          throw new Error('فشل رفع الملف على GoFile');
        }
        
      } catch (uploadError) {
        console.error("تحميل: خطأ في الرفع", uploadError);
        
        // محاولة بديلة باستخدام file.io
        try {
          console.log("تحميل: محاولة رفع على file.io");
          
          const form2 = new FormData();
          form2.append('file', fs.createReadStream(zipPath));
          
          const uploadRes2 = await axios.post('https://file.io', form2, {
            headers: form2.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 300000
          });
          
          if (uploadRes2.data && uploadRes2.data.success) {
            const stats = fs.statSync(zipPath);
            const fileSizeInMB = stats.size / (1024 * 1024);
            
            fs.unlinkSync(zipPath);
            
            const message = `✅ تم ضغط ورفع ملفات البوت بنجاح!\n\n` +
                           `📦 حجم الملف: ${fileSizeInMB.toFixed(2)} ميجابايت\n` +
                           `📁 يحتوي على: جميع ملفات البوت (بدون ملفات الكاش الثقيلة)\n` +
                           `🔗 رابط التحميل:\n${uploadRes2.data.link}\n\n` +
                           `⚠️ ملاحظة: الرابط يعمل لمرة واحدة فقط!`;
            
            api.sendMessage(message, threadID, messageID);
          } else {
            throw new Error('فشل الرفع على file.io');
          }
          
        } catch (error2) {
          console.error("تحميل: فشلت جميع المحاولات", error2);
          
          // حذف الملف المؤقت
          if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
          }
          
          api.sendMessage(`❌ عذراً، فشل رفع الملف على الخدمات السحابية.\nالرجاء المحاولة مرة أخرى لاحقاً.`, threadID, messageID);
        }
      }
    });
    
  } catch (error) {
    console.error("تحميل: خطأ عام", error);
    api.sendMessage(`❌ حدث خطأ: ${error.message}`, threadID, messageID);
  }
};
