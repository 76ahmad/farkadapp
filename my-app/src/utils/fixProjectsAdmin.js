const admin = require("firebase-admin");
const serviceAccount = require("../../firebase/serviceAccountKey.json"); // تأكد من المسار الصحيح للملف

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fixProjects() {
  const projectsCol = db.collection('projects');
  const snapshot = await projectsCol.get();
  let fixedCount = 0;
  for (const projectDoc of snapshot.docs) {
    const data = projectDoc.data();
    let needsFix = false;
    const updateData = {};
    if (!data.client || typeof data.client !== 'object') {
      updateData.client = { name: 'غير محدد', phone: '' };
      needsFix = true;
    }
    if (!data.siteManager || typeof data.siteManager !== 'object') {
      updateData.siteManager = { name: 'غير محدد' };
      needsFix = true;
    }
    if (!data.inspector || typeof data.inspector !== 'object') {
      updateData.inspector = { name: 'غير محدد' };
      needsFix = true;
    }
    if (!data.architect || typeof data.architect !== 'object') {
      updateData.architect = { name: 'غير محدد' };
      needsFix = true;
    }
    if (needsFix) {
      await projectDoc.ref.update(updateData);
      console.log(`✅ تم تصحيح مشروع: ${projectDoc.id}`);
      fixedCount++;
    }
  }
  if (fixedCount === 0) {
    console.log('كل المشاريع سليمة ولا تحتاج تصحيح.');
  } else {
    console.log(`تم تصحيح ${fixedCount} مشروع/مشاريع.`);
  }
}

fixProjects().catch(e => {
  console.error('حدث خطأ أثناء التصحيح:', e);
  process.exit(1);
});