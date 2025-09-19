# 🚀 دليل الحصول على Telegram Chat ID و Channel ID

## 📱 **الخطوات السريعة:**

### **1. للحصول على Chat ID (للمحادثة الشخصية):**
- ابحث عن البوت في Telegram: `@your_bot_name`
- أرسل أي رسالة للبوت (مثل: "Hello")
- شغل الأداة: `node getTelegramIdsAPI.js`
- ستحصل على Chat ID في النتيجة

### **2. للحصول على Channel ID:**
- أنشئ قناة جديدة في Telegram
- أضف البوت كـ **Administrator** للقناة
- أرسل رسالة في القناة
- شغل الأداة مرة أخرى لرؤية Channel ID

### **3. مثال على النتيجة:**
```
📨 Found messages:
==================
Message 1:
  Chat ID: 123456789
  Chat Type: private
  Chat Title: Your Name
  Message: Hello
---
Channel Post 1:
  Channel ID: -1001234567890
  Channel Title: AIOS Debug Channel
  Post: Test message
---
```

### **4. تحديث ملف البيئة:**
بعد الحصول على IDs، حدث ملف `firebase.env`:

```bash
TELEGRAM_BOT_TOKEN=8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0
TELEGRAM_CHANNEL_ID=-1001234567890
DEBUGGER_CHAT_ID=123456789
```

## 🔧 **أدوات متاحة:**

1. **`node getTelegramIds.js`** - بوت تفاعلي (يعمل في الخلفية)
2. **`node getTelegramIdsAPI.js`** - فحص API مباشر (يعمل في الخلفية)

## 🚀 **بعد الحصول على IDs:**

1. **تحديث ملف البيئة** بالـ IDs الصحيحة
2. **إيقاف الأدوات** (Ctrl+C)
3. **تشغيل النظام الكامل** مع Quantum Autopilot

## 📞 **مساعدة:**

إذا واجهت مشاكل:
- تأكد من أن البوت Token صحيح
- تأكد من إضافة البوت كـ Admin في القناة
- تحقق من أن البوت يستقبل الرسائل

---

**ملاحظة:** الأداة تفحص كل 10 ثوانٍ تلقائياً للرسائل الجديدة.
