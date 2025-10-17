// api.js - API Service for MongoDB backend
const API_URL ='http://localhost:5000/api';

// Get userId from localStorage or generate one (replace with proper auth)
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Date.now();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'user-id': getUserId()
});

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    // try to parse JSON, but allow empty responses
    const text = await response.text();
    try { return text ? JSON.parse(text) : null; } catch { return text; }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============ SUBJECTS API ============
export const subjectsAPI = {
  getAll: () => fetchAPI('/subjects'),
  create: (subject) => fetchAPI('/subjects', {
    method: 'POST',
    body: JSON.stringify(subject)
  }),
  update: (id, subject) => fetchAPI(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subject)
  }),
  delete: (id) => fetchAPI(`/subjects/${id}`, {
    method: 'DELETE'
  })
};

// ============ SCHEDULE API ============
export const scheduleAPI = {
  getAll: () => fetchAPI('/schedule'),
  create: (schedule) => fetchAPI('/schedule', {
    method: 'POST',
    body: JSON.stringify(schedule)
  }),
  update: (id, schedule) => fetchAPI(`/schedule/${id}`, {
    method: 'PUT',
    body: JSON.stringify(schedule)
  }),
  delete: (id) => fetchAPI(`/schedule/${id}`, {
    method: 'DELETE'
  })
};

// ============ GOALS API ============
export const goalsAPI = {
  getAll: () => fetchAPI('/goals'),
  create: (goal) => fetchAPI('/goals', {
    method: 'POST',
    body: JSON.stringify(goal)
  }),
  update: (id, goal) => fetchAPI(`/goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(goal)
  }),
  delete: (id) => fetchAPI(`/goals/${id}`, {
    method: 'DELETE'
  })
};

// ============ GRADES API ============
export const gradesAPI = {
  getAll: () => fetchAPI('/grades'),
  create: (grade) => fetchAPI('/grades', {
    method: 'POST',
    body: JSON.stringify(grade)
  }),
  delete: (id) => fetchAPI(`/grades/${id}`, {
    method: 'DELETE'
  })
};

// ============ DOCUMENTS API ============
export const documentsAPI = {
  getAll: () => fetchAPI('/documents'),
  create: (document) => fetchAPI('/documents', {
    method: 'POST',
    body: JSON.stringify(document)
  }),
  delete: (id) => fetchAPI(`/documents/${id}`, {
    method: 'DELETE'
  })
};

// ============ SETTINGS API ============
export const settingsAPI = {
  get: () => fetchAPI('/settings'),
  update: (settings) => fetchAPI('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  })
};

// ============ STATS API ============
export const statsAPI = {
  get: () => fetchAPI('/stats'),
  update: (stats) => fetchAPI('/stats', {
    method: 'PUT',
    body: JSON.stringify(stats)
  })
};

// ============ BACKUP (single-shot snapshot) ============
// Best-effort helper to push the whole app snapshot to a single endpoint.
// Backend should accept POST /backup { ...snapshot } for this to persist.
export const backupAPI = {
  backupAll: (payload) => fetchAPI('/backup', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

export default {
  subjects: subjectsAPI,
  schedule: scheduleAPI,
  goals: goalsAPI,
  grades: gradesAPI,
  documents: documentsAPI,
  settings: settingsAPI,
  stats: statsAPI,
  backup: backupAPI,
  API_URL,
  getUserId,
  getHeaders
};
