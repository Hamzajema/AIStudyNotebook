// Floating timer widget - shows all active timers
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


      <FloatingTimerWidget />
