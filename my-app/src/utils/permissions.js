// تحديد الصلاحيات لكل نوع مستخدم
export const getUserPermissions = (userType) => {
  const permissions = {
    contractor: {
      canView: true,
      canAdd: true,
      canEdit: true,
      canDelete: true,
      canViewLog: true,
      role: 'مدير النظام'
    },
    site_manager: {
      canView: true,
      canAdd: true,
      canEdit: true,
      canDelete: false,
      canViewLog: true,
      role: 'مدير المخزون'
    },
    worker: {
      canView: true,
      canAdd: false,
      canEdit: false,
      canDelete: false,
      canViewLog: false,
      role: 'عرض فقط'
    },
    architect: {
      canView: true,
      canAdd: false,
      canEdit: false,
      canDelete: false,
      canViewLog: false,
      role: 'عرض فقط'
    },
    inspector: {
      canView: true,
      canAdd: false,
      canEdit: false,
      canDelete: false,
      canViewLog: true,
      role: 'مراقب'
    },
    client: {
      canView: true,
      canAdd: false,
      canEdit: false,
      canDelete: false,
      canViewLog: false,
      role: 'عرض فقط'
    }
  };
  return permissions[userType] || permissions.worker;
};