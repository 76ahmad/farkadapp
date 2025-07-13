import React, { useState, useEffect } from 'react';
import { 
  Map, FileText, Upload, Download, Search, Filter, 
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle,
  Calendar, User, Tag, MessageSquare, Share2,
  Building2, Layers, Compass, Ruler, Palette
} from 'lucide-react';
import { mapsService } from '../../services/mapsService';

const MapsManager = ({ 
  currentUser, 
  currentProject, 
  onViewChange 
}) => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [mapStats, setMapStats] = useState({});

  // نموذج إضافة خارطة جديدة
  const [newMap, setNewMap] = useState({
    title: '',
    description: '',
    type: 'architectural',
    status: 'draft',
    tags: [],
    fileUrl: '',
    version: 1
  });

  useEffect(() => {
    if (currentProject?.id) {
      loadMaps();
      loadMapStats();
    }
  }, [currentProject]);

  const loadMaps = async () => {
    try {
      setLoading(true);
      const unsubscribe = mapsService.subscribeToProjectMaps(
        currentProject.id,
        (mapsData) => {
          setMaps(mapsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading maps:', error);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up maps subscription:', error);
      setLoading(false);
    }
  };

  const loadMapStats = async () => {
    try {
      const stats = await mapsService.getMapsStats(currentProject.id);
      setMapStats(stats);
    } catch (error) {
      console.error('Error loading map stats:', error);
    }
  };

  const handleAddMap = async (e) => {
    e.preventDefault();
    try {
      await mapsService.addMap({
        ...newMap,
        projectId: currentProject.id,
        createdBy: currentUser?.email,
        createdByName: currentUser?.displayName
      });
      
      setNewMap({
        title: '',
        description: '',
        type: 'architectural',
        status: 'draft',
        tags: [],
        fileUrl: '',
        version: 1
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding map:', error);
      alert('حدث خطأ أثناء إضافة الخارطة');
    }
  };

  const handleUpdateMap = async (mapId, updates) => {
    try {
      await mapsService.updateMap(mapId, updates);
      setSelectedMap(null);
    } catch (error) {
      console.error('Error updating map:', error);
      alert('حدث خطأ أثناء تحديث الخارطة');
    }
  };

  const handleDeleteMap = async (mapId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الخارطة؟')) {
      try {
        await mapsService.deleteMap(mapId);
      } catch (error) {
        console.error('Error deleting map:', error);
        alert('حدث خطأ أثناء حذف الخارطة');
      }
    }
  };

  const handleAddComment = async (mapId, comment) => {
    try {
      await mapsService.addMapComment(mapId, {
        comment,
        createdBy: currentUser?.email,
        createdByName: currentUser?.displayName
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('حدث خطأ أثناء إضافة التعليق');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'architectural': return <Building2 className="h-4 w-4" />;
      case 'structural': return <Layers className="h-4 w-4" />;
      case 'electrical': return <Compass className="h-4 w-4" />;
      case 'plumbing': return <Ruler className="h-4 w-4" />;
      case 'mechanical': return <Palette className="h-4 w-4" />;
      default: return <Map className="h-4 w-4" />;
    }
  };

  const filteredMaps = maps.filter(map => {
    const matchesSearch = map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         map.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || map.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3">
                  <Map className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">إدارة الخوارط والتصاميم</h1>
                  <p className="text-gray-600">مشروع: {currentProject?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  إضافة خارطة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-xl p-3">
                <Map className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{mapStats.total || 0}</div>
                <div className="text-sm text-gray-600">إجمالي الخوارط</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-xl p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{mapStats.approved || 0}</div>
                <div className="text-sm text-gray-600">موافق عليها</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-xl p-3">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{mapStats.pending || 0}</div>
                <div className="text-sm text-gray-600">قيد المراجعة</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-xl p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{mapStats.rejected || 0}</div>
                <div className="text-sm text-gray-600">مرفوضة</div>
              </div>
            </div>
          </div>
        </div>

        {/* أدوات البحث والفلترة */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الخوارط..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="draft">مسودة</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">موافق عليها</option>
                <option value="rejected">مرفوضة</option>
              </select>
              
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all duration-300">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* قائمة الخوارط */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الخوارط...</p>
            </div>
          ) : filteredMaps.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">لا توجد خوارط حالياً</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                إضافة خارطة جديدة
              </button>
            </div>
          ) : (
            filteredMaps.map((map) => (
              <div key={map.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(map.type)}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{map.title}</h3>
                      <p className="text-sm text-gray-600">{map.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(map.status)}`}>
                      {map.status === 'approved' ? 'موافق عليها' :
                       map.status === 'rejected' ? 'مرفوضة' :
                       map.status === 'pending' ? 'قيد المراجعة' : 'مسودة'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>الإصدار: {map.version}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{map.createdByName}</span>
                  </div>
                  
                  {map.tags && map.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {map.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMap(map)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => setSelectedMap(map)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-all duration-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteMap(map.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* نموذج إضافة خارطة جديدة */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">إضافة خارطة جديدة</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddMap} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الخارطة</label>
                <input
                  type="text"
                  required
                  value={newMap.title}
                  onChange={(e) => setNewMap({...newMap, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={newMap.description}
                  onChange={(e) => setNewMap({...newMap, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخارطة</label>
                  <select
                    value={newMap.type}
                    onChange={(e) => setNewMap({...newMap, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="architectural">معماري</option>
                    <option value="structural">إنشائي</option>
                    <option value="electrical">كهربائي</option>
                    <option value="plumbing">سباكة</option>
                    <option value="mechanical">ميكانيكي</option>
                    <option value="landscape">تنسيق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select
                    value={newMap.status}
                    onChange={(e) => setNewMap({...newMap, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">مسودة</option>
                    <option value="pending">قيد المراجعة</option>
                    <option value="approved">موافق عليها</option>
                    <option value="rejected">مرفوضة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رابط الملف (اختياري)</label>
                <input
                  type="url"
                  value={newMap.fileUrl}
                  onChange={(e) => setNewMap({...newMap, fileUrl: e.target.value})}
                  placeholder="https://example.com/file.pdf"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300"
                >
                  إضافة الخارطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* تفاصيل الخارطة */}
      {selectedMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الخارطة</h2>
              <button
                onClick={() => setSelectedMap(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedMap.title}</h3>
                <p className="text-gray-600 mb-6">{selectedMap.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">النوع:</span>
                    <span className="text-gray-600">{selectedMap.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">الحالة:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedMap.status)}`}>
                      {selectedMap.status === 'approved' ? 'موافق عليها' :
                       selectedMap.status === 'rejected' ? 'مرفوضة' :
                       selectedMap.status === 'pending' ? 'قيد المراجعة' : 'مسودة'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">الإصدار:</span>
                    <span className="text-gray-600">{selectedMap.version}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">أنشئ بواسطة:</span>
                    <span className="text-gray-600">{selectedMap.createdByName}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4">الإجراءات</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-300">
                    <Download className="h-5 w-5" />
                    تحميل الخارطة
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all duration-300">
                    <Edit className="h-5 w-5" />
                    تعديل الخارطة
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all duration-300">
                    <MessageSquare className="h-5 w-5" />
                    إضافة تعليق
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-300">
                    <Share2 className="h-5 w-5" />
                    مشاركة الخارطة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapsManager;