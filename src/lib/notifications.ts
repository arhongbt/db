// ============================================================
// PWA Push Notification System for Deadline Reminders
// ============================================================

const NOTIFICATION_STORAGE_KEY = 'dodsbo_notification_prefs';

export interface NotificationPrefs {
  enabled: boolean;
  /** Days before deadline to remind */
  reminderDays: number[];
}

const DEFAULT_PREFS: NotificationPrefs = {
  enabled: false,
  reminderDays: [7, 3, 1],
};

export function getNotificationPrefs(): NotificationPrefs {
  try {
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export interface DeadlineReminder {
  id: string;
  title: string;
  body: string;
  daysLeft: number;
  isUrgent: boolean;
}

export function calculateUpcomingReminders(
  deathDate: string,
  deadlines: { id: string; title: string; description: string; offsetDays: number }[]
): DeadlineReminder[] {
  const death = new Date(deathDate);
  const now = new Date();
  const daysSinceDeath = Math.floor((now.getTime() - death.getTime()) / (1000 * 60 * 60 * 24));

  return deadlines
    .map((d) => {
      const daysLeft = d.offsetDays - daysSinceDeath;
      return {
        id: d.id,
        title: d.title,
        body: d.description,
        daysLeft,
        isUrgent: daysLeft <= 7 && daysLeft > 0,
      };
    })
    .filter((r) => r.daysLeft > 0 && r.daysLeft <= 30);
}

export function sendLocalNotification(title: string, body: string, tag?: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  // Use service worker registration if available for persistent notifications
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: tag || 'dodsbo-reminder',
        data: { url: '/dashboard' },
      });
    }).catch(() => {
      // Fallback to regular notification
      new Notification(title, { body, icon: '/icons/icon-192.png', tag: tag || 'dodsbo-reminder' });
    });
  } else {
    new Notification(title, { body, icon: '/icons/icon-192.png', tag: tag || 'dodsbo-reminder' });
  }
}

/**
 * Check deadlines and send notifications if needed.
 * Should be called on app open / dashboard mount.
 */
export function checkAndNotifyDeadlines(
  deathDate: string,
  deadlines: { id: string; title: string; description: string; offsetDays: number }[]
): void {
  const prefs = getNotificationPrefs();
  if (!prefs.enabled) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const SENT_KEY = 'dodsbo_notifications_sent';
  let sentMap: Record<string, number[]> = {};
  try {
    const saved = localStorage.getItem(SENT_KEY);
    if (saved) sentMap = JSON.parse(saved);
  } catch { /* ignore */ }

  const reminders = calculateUpcomingReminders(deathDate, deadlines);

  for (const reminder of reminders) {
    // Check if we should send for any of the reminder day thresholds
    for (const dayThreshold of prefs.reminderDays) {
      if (reminder.daysLeft <= dayThreshold) {
        const alreadySent = sentMap[reminder.id]?.includes(dayThreshold);
        if (!alreadySent) {
          const urgencyPrefix = reminder.daysLeft <= 3 ? '⚠️ ' : '';
          sendLocalNotification(
            `${urgencyPrefix}${reminder.title}`,
            `${reminder.daysLeft} dag${reminder.daysLeft === 1 ? '' : 'ar'} kvar — ${reminder.body}`,
            `deadline-${reminder.id}-${dayThreshold}`
          );

          // Mark as sent
          if (!sentMap[reminder.id]) sentMap[reminder.id] = [];
          sentMap[reminder.id].push(dayThreshold);
        }
      }
    }
  }

  try {
    localStorage.setItem(SENT_KEY, JSON.stringify(sentMap));
  } catch { /* ignore */ }
}
