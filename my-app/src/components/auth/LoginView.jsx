import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Building } from 'lucide-react';

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('contractor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in user:', user);
      onLogin({ uid: user.uid, email: user.email, type: role });
    } catch (err) {
      console.error('Login error:', err.message);
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
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">منصة البناء الذكي</h2>
          <p className="mt-2 text-sm text-gray-600">نظام إدارة شامل لصناعة البناء</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
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
              className="input-field"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
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
