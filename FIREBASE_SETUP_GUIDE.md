# 🚀 دليل استخدام مشروع AIOS مع Firebase

## ✅ تم ربط المشروع بـ Firebase بنجاح!

مشروعك الآن مربوط بمشروع Firebase: **aios-97581**

## 📁 الملفات التي تم إنشاؤها

- `firebase.json` - إعدادات Firebase
- `.firebaserc` - معرف المشروع
- `firestore.rules` - قواعد قاعدة البيانات
- `firestore.indexes.json` - فهارس قاعدة البيانات
- `firebase.env` - متغيرات البيئة

## 🔧 الخطوات التالية

### 1. إعداد متغيرات البيئة
```bash
# انسخ ملف الإعدادات
cp firebase.env .env

# ثم عدل الملف وأدخل بيانات Firebase الحقيقية
nano .env
```

### 2. الحصول على بيانات Firebase
اذهب إلى [Firebase Console](https://console.firebase.google.com/project/aios-97581/settings/general)

1. **Project Settings** → **General**
2. انسخ البيانات التالية:
   - API Key
   - Auth Domain
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 3. تشغيل المشروع محلياً
```bash
# تثبيت التبعيات
npm run install:all

# تشغيل الخادم
npm run dev

# في terminal آخر، تشغيل العميل
cd client && npm start
```

### 4. نشر المشروع على Firebase
```bash
# بناء المشروع
npm run build

# نشر على Firebase Hosting
firebase deploy
```

## 🧪 تشغيل الاختبارات
```bash
# جميع الاختبارات
./run-tests.sh

# أو
npm test
```

## 📊 إدارة قاعدة البيانات

### عرض البيانات
```bash
firebase firestore:get
```

### نشر قواعد قاعدة البيانات
```bash
firebase deploy --only firestore:rules
```

## 🔐 إعداد المصادقة

1. اذهب إلى **Authentication** في Firebase Console
2. فعّل **Email/Password** أو **Google**
3. أضف المستخدمين

## 📱 إعداد التطبيق

### Frontend (React)
- البيانات في `client/src/services/FirebaseService.js`
- متغيرات البيئة تبدأ بـ `REACT_APP_`

### Backend (Node.js)
- البيانات في `server/index.js`
- متغيرات البيئة عادية

## 🚀 نشر المشروع

### Hosting
```bash
firebase deploy --only hosting
```

### Functions (إذا كان لديك)
```bash
firebase deploy --only functions
```

### كل شيء
```bash
firebase deploy
```

## 🔍 مراقبة المشروع

### Logs
```bash
firebase functions:log
```

### Analytics
- اذهب إلى Firebase Console → Analytics

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من ملف `.env`
2. تأكد من تسجيل الدخول: `firebase login`
3. تحقق من المشروع: `firebase use`

## 🎯 الخطوات التالية المقترحة

1. **إعداد المصادقة** - إضافة تسجيل الدخول
2. **إعداد قاعدة البيانات** - إنشاء المجموعات
3. **إضافة المزيد من الميزات** - حسب احتياجاتك
4. **تحسين الأداء** - تحسين الاستعلامات
5. **النشر** - نشر المشروع للاستخدام الفعلي

---

**مبروك! مشروعك الآن جاهز للاستخدام مع Firebase** 🎉
