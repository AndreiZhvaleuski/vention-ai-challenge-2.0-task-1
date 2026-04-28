export type Category = 'Education' | 'Public Speaking' | 'University Partnerships';

export interface Activity {
  id: string;
  title: string;
  category: Category;
  date: Date;
  points: number;
  quarter: 1 | 2 | 3 | 4;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  avatarColor: string;
  avatarUrl: string;
  avatarUrlLarge: string;
  activities: Activity[];
}
