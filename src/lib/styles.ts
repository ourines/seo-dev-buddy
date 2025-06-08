// 内联样式定义，不依赖外部 CSS 框架
export const styles = {
  // 浮动按钮样式
  floatingButton: {
    position: 'fixed' as const,
    bottom: '1rem',
    right: '1rem',
    zIndex: 50,
    height: '3rem',
    width: '3rem',
    borderRadius: '50%',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#2563eb',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    outline: 'none',
  },

  floatingButtonHover: {
    backgroundColor: '#1d4ed8',
  },

  // Popover 内容样式
  popoverContent: {
    maxWidth: '420px',
    maxHeight: '60vh',
    marginRight: '1rem',
    marginBottom: '0.5rem',
    backgroundColor: 'white',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    color: '#111827',
    fontSize: '0.875rem',
    overflowY: 'auto' as const,
    padding: 0,
  },

  // 深色模式 Popover
  popoverContentDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    color: '#f9fafb',
  },

  // 头部样式
  header: {
    padding: '0.75rem',
    paddingBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky' as const,
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
  },

  headerDark: {
    borderBottomColor: '#374151',
    backgroundColor: '#1f2937',
  },

  // 标题样式
  title: {
    fontWeight: '600',
    lineHeight: '1',
    fontSize: '1.125rem',
    margin: 0,
  },

  subtitle: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0,
  },

  subtitleDark: {
    color: '#9ca3af',
  },

  // 按钮样式
  button: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    height: 'auto',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.2s ease-in-out',
    color: '#374151',
  },

  buttonHover: {
    backgroundColor: '#f3f4f6',
  },

  buttonDark: {
    color: '#d1d5db',
  },

  buttonDarkHover: {
    backgroundColor: '#374151',
  },

  // 加载状态
  loading: {
    padding: '1.5rem',
    textAlign: 'center' as const,
    color: '#6b7280',
  },

  loadingDark: {
    color: '#9ca3af',
  },

  // 内容区域
  content: {
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },

  // 章节样式
  section: {
    marginBottom: '0.75rem',
  },

  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#374151',
  },

  sectionTitleDark: {
    color: '#d1d5db',
  },

  // 检查项样式
  checkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f3f4f6',
  },

  checkItemDark: {
    borderBottomColor: '#374151',
  },

  checkItemLast: {
    borderBottom: 'none',
  },

  // 标签样式
  label: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#374151',
    minWidth: '80px',
  },

  labelDark: {
    color: '#d1d5db',
  },

  // 值样式
  value: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textAlign: 'right' as const,
    flex: 1,
    marginLeft: '0.5rem',
    wordBreak: 'break-word' as const,
  },

  valueDark: {
    color: '#9ca3af',
  },

  // 状态指示器
  statusIndicator: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    marginLeft: '0.5rem',
    flexShrink: 0,
  },

  statusSuccess: {
    backgroundColor: '#10b981',
  },

  statusWarning: {
    backgroundColor: '#f59e0b',
  },

  statusError: {
    backgroundColor: '#ef4444',
  },

  // 图标样式
  icon: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.25rem',
  },

  iconSmall: {
    width: '0.75rem',
    height: '0.75rem',
    marginRight: '0.25rem',
  },

  // Tooltip 样式
  tooltip: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    maxWidth: '200px',
    zIndex: 100,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

// 辅助函数：合并样式
export const mergeStyles = (...styleObjects: any[]) => {
  return Object.assign({}, ...styleObjects);
};

// 辅助函数：根据主题获取样式
export const getThemedStyle = (baseStyle: any, darkStyle: any, isDark: boolean) => {
  return isDark ? mergeStyles(baseStyle, darkStyle) : baseStyle;
};

// 检测深色模式
export const isDarkMode = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};