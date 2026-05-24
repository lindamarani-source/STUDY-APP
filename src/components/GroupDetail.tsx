import { useState } from 'react';
import type { Group, Member, Task } from '../types';
import MemberCard from './MemberCard';
import TaskManager from './TaskManager';

interface GroupDetailProps {
  group: Group;
  onBack: () => void;
  onUpdateGroup: (group: Group) => void;
}

export function GroupDetail({ group, onBack, onUpdateGroup }: GroupDetailProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'tasks'>('members');

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberName,
        hoursWorked: 0,
        tasksCompleted: 0,
        activityLevel: 5,
        lastActive: new Date().toISOString(),
      };
      const updatedGroup = {
        ...group,
        members: [...group.members, newMember],
      };
      onUpdateGroup(updatedGroup);
      setNewMemberName('');
    }
  };

  const handleUpdateMember = (memberId: string, updates: Partial<Member>) => {
    const updatedGroup = {
      ...group,
      members: group.members.map((m) =>
        m.id === memberId ? { ...m, ...updates } : m
      ),
    };
    onUpdateGroup(updatedGroup);
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedGroup = {
      ...group,
      members: group.members.filter((m) => m.id !== memberId),
    };
    onUpdateGroup(updatedGroup);
  };

  const handleAddTask = (task: Task) => {
    const updatedGroup = {
      ...group,
      tasks: [...group.tasks, task],
    };
    onUpdateGroup(updatedGroup);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedGroup = {
      ...group,
      tasks: group.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    };
    onUpdateGroup(updatedGroup);
  };

  const handleRemoveTask = (taskId: string) => {
    const updatedGroup = {
      ...group,
      tasks: group.tasks.filter((t) => t.id !== taskId),
    };
    onUpdateGroup(updatedGroup);
  };

  const avgActivityLevel =
    group.members.length > 0
      ? Math.round(
          group.members.reduce((sum, m) => sum + m.activityLevel, 0) /
            group.members.length
        )
      : 0;

  const totalHours = group.members.reduce((sum, m) => sum + m.hoursWorked, 0);
  const completedTasks = group.tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-in">
      <button
        onClick={onBack}
        className="btn bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 mb-8"
      >
        ← Back
      </button>

      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">{group.name}</h1>
        <p className="text-lg text-gray-600">{group.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card border-t-4 border-primary-600">
          <p className="text-gray-600 text-sm font-semibold mb-2">TOTAL HOURS</p>
          <p className="text-4xl font-bold text-primary-600">{totalHours.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">hours worked</p>
        </div>
        <div className="card border-t-4 border-gold-500">
          <p className="text-gray-600 text-sm font-semibold mb-2">AVG ACTIVITY</p>
          <p className="text-4xl font-bold text-gold-500">{avgActivityLevel}</p>
          <p className="text-xs text-gray-500 mt-1">/ 10</p>
        </div>
        <div className="card border-t-4 border-green-500">
          <p className="text-gray-600 text-sm font-semibold mb-2">TASKS DONE</p>
          <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
          <p className="text-xs text-gray-500 mt-1">of {group.tasks.length}</p>
        </div>
        <div className="card border-t-4 border-blue-500">
          <p className="text-gray-600 text-sm font-semibold mb-2">MEMBERS</p>
          <p className="text-4xl font-bold text-blue-600">{group.members.length}</p>
          <p className="text-xs text-gray-500 mt-1">in group</p>
        </div>
      </div>

      <div className="mb-8 border-b-2 border-gray-300">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-4 px-2 font-bold text-lg transition-all ${
              activeTab === 'members'
                ? 'text-primary-600 border-b-4 border-primary-600 -mb-2'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Members ({group.members.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-4 px-2 font-bold text-lg transition-all ${
              activeTab === 'tasks'
                ? 'text-primary-600 border-b-4 border-primary-600 -mb-2'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✓ Tasks ({group.tasks.length})
          </button>
        </div>
      </div>

      {activeTab === 'members' && (
        <div className="animate-fade-in">
          <div className="mb-8 p-6 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Member name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                className="input-field flex-1"
              />
              <button onClick={handleAddMember} className="btn btn-primary btn-lg">
                Add Member
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onUpdate={(updates) => handleUpdateMember(member.id, updates)}
                onRemove={() => handleRemoveMember(member.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="animate-fade-in">
          <TaskManager
            tasks={group.tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onRemoveTask={handleRemoveTask}
            groupId={group.id}
          />
        </div>
      )}
    </div>
  );
}

export default GroupDetail;
