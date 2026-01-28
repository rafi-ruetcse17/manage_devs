export interface DailyNote {
  _id: string;
  developerName: string;
  username: string;
  dayStartPlan: string;
  dayEndWorkUpdate: string;
  hasBlocker: boolean;
  createdAt: string;
  updatedAt: string;
  formattedDate?: string;
}
