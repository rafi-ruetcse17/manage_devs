export interface DailyNote {
  _id: string;
  developerName: string;
  username: string;
  previousDayWork: string;
  todayPlan: string;
  hasBlocker: boolean;
  createdAt: string;
  updatedAt: string;
  formattedDate?: string;
}
