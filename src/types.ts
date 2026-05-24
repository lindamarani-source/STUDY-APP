export interface Member {
  id: string;
  name: string;
  hoursWorked: number;
  tasksCompleted: number;
  activityLevel: number; // 1-10 scale
  lastActive: string; // ISO date string
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string; // group id
  status: 'pending' | 'in-progress' | 'completed';
  completionPercentage: number;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  tasks: Task[];
  createdAt: string;
}
