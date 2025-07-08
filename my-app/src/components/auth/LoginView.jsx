import React, { useState } from 'react';
import { auth } from '../../firebase/config'; // Assuming firebase config is here
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('contractor'); // Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client-side validation
    if (!email || !password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Assuming user data includes a 'type' or 'role' field
      // You might need to fetch additional user data from Firestore here
      const user = userCredential.user;
      console.log('Logged in user:', user);
      onLogin({ uid: user.uid, email: user.email, type: role }); // Pass user data to App.js
    } catch (err) {
      console.error('Login error:', err.message);
      // Provide more user-friendly error messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/invalid-email') {
        setError('صيغة البريد الإلكتروني غير صحيحة.');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="mb-6">
          <img src="/path/to/your/logo.png" alt="Logo" className="mx-auto h-16 w-auto" /> {/* Replace with your logo */}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">منصة البناء الذكي</h2>
          <p className="mt-2 text-sm text-gray-600">نظام إدارة شامل لصناعة البناء</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="contractor">مقاول</option>
              <option value="architect">مهندس معماري</option>
              <option value="worker">عامل</option>
              <option value="site_manager">مدير موقع</option>
              <option value="inspector">مفتش/بلدية</option>
              <option value="client">عميل/مالك</option>
            </select>
          </div>
          <div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          للتجربة: أدخل أي بريد إلكتروني وكلمة مرور
        </p>
      </div>
    </div>
  );
}

export default LoginView;

