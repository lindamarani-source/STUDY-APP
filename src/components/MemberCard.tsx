import { useState } from 'react';
import type { Member } from '../types';

interface MemberCardProps {
  member: Member;
  onUpdate: (updates: Partial<Member>) => void;
  onRemove: () => void;
}

export function MemberCard({ member, onUpdate, onRemove }: MemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(member.hoursWorked.toString());
  const [activity, setActivity] = useState(member.activityLevel.toString());
  const [tasksCompleted, setTasksCompleted] = useState(member.tasksCompleted.toString());

  const handleSave = () => {
    onUpdate({
      hoursWorked: parseFloat(hours) || 0,
      activityLevel: Math.min(10, Math.max(1, parseInt(activity) || 5)),
      tasksCompleted: parseInt(tasksCompleted) || 0,
      lastActive: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const activityColor = member.activityLevel <= 3 ? 'text-red-600' : 
                        member.activityLevel <= 6 ? 'text-yellow-600' : 'text-green-600';

  const activityBg = member.activityLevel <= 3 ? 'bg-red-200' : 
                     member.activityLevel <= 6 ? 'bg-yellow-200' : 'bg-green-200';

  return (
    <div className="card card-hover bg-gradient-to-br from-white to-blue-50">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-sm bg-blue-100 text-blue-600 hover:bg-blue-200"
        >
          {isEditing ? '✓' : '✎'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hours Worked
            </label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              step="0.5"
              min="0"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Activity Level (1-10)
            </label>
            <input
              type="number"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              min="1"
              max="10"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tasks Completed
            </label>
            <input
              type="number"
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              min="0"
              className="input-field"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn btn-primary btn-sm flex-1">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary btn-sm flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 font-semibold">HOURS</p>
              <p className="text-2xl font-bold text-primary-600">{member.hoursWorked.toFixed(1)}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 font-semibold">TASKS</p>
              <p className="text-2xl font-bold text-gold-600">{member.tasksCompleted}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-600 font-semibold">ACTIVITY</p>
              <p className={`text-sm font-bold ${activityColor}`}>{member.activityLevel}/10</p>
            </div>
            <div className={`w-full h-2 ${activityBg} rounded-full overflow-hidden`}>
              <div
                className={`h-full transition-all ${
                  member.activityLevel <= 3 ? 'bg-red-500' : 
                  member.activityLevel <= 6 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(member.activityLevel / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onRemove}
        className="btn btn-danger btn-sm w-full mt-4"
      >
        Remove
      </button>
    </div>
  );
}

export default MemberCard;
