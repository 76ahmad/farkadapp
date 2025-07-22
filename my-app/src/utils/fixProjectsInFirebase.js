// سكربت تصحيح المشاريع الناقصة في Firestore
// شغّله عبر: node src/utils/fixProjectsInFirebase.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');
const { firebaseConfig } = require('../firebase/config');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixProjects() {
  const projectsCol = collection(db, 'projects');
  const snapshot = await getDocs(projectsCol);
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
      await updateDoc(doc(db, 'projects', projectDoc.id), updateData);
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