import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProjectMeetings, useEndMeeting } from '../../../hooks/meeting/meetingHooks';
import { MeetingCard } from './components/MeetingCard';
import { ScheduleMeetingTab } from './components/ScheduleMeetingTab';
import { MeetingCalendarTab } from './components/MeetingCalendarTab';
import { EditMeetingModal } from './components/EditMeetingModal';
import { Clock, Plus, CheckSquare, Calendar as CalendarIcon, Video } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { RootState } from '../../../store/Store';
import { JaaSMeeting } from '@jitsi/react-sdk';
import type { Meeting } from '../../../types/meeting';


type Tab = 'upcoming' | 'schedule' | 'recent' | 'calendar';

const MeetingPage: React.FC = () => {
  const currentProject = useSelector((state: RootState) => state.project.currentProject);
  const projectId = currentProject?.id|| currentProject?.id;
  
  const { data, isLoading } = useGetProjectMeetings(projectId || '');
  const { mutate: endMeeting } = useEndMeeting();
  const meetings = data?.data || [];

  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  
  const handleJoin = (meeting: Meeting) => {
      setActiveMeeting(meeting);
  };
  
  const handleClose = () => {
      setShowEndConfirm(true);
  };

  const handleEndMeeting = () => {
      if (activeMeeting) {
          endMeeting(activeMeeting.id);
      }
      setActiveMeeting(null);
      setShowEndConfirm(false);
  };

  const handleLeaveMeeting = () => {
      setActiveMeeting(null);
      setShowEndConfirm(false);
  };

  const now = new Date().getTime();

  const upcomingMeetings = meetings.filter(m => {
    const isPast = new Date(m.endTime).getTime() < now;
    if (isPast && m.status === 'SCHEDULED') return false;
    return m.status === 'SCHEDULED' || m.status === 'LIVE';
  });

  const pastMeetings = meetings.filter(m => {
    const isPast = new Date(m.endTime).getTime() < now;
    if (isPast && m.status === 'SCHEDULED') return true;
    return m.status === 'COMPLETED' || m.status === 'MISSED';
  });

  if (!projectId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-background text-muted-foreground p-8">
        <Video className="w-16 h-16 mb-4 opacity-20 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2 text-foreground">No Project Selected</h2>
        <p className="text-sm text-center max-w-md text-muted-foreground">
          Please select a project from the sidebar to view and manage meetings.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Meetings', icon: Clock },
    { id: 'schedule', label: 'Schedule Meeting', icon: Plus },
    { id: 'recent', label: 'Recent Meetings', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  ] as const;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 blur-[128px] rounded-full mix-blend-screen opacity-70 animate-pulse duration-10000" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-accent/20 blur-[128px] rounded-full mix-blend-screen opacity-70" />
      </div>

      {/* Header Area */}
      <div className="flex-shrink-0 pt-10 px-8 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold gradient-text tracking-tight pb-1">Meetings</h1>
        </div>
        
        {/* Modern Pill Tabs */}
        <div className="flex justify-center">
          <div className="flex gap-2 p-1.5 bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[1.25rem] shadow-2xl">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl relative overflow-hidden group",
                    isActive 
                      ? "text-primary-foreground bg-primary shadow-lg shadow-primary/40 scale-105" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4 transition-transform duration-300", isActive ? "" : "group-hover:scale-110 group-hover:rotate-3")} />
                  <span className="relative z-10">{tab.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-20 animate-gradient" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content area with scrolling */}
      {activeMeeting ? (
          <div className="flex-1 relative bg-background/95 flex flex-col items-center justify-center p-2 sm:p-4 md:p-8">
              <div className="w-full max-w-7xl h-full bg-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-border relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="size-20 border-2 border-border rounded-full animate-ping" />
                  </div>
                  <JaaSMeeting
                      appId={import.meta.env.VITE_JAAS_APP_ID || ''}
                      roomName={activeMeeting.roomId || `Planx_${activeMeeting.id}`}
                      configOverwrite={{
                          prejoinPageEnabled: false,
                          disableDeepLinking: true,
                          startWithAudioMuted: true,
                          toolbarButtons: [
                              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                              'fodeviceselection', 'hangup', 'profile', 'chat', 'settings', 'raisehand',
                              'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur'
                          ],
                      }}
                      interfaceConfigOverwrite={{
                          SHOW_JITSI_WATERMARK: false,
                          HIDE_DEEP_LINKING_LOGO: true,
                      }}
                      userInfo={{
                          displayName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest',
                          email: user?.email || 'guest@example.com'
                      }}
                      onReadyToClose={handleClose}
                      getIFrameRef={(iframeRef) => {
                          iframeRef.style.height = '100%';
                          iframeRef.style.width = '100%';
                          iframeRef.style.border = 'none';
                      }}
                  />
              </div>

              {/* End/Leave Confirmation Modal */}
              {showEndConfirm && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-xl animate-in fade-in duration-200">
                  <div className="bg-card/80 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-10 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                    {/* Decorative gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                        <Video className="w-8 h-8 text-primary" />
                      </div>

                      <h3 className="text-2xl font-bold text-foreground text-center mb-2">Leave Meeting?</h3>
                      <p className="text-sm text-muted-foreground text-center mb-8 max-w-xs mx-auto">
                        Choose whether to end this meeting for everyone or leave temporarily.
                      </p>

                      <div className="flex flex-col gap-3">
                        {/* End Meeting Button */}
                        <button
                          onClick={handleEndMeeting}
                          className="group w-full flex items-center gap-4 py-4 px-5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl font-medium text-sm hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:shadow-lg hover:shadow-destructive/20 hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-xl bg-destructive/20 group-hover:bg-destructive-foreground/20 flex items-center justify-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">End Meeting</div>
                            <div className="text-xs opacity-70">Close for everyone &amp; mark as completed</div>
                          </div>
                        </button>

                        {/* Leave & Rejoin Button */}
                        <button
                          onClick={handleLeaveMeeting}
                          className="group w-full flex items-center gap-4 py-4 px-5 bg-primary/10 border border-primary/20 text-primary rounded-xl font-medium text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/20 group-hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">Leave &amp; Rejoin Later</div>
                            <div className="text-xs opacity-70">Meeting stays active for others</div>
                          </div>
                        </button>

                        {/* Cancel */}
                        <button
                          onClick={() => setShowEndConfirm(false)}
                          className="w-full py-3 px-4 text-muted-foreground hover:text-foreground rounded-xl font-medium text-sm hover:bg-muted/30 transition-all duration-200 mt-1"
                        >
                          Go Back to Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
      ) : (
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
        
        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto pb-10">
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingMeetings.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">No upcoming meetings.</div>
                ) : (
                  upcomingMeetings.map(meeting => (
                    <MeetingCard 
                      key={meeting.id} 
                      meeting={meeting} 
                      onJoin={handleJoin} 
                      onEdit={setEditingMeeting}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'recent' && (
              <div className="space-y-4">
                {pastMeetings.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">No recent meetings.</div>
                ) : (
                  pastMeetings.map(meeting => (
                    <MeetingCard key={meeting.id} meeting={meeting} isRecent={true} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <ScheduleMeetingTab />
            )}

            {activeTab === 'calendar' && (
              <MeetingCalendarTab meetings={meetings} />
            )}
          </div>
        )}
      </div>
      )}

      {/* Edit Meeting Modal */}
      {editingMeeting && (
        <EditMeetingModal 
          meeting={editingMeeting} 
          onClose={() => setEditingMeeting(null)} 
        />
      )}
    </div>
  );
};

export default MeetingPage;
