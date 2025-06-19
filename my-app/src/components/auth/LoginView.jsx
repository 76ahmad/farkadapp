import React, { useState } from 'react';
import { auth } from '../../services/firebase'; // ✅ صحيح
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Building } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('contractor');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('يرجى إدخال البيانات');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userNames = {
        contractor: 'المقاول',
        architect: 'المهندس المعماري',
        worker: 'العامل',
        site_manager: 'مدير الموقع',
        inspector: 'المفتش',
        client: 'العميل'
      };

      onLogin({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        type: userType,
        displayName: userNames[userType]
      });
    } catch (error) {
      console.error('Login error:', error);
      alert('فشل تسجيل الدخول: تأكد من البريد وكلمة المرور');
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <Building className="h-12 w-12 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">منصة البناء الذكي</h1>
          <p className="text-sm text-gray-600">نظام إدارة شامل لصناعة البناء</p>
        </div>
        
        <div className="space-y-4">
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)} 
            className="w-full p-3 border rounded-lg"
          >
            <option value="contractor">مقاول</option>
            <option value="architect">مهندس معماري</option>
            <option value="worker">عامل</option>
            <option value="site_manager">مدير موقع</option>
            <option value="inspector">مفتش/بلدية</option>
            <option value="client">عميل/مالك</option>
          </select>
          
          <input 
            type="email" 
            placeholder="البريد الإلكتروني" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border rounded-lg" 
          />
          
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border rounded-lg" 
          />
          
          <button 
            onClick={handleLogin} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>للتجربة: أدخل أي بريد إلكتروني وكلمة مرور</p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;