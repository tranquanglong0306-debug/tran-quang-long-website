import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  Plus, Edit, Trash2, LogOut, ArrowLeft, Send, 
  Lock, Mail, BookOpen, AlertCircle, FileText, CheckCircle
} from 'lucide-react';
import { auth, db } from '../lib/firebase';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Blog management states
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: '',
    category: 'Applied Linguistics',
    readTime: '5 min read',
    summary: '',
    content: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Monitor Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
      if (currentUser) {
        fetchPosts();
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch blog posts from Firestore
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedPosts: any[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedPosts.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Lỗi khi tải bài viết:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Lỗi đăng nhập admin:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setLoginError('Email hoặc mật khẩu không chính xác.');
      } else {
        setLoginError('Đã xảy ra lỗi đăng nhập. Vui lòng thử lại sau.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPosts([]);
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    }
  };

  // Form handle changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  // Submit new or edited post
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.summary || !formState.content) return;

    setFormStatus('loading');
    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const now = new Date();
      const dateString = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

      const postData = {
        title: formState.title,
        category: formState.category,
        readTime: formState.readTime,
        date: dateString,
        summary: formState.summary,
        content: formState.content,
        createdAt: Timestamp.now()
      };

      if (editId) {
        // Edit existing post
        const postDocRef = doc(db, 'blogPosts', editId);
        await updateDoc(postDocRef, {
          title: postData.title,
          category: postData.category,
          readTime: postData.readTime,
          summary: postData.summary,
          content: postData.content
        });
        setEditId(null);
      } else {
        // Create new post
        await addDoc(collection(db, 'blogPosts'), postData);
      }

      setFormStatus('success');
      setFormState({
        title: '',
        category: 'Applied Linguistics',
        readTime: '5 min read',
        summary: '',
        content: ''
      });
      fetchPosts();
      
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (err) {
      console.error('Lỗi lưu bài viết:', err);
      setFormStatus('error');
    }
  };

  // Start editing a post
  const handleEditStart = (post: any) => {
    setEditId(post.id);
    setFormState({
      title: post.title,
      category: post.category,
      readTime: post.readTime,
      summary: post.summary,
      content: post.content
    });
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setFormState({
      title: '',
      category: 'Applied Linguistics',
      readTime: '5 min read',
      summary: '',
      content: ''
    });
  };

  // Delete a post
  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;

    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      fetchPosts();
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
    }
  };

  if (loadingUser) {
    return (
      <div className="w-screen h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render Login Screen if not authenticated
  if (!user) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-[#050505] to-[#1a0b2e] flex items-center justify-center p-4 font-sans select-none relative">
        <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0" />
        
        {/* Back button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="absolute top-6 left-6 flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trang chủ</span>
        </button>

        {/* Login Card */}
        <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(147,51,234,0.15)] z-10 relative">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-wide">Đăng nhập Admin</h2>
            <p className="text-xs text-neutral-400">Nhập thông tin quản trị viên để cập nhật nội dung</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Mật khẩu
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            {loginError && (
              <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-medium py-3 rounded-xl text-sm transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-55"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Xác nhận đăng nhập</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard Workspace
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050505] to-[#120722] text-white p-6 sm:p-10 font-sans relative">
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 z-0" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto z-10 relative space-y-8">
        
        {/* Header HUD */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-wider flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              BẢNG QUẢN TRỊ BÀI VIẾT
            </h1>
            <p className="text-xs text-neutral-400">
              Đăng nhập dưới quyền: <span className="text-purple-300 font-bold font-mono">{user.email}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Xem Website</span>
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-xs uppercase tracking-wider text-rose-300 hover:text-rose-200 transition-all bg-rose-950/20 hover:bg-rose-900/30 px-4 py-2.5 rounded-xl border border-rose-900/30 cursor-pointer font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Grid content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Post Editor Form (Left 5 cols) */}
          <section className="lg:col-span-5 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md h-fit space-y-5">
            <h2 className="text-base font-bold tracking-wider text-purple-300 border-b border-white/5 pb-3 flex items-center gap-2">
              {editId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editId ? 'CHỈNH SỬA BÀI VIẾT' : 'THÊM BÀI VIẾT MỚI'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase">Tiêu đề</label>
                <input 
                  type="text"
                  name="title"
                  required
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase">Danh mục</label>
                  <select 
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all [&>option]:bg-[#120722] [&>option]:text-white"
                  >
                    <option value="Applied Linguistics">Applied Linguistics</option>
                    <option value="Positive Discipline">Positive Discipline</option>
                    <option value="Educational Leadership">Educational Leadership</option>
                    <option value="General Education">General Education</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase">Thời lượng đọc</label>
                  <input 
                    type="text"
                    name="readTime"
                    required
                    value={formState.readTime}
                    onChange={handleInputChange}
                    placeholder="5 min read"
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase">Tóm tắt ngắn (1-2 câu)</label>
                <textarea 
                  name="summary"
                  required
                  rows={2}
                  value={formState.summary}
                  onChange={handleInputChange}
                  placeholder="Mô tả tóm tắt nội dung bài viết..."
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase flex justify-between">
                  <span>Nội dung chi tiết (Markdown)</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Hỗ trợ định dạng H3, p, ul, li</span>
                </label>
                <textarea 
                  name="content"
                  required
                  rows={10}
                  value={formState.content}
                  onChange={handleInputChange}
                  placeholder="### Tiêu đề phụ&#10;&#10;Nội dung bài viết..."
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-mono resize-none scrollbar-thin"
                />
              </div>

              {formStatus === 'success' && (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl animate-pulse">
                  <CheckCircle className="w-4 h-4" />
                  <span>Bài viết đã được lưu thành công trên Firestore!</span>
                </div>
              )}

              {formStatus === 'error' && (
                <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                  <span>Đã xảy ra lỗi khi lưu bài viết. Vui lòng thử lại.</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-medium py-2.5 rounded-xl text-sm transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-55"
                >
                  {formStatus === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>{editId ? 'Cập nhật' : 'Đăng bài viết'}</span>
                    </>
                  )}
                </button>

                {editId && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-medium py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Posts List (Right 7 cols) */}
          <section className="lg:col-span-7 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <h2 className="text-base font-bold tracking-wider text-purple-300 border-b border-white/5 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              DANH SÁCH BÀI VIẾT ({posts.length})
            </h2>

            {loadingPosts ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-neutral-400 font-mono">Đang tải dữ liệu từ Firestore...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-2xl">
                Không tìm thấy bài viết nào. Hãy tạo bài viết đầu tiên của bạn!
              </div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-purple-950/40 text-purple-300 px-2 py-0.5 rounded border border-purple-900/30 font-medium">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {post.date} · {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-wide line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button 
                        onClick={() => handleEditStart(post)}
                        className="p-2 border border-white/10 hover:border-purple-500/50 hover:bg-purple-950/20 text-neutral-400 hover:text-purple-300 rounded-xl transition-all cursor-pointer"
                        title="Chỉnh sửa bài viết"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 border border-white/10 hover:border-rose-500/50 hover:bg-rose-950/20 text-neutral-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
