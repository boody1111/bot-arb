module.exports.config = {
name: "هدية",
version: "1.0.1",
hasPermssion: 0,
credits: "عمر",
description: "يعطيك هدية بمبلغ عشوائي",
commandCategory: "الاموال",
usages: "",
cooldowns: 86400
};

module.exports.run = async function ({ api,event,Users,Currencies,args }) {
    var out = (msg) => api.sendMessage(msg,event.threadID,event.messageID);
    let ix = ["5000","16000","1050","1600","1000","8000","10000","12000","1400","1581","1980","9910","3000","6900","15000","6099","4231","5482","2000","1510","20000"];
    let rxx = ix[Math.floor(Math.random() * ix.length)]; 
    
    var mention = Object.keys(event.mentions);
    const admins = (global.config && global.config.ADMINBOT) ? global.config.ADMINBOT : [];
    const isAdmin = admins.includes(event.senderID);
    
    if (args[0] == 'all' && isAdmin) {
        var x = global.data.allCurrenciesID;
        for (let ex of x) {
            await Currencies.increaseMoney(ex, parseInt(rxx));
        }
        return api.sendMessage("تم إرسال الهدايا لجميع المستخدمين ✅",event.threadID);
    }
    else if (args[0] == "user" && isAdmin) {
        if (isNaN(args[1])) return api.sendMessage("الرجاء إدخال معرف المستخدم !",event.threadID,event.messageID);
        await Currencies.increaseMoney(parseInt(args[1]), parseInt(rxx));
        out("تم الاسترداد بنجاح !");
        return api.sendMessage("حصلت ع فلوس هدية، المبلغ الذي تلقيته هو: " +  rxx,parseInt(args[1]));
    }
    else if (mention[0] && isAdmin) {
        await Currencies.increaseMoney(mention[0], parseInt(rxx)); 
        return out(event.mentions[mention].replace("@", "") + " حصلت ع فلوس الهدية 🎁، المبلغ هو: " + rxx);
    }
    else {
        await Currencies.increaseMoney(event.senderID, parseInt(rxx)); 
        return out("====[ الهدية اليومية ]====\n✅ مبروك حصلت ع فلوس الحظ\n💰 المبلغ: " + rxx + "\n⏰ يمكنك استخدام الأمر مرة أخرى بعد 24 ساعة");
    }
};