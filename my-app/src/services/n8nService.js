// src/services/n8nService.js
export const sendTaskToN8N = async (taskData) => {
  try {
    const response = await fetch('https://abofarka.app.n8n.cloud/webhook-test/newtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) throw new Error('فشل الإرسال إلى n8n');

    const result = await response.json();
    console.log('✅ تم إرسال البيانات إلى n8n:', result);
    return result;
  } catch (error) {
    console.error('❌ خطأ أثناء إرسال البيانات إلى n8n:', error);
  }
};