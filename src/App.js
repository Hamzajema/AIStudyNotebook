import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Coffee, RefreshCw,   Lightbulb, Calendar, Clock, BookOpen, Plus, Edit2, Trash2, Target, BarChart3, Settings, Save, Download, Upload, Filter, Search, Bell, CheckCircle, AlertCircle, TrendingUp, Users, Globe, X, Play, Pause, RotateCcw, Award, BookMarked, Brain, Timer, Zap, Star, FileText, GraduationCap, Mail, MessageSquare, Image, Link, File, Tag } from 'lucide-react';
import {HelpCircle, CreditCard, ChevronLeft, ChevronRight } from 'react-feather';
import ReactFlow, { MiniMap, Controls, Background, Handle, Position,} from "reactflow";
import "reactflow/dist/style.css";
import { FaCalculator,FaNetworkWired, FaExpand, FaCompress, FaBrain, FaChevronDown, FaChevronRight } from 'react-icons/fa';


// API Base URL - adjust this to match your backend URL
const API_BASE_URL = 'https://backend-ai-study-notebook.vercel.app/api';

// API Service functions
const apiService = {
  // Subjects
  async getSubjects(userId) {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  async createSubject(subject, userId) {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(subject)
    });
    return response.json();
  },

  async updateSubject(id, subject, userId) {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(subject)
    });
    return response.json();
  },

  async deleteSubject(id, userId) {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  // Schedule
  async getSchedule(userId) {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  async createSchedule(schedule, userId) {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(schedule)
    });
    return response.json();
  },

  async updateSchedule(id, schedule, userId) {
    const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(schedule)
    });
    return response.json();
  },

  async deleteSchedule(id, userId) {
    const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
      method: 'DELETE',
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  // Goals
  async getGoals(userId) {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  async createGoal(goal, userId) {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(goal)
    });
    return response.json();
  },

  async updateGoal(id, goal, userId) {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(goal)
    });
    return response.json();
  },

  async deleteGoal(id, userId) {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  // Grades
  async getGrades(userId) {
    const response = await fetch(`${API_BASE_URL}/grades`, {
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  async createGrade(grade, userId) {
    const response = await fetch(`${API_BASE_URL}/grades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(grade)
    });
    return response.json();
  },

  async deleteGrade(id, userId) {
    const response = await fetch(`${API_BASE_URL}/grades/${id}`, {
      method: 'DELETE',
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  // Documents
  async getDocuments(userId) {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  async createDocument(document, userId) {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(document)
    });
    return response.json();
  },

  async deleteDocument(id, userId) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  // Settings
  async getSettings(userId) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  async updateSettings(settings, userId) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(settings)
    });
    return response.json();
  },

  // Stats
  async getStats(userId) {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: { 'user-id': userId }
    });
    return response.json();
  },

  async updateStats(stats, userId) {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify(stats)
    });
    return response.json();
  }
};

// Ensure subject objects always have the expected properties
const ensureSubjectProperties = (subject) => {
  const safeArray = (val) => Array.isArray(val) ? val : [];
  const safeString = (val) => typeof val === 'string' ? val : '';
  
  const normalizedNotes = safeArray(subject?.notes).map((n) => ({
    id: n?.id ?? Date.now() + Math.random(),
    title: safeString(n?.title ?? 'Untitled note'),
    content: safeString(n?.content),
    date: safeString(n?.date) || new Date().toISOString(),
    tags: safeArray(n?.tags),
    images: safeArray(n?.images),
    questions: safeString(n?.questions),
    summary: safeString(n?.summary),
        exercises: safeArray(n?.exercises),
            keyConcepts: safeString(n?.keyConcepts),
            flashcards: safeArray(n?.flashcards),
            simpleExplanation: safeString(n?.simpleExplanation),
            mindMap: safeString(n?.mindMap),
            mindMapData: n?.mindMapData || null,
            quiz: safeString(n?.quiz),
  }));

  const normalizedMaterials = safeArray(subject?.materials).map((m) => ({
    id: m?.id ?? Date.now() + Math.random(),
    name: safeString(m?.name ?? 'Material'),
    type: safeString(m?.type),
    content: safeString(m?.content),
    date: safeString(m?.date) || new Date().toISOString(),
    url: safeString(m?.url),
  }));

  return {
    _id: subject?._id,
    id: subject?.id ??  Date.now() + Math.random(),
    name: safeString(subject?.name),
    code: safeString(subject?.code),
    color: safeString(subject?.color) || '#3B82F6',
    credits: Number.isFinite(subject?.credits) ? subject.credits : 3,
    priority: safeString(subject?.priority) || 'Medium',
    completed: Boolean(subject?.completed),
    description: safeString(subject?.description),
    summary: safeString(subject?.summary),
    syllabus: safeString(subject?.syllabus),
    professor: safeString(subject?.professor),
    schedule: safeString(subject?.schedule),
    objectives: safeArray(subject?.objectives),
    notes: normalizedNotes,
    materials: normalizedMaterials,
  };
};


const StudyScheduleApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [userId] = useState("123"); // In a real app, this would come from authentication
  const [loading, setLoading] = useState(true);
  
  // State for all data
  const [subjects, setSubjects] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [studyGoals, setStudyGoals] = useState([]);
  const [grades, setGrades] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [backgroundTimers, setBackgroundTimers] = useState({});
const [pomodoroSession, setPomodoroSession] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoBackup: true,
    studyReminders: true,
    weeklyGoal: 40,
    dailyGoal: 6,
    pomodoroLength: 25,
    breakLength: 5,
    longBreakLength: 15
  });
  const [studyStats, setStudyStats] = useState({
    totalHours: 0,
    weeklyGoal: 40,
    streak: 0,
    dailyGoal: 6,
    completionRate: 0,
    averageSession: 0
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  
  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const [timerSession, setTimerSession] = useState(null);
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomodoroRounds, setPomodoroRounds] = useState(0);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [completedTasks] = useState(new Set());

  // Time slots for 24-hour day
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load all data from MongoDB on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        subjectsData,
        scheduleData,
        goalsData,
        gradesData,
        documentsData,
        settingsData,
        statsData
      ] = await Promise.all([
        apiService.getSubjects(userId),
        apiService.getSchedule(userId),
        apiService.getGoals(userId),
        apiService.getGrades(userId),
        apiService.getDocuments(userId),
        apiService.getSettings(userId),
        apiService.getStats(userId)
      ]);

      // Update state with fetched data
      setSubjects(subjectsData.map(ensureSubjectProperties));
      setScheduleData(scheduleData);
      setStudyGoals(goalsData);
      setGrades(gradesData);
      setUploadedDocs(documentsData);
      setSettings(settingsData);
      setStudyStats(statsData);

    } catch (error) {
      console.error('Error loading data:', error);
      addNotification('Error loading data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Convert schedule data to the format expected by the UI
  const getScheduleForDate = (date) => {
    const daySchedule = {};
    scheduleData
      .filter(session => session.date === date)
      .forEach(session => {
        daySchedule[session.timeSlot] = session;
      });
    return daySchedule;
  };

  const currentDaySchedule = getScheduleForDate(selectedDate);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/stop timer
  const toggleTimer = (session = null) => {
    if (timerActive) {
      setTimerActive(false);
      if (timerSession && timerTime > 0) {
        // Log completed study time
        const minutes = Math.floor(timerTime / 60);
        setStudyStats(prev => ({
          ...prev,
          totalHours: prev.totalHours + (minutes / 60)
        }));
        // Save to MongoDB
        apiService.updateStats({
          ...studyStats,
          totalHours: studyStats.totalHours + (minutes / 60)
        }, userId);
      }
    } else {
      setTimerActive(true);
      if (session) {
        setTimerSession(session);
      }
    }
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerTime(0);
    setTimerSession(null);
    setPomodoroRounds(0);
  };

  // Advanced filtering
  const getFilteredSessions = () => {
    const daySchedule = currentDaySchedule || {};
    return Object.entries(daySchedule).filter(([time, session]) => {
      const matchesSearch = !searchQuery || 
        session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subjects.find(s => s.id === session.subjectId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = !filterSubject || session.subjectId === parseInt(filterSubject);
      const matchesPriority = !filterPriority || session.priority === filterPriority;
      
      return matchesSearch && matchesSubject && matchesPriority;
    });
  };

  // Add notification
  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id:  Date.now() + Math.random(),
      message,
      time: 'Just now',
      type
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  // Subject CRUD operations
  const handleCreateSubject = async (subjectData) => {
    try {
      const newSubject = await apiService.createSubject(subjectData, userId);
      setSubjects(prev => [...prev, ensureSubjectProperties(newSubject)]);
      addNotification('Subject created successfully!', 'success');
      return newSubject;
    } catch (error) {
      console.error('Error creating subject:', error);
      addNotification('Error creating subject', 'error');
      throw error;
    }
  };

  const handleUpdateSubject = async (id, subjectData) => {
    try {
      const updatedSubject = await apiService.updateSubject(id, subjectData, userId);
      setSubjects(prev => prev.map(s => 
        s._id === id ? ensureSubjectProperties(updatedSubject) : s
      ));
      addNotification('Subject updated successfully!', 'success');
      return updatedSubject;
    } catch (error) {
      console.error('Error updating subject:', error);
      addNotification('Error updating subject', 'error');
      throw error;
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await apiService.deleteSubject(id, userId);
      setSubjects(prev => prev.filter(s => s._id !== id));
      addNotification('Subject deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting subject:', error);
      addNotification('Error deleting subject', 'error');
      throw error;
    }
  };

  // Schedule CRUD operations
  const handleCreateSchedule = async (scheduleData) => {
    try {
      const newSchedule = await apiService.createSchedule(scheduleData, userId);
      setScheduleData(prev => [...prev, newSchedule]);
      addNotification('Schedule created successfully!', 'success');
      return newSchedule;
    } catch (error) {
      console.error('Error creating schedule:', error);
      addNotification('Error creating schedule', 'error');
      throw error;
    }
  };

  const handleUpdateSchedule = async (id, scheduleData) => {
    try {
      const updatedSchedule = await apiService.updateSchedule(id, scheduleData, userId);
      setScheduleData(prev => prev.map(s => 
        s._id === id ? updatedSchedule : s
      ));
      addNotification('Schedule updated successfully!', 'success');
      return updatedSchedule;
    } catch (error) {
      console.error('Error updating schedule:', error);
      addNotification('Error updating schedule', 'error');
      throw error;
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await apiService.deleteSchedule(id, userId);
      setScheduleData(prev => prev.filter(s => s._id !== id));
      addNotification('Schedule deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      addNotification('Error deleting schedule', 'error');
      throw error;
    }
  };

  // Goals CRUD operations
  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await apiService.createGoal(goalData, userId);
      setStudyGoals(prev => [...prev, newGoal]);
      addNotification('Goal created successfully!', 'success');
      return newGoal;
    } catch (error) {
      console.error('Error creating goal:', error);
      addNotification('Error creating goal', 'error');
      throw error;
    }
  };

  const handleUpdateGoal = async (id, goalData) => {
    try {
      const updatedGoal = await apiService.updateGoal(id, goalData, userId);
      setStudyGoals(prev => prev.map(g => 
        g._id === id ? updatedGoal : g
      ));
      addNotification('Goal updated successfully!', 'success');
      return updatedGoal;
    } catch (error) {
      console.error('Error updating goal:', error);
      addNotification('Error updating goal', 'error');
      throw error;
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await apiService.deleteGoal(id, userId);
      setStudyGoals(prev => prev.filter(g => g._id !== id));
      addNotification('Goal deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting goal:', error);
      addNotification('Error deleting goal', 'error');
      throw error;
    }
  };

  // Grades CRUD operations
  const handleCreateGrade = async (gradeData) => {
    try {
      const newGrade = await apiService.createGrade(gradeData, userId);
      setGrades(prev => [...prev, newGrade]);
      addNotification('Grade created successfully!', 'success');
      return newGrade;
    } catch (error) {
      console.error('Error creating grade:', error);
      addNotification('Error creating grade', 'error');
      throw error;
    }
  };

  const handleDeleteGrade = async (id) => {
    try {
      await apiService.deleteGrade(id, userId);
      setGrades(prev => prev.filter(g => g._id !== id));
      addNotification('Grade deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting grade:', error);
      addNotification('Error deleting grade', 'error');
      throw error;
    }
  };

  // Documents CRUD operations
  const handleCreateDocument = async (documentData) => {
    try {
      const newDocument = await apiService.createDocument(documentData, userId);
      setUploadedDocs(prev => [...prev, newDocument]);
      addNotification('Document uploaded successfully!', 'success');
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      addNotification('Error uploading document', 'error');
      throw error;
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      await apiService.deleteDocument(id, userId);
      setUploadedDocs(prev => prev.filter(d => d._id !== id));
      addNotification('Document deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting document:', error);
      addNotification('Error deleting document', 'error');
      throw error;
    }
  };

  // Settings operations
  const handleUpdateSettings = async (newSettings) => {
    try {
      const updatedSettings = await apiService.updateSettings(newSettings, userId);
      setSettings(updatedSettings);
      addNotification('Settings updated successfully!', 'success');
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      addNotification('Error updating settings', 'error');
      throw error;
    }
  };

  // Stats operations
  const handleUpdateStats = async (newStats) => {
    try {
      const updatedStats = await apiService.updateStats(newStats, userId);
      setStudyStats(updatedStats);
      return updatedStats;
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  };

  // Export data
  const exportData = async (format) => {
    try {
      const allData = {
        subjects,
        schedule: scheduleData,
        goals: studyGoals,
        grades,
        documents: uploadedDocs,
        settings,
        stats: studyStats,
        exportDate: new Date().toISOString()
      };
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `studypro_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        addNotification('Data exported successfully!', 'success');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      addNotification('Error exporting data', 'error');
    }
  };

  // Import data
  const importData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Import each type of data
      if (data.subjects) {
        for (const subject of data.subjects) {
          await handleCreateSubject(subject);
        }
      }
      
      if (data.schedule) {
        for (const session of data.schedule) {
          await handleCreateSchedule(session);
        }
      }
      
      if (data.goals) {
        for (const goal of data.goals) {
          await handleCreateGoal(goal);
        }
      }
      
      if (data.settings) {
        await handleUpdateSettings(data.settings);
      }
      
      if (data.stats) {
        await handleUpdateStats(data.stats);
      }
      
      addNotification('Data imported successfully!', 'success');
    } catch (error) {
      console.error('Error importing data:', error);
      addNotification('Error importing data', 'error');
    }
  };

  // Styles object (keep your existing styles)
  const styles = {
    app: {
      minHeight: '100vh',
      backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: settings.darkMode ? '#f9fafb' : '#1f2937'
    },
    header: {
      backgroundColor: settings.darkMode ? '#111827' : 'white',
      borderBottom: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`,
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: settings.darkMode ? '#f9fafb' : '#1f2937',
      margin: 0
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: settings.darkMode ? '#9ca3af' : '#6b7280',
      margin: 0
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    timerDisplay: {
      backgroundColor: timerActive ? '#dbeafe' : settings.darkMode ? '#374151' : '#f3f4f6',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontFamily: 'monospace',
      fontWeight: 'bold'
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative'
    },
    searchInput: {
      padding: '0.25rem 0.75rem',
      border: `1px solid ${settings.darkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: settings.darkMode ? '#374151' : 'white',
      color: settings.darkMode ? '#f9fafb' : '#1f2937'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    primaryButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: settings.darkMode ? '#374151' : 'white',
      color: settings.darkMode ? '#f9fafb' : '#374151',
      border: `1px solid ${settings.darkMode ? '#4b5563' : '#d1d5db'}`
    },
    iconButton: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      color: settings.darkMode ? '#9ca3af' : '#6b7280',
      transition: 'all 0.2s'
    },
    mainContainer: {
      display: 'flex'
    },
    sidebar: {
      width: '16rem',
      backgroundColor: settings.darkMode ? '#111827' : 'white',
      borderRight: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`,
      minHeight: 'calc(100vh - 73px)',
      padding: '1rem'
    },
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      textAlign: 'left',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s'
    },
    navButtonActive: {
      backgroundColor: '#dbeafe',
      color: '#2563eb'
    },
    navButtonInactive: {
      color: settings.darkMode ? '#d1d5db' : '#374151'
    },
    content: {
      flex: 1,
      padding: '1.5rem',
      backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb'
    },
    card: {
      backgroundColor: settings.darkMode ? '#111827' : 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: settings.darkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`
    },
    notebookCard: {
      backgroundColor: settings.darkMode ? '#111827' : '#fefefe',
      padding: '2rem',
      borderRadius: '0.5rem',
      boxShadow: settings.darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: settings.darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
      position: 'relative',
      backgroundImage: settings.darkMode ? 'none' : 'linear-gradient(to bottom, transparent 0%, transparent 24px, #e5e7eb 24px, #e5e7eb 25px, transparent 25px, transparent 49px, #e5e7eb 49px, #e5e7eb 50px, transparent 50px)',
      backgroundSize: '100% 25px',
      backgroundPosition: '0 0',
      backgroundRepeat: 'repeat-y'
    },
    notebookMargin: {
      borderLeft: settings.darkMode ? '2px solid #4b5563' : '2px solid #ef4444',
      paddingLeft: '1rem',
      marginLeft: '1rem'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    },
    modalContent: {
      backgroundColor: settings.darkMode ? '#111827' : 'white',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      width: '90%',
      maxWidth: '28rem',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: `1px solid ${settings.darkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: settings.darkMode ? '#374151' : 'white',
      color: settings.darkMode ? '#f9fafb' : '#1f2937'
    },
    select: {
      width: '100%',
      padding: '0.5rem',
      border: `1px solid ${settings.darkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: settings.darkMode ? '#374151' : 'white',
      color: settings.darkMode ? '#f9fafb' : '#1f2937'
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      border: `1px solid ${settings.darkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '0.375rem',
      height: '5rem',
      resize: 'vertical',
      backgroundColor: settings.darkMode ? '#374151' : 'white',
      color: settings.darkMode ? '#f9fafb' : '#1f2937'
    },
    notebookTextarea: {
      width: '100%',
      padding: '1rem',
      border: 'none',
      borderRadius: '0.375rem',
      height: '5rem',
      resize: 'vertical',
      backgroundColor: 'transparent',
      color: settings.darkMode ? '#f9fafb' : '#1f2937',
      fontFamily: settings.darkMode ? 'inherit' : '"Kalam", "Comic Sans MS", cursive',
      fontSize: '1rem',
      lineHeight: '1.6',
      backgroundImage: settings.darkMode ? 'none' : 'linear-gradient(to bottom, transparent 0%, transparent 24px, #e5e7eb 24px, #e5e7eb 25px, transparent 25px, transparent 49px, #e5e7eb 49px, #e5e7eb 50px, transparent 50px)',
      backgroundSize: '100% 25px',
      backgroundPosition: '0 0',
      backgroundRepeat: 'repeat-y'
    },
    notebookInput: {
      width: '100%',
      padding: '0.75rem',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      backgroundColor: 'transparent',
      color: settings.darkMode ? '#f9fafb' : '#1f2937',
      fontFamily: settings.darkMode ? 'inherit' : '"Kalam", "Comic Sans MS", cursive',
      fontWeight: '600',
      borderBottom: settings.darkMode ? '2px solid #4b5563' : '2px solid #ef4444'
    },
    grid: {
      display: 'grid',
      gap: '1rem'
    },
    progressBar: {
      width: '100%',
      backgroundColor: settings.darkMode ? '#374151' : '#e5e7eb',
      borderRadius: '9999px',
      height: '0.5rem'
    },
    progressFill: {
      height: '0.5rem',
      borderRadius: '9999px',
      transition: 'width 0.3s ease'
    }
  };

const FloatingTimerWidget = () => {
    const activeTimers = Object.entries(backgroundTimers).filter(([_, timer]) => timer.isRunning);
    
    if (activeTimers.length === 0) return null;
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        backgroundColor: settings.darkMode ? '#1f2937' : 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        padding: '1rem',
        minWidth: '250px',
        zIndex: 1000,
        border: `2px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '0.75rem',
          paddingBottom: '0.5rem',
          borderBottom: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`
        }}>
          <Clock size={18} color="#3b82f6" />
          <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>
            Active Timers ({activeTimers.length})
          </h4>
        </div>
        
        {activeTimers.map(([timerId, timer]) => {
          const session = scheduleData.find(s => s._id === timerId);
          if (!session) return null;
          
          const subject = subjects.find(s => s.id === session.subjectId);
          const progress = ((timer.duration - timer.timeRemaining) / timer.duration) * 100;
          
          return (
            <div key={timerId} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                  {session.topic}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {formatTime(timer.timeRemaining)}
                </span>
              </div>
              <div style={{ 
                height: '4px', 
                backgroundColor: settings.darkMode ? '#374151' : '#e5e7eb',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '0.25rem'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: timer.isPomodoro ? '#f59e0b' : (subject?.color || '#3b82f6'),
                  transition: 'width 1s linear'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.625rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                  {timer.isPomodoro ? `🍅 ${timer.pomodoroPhase}` : subject?.code}
                </span>
                <button
                  onClick={() => toggleBackgroundTimer(session)}
                  style={{
                    ...styles.iconButton,
                    padding: '0.125rem',
                    color: '#ef4444'
                  }}
                  title="Stop timer"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };  // Enhanced Study session component with advanced features
  const StudySession = ({ session, timeSlot, onEdit, onDelete, onComplete }) => {
    const subject = subjects.find(s => s.id === session.subjectId);
    const [showNotes, setShowNotes] = React.useState(false);
    const [sessionNotes, setSessionNotes] = React.useState(session.notes || '');
    const [showPomodoro, setShowPomodoro] = React.useState(false);
    
    const activeTimer = backgroundTimers[session._id];
    const isTimerRunning = activeTimer?.isRunning;
    const timeRemaining = activeTimer?.timeRemaining || session.duration * 60;
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSaveNotes = async () => {
      try {
        await handleUpdateSchedule(session._id, { ...session, notes: sessionNotes });
        setShowNotes(false);
      } catch (error) {
        console.error('Failed to save notes');
      }
    };

    return (
      <div 
        style={{
          ...styles.card,
          borderLeft: `4px solid ${subject?.color}`,
          backgroundColor: session.completed ? 
            (settings.darkMode ? '#064e3b' : '#f0fdf4') : 
            (settings.darkMode ? '#111827' : 'white'),
          marginBottom: '0.5rem',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Progress bar for active timer */}
        {isTimerRunning && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            width: `${(timeRemaining / (session.duration * 60)) * 100}%`,
            backgroundColor: subject?.color || '#3b82f6',
            transition: 'width 1s linear'
          }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontWeight: '600', fontSize: '0.875rem', margin: 0 }}>
                {subject?.name}
              </h4>
              {session.priority === 'High' && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '0.625rem',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.25rem',
                  fontWeight: '600'
                }}>
                  HIGH
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: settings.darkMode ? '#9ca3af' : '#6b7280', margin: '0.25rem 0' }}>
              {session.topic}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '0.75rem', color: '#2563eb', margin: 0 }}>
                {isTimerRunning ? formatTime(timeRemaining) : `${session.duration}min`} • {session.type} • {session.priority}
              </p>
              {session.pomodoroCount > 0 && (
                <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                  🍅 {session.pomodoroCount}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onComplete(session._id, !session.completed)}
              style={{
                ...styles.iconButton,
                color: session.completed ? '#22c55e' : (settings.darkMode ? '#9ca3af' : '#6b7280')
              }}
              title="Mark as complete"
            >
              <CheckCircle size={14} />
            </button>
            <button 
              onClick={() => toggleBackgroundTimer(session)}
              style={{
                ...styles.iconButton,
                color: isTimerRunning ? '#22c55e' : (settings.darkMode ? '#9ca3af' : '#6b7280'),
                backgroundColor: isTimerRunning ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
              }}
              title={isTimerRunning ? "Stop timer" : "Start timer"}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button 
              onClick={() => setShowPomodoro(!showPomodoro)}
              style={{
                ...styles.iconButton,
                color: '#f59e0b'
              }}
              title="Pomodoro mode"
            >
              <Clock size={14} />
            </button>
            <button 
              onClick={() => setShowNotes(!showNotes)}
              style={{
                ...styles.iconButton,
                color: session.notes ? '#3b82f6' : (settings.darkMode ? '#9ca3af' : '#6b7280')
              }}
              title="Session notes"
            >
              <FileText size={14} />
            </button>
            <button 
              onClick={() => onEdit(session)} 
              style={styles.iconButton}
              title="Edit session"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={() => onDelete(session._id)} 
              style={styles.iconButton}
              title="Delete session"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Notes section */}
        {showNotes && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}` }}>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Add session notes..."
              style={{
                ...styles.input,
                minHeight: '80px',
                resize: 'vertical',
                marginBottom: '0.5rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={handleSaveNotes}
                style={{ ...styles.button, ...styles.primaryButton, fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
              >
                Save Notes
              </button>
              <button 
                onClick={() => setShowNotes(false)}
                style={{ ...styles.button, ...styles.secondaryButton, fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pomodoro settings */}
        {showPomodoro && (
          <div style={{ 
            marginTop: '0.75rem', 
            paddingTop: '0.75rem', 
            borderTop: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`,
            fontSize: '0.75rem'
          }}>
            <p style={{ margin: '0 0 0.5rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
              🍅 Pomodoro: 25min work + 5min break
            </p>
            <button 
              onClick={() => startPomodoroSession(session)}
              style={{ 
                ...styles.button, 
                ...styles.primaryButton, 
                fontSize: '0.75rem', 
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f59e0b'
              }}
            >
              Start Pomodoro
            </button>
          </div>
        )}
      </div>
    );
  };
// Voice notification function
const speakNotification = (text) => {
  if (!settings.voiceEnabled || !window.speechSynthesis) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};

// Play notification sound
const playNotificationSound = () => {
  if (!settings.soundEnabled) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

// Background timer system
const toggleBackgroundTimer = (session) => {
  const timerId = session._id;
  
  if (backgroundTimers[timerId]?.isRunning) {
    // Stop timer
    setBackgroundTimers(prev => ({
      ...prev,
      [timerId]: { ...prev[timerId], isRunning: false }
    }));
    playNotificationSound();
    speakNotification(`Timer stopped for ${session.topic}`);
  } else {
    // Start timer
    const startTime = Date.now();
    const duration = session.duration * 60;
    
    setBackgroundTimers(prev => ({
      ...prev,
      [timerId]: {
        isRunning: true,
        startTime,
        duration,
        timeRemaining: duration,
        sessionId: timerId
      }
    }));
    
    playNotificationSound();
    speakNotification(`Timer started for ${session.topic}. Duration ${session.duration} minutes`);
    
    // Request notification permission
    if (settings.notifications && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
};

// Pomodoro session starter
const startPomodoroSession = (session) => {
  const timerId = session._id;
  const startTime = Date.now();
  const pomodoroWork = 25 * 60; // 25 minutes
  
  setBackgroundTimers(prev => ({
    ...prev,
    [timerId]: {
      isRunning: true,
      startTime,
      duration: pomodoroWork,
      timeRemaining: pomodoroWork,
      sessionId: timerId,
      isPomodoro: true,
      pomodoroPhase: 'work'
    }
  }));
  
  setPomodoroSession({ sessionId: timerId, phase: 'work', count: (session.pomodoroCount || 0) + 1 });
  playNotificationSound();
  speakNotification(`Pomodoro started for ${session.topic}. Focus for 25 minutes`);
};
  // Session modal component (updated for MongoDB)
  const SessionModal = ({ isOpen, onClose, session, timeSlot }) => {
    const [formData, setFormData] = useState({
      subjectId: session?.subjectId || (subjects[0]?.id || ''),
      topic: session?.topic || '',
      type: session?.type || 'Lecture',
      duration: session?.duration || 60,
      priority: session?.priority || 'Medium',
      notes: session?.notes || '',
      date: session?.date || selectedDate,
      timeSlot: session?.timeSlot || timeSlot
    });

    const handleSubmit = async () => {
      if (!formData.topic.trim() || !formData.subjectId) return;
      
      try {
        if (session?._id) {
          // Update existing session
          await handleUpdateSchedule(session._id, formData);
        } else {
          // Create new session
          await handleCreateSchedule(formData);
        }
        onClose();
      } catch (error) {
        // Error handling is done in the CRUD functions
      }
    };

    if (!isOpen) return null;

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
              {session ? 'Edit Session' : 'Add Study Session'}
            </h3>
            <button onClick={onClose} style={styles.iconButton}>
              <X size={20} />
            </button>
          </div>         
          <div style={{ ...styles.grid, gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Subject
              </label>
              <select 
                value={formData.subjectId}
                onChange={(e) => setFormData({...formData, subjectId: parseInt(e.target.value)})}
                style={styles.select}
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                style={styles.input}
                placeholder="What will you study?"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  style={styles.input}
                  min="15"
                  max="240"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  style={styles.select}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={styles.select}
              >
                <option value="Lecture">Lecture</option>
                <option value="Exercise">Exercise</option>
                <option value="Project">Project</option>
                <option value="Revision">Revision</option>
                <option value="Exam Prep">Exam Prep</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem' }}>
              <button 
                onClick={handleSubmit} 
                style={{ ...styles.button, ...styles.primaryButton, flex: 1 }}
              >
                {session ? 'Update Session' : 'Add Session'}
              </button>
              <button 
                onClick={onClose} 
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Goal modal component (updated for MongoDB)
  const GoalModal = ({ isOpen, onClose, goal }) => {
    const [formData, setFormData] = useState({
      title: goal?.title || '',
      deadline: goal?.deadline || '',
      priority: goal?.priority || 'Medium',
      description: goal?.description || '',
      completed: goal?.completed || false
    });

    const handleSubmit = async () => {
      if (!formData.title.trim()) return;
      
      try {
        if (goal?._id) {
          await handleUpdateGoal(goal._id, formData);
        } else {
          await handleCreateGoal(formData);
        }
        onClose();
      } catch (error) {
        // Error handling is done in the CRUD functions
      }
    };

    if (!isOpen) return null;

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
              {goal ? 'Edit Goal' : 'Add Goal'}
            </h3>
            <button onClick={onClose} style={styles.iconButton}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ ...styles.grid, gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={styles.input}
                placeholder="e.g., Complete final project"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  style={styles.input}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  style={styles.select}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={styles.textarea}
                placeholder="Goal description..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem' }}>
              <button 
                onClick={handleSubmit} 
                style={{ ...styles.button, ...styles.primaryButton, flex: 1 }}
              >
                {goal ? 'Update' : 'Add'} Goal
              </button>
              <button 
                onClick={onClose} 
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Subject modal component (updated for MongoDB)
  const SubjectModal = ({ isOpen, onClose, subject }) => {
    const [formData, setFormData] = useState({
      name: subject?.name || '',
      code: subject?.code || '',
      color: subject?.color || '#3B82F6',
      credits: subject?.credits || 3,
      priority: subject?.priority || 'Medium',
      completed: subject?.completed || false,
      description: subject?.description || '',
      materials: subject?.materials || [],
      notes: subject?.notes || [],
      syllabus: subject?.syllabus || '',
      professor: subject?.professor || '',
      schedule: subject?.schedule || '',
      objectives: subject?.objectives || []
    });

    const handleSubmit = async () => {
      if (!formData.name.trim() || !formData.code.trim()) return;
      
      try {
        if (subject?._id) {
          await handleUpdateSubject(subject._id, formData);
        } else {
          await handleCreateSubject(formData);
        }
        onClose();
      } catch (error) {
        // Error handling is done in the CRUD functions
      }
    };

    if (!isOpen) return null;

    return (
      <div style={styles.modal}>
        <div style={{...styles.modalContent, width: '90%', maxWidth: '600px'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
              {subject ? 'Edit Subject' : 'Add Subject'}
            </h3>
            <button onClick={onClose} style={styles.iconButton}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ ...styles.grid, gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Subject Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={styles.input}
                placeholder="e.g., Advanced Algorithms"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  style={styles.input}
                  placeholder="e.g., AA"
                  maxLength={4}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Credits
                </label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                  style={styles.input}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  style={{...styles.input, height: '2.5rem'}}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  style={styles.select}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Course Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{...styles.textarea, height: '100px'}}
                placeholder="Course description and key information..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem' }}>
              <button 
                onClick={handleSubmit} 
                style={{ ...styles.button, ...styles.primaryButton, flex: 1 }}
              >
                {subject ? 'Update' : 'Add'} Subject
              </button>
              <button 
                onClick={onClose} 
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Notebook View (updated for MongoDB)
  const NotebookView = () => {
    
    const [activeSubjectId, setActiveSubjectId] = useState(subjects[0]?.id || null);
    const activeSubject = subjects.find(s => s.id === activeSubjectId);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [editorNoteId, setEditorNoteId] = useState(null);
    
    const [localSummary, setLocalSummary] = useState('');
    const [localNoteTitles, setLocalNoteTitles] = useState({});
    // Advanced search and filtering
      const [searchFilters, setSearchFilters] = useState({
        subjects: [],
        tags: [],
        dateRange: { start: '', end: '' },
        contentType: 'all' // all, notes, materials, summary
      });
    const [localNoteContents, setLocalNoteContents] = useState({});
    
    const [searchQuery, setSearchQuery] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
    // Sync local state with active subject
    useEffect(() => {
      if (activeSubject) {
        setLocalSummary(activeSubject.summary || '');
        const titles = {};
        const contents = {};
        (activeSubject.notes || []).forEach(note => {
          titles[note.id] = note.title || '';
          contents[note.id] = note.content || '';
        });
        setLocalNoteTitles(titles);
        setLocalNoteContents(contents);
      }
    }, [activeSubject?.id]);
  // Advanced search functionality
  const performAdvancedSearch = () => {
    if (!searchQuery.trim()) return subjects;
    
    const query = searchQuery.toLowerCase();
    return subjects.filter(subject => {
      // Search in subject name and description
      const subjectMatch = subject.name.toLowerCase().includes(query) || 
                          (subject.description || '').toLowerCase().includes(query);
      
      // Search in summary
      const summaryMatch = (subject.summary || '').toLowerCase().includes(query);
      
      // Search in notes
      const notesMatch = (subject.notes || []).some(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query) ||
        (note.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
      
      // Search in materials
      const materialsMatch = (subject.materials || []).some(material => 
        material.name.toLowerCase().includes(query)
      );
      
      return subjectMatch || summaryMatch || notesMatch || materialsMatch;
    });
  };
    const filteredSubjects = performAdvancedSearch();
  // Advanced analytics
  const getAnalytics = () => {
    const totalNotes = subjects.reduce((acc, s) => acc + (s.notes?.length || 0), 0);
    const totalMaterials = subjects.reduce((acc, s) => acc + (s.materials?.length || 0), 0);
    const totalTags = [...new Set(subjects.flatMap(s => s.notes?.flatMap(n => n.tags || []) || []))].length;
    const recentActivity = subjects.flatMap(s => 
      (s.notes || []).map(note => ({
        type: 'note',
        subject: s.name,
        title: note.title,
        date: note.date,
        id: note.id,
        questions: note.questions || '',
        summary: note.summary || ''
      }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    return {
      totalNotes,
      totalMaterials,
      totalTags,
      recentActivity,
      subjectsCount: subjects.length
    };
  };

  const analytics = getAnalytics();
 const updateSubject = async (updater) => {
  if (!activeSubject) return;
  try {
    console.log("Active Subject before update:", activeSubject);
    
    const updatedSubject = ensureSubjectProperties(updater(ensureSubjectProperties(activeSubject)));
     const previousScrollY = window.scrollY;
     
     
    // Remove MongoDB-specific fields before sending update
    const { __v, createdAt, updatedAt, ...subjectData } = updatedSubject;
    console.log(subjectData);
    const IDACT=subjectData.id
     console.log("IDACT",IDACT);
     
    await handleUpdateSubject(activeSubject._id, subjectData);
    
 // Update local subjects list without losing reference
    setSubjects(prev =>
      prev.map(s => s.id === IDACT ? { ...s, ...subjectData } : s)
    );

    // Keep same subject selected
    setActiveSubjectId(IDACT);
 requestAnimationFrame(() => {
        window.scrollTo(0, previousScrollY);
      });

  } catch (error) {
    console.error('Error updating subject:', error);
    addNotification(`Update failed: ${error.message}`, 'error');
  }
};

    const addNote = () => {
      updateSubject((s) => ({
        ...s,
        notes: [
          ...s.notes,
          {
             id:  Date.now() + Math.random(),
            title: 'New Note',
            content: '',
            date: new Date().toISOString(),
            tags: [],
            images: [],
            questions: '',
            summary: '',
            exercises: [],
            keyConcepts: '',
            flashcards: [],
            simpleExplanation: '',
            mindMap: '',
            mindMapData: null,
            quiz: ''
          }
        ]
      }));
    };

     const addTagToNote = (noteId, tag) => {
      if (!tag.trim()) return;
      updateSubject((s) => ({
        ...s,
        notes: s.notes.map(n => n.id === noteId ? { ...n, tags: [...(n.tags || []), tag.trim()] } : n)
      }));
    };

    const removeTagFromNote = (noteId, tagToRemove) => {
      updateSubject((s) => ({
        ...s,
        notes: s.notes.map(n => n.id === noteId ? { ...n, tags: (n.tags || []).filter(tag => tag !== tagToRemove) } : n)
      }));
    };

    const createNewTag = () => {
      if (!newTag.trim()) return;
      setAvailableTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    };

    // Export/Import functionality
    const exportData = () => {
      const dataToExport = {
        subjects,
        studyGoals,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `study-notebook-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const importData = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.subjects) setSubjects(importedData.subjects);
          if (importedData.studyGoals) setStudyGoals(importedData.studyGoals);
          if (importedData.settings) setSettings(importedData.settings);
          addNotification('Data imported successfully!', 'success');
        } catch (error) {
          addNotification('Error importing data. Please check the file format.', 'error');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    };
// Utility: call Groq API
const apikeygroq=process.env.REACT_APP_GROQ_API_KEY;
const callGroqAI = async (prompt) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apikeygroq}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",  // ✅ Fixed
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Groq API Error Response:", data);
      return `Error: ${data.error?.message || "Unknown error"}`;
    }
    
    return data.choices?.[0]?.message?.content?.trim() || "No response";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Error contacting AI.";
  }
};

// AI-powered summarization
const summarizeNote = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !note.content) return;

  const prompt = `Summarize the following note in 3-4 sentences:\n\n${note.content}`;
  const summary = await callGroqAI(prompt);
console.log("AI Summary:", summary);

  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { ...n, summary } : n)
  }));

  addNotification('Note summarized with AI!', 'success');
};

// AI-powered study questions
const generateStudyQuestions = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !note.content) return;

  const prompt = `Generate 4 study questions based on the following content:\n\n${note.content}`;
  const questionsText = await callGroqAI(prompt);
  console.log("AI Study Questions:", questionsText);
  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { 
      ...n, 
      questions: questionsText
    } : n)
  }));

  addNotification('Study questions generated with AI!', 'success');
};
const [exerciseInput, setExerciseInput] = useState('');
const [showFlashcards, setShowFlashcards] = useState(false);
const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
const [flashcardFlipped, setFlashcardFlipped] = useState(false);

// Enhanced AI Functions

// 1. Exercise Solution Generator
const solveExercise = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !exerciseInput.trim()) {
    addNotification('Please enter an exercise problem', 'warning');
    return;
  }

  addNotification('Solving exercise...', 'info');
  
  const prompt = `Solve this exercise step by step with detailed explanation:

Exercise: ${exerciseInput}

Context from notes: ${note.content.substring(0, 500)}

Provide:
1. Step-by-step solution
2. Key concepts used
3. Common mistakes to avoid
4. Similar practice problems`;

  const solution = await callGroqAI(prompt);
  console.log("AI Exercise Solution:", solution);
  
  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { 
      ...n, 
      exercises: [
        ...(n.exercises || []),
        {
          id: Date.now(),
          problem: exerciseInput,
          solution: solution,
          date: new Date().toISOString()
        }
      ]
    } : n)
  }));

  setExerciseInput('');
  addNotification('Exercise solved!', 'success');
};

// 2. Key Concepts Extractor
const extractKeyConcepts = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !note.content) return;

  addNotification('Extracting key concepts...', 'info');

  const prompt = `Extract the most important concepts from these notes. Format as bullet points with brief explanations:

${note.content}

Provide 5-7 key concepts that a student must understand.`;

  const concepts = await callGroqAI(prompt);
  
  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { 
      ...n, 
      keyConcepts: concepts
    } : n)
  }));

  addNotification('Key concepts extracted!', 'success');
};

// 3. Generate Flashcards
const generateFlashcards = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !note.content) return;

  addNotification('Generating flashcards...', 'info');

  const prompt = `Create 5 flashcards from these notes. Format each as:
FRONT: [question]
BACK: [answer]

Notes: ${note.content}

Make them clear, concise, and focused on key facts and concepts.`;

  const flashcardsText = await callGroqAI(prompt);
  
  // Parse flashcards
  const flashcards = [];
  const lines = flashcardsText.split('\n');
  let currentCard = {};
  
  lines.forEach(line => {
    if (line.startsWith('FRONT:')) {
      if (currentCard.front) flashcards.push(currentCard);
      currentCard = { front: line.replace('FRONT:', '').trim() };
    } else if (line.startsWith('BACK:')) {
      currentCard.back = line.replace('BACK:', '').trim();
    }
  });
  if (currentCard.front) flashcards.push(currentCard);

  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { 
      ...n, 
      flashcards: flashcards.map((fc, idx) => ({
        id: Date.now() + idx,
        ...fc
      }))
    } : n)
  }));

  addNotification('Flashcards generated!', 'success');
};

// 4. Explain Like I'm 5
const explainSimple = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !note.content) return;

  addNotification('Simplifying explanation...', 'info');

  const prompt = `Explain these notes in very simple terms, as if explaining to a 10-year-old. Use analogies and examples:

${note.content}

Make it engaging and easy to understand.`;

  const simpleExplanation = await callGroqAI(prompt);
  
  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { 
      ...n, 
      simpleExplanation
    } : n)
  }));

  addNotification('Simple explanation created!', 'success');
};

// 5. Mind Map Generator
const generateMindMap = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !note.content) return;

  addNotification('Creating mind map...', 'info');

  const prompt = `Analyze these notes and create a structured mind map in JSON format:

${note.content}

Return ONLY a valid JSON object with this structure:
{
  "topic": "Main Topic Title",
  "children": [
    {
      "topic": "Subtopic 1",
      "children": [
        {"topic": "Detail A"},
        {"topic": "Detail B"}
      ]
    },
    {
      "topic": "Subtopic 2",
      "children": [{"topic": "Detail C"}]
    }
  ]
}

Keep it organized, hierarchical, and focused on key concepts.`;

  const response = await callGroqAI(prompt);
  
  // Parse the JSON response
  let mindMapData;
  try {
    // Remove markdown code blocks if present
    let cleanResponse = response.trim();
    
    // Remove ```json and ``` markers
    cleanResponse = cleanResponse.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
    
    // Remove any leading/trailing whitespace and newlines
    cleanResponse = cleanResponse.trim();
    
    // Extract JSON object
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      mindMapData = JSON.parse(jsonMatch[0]);
    } else {
      console.error('No valid JSON found in response');
      mindMapData = null;
    }
  } catch (e) {
    console.error('Failed to parse mind map JSON:', e);
    console.log('Raw response:', response);
    mindMapData = null;
  }
  
  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { 
      ...n, 
      mindMap: response,
      mindMapData
      
    } : n)
  }));

  addNotification('Mind map created!', 'success');
};

// 6. Quiz Generator
const generateQuiz = async (noteId) => {
  const note = activeSubject.notes.find(n => n.id === noteId);
  if (!note || !note.content) return;

  addNotification('Generating quiz...', 'info');

  const prompt = `Create a 5-question multiple choice quiz from these notes:

${note.content}

Format each question as:
Q#: [question]
A) [option]
B) [option]
C) [option]
D) [option]
ANSWER: [correct letter]

Make questions challenging but fair.`;

  const quiz = await callGroqAI(prompt);
  
  updateSubject((s) => ({
    ...s,
    notes: s.notes.map(n => n.id === noteId ? { 
      ...n, 
      quiz
    } : n)
  }));

  addNotification('Quiz generated!', 'success');
};

// Helper function to copy text to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    addNotification('Copied to clipboard!', 'success');
  }).catch(() => {
    addNotification('Failed to copy', 'error');
  });
};

// Flashcard Navigation
const nextFlashcard = () => {
  const note = activeSubject.notes.find(n => n.id === showFlashcards);
  if (!note?.flashcards) return;
  setFlashcardFlipped(false);
  setCurrentFlashcardIndex((prev) => (prev + 1) % note.flashcards.length);
};

const prevFlashcard = () => {
  const note = activeSubject.notes.find(n => n.id === showFlashcards);
  if (!note?.flashcards) return;
  setFlashcardFlipped(false);
  setCurrentFlashcardIndex((prev) => (prev - 1 + note.flashcards.length) % note.flashcards.length);
};


  const handleAddMaterialFile = (file) => {
  const maxBytes = 5 * 1024 * 1024; // 5MB max for materials
  if (file.size > maxBytes) {
    addNotification('File too large (max 5MB). Please use smaller files.', 'warning');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onerror = () => {
    addNotification('Error reading file. Please try again.', 'error');
  };
  
  reader.onload = (e) => {
    try {
      updateSubject((s) => ({
        ...s,
        materials: [
          ...s.materials,
          {
            id:  Date.now() ,
            name: file.name,
            type: file.type,
            content: e.target.result,
            date: new Date().toISOString(),
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding material:', error);
      addNotification('Failed to add material', 'error');
    }
  };
  
  reader.readAsDataURL(file);
};

 const handleAddNoteImage = (noteId, file) => {
  const maxBytes = 1024 * 1024 * 1.5; // ~1.5MB per image
  if (file.size > maxBytes) {
    addNotification('Image too large (max 1.5MB). Please compress first.', 'warning');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onerror = () => {
    addNotification('Error reading file. Please try again.', 'error');
  };
  
  reader.onload = (e) => {
    try {
      updateSubject((s) => ({
        ...s,
        notes: s.notes.map(n => n.id === noteId ? {
          ...n,
          images: [...(n.images || []), {
            id:  Date.now() ,
            name: file.name,
            type: file.type,
            dataUrl: e.target.result,
            date: new Date().toISOString()
          }]
        } : n)
      }));
    } catch (error) {
      console.error('Error adding image:', error);
      addNotification('Failed to add image', 'error');
    }
  };
  
  reader.readAsDataURL(file);
};

    if (!activeSubject) {
      return (
        <div style={styles.card}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>No subjects available. Add a subject to start your notebook.</p>
        </div>
      );
    }

     return (
       <>
       {/* Advanced Search Bar */}
       <div style={styles.card}>
         <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
           <div style={{ position: 'relative', flex: 1 }}>
             <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: settings.darkMode ? '#9ca3af' : '#6b7280' }} />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search notes, subjects, content..."
               style={{ ...styles.input, paddingLeft: '2.5rem', width: '100%' }}
             />
           </div>
           <button 
             onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
             style={{ ...styles.button, ...styles.secondaryButton }}
           >
             <Filter size={16} /> Filters
           </button>
         </div>
         
         {showAdvancedSearch && (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb', borderRadius: '0.5rem', marginBottom: '1rem' }}>
             <div>
               <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Subject</label>
               <select 
                 value={searchFilters.subjects[0] || ''}
                 onChange={(e) => setSearchFilters(prev => ({ ...prev, subjects: e.target.value ? [e.target.value] : [] }))}
                 style={styles.select}
               >
                 <option value="">All Subjects</option>
                 {subjects.map(s => (
                   <option key={s.id} value={s.id}>{s.name}</option>
                 ))}
               </select>
             </div>
             <div>
               <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Content Type</label>
               <select 
                 value={searchFilters.contentType}
                 onChange={(e) => setSearchFilters(prev => ({ ...prev, contentType: e.target.value }))}
                 style={styles.select}
               >
                 <option value="all">All Content</option>
                 <option value="notes">Notes Only</option>
                 <option value="materials">Materials Only</option>
                 <option value="summary">Summary Only</option>
               </select>
             </div>
             <div>
               <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>From Date</label>
               <input
                 type="date"
                 value={searchFilters.dateRange.start}
                 onChange={(e) => setSearchFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
                 style={styles.input}
               />
             </div>
             <div>
               <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>To Date</label>
               <input
                 type="date"
                 value={searchFilters.dateRange.end}
                 onChange={(e) => setSearchFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
                 style={styles.input}
               />
             </div>
           </div>
         )}
       </div>
 
       {/* Analytics Panel */}
       <div style={styles.card}>
         <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Study Analytics</h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
           <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb', borderRadius: '0.5rem' }}>
             <BookOpen size={24} style={{ color: '#3b82f6', marginBottom: '0.5rem' }} />
             <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: settings.darkMode ? '#f9fafb' : '#1f2937' }}>{analytics.subjectsCount}</div>
             <div style={{ fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>Subjects</div>
           </div>
           <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb', borderRadius: '0.5rem' }}>
             <FileText size={24} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
             <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: settings.darkMode ? '#f9fafb' : '#1f2937' }}>{analytics.totalNotes}</div>
             <div style={{ fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>Notes</div>
           </div>
           <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb', borderRadius: '0.5rem' }}>
             <File size={24} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
             <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: settings.darkMode ? '#f9fafb' : '#1f2937' }}>{analytics.totalMaterials}</div>
             <div style={{ fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>Materials</div>
           </div>
           <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb', borderRadius: '0.5rem' }}>
             <Tag size={24} style={{ color: '#8b5cf6', marginBottom: '0.5rem' }} />
             <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: settings.darkMode ? '#f9fafb' : '#1f2937' }}>{analytics.totalTags}</div>
             <div style={{ fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>Tags</div>
           </div>
         </div>
         
         {analytics.recentActivity.length > 0 && (
           <div>
             <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Recent Activity</h4>
             <div style={{ display: 'grid', gap: '0.5rem' }}>
               {analytics.recentActivity.map(activity => (
                 <div key={activity.id} style={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '0.5rem', 
                   padding: '0.5rem', 
                   backgroundColor: settings.darkMode ? '#374151' : '#f3f4f6', 
                   borderRadius: '0.375rem',
                   fontSize: '0.875rem'
                 }}>
                   <BookOpen size={14} style={{ color: settings.darkMode ? '#9ca3af' : '#6b7280' }} />
                   <span style={{ flex: 1 }}>{activity.title}</span>
                   <span style={{ fontSize: '0.75rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                     {new Date(activity.date).toLocaleDateString()}
                   </span>
                 </div>
               ))}
             </div>
           </div>
         )}
       </div>
 
       <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1rem' }}>
         {/* Subject list */}
         <div style={styles.card}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
             <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Notebook</h3>
             <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button onClick={exportData} style={{ ...styles.button, ...styles.secondaryButton }}>
                 <Download size={16} />
               </button>
               <label style={{ ...styles.button, ...styles.secondaryButton, cursor: 'pointer' }}>
                 <Upload size={16} />
                 <input type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
               </label>
               <button onClick={addNote} style={{ ...styles.button, ...styles.primaryButton }}>
                 <Plus size={16} />
               </button>
             </div>
           </div>
           <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
             {filteredSubjects.map(s => (
               <button
                 key={s.id}
                 onClick={() => setActiveSubjectId(s.id)}
                 style={{
                   ...styles.navButton,
                   display: 'flex',
                   justifyContent: 'space-between',
                   backgroundColor: activeSubjectId === s.id ? '#dbeafe' : 'transparent',
                   color: activeSubjectId === s.id ? '#2563eb' : (settings.darkMode ? '#d1d5db' : '#374151')
                 }}
               >
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: s.color }} />
                   {s.name}
                 </span>
                 <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{(s.notes || []).length}</span>
               </button>
             ))}
           </div>
         </div>
 
         {/* Editor area */}
         <div style={{ display: 'grid', gap: '1rem' }}>
           {/* Summary */}
           <div style={styles.notebookCard}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Course Summary</h3>
             </div>
             <div style={styles.notebookMargin}>
               <textarea
                 value={localSummary}
                 onChange={(e) => setLocalSummary(e.target.value)}
                 onBlur={() => {
                   if ((activeSubject.summary || '') !== (localSummary || '')) {
                     updateSubject((s) => ({ ...s, summary: localSummary }));
                   }
                 }}
                 style={{ ...styles.notebookTextarea, height: '120px' }}
                 placeholder="High-level summary of this course..."
               />
             </div>
           </div>
 
           {/* Materials */}
           <div style={styles.card}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Course Materials</h3>
               <label style={{ ...styles.button, ...styles.secondaryButton, cursor: 'pointer' }}>
                 <Upload size={16} /> Upload
                 <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAddMaterialFile(f); e.target.value = ''; }} />
               </label>
             </div>
             <div style={{ display: 'grid', gap: '0.5rem' }}>
               {(activeSubject.materials || []).map(mat => (
                 <div key={mat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '0.375rem' }}>
                   <File size={16} />
                   <span style={{ flex: 1, fontSize: '0.875rem' }}>{mat.name}</span>
                   {mat.content?.startsWith('data:image') && (
                     <img src={mat.content} alt={mat.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '0.25rem' }} />
                   )}
                   <a href={mat.content || mat.url} target="_blank" rel="noreferrer" style={{ ...styles.button, ...styles.secondaryButton, textDecoration: 'none', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                     <FileText size={14} /> Open
                   </a>
                   <button onClick={() => updateSubject((s) => ({ ...s, materials: s.materials.filter(m => m.id !== mat.id) }))} style={styles.iconButton}>
                     <Trash2 size={14} />
                   </button>
                 </div>
               ))}
             {(activeSubject.materials || []).length === 0 && (
                 <p style={{ margin: 0, fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>No materials yet.</p>
               )}
             </div>
           </div>
 
           {/* Notes */}
           <div style={styles.notebookCard}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Notes</h3>
               <button onClick={addNote} style={{ ...styles.button, ...styles.primaryButton }}>
                 <Plus size={16} /> Add Note
               </button>
             </div>
             <div style={{ display: 'grid', gap: '0.75rem' }}>
               {(activeSubject.notes || []).map(note => (
                 <div key={note.id} style={{ padding: '1.5rem', border: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '0.5rem', backgroundColor: settings.darkMode ? '#1f2937' : '#fefefe', position: 'relative', backgroundImage: settings.darkMode ? 'none' : 'linear-gradient(to bottom, transparent 0%, transparent 24px, #e5e7eb 24px, #e5e7eb 25px, transparent 25px, transparent 49px, #e5e7eb 49px, #e5e7eb 50px, transparent 50px)', backgroundSize: '100% 25px', backgroundPosition: '0 0', backgroundRepeat: 'repeat-y' }}>
                   <div style={styles.notebookMargin}>
                     <input
                       type="text"
                       value={localNoteTitles[note.id] || ''}
                       onChange={(e) => setLocalNoteTitles(prev => ({ ...prev, [note.id]: e.target.value }))}
                       onBlur={() => {
                         if ((note.title || '') !== (localNoteTitles[note.id] || '')) {
                           updateSubject((s) => ({ ...s, notes: s.notes.map(n => n.id === note.id ? { ...n, title: localNoteTitles[note.id] || '' } : n) }));
                         }
                       }}
                       style={{ ...styles.notebookInput, marginBottom: '1rem' }}
                       placeholder="Note title"
                     />
                     <textarea
                       value={localNoteContents[note.id] || ''}
                       onChange={(e) => setLocalNoteContents(prev => ({ ...prev, [note.id]: e.target.value }))}
                       onBlur={() => {
                         if ((note.content || '') !== (localNoteContents[note.id] || '')) {
                           updateSubject((s) => ({ ...s, notes: s.notes.map(n => n.id === note.id ? { ...n, content: localNoteContents[note.id] || '' } : n) }));
                         }
                       }}
                       style={{ ...styles.notebookTextarea, height: '120px' }}
                       placeholder="Write your note..."
                     />
                   </div>
               {/* AI Summary */}
                   {note.summary && (
                     <div style={{ 
                       marginTop: '0.75rem', 
                       padding: '0.75rem', 
                       backgroundColor: settings.darkMode ? '#064e3b' : '#f0fdf4', 
                       borderLeft: '3px solid #10b981',
                       borderRadius: '0.375rem'
                     }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                         <Brain size={14} color="#10b981" />
                         <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#10b981' }}>AI Summary</span>
                       </div>
                       <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>{note.summary}</p>
                     </div>
                   )}
 
                   {/* AI Study Questions */}
                   {note.questions && (
                     <div style={{ 
                       marginTop: '0.75rem', 
                       padding: '0.75rem', 
                       backgroundColor: settings.darkMode ? '#1e3a8a' : '#dbeafe', 
                       borderLeft: '3px solid #3b82f6',
                       borderRadius: '0.375rem'
                     }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                         <Target size={14} color="#3b82f6" />
                         <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#3b82f6' }}>Study Questions</span>
                       </div>
                       <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>{note.questions}</p>
                     </div>
                  )}

{/* Key Concepts */}
{note.keyConcepts && (
  <div style={{ 
    marginTop: '0.75rem', 
    padding: '0.75rem', 
    backgroundColor: settings.darkMode ? '#4c1d95' : '#f5f3ff', 
    borderLeft: '3px solid #8b5cf6',
    borderRadius: '0.375rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <Lightbulb size={14} color="#8b5cf6" />
      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#8b5cf6' }}>Key Concepts</span>
    </div>
    <div style={{ fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
      {note.keyConcepts}
    </div>
  </div>
)}

{/* Simple Explanation */}
{note.simpleExplanation && (
  <div style={{ 
    marginTop: '0.75rem', 
    padding: '0.75rem', 
    backgroundColor: settings.darkMode ? '#1e3a8a' : '#dbeafe', 
    borderLeft: '3px solid #3b82f6',
    borderRadius: '0.375rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <BookOpen size={14} color="#3b82f6" />
      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#3b82f6' }}>Simple Explanation</span>
    </div>
    <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>{note.simpleExplanation}</p>
  </div>
)}

{/* Mind Map */}
{note.mindMapData && (
  <AdvancedMindMap 
    mindMapData={note.mindMapData} 
    darkMode={settings.darkMode} 
  />
)}

{/* Quiz */}
{note.quiz && (
  <div style={{ 
    marginTop: '0.75rem', 
    padding: '0.75rem', 
    backgroundColor: settings.darkMode ? '#7c2d12' : '#fef2f2', 
    borderLeft: '3px solid #ef4444',
    borderRadius: '0.375rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <HelpCircle size={14} color="#ef4444" />
      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#ef4444' }}>Practice Quiz</span>
    </div>
    <pre style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
      {note.quiz}
    </pre>
  </div>
)}

{/* Exercise Input Section - Add before the action buttons */}
<div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb', borderRadius: '0.375rem' }}>
  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>
    Exercise Problem:
  </label>
  <textarea
    value={exerciseInput}
    onChange={(e) => setExerciseInput(e.target.value)}
    placeholder="Enter your exercise or problem here..."
    style={{ ...styles.input, minHeight: '60px', fontSize: '0.875rem' }}
  />
</div>
 {/* Exercise Solutions */}
{note.exercises && note.exercises.length > 0 && (
  <div style={{ marginTop: '0.75rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <FaCalculator size={14} color="#f59e0b" />
      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#f59e0b' }}>Exercise Solutions</span>
    </div>
    {note.exercises.map((ex, idx) => (
      <div key={ex.id} style={{ 
        marginBottom: '0.75rem',
        padding: '0.75rem', 
        backgroundColor: settings.darkMode ? '#422006' : '#fffbeb', 
        borderLeft: '3px solid #f59e0b',
        borderRadius: '0.375rem'
      }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#f59e0b' }}>
          Problem {idx + 1}:
        </div>
        <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
          {ex.problem}
        </div>
        <div style={{ fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
          {ex.solution}
        </div>
        <button 
          onClick={() => updateSubject((s) => ({
            ...s,
            notes: s.notes.map(n => n.id === note.id ? {
              ...n,
              exercises: n.exercises.filter(e => e.id !== ex.id)
            } : n)
          }))}
          style={{ ...styles.button, ...styles.secondaryButton, marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
        >
          <Trash2 size={12} /> Remove
        </button>
      </div>
    ))}
  </div>
)}

{/* Enhanced Action Buttons - Replace existing action buttons */}
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
  <label style={{ ...styles.button, ...styles.secondaryButton, cursor: 'pointer' }}>
    <Image size={16} /> Image
    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAddNoteImage(note.id, f); e.target.value = ''; }} />
  </label>
  
  <button onClick={() => summarizeNote(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <Brain size={16} /> Summary
  </button>
  
  <button onClick={() => generateStudyQuestions(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <Target size={16} /> Questions
  </button>
  
  <button onClick={() => solveExercise(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <FaCalculator size={16} /> Solve
  </button>
  
  <button onClick={() => extractKeyConcepts(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <Lightbulb size={16} /> Concepts
  </button>
  
  <button onClick={() => generateFlashcards(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <CreditCard size={16} /> Flashcards
  </button>
  
  <button onClick={() => explainSimple(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <BookOpen size={16} /> ELI5
  </button>
  
  <button onClick={() => generateMindMap(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <FaNetworkWired size={16} /> Mind Map
  </button>
  
  <button onClick={() => generateQuiz(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <HelpCircle size={16} /> Quiz
  </button>
  
  <button onClick={() => setEditorNoteId(note.id)} style={{ ...styles.button, ...styles.secondaryButton }}>
    <Edit2 size={16} /> Open
  </button>
  
  <button onClick={() => updateSubject((s) => ({ ...s, notes: s.notes.filter(n => n.id !== note.id) }))} style={{ ...styles.button, ...styles.secondaryButton }}>
    <Trash2 size={16} /> Delete
  </button>
  
  {note.flashcards && note.flashcards.length > 0 && (
    <button onClick={() => setShowFlashcards(note.id)} style={{ ...styles.button, ...styles.primaryButton }}>
      <CreditCard size={16} /> View Cards ({note.flashcards.length})
    </button>
  )}
</div>

{/* Flashcard Modal - Add at the end before closing the NotebookView component */}
{showFlashcards && (() => {
  const note = activeSubject.notes.find(n => n.id === showFlashcards);
  if (!note?.flashcards?.length) return null;
  const card = note.flashcards[currentFlashcardIndex];
  
  return (
    <div style={styles.modal} onClick={() => setShowFlashcards(false)}>
      <div style={{ ...styles.modalContent, width: 'min(90vw, 600px)', maxHeight: '80vh' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
            Flashcard {currentFlashcardIndex + 1} of {note.flashcards.length}
          </h3>
          <button onClick={() => setShowFlashcards(false)} style={styles.iconButton}>
            <X size={18} />
          </button>
        </div>
        
        <div 
          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
          style={{ 
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            border: `2px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
              {flashcardFlipped ? 'ANSWER' : 'QUESTION'}
            </div>
            <div style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
              {flashcardFlipped ? card.back : card.front}
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '1rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
              Click to flip
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={prevFlashcard} style={{ ...styles.button, ...styles.secondaryButton }}>
            <ChevronLeft size={16} /> Previous
          </button>
          <button onClick={nextFlashcard} style={{ ...styles.button, ...styles.secondaryButton }}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
})()}

                   {/* Tags */}
                   <div style={{ marginTop: '0.75rem' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                       {(note.tags || []).map(tag => (
                         <span key={tag} style={{ 
                           display: 'inline-flex', 
                           alignItems: 'center', 
                           gap: '0.25rem', 
                           padding: '0.25rem 0.5rem', 
                           backgroundColor: settings.darkMode ? '#374151' : '#e5e7eb', 
                           borderRadius: '0.375rem', 
                           fontSize: '0.75rem',
                           color: settings.darkMode ? '#f9fafb' : '#374151'
                         }}>
                           {tag}
                           <button 
                             onClick={() => removeTagFromNote(note.id, tag)}
                             style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                           >
                             <X size={12} />
                           </button>
                         </span>
                       ))}
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                       <input
                         type="text"
                         placeholder="Add tag..."
                         value={newTag}
                         onChange={(e) => setNewTag(e.target.value)}
                         onKeyPress={(e) => e.key === 'Enter' && addTagToNote(note.id, newTag)}
                         style={{ ...styles.input, fontSize: '0.75rem', padding: '0.25rem 0.5rem', flex: 1 }}
                       />
                       <button 
                         onClick={() => addTagToNote(note.id, newTag)}
                         style={{ ...styles.button, ...styles.secondaryButton, padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                       >
                         <Plus size={12} />
                       </button>
                     </div>
                   </div>
                   
                   {/* Images preview */}
                   {note.images && note.images.length > 0 && (
                     <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                       {note.images.map(img => (
                         <div key={img.id} style={{ position: 'relative' }}>
                           <img onClick={() => setLightboxImage(img)} src={img.dataUrl} alt={img.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '0.25rem', border: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`, cursor: 'zoom-in' }} />
                           <button onClick={() => updateSubject((s) => ({ ...s, notes: s.notes.map(n => n.id === note.id ? { ...n, images: n.images.filter(i => i.id !== img.id) } : n) }))} style={{ ...styles.iconButton, position: 'absolute', top: 2, right: 2, backgroundColor: settings.darkMode ? '#111827' : 'white' }}>
                             <X size={12} />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               ))}
               {(activeSubject.notes || []).length === 0 && (
                 <p style={{ margin: 0, fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>No notes yet.</p>
               )}
             </div>
           </div>
         </div>
       </div>
       {/* Lightbox for images */}
       {lightboxImage && (
         <div style={styles.modal} onClick={() => setLightboxImage(null)}>
           <div style={{ ...styles.modalContent, width: 'min(90vw, 900px)' }} onClick={(e) => e.stopPropagation()}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
               <span style={{ fontSize: '0.875rem' }}>{lightboxImage.name}</span>
               <button onClick={() => setLightboxImage(null)} style={styles.iconButton}><X size={18} /></button>
             </div>
             <img src={lightboxImage.dataUrl} alt={lightboxImage.name} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '0.5rem' }} />
             <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
               <a href={lightboxImage.dataUrl} target="_blank" rel="noreferrer" style={{ ...styles.button, ...styles.primaryButton, textDecoration: 'none' }}>
                 <Download size={16} /> Open in new tab
               </a>
             </div>
           </div>
         </div>
       )}
 
       {/* Fullscreen Advanced Editor */}
       {editorNoteId && (() => {
         const note = activeSubject.notes.find(n => n.id === editorNoteId);
         if (!note) return null;
         return (
           <div style={styles.modal}>
             <div style={{ ...styles.modalContent, width: 'min(95vw, 1000px)', maxHeight: '90vh', ...styles.notebookCard }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                 <div style={styles.notebookMargin}>
                   <input
                     type="text"
                     value={localNoteTitles[note.id] || ''}
                     onChange={(e) => setLocalNoteTitles(prev => ({ ...prev, [note.id]: e.target.value }))}
                     onBlur={() => {
                       if ((note.title || '') !== (localNoteTitles[note.id] || '')) {
                         updateSubject((s) => ({ ...s, notes: s.notes.map(n => n.id === note.id ? { ...n, title: localNoteTitles[note.id] || '' } : n) }));
                       }
                     }}
                     style={{ ...styles.notebookInput, fontSize: '1.25rem' }}
                     placeholder="Note title"
                   />
                 </div>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <label style={{ ...styles.button, ...styles.secondaryButton, cursor: 'pointer' }}>
                     <Image size={16} /> Add Image
                     <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAddNoteImage(note.id, f); e.target.value = ''; }} />
                   </label>
                   <button onClick={() => setEditorNoteId(null)} style={{ ...styles.button, ...styles.primaryButton }}>
                     <Save size={16} /> Close
                   </button>
                 </div>
               </div>
               <div style={styles.notebookMargin}>
                 <textarea
                   value={localNoteContents[note.id] || ''}
                   onChange={(e) => setLocalNoteContents(prev => ({ ...prev, [note.id]: e.target.value }))}
                   onBlur={() => {
                     if ((note.content || '') !== (localNoteContents[note.id] || '')) {
                       updateSubject((s) => ({ ...s, notes: s.notes.map(n => n.id === note.id ? { ...n, content: localNoteContents[note.id] || '' } : n) }));
                     }
                   }}
                   style={{ ...styles.notebookTextarea, height: '50vh' }}
                   placeholder="Write your detailed note with summary, key points, etc..."
                 />
               </div>
               {note.images?.length > 0 && (
                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                   {note.images.map(img => (
                     <div key={img.id} style={{ position: 'relative' }}>
                       <img onClick={() => setLightboxImage(img)} src={img.dataUrl} alt={img.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '0.25rem', border: `1px solid ${settings.darkMode ? '#374151' : '#e5e7eb'}`, cursor: 'zoom-in' }} />
                       <button onClick={() => updateSubject((s) => ({ ...s, notes: s.notes.map(n => n.id === note.id ? { ...n, images: n.images.filter(i => i.id !== img.id) } : n) }))} style={{ ...styles.iconButton, position: 'absolute', top: 2, right: 2, backgroundColor: settings.darkMode ? '#111827' : 'white' }}>
                         <X size={12} />
                       </button>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
         );
       })()}
       </>
     );
  };

const MindMapNode = ({ node, level = 0, parentColor, isExpanded, onToggle, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(true);
  
  const colors = [
    { bg: '#3b82f6', light: '#dbeafe', glow: 'rgba(59, 130, 246, 0.3)' },
    { bg: '#10b981', light: '#d1fae5', glow: 'rgba(16, 185, 129, 0.3)' },
    { bg: '#f59e0b', light: '#fef3c7', glow: 'rgba(245, 158, 11, 0.3)' },
    { bg: '#ef4444', light: '#fee2e2', glow: 'rgba(239, 68, 68, 0.3)' },
    { bg: '#8b5cf6', light: '#ede9fe', glow: 'rgba(139, 92, 246, 0.3)' },
    { bg: '#ec4899', light: '#fce7f3', glow: 'rgba(236, 72, 153, 0.3)' },
  ];
  
  const color = parentColor || colors[level % colors.length];
  const hasChildren = node.children && node.children.length > 0;
  const expanded = localExpanded && isExpanded;
  
  const nodeStyle = {
    position: 'relative',
    marginBottom: level === 0 ? '2rem' : '1rem',
    marginLeft: level > 0 ? '2rem' : '0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };
  
  const cardStyle = {
    background: darkMode 
      ? (level === 0 ? `linear-gradient(135deg, ${color.bg} 0%, ${color.bg}dd 100%)` : '#1f2937')
      : (level === 0 ? `linear-gradient(135deg, ${color.bg} 0%, ${color.bg}ee 100%)` : '#ffffff'),
    border: level === 0 ? 'none' : `2px solid ${color.bg}`,
    borderRadius: level === 0 ? '16px' : '12px',
    padding: level === 0 ? '1.5rem 2rem' : '1rem 1.5rem',
    cursor: hasChildren ? 'pointer' : 'default',
    transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovered 
      ? `0 12px 24px ${color.glow}, 0 0 0 2px ${color.bg}33`
      : level === 0 
        ? `0 8px 16px ${color.glow}`
        : `0 4px 8px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };
  
  const textStyle = {
    color: level === 0 ? '#ffffff' : (darkMode ? '#e5e7eb' : '#1f2937'),
    fontSize: level === 0 ? '1.25rem' : level === 1 ? '1.1rem' : '1rem',
    fontWeight: level === 0 ? '700' : level === 1 ? '600' : '500',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    position: 'relative',
    zIndex: 1,
  };
  
  const iconStyle = {
    fontSize: level === 0 ? '1.5rem' : '1rem',
    opacity: 0.9,
  };

  const handleClick = () => {
    if (hasChildren) {
      setLocalExpanded(!localExpanded);
      if (onToggle) onToggle();
    }
  };

  return (
    <div style={nodeStyle}>
      {level > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '-2rem',
            top: '1.5rem',
            width: '2rem',
            height: '2px',
            background: `linear-gradient(90deg, ${color.bg} 0%, transparent 100%)`,
            opacity: 0.5,
          }}
        />
      )}
      
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {level === 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at top right, ${color.glow}, transparent 70%)`,
              opacity: 0.3,
              pointerEvents: 'none',
            }}
          />
        )}
        
        <div style={textStyle}>
          {level === 0 ? (
            <FaBrain style={iconStyle} />
          ) : (
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: color.bg,
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ flex: 1 }}>{node.topic}</span>
          {hasChildren && (
            <div style={{ 
              transition: 'transform 0.3s ease',
              transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              color: level === 0 ? '#ffffff' : color.bg,
            }}>
              <FaChevronDown size={14} />
            </div>
          )}
        </div>
      </div>
      
      {hasChildren && expanded && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingLeft: '0.5rem',
            borderLeft: `2px solid ${color.bg}33`,
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          {node.children.map((child, idx) => (
            <MindMapNode
              key={idx}
              node={child}
              level={level + 1}
              parentColor={color}
              isExpanded={expanded}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AdvancedMindMap = ({ mindMapData, darkMode = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [globalExpanded, setGlobalExpanded] = useState(true);

  if (!mindMapData) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: darkMode ? '#9ca3af' : '#6b7280',
        background: darkMode ? '#1f2937' : '#f9fafb',
        borderRadius: '12px',
        border: `2px dashed ${darkMode ? '#374151' : '#e5e7eb'}`,
      }}>
        <FaBrain size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <p style={{ margin: 0, fontSize: '0.875rem' }}>Mind map data not available</p>
      </div>
    );
  }

  const containerStyle = {
    marginTop: '1rem',
    padding: isFullscreen ? '2rem' : '1.5rem',
    background: darkMode 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: isFullscreen ? '0' : '16px',
    border: isFullscreen ? 'none' : `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    position: isFullscreen ? 'fixed' : 'relative',
    top: isFullscreen ? 0 : 'auto',
    left: isFullscreen ? 0 : 'auto',
    right: isFullscreen ? 0 : 'auto',
    bottom: isFullscreen ? 0 : 'auto',
    zIndex: isFullscreen ? 9999 : 'auto',
    overflow: isFullscreen ? 'auto' : 'visible',
    maxHeight: isFullscreen ? '100vh' : '600px',
    overflowY: isFullscreen ? 'auto' : 'auto',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FaNetworkWired size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '700',
                color: darkMode ? '#f1f5f9' : '#1e293b',
              }}>
                Interactive Mind Map
              </h3>
              <p style={{
                margin: 0,
                fontSize: '0.75rem',
                color: darkMode ? '#94a3b8' : '#64748b',
                marginTop: '0.25rem',
              }}>
                Click nodes to expand/collapse
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setGlobalExpanded(!globalExpanded)}
              style={{
                background: darkMode ? '#334155' : '#ffffff',
                border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: darkMode ? '#e2e8f0' : '#1e293b',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              {globalExpanded ? 'Collapse All' : 'Expand All'}
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <MindMapNode 
            node={mindMapData} 
            level={0} 
            isExpanded={globalExpanded}
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
};


  // Dashboard View (updated for MongoDB)
  const DashboardView = () => {
    const todaySessions = scheduleData.filter(session => session.date === selectedDate).length;
    const completedToday = scheduleData.filter(session => session.date === selectedDate && session.completed).length;
    const completionRate = todaySessions > 0 ? Math.round((completedToday / todaySessions) * 100) : 0;

    const handleCompleteSession = async (sessionId, completed) => {
      try {
        const session = scheduleData.find(s => s._id === sessionId);
        if (session) {
          await handleUpdateSchedule(sessionId, { ...session, completed });
        }
      } catch (error) {
        // Error handling is done in the CRUD function
      }
    };

    const handleDeleteSession = async (sessionId) => {
      try {
        await handleDeleteSchedule(sessionId);
      } catch (error) {
        // Error handling is done in the CRUD function
      }
    };

    const handleCompleteGoal = async (goalId, completed) => {
      try {
        const goal = studyGoals.find(g => g._id === goalId);
        if (goal) {
          await handleUpdateGoal(goalId, { ...goal, completed });
        }
      } catch (error) {
        // Error handling is done in the CRUD function
      }
    };

    return (
      <div style={{ ...styles.grid, gap: '1.5rem' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{
            ...styles.card,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Today's Sessions</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0 0' }}>{todaySessions}</p>
              </div>
              <BookOpen size={24} />
            </div>
          </div>
          
          {/* ... other stat cards ... */}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Today's Schedule */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Today's Schedule</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  style={{...styles.select, width: 'auto', fontSize: '0.75rem'}}
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.code}</option>
                  ))}
                </select>
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  style={{...styles.select, width: 'auto', fontSize: '0.75rem'}}
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            
            <div style={{ maxHeight: '24rem', overflowY: 'auto' }}>
              {timeSlots.map(time => {
                const session = currentDaySchedule[time];
                const filteredSessions = getFilteredSessions();
                const shouldShow = !session || filteredSessions.some(([t, s]) => t === time);
                
                if (!shouldShow && session) return null;
                
                return (
                  <div key={time} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem', 
                    padding: '0.5rem 0',
                    borderBottom: `1px solid ${settings.darkMode ? '#374151' : '#f3f4f6'}`
                  }}>
                    <div style={{ 
                      width: '4rem', 
                      fontSize: '0.875rem', 
                      color: settings.darkMode ? '#9ca3af' : '#6b7280',
                      fontFamily: 'monospace' 
                    }}>
                      {time}
                    </div>
                    <div style={{ flex: 1 }}>
                      {session ? (
                        <StudySession 
                          session={session} 
                          timeSlot={time}
                          onEdit={(s) => { setEditingSession(s); setShowAddModal(true); }}
                          onDelete={handleDeleteSession}
                          onComplete={handleCompleteSession}
                        />
                      ) : (
                        <button 
                          onClick={() => { setEditingSession({timeSlot: time}); setShowAddModal(true); }}
                          style={{
                            color: settings.darkMode ? '#9ca3af' : '#6b7280',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={16} /> Add session
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Goals */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Study Goals</h3>
              <button 
                onClick={() => setShowGoalModal(true)}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                <Target size={16} /> Add Goal
              </button>
            </div>
            
            <div style={{ ...styles.grid, gap: '0.75rem' }}>
              {studyGoals.map(goal => (
                <div 
                  key={goal._id} 
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: goal.completed ? 
                      (settings.darkMode ? '#064e3b' : '#f0fdf4') : 
                      (settings.darkMode ? '#374151' : '#f9fafb'),
                    border: `1px solid ${
                      goal.priority === 'Critical' ? '#ef4444' :
                      goal.priority === 'High' ? '#f59e0b' :
                      goal.priority === 'Medium' ? '#3b82f6' : '#6b7280'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontWeight: '600', 
                        fontSize: '0.875rem', 
                        margin: 0,
                        textDecoration: goal.completed ? 'line-through' : 'none'
                      }}>
                        {goal.title}
                      </h4>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: settings.darkMode ? '#9ca3af' : '#6b7280', 
                        margin: '0.25rem 0' 
                      }}>
                        Due: {new Date(goal.deadline).toLocaleDateString()} • {goal.priority} Priority
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button 
                        onClick={() => handleCompleteGoal(goal._id, !goal.completed)}
                        style={{
                          ...styles.iconButton,
                          color: goal.completed ? '#22c55e' : (settings.darkMode ? '#9ca3af' : '#6b7280')
                        }}
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button 
                        onClick={() => { setEditingGoal(goal); setShowGoalModal(true); }}
                        style={styles.iconButton}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteGoal(goal._id)}
                        style={styles.iconButton}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calendar View (updated for MongoDB)
  const CalendarView = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const navigateMonth = (direction) => {
      if (direction === 'prev') {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
    };

    // Get session count for a specific date
    const getSessionCountForDate = (dateStr) => {
      return scheduleData.filter(session => session.date === dateStr).length;
    };

    const getCompletedCountForDate = (dateStr) => {
      return scheduleData.filter(session => session.date === dateStr && session.completed).length;
    };

    return (
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => navigateMonth('prev')}
              style={{ ...styles.button, ...styles.secondaryButton, padding: '0.5rem' }}
            >
              ←
            </button>
            <button 
              onClick={() => {
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Today
            </button>
            <button 
              onClick={() => navigateMonth('next')}
              style={{ ...styles.button, ...styles.secondaryButton, padding: '0.5rem' }}
            >
              →
            </button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{
              padding: '0.5rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: settings.darkMode ? '#9ca3af' : '#6b7280'
            }}>
              {day}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
          {days.map((day, index) => {
            if (!day) return <div key={index} style={{ padding: '0.5rem' }} />;
            
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const sessionCount = getSessionCountForDate(dateStr);
            const completedCount = getCompletedCountForDate(dateStr);
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isSelected = dateStr === selectedDate;
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  border: `1px solid ${
                    isToday ? '#3b82f6' : 
                    isSelected ? '#60a5fa' : 
                    (settings.darkMode ? '#4b5563' : '#e5e7eb')
                  }`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  backgroundColor: isToday ? '#dbeafe' : 
                    isSelected ? '#eff6ff' : 
                    (settings.darkMode ? '#374151' : 'white'),
                  color: settings.darkMode ? '#f9fafb' : '#1f2937'
                }}
              >
                <div style={{ fontWeight: '500' }}>{day}</div>
                {sessionCount > 0 && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#2563eb', 
                    marginTop: '0.25rem',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}>
                    <span>{sessionCount}</span>
                    {completedCount > 0 && (
                      <span style={{ color: '#22c55e' }}>({completedCount}✓)</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Settings View (updated for MongoDB)
  const SettingsView = () => {
    const handleSettingChange = async (key, value) => {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      try {
        await handleUpdateSettings(newSettings);
      } catch (error) {
        // Error handling is done in the CRUD function
      }
    };

    const handleResetData = async () => {
      if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        try {
          // Delete all data
          await Promise.all([
            ...subjects.map(subject => handleDeleteSubject(subject._id)),
            ...scheduleData.map(session => handleDeleteSchedule(session._id)),
            ...studyGoals.map(goal => handleDeleteGoal(goal._id)),
            ...grades.map(grade => handleDeleteGrade(grade._id)),
            ...uploadedDocs.map(doc => handleDeleteDocument(doc._id))
          ]);
          
          // Reset stats
          await handleUpdateStats({
            totalHours: 0,
            weeklyGoal: 40,
            streak: 0,
            dailyGoal: 6,
            completionRate: 0,
            averageSession: 60
          });
          
          addNotification('All data has been reset', 'info');
        } catch (error) {
          console.error('Error resetting data:', error);
          addNotification('Error resetting data', 'error');
        }
      }
    };

    return (
      <div style={{ ...styles.grid, gap: '1.5rem' }}>
        {/* Subjects Management */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Subjects Management</h3>
            <button 
              onClick={() => setShowSubjectModal(true)}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              <Plus size={16} /> Add Subject
            </button>
          </div>
          
          <div style={{ ...styles.grid, gap: '0.75rem' }}>
            {subjects.map(subject => (
              <div key={subject._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem', 
                border: `1px solid ${settings.darkMode ? '#4b5563' : '#e5e7eb'}`, 
                borderRadius: '0.5rem',
                backgroundColor: settings.darkMode ? '#374151' : '#f9fafb'
              }}>
                <div 
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '0.5rem',
                    backgroundColor: subject.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {subject.code}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{subject.name}</h4>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                        {subject.credits} credits • {subject.priority} priority
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button onClick={() => { setEditingSubject(subject); setShowSubjectModal(true); }} style={styles.iconButton}>
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSubject(subject._id)} 
                        style={styles.iconButton}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Preferences */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Study Preferences</h3>
          <div style={{ ...styles.grid, gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Weekly Study Target (hours)
                </label>
                <input 
                  type="number" 
                  value={settings.weeklyGoal}
                  onChange={(e) => handleSettingChange('weeklyGoal', parseInt(e.target.value))}
                  style={styles.input}
                  min="1"
                  max="168"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Daily Study Target (hours)
                </label>
                <input 
                  type="number" 
                  value={settings.dailyGoal}
                  onChange={(e) => handleSettingChange('dailyGoal', parseInt(e.target.value))}
                  style={styles.input}
                  min="1"
                  max="24"
                />
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>App Settings</h3>
          <div style={{ ...styles.grid, gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>Dark Mode</p>
                <p style={{ fontSize: '0.75rem', color: settings.darkMode ? '#9ca3af' : '#6b7280', margin: '0.25rem 0 0' }}>
                  Switch between light and dark themes
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '3rem', height: '1.5rem' }}>
                <input 
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.darkMode ? '#3b82f6' : '#ccc',
                  transition: '0.4s',
                  borderRadius: '1.5rem'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '1.25rem',
                    width: '1.25rem',
                    left: settings.darkMode ? '1.625rem' : '0.125rem',
                    bottom: '0.125rem',
                    backgroundColor: 'white',
                    transition: '0.4s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Data Management</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowExportModal(true)}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              <Download size={16} /> Export Data
            </button>
            <label style={{ ...styles.button, ...styles.secondaryButton, cursor: 'pointer' }}>
              <Upload size={16} /> Import Data
              <input 
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              onClick={handleResetData}
              style={{ ...styles.button, backgroundColor: '#ef4444', color: 'white' }}
            >
              <Trash2 size={16} /> Reset All Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Documents View (updated for MongoDB)
  const DocumentsView = () => {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newDoc = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: e.target.result,
          uploadDate: new Date().toISOString(),
          category: file.type.includes('pdf') ? 'PDF' : 'Other'
        };
        
        try {
          await handleCreateDocument(newDoc);
        } catch (error) {
          // Error handling is done in the CRUD function
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    };

    const deleteDoc = async (id) => {
      try {
        await handleDeleteDocument(id);
        if (selectedDoc?._id === id) setSelectedDoc(null);
      } catch (error) {
        // Error handling is done in the CRUD function
      }
    };

    const filteredDocs = uploadedDocs.filter(doc => 
      doc.name?.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    return (
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>My Documents</h2>
            <label style={{ ...styles.button, ...styles.primaryButton, cursor: 'pointer' }}>
              <Upload size={16} /> Upload Document
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: settings.darkMode ? '#9ca3af' : '#6b7280' }} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search documents..." style={{ ...styles.input, paddingLeft: '2.5rem' }} />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '300px 1fr' : '1fr', gap: '1.5rem' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Documents ({filteredDocs.length})</h3>
            <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '70vh', overflowY: 'auto' }}>
              {filteredDocs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                  <File size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ margin: 0 }}>No documents yet. Upload your study materials!</p>
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <div key={doc._id} onClick={() => setSelectedDoc(doc)} style={{ 
                    padding: '1rem', 
                    border: `1px solid ${selectedDoc?._id === doc._id ? '#3b82f6' : (settings.darkMode ? '#4b5563' : '#e5e7eb')}`, 
                    borderRadius: '0.5rem', 
                    cursor: 'pointer', 
                    backgroundColor: selectedDoc?._id === doc._id ? (settings.darkMode ? '#1e3a8a' : '#dbeafe') : (settings.darkMode ? '#374151' : '#f9fafb'), 
                    transition: 'all 0.2s' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '2.5rem', 
                        height: '2.5rem', 
                        borderRadius: '0.375rem', 
                        backgroundColor: doc.type.includes('pdf') ? '#ef4444' : '#3b82f6', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold' 
                      }}>
                        {doc.type.includes('pdf') ? 'PDF' : 'DOC'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.name}
                        </h4>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                          {(doc.size / 1024).toFixed(0)} KB • {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteDoc(doc._id); }} style={styles.iconButton}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {selectedDoc && (
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>{selectedDoc.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href={selectedDoc.dataUrl} download={selectedDoc.name} style={{ ...styles.button, ...styles.secondaryButton, textDecoration: 'none' }}>
                    <Download size={16} /> Download
                  </a>
                  <button onClick={() => setSelectedDoc(null)} style={styles.iconButton}>
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div style={{ border: `1px solid ${settings.darkMode ? '#4b5563' : '#e5e7eb'}`, borderRadius: '0.5rem', overflow: 'hidden', height: '70vh' }}>
                {selectedDoc.type.includes('pdf') ? (
                  <iframe src={selectedDoc.dataUrl} style={{ width: '100%', height: '100%', border: 'none' }} title={selectedDoc.name} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '1rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                    <File size={64} />
                    <p>Preview not available for this file type</p>
                    <a href={selectedDoc.dataUrl} download={selectedDoc.name} style={{ ...styles.button, ...styles.primaryButton, textDecoration: 'none' }}>
                      <Download size={16} /> Download to view
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Grades View (updated for MongoDB)
  const GradesView = () => {
    const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || null);
    const [showAddGrade, setShowAddGrade] = useState(false);
    const [newGrade, setNewGrade] = useState({ 
      name: '', 
      grade: '', 
      coefficient: 1, 
      type: 'Exam',
      subjectId: selectedSubjectId 
    });

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
    const subjectGrades = grades.filter(grade => grade.subjectId === selectedSubjectId);

    // Update newGrade when selectedSubjectId changes
    useEffect(() => {
      setNewGrade(prev => ({ ...prev, subjectId: selectedSubjectId }));
    }, [selectedSubjectId]);

    const addGrade = async () => {
      if (!newGrade.name || !newGrade.grade || !selectedSubjectId) return;
      
      const gradeObj = {
        ...newGrade,
        grade: parseFloat(newGrade.grade),
        date: new Date().toISOString(),
        subjectId: selectedSubjectId
      };
      
      try {
        await handleCreateGrade(gradeObj);
        setNewGrade({ name: '', grade: '', coefficient: 1, type: 'Exam', subjectId: selectedSubjectId });
        setShowAddGrade(false);
      } catch (error) {
        // Error handling is done in the CRUD function
      }
    };

    const deleteGrade = async (gradeId) => {
      try {
        await handleDeleteGrade(gradeId);
      } catch (error) {
        // Error handling is done in the CRUD function
      }
    };

    // Grade calculation helpers
    const calculateAverage = (gradesList) => {
      if (!gradesList || gradesList.length === 0) return 0;
      const totalWeight = gradesList.reduce((sum, g) => sum + (g.coefficient || 1), 0);
      const weightedSum = gradesList.reduce((sum, g) => sum + (g.grade * (g.coefficient || 1)), 0);
      return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
    };

    const calculateGPA = () => {
      let totalCredits = 0;
      let weightedSum = 0;
      subjects.forEach(subject => {
        const subjectGradesList = grades.filter(g => g.subjectId === subject.id);
        if (subjectGradesList.length > 0) {
          const avg = parseFloat(calculateAverage(subjectGradesList));
          weightedSum += avg * subject.credits;
          totalCredits += subject.credits;
        }
      });
      return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
    };

    const getGradeColor = (grade) => {
      const numGrade = parseFloat(grade);
      if (numGrade >= 16) return '#22c55e';
      if (numGrade >= 14) return '#84cc16';
      if (numGrade >= 12) return '#eab308';
      if (numGrade >= 10) return '#f97316';
      return '#ef4444';
    };

    return (
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Grade Calculator</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Overall GPA</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{calculateGPA()}</p>
                </div>
                <Award size={32} />
              </div>
            </div>
            <div style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Total Credits</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{subjects.reduce((sum, s) => sum + s.credits, 0)}</p>
                </div>
                <BookOpen size={32} />
              </div>
            </div>
            <div style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Subjects</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{subjects.length}</p>
                </div>
                <Target size={32} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Subjects</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {subjects.map(subject => {
                const subjectGradesList = grades.filter(g => g.subjectId === subject.id);
                const avg = calculateAverage(subjectGradesList);
                return (
                  <button 
                    key={subject.id} 
                    onClick={() => setSelectedSubjectId(subject.id)}
                    style={{ 
                      ...styles.navButton, 
                      flexDirection: 'column', 
                      alignItems: 'flex-start', 
                      backgroundColor: selectedSubjectId === subject.id ? '#dbeafe' : 'transparent', 
                      color: selectedSubjectId === subject.id ? '#2563eb' : (settings.darkMode ? '#d1d5db' : '#374151') 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: subject.color }} />
                        <span style={{ fontWeight: '500' }}>{subject.name}</span>
                      </div>
                      {avg > 0 && <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: getGradeColor(avg) }}>{avg}</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
                      {subject.credits} credits • {subjectGradesList.length} grades
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.card}>
            {selectedSubject ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>{selectedSubject.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280', margin: '0.25rem 0 0' }}>
                      Average: <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: getGradeColor(calculateAverage(subjectGrades)) }}>
                        {calculateAverage(subjectGrades) || 'N/A'}
                      </span> / 20
                    </p>
                  </div>
                  <button onClick={() => setShowAddGrade(!showAddGrade)} style={{ ...styles.button, ...styles.primaryButton }}>
                    <Plus size={16} /> Add Grade
                  </button>
                </div>

                {showAddGrade && (
                  <div style={{ padding: '1rem', backgroundColor: settings.darkMode ? '#374151' : '#f9fafb', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Grade name" 
                        value={newGrade.name} 
                        onChange={(e) => setNewGrade({...newGrade, name: e.target.value})} 
                        style={styles.input} 
                      />
                      <input 
                        type="number" 
                        placeholder="Grade /20" 
                        value={newGrade.grade} 
                        onChange={(e) => setNewGrade({...newGrade, grade: e.target.value})} 
                        style={styles.input} 
                        min="0" 
                        max="20" 
                        step="0.01" 
                      />
                      <input 
                        type="number" 
                        placeholder="Coef." 
                        value={newGrade.coefficient} 
                        onChange={(e) => setNewGrade({...newGrade, coefficient: parseFloat(e.target.value)})} 
                        style={styles.input} 
                        min="0.1" 
                        step="0.1" 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select 
                        value={newGrade.type} 
                        onChange={(e) => setNewGrade({...newGrade, type: e.target.value})} 
                        style={{ ...styles.select, flex: 1 }}
                      >
                        <option>Exam</option>
                        <option>Quiz</option>
                        <option>Assignment</option>
                        <option>Project</option>
                        <option>Practical</option>
                        <option>Presentation</option>
                      </select>
                      <button onClick={addGrade} style={{ ...styles.button, ...styles.primaryButton }}>Add</button>
                      <button onClick={() => setShowAddGrade(false)} style={{ ...styles.button, ...styles.secondaryButton }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {subjectGrades.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                      <Award size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                      <p>No grades yet. Add your first grade to start tracking!</p>
                    </div>
                  ) : (
                    subjectGrades.map(grade => (
                      <div key={grade._id} style={{ 
                        padding: '1rem', 
                        border: `2px solid ${getGradeColor(grade.grade)}`, 
                        borderRadius: '0.5rem', 
                        backgroundColor: settings.darkMode ? '#374151' : '#f9fafb' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{grade.name}</h4>
                              <span style={{ 
                                padding: '0.125rem 0.5rem', 
                                borderRadius: '0.25rem', 
                                fontSize: '0.75rem', 
                                backgroundColor: settings.darkMode ? '#1f2937' : '#e5e7eb', 
                                color: settings.darkMode ? '#d1d5db' : '#374151' 
                              }}>
                                {grade.type}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                              Coefficient: {grade.coefficient} • {new Date(grade.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getGradeColor(grade.grade) }}>
                                {grade.grade}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>/ 20</div>
                            </div>
                            <button onClick={() => deleteGrade(grade._id)} style={styles.iconButton}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
                <GraduationCap size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>Select a subject to view grades</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Notifications Modal
  const NotificationsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div style={styles.modal}>
        <div style={{...styles.modalContent, width: '90%', maxWidth: '24rem'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Notifications</h3>
            <button onClick={onClose} style={styles.iconButton}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ ...styles.grid, gap: '0.5rem', maxHeight: '20rem', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ textAlign: 'center', color: settings.darkMode ? '#9ca3af' : '#6b7280', padding: '2rem' }}>
                No notifications yet
              </p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: settings.darkMode ? '#374151' : '#f9fafb',
                    border: `1px solid ${
                      notification.type === 'success' ? '#22c55e' : 
                      notification.type === 'warning' ? '#f59e0b' : 
                      notification.type === 'error' ? '#ef4444' : '#6b7280'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    {notification.type === 'success' && <CheckCircle size={16} color="#22c55e" />}
                    {notification.type === 'warning' && <AlertCircle size={16} color="#f59e0b" />}
                    {notification.type === 'error' && <AlertCircle size={16} color="#ef4444" />}
                    {notification.type === 'info' && <Bell size={16} color="#6b7280" />}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>{notification.message}</p>
                      <p style={{ fontSize: '0.75rem', color: settings.darkMode ? '#9ca3af' : '#6b7280', margin: '0.25rem 0 0' }}>
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <button 
              onClick={() => setNotifications([])}
              style={{ ...styles.button, ...styles.secondaryButton, width: '100%', marginTop: '1rem' }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    );
  };

  // Export Modal
  const ExportModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div style={styles.modal}>
        <div style={{...styles.modalContent, width: '90%', maxWidth: '20rem'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Export Data</h3>
            <button onClick={onClose} style={styles.iconButton}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ ...styles.grid, gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: settings.darkMode ? '#9ca3af' : '#6b7280' }}>
              Choose export format:
            </p>
            
            <button 
              onClick={() => exportData('json')}
              style={{ ...styles.button, ...styles.secondaryButton, justifyContent: 'flex-start' }}
            >
              <FileText size={16} />
              Export as JSON (Complete backup)
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Analytics View (you can implement this similarly)
  const AnalyticsView = () => {
    return (
      <div style={styles.card}>
        <h2>Analytics View</h2>
        <p>This view would show study analytics and statistics from your MongoDB data.</p>
        {/* Implement analytics based on your scheduleData, studyStats, etc. */}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: settings.darkMode ? '#1f2937' : '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen size={48} color="#3b82f6" />
          <p style={{ marginTop: '1rem', color: settings.darkMode ? '#f9fafb' : '#1f2937' }}>
            Loading your study data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <BookOpen color="#2563eb" size={32} />
          <div>
            <h1 style={styles.headerTitle}>StudyPro Manager</h1>
            <p style={styles.headerSubtitle}>Advanced Study Schedule for IT Engineering</p>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          {/* Timer Display */}
          <div style={styles.timerDisplay}>
            <Clock size={16} />
            <span>{formatTime(timerTime)}</span>
            {timerSession && (
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {subjects.find(s => s.id === timerSession.subjectId)?.code}
              </span>
            )}
          </div>

          {/* Timer Controls */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              onClick={() => toggleTimer()}
              style={{ ...styles.button, ...styles.primaryButton, padding: '0.5rem' }}
              title={timerActive ? 'Pause timer' : 'Start timer'}
            >
              {timerActive ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button 
              onClick={resetTimer}
              style={{ ...styles.button, ...styles.secondaryButton, padding: '0.5rem' }}
              title="Reset timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Search */}
          <div style={styles.searchContainer}>
            <Search size={16} color={settings.darkMode ? '#9ca3af' : '#6b7280'} />
            <input 
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(true)}
            style={{ ...styles.button, ...styles.secondaryButton, padding: '0.5rem', position: 'relative' }}
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '0.25rem',
                right: '0.25rem',
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#ef4444',
                borderRadius: '50%'
              }} />
            )}
          </button>

          {/* Add Session */}
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ ...styles.button, ...styles.primaryButton }}
          >
            <Plus size={16} /> Add Session
          </button>
        </div>
      </div>

      <div style={styles.mainContainer}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <nav>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{
                ...styles.navButton,
                ...(currentView === 'dashboard' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <BarChart3 size={20} />
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('calendar')}
              style={{
                ...styles.navButton,
                ...(currentView === 'calendar' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <Calendar size={20} />
              Calendar
            </button>
            <button 
              onClick={() => setCurrentView('notebook')}
              style={{
                ...styles.navButton,
                ...(currentView === 'notebook' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <FileText size={20} />
              Notebook
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              style={{
                ...styles.navButton,
                ...(currentView === 'analytics' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <TrendingUp size={20} />
              Analytics
            </button>
            <button 
              onClick={() => setCurrentView('Documents')}
              style={{
                ...styles.navButton,
                ...(currentView === 'Documents' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <BookOpen size={20} />
              Documents
            </button>
            <button 
              onClick={() => setCurrentView('Grades')}
              style={{
                ...styles.navButton,
                ...(currentView === 'Grades' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <GraduationCap size={20} />
              Grades
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              style={{
                ...styles.navButton,
                ...(currentView === 'settings' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <Settings size={20} />
              Settings
            </button>
          </nav>

          {/* Quick Date Selector */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: settings.darkMode ? '#d1d5db' : '#374151', marginBottom: '0.75rem' }}>
              Quick Date
            </h3>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ ...styles.input, fontSize: '0.875rem' }}
            />
          </div>

          {/* Subject Filter */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: settings.darkMode ? '#d1d5db' : '#374151', marginBottom: '0.75rem' }}>
              Filter by Subject
            </h3>
            <select 
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              style={{ ...styles.select, fontSize: '0.875rem' }}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.code}</option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: settings.darkMode ? '#d1d5db' : '#374151', marginBottom: '0.75rem' }}>
              Quick Actions
            </h3>
            <div style={{ ...styles.grid, gap: '0.5rem' }}>
              <button 
                onClick={() => setShowAddModal(true)}
                style={{ ...styles.button, ...styles.primaryButton, fontSize: '0.75rem', padding: '0.5rem' }}
              >
                <Plus size={14} /> Add Session
              </button>
              <button 
                onClick={() => setShowGoalModal(true)}
                style={{ ...styles.button, ...styles.secondaryButton, fontSize: '0.75rem', padding: '0.5rem' }}
              >
                <Target size={14} /> Add Goal
              </button>
              <button 
                onClick={() => toggleTimer()}
                style={{ ...styles.button, backgroundColor: timerActive ? '#f59e0b' : '#22c55e', color: 'white', fontSize: '0.75rem', padding: '0.5rem' }}
              >
                {timerActive ? <Pause size={14} /> : <Play size={14} />}
                {timerActive ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'notebook' && <NotebookView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'Documents' && <DocumentsView />}
          {currentView === 'Grades' && <GradesView />}
        </div>
      </div>

      {/* Modals */}
            <FloatingTimerWidget />

      <SessionModal 
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingSession(null);
        }}
        session={editingSession}
        timeSlot={editingSession?.timeSlot}
      />

      <SubjectModal 
        isOpen={showSubjectModal}
        onClose={() => {
          setShowSubjectModal(false);
          setEditingSubject(null);
        }}
        subject={editingSubject}
      />

      <GoalModal 
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
      />

      <NotificationsModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <BookOpen size={48} color="#3b82f6" />
            <p style={{ marginTop: '1rem' }}>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyScheduleApp;

