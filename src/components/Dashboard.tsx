import { useState, useEffect } from 'react';
import type { Group } from '../types';
import GroupsList from './GroupsList';
import GroupDetail from './GroupDetail';

function getSavedGroups(): Group[] {
  const savedGroups = localStorage.getItem('studyGroups');

  if (!savedGroups) {
    return [];
  }

  try {
    return JSON.parse(savedGroups) as Group[];
  } catch {
    return [];
  }
}

export function Dashboard() {
  const [groups, setGroups] = useState<Group[]>(getSavedGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('studyGroups', JSON.stringify(groups));
  }, [groups]);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName,
        description: newGroupDescription,
        members: [],
        tasks: [],
        createdAt: new Date().toISOString(),
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateForm(false);
    }
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter((g) => g.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      {selectedGroup ? (
        <GroupDetail
          group={selectedGroup}
          onBack={() => setSelectedGroup(null)}
          onUpdateGroup={handleUpdateGroup}
        />
      ) : (
        <>
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Study Group</h2>
                <input
                  type="text"
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
                  className="input-field mb-4"
                />
                <textarea
                  placeholder="Group description (optional)"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="input-field mb-6"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button onClick={handleCreateGroup} className="btn btn-primary flex-1">
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <GroupsList
            groups={groups}
            onSelectGroup={setSelectedGroup}
            onCreateGroup={() => setShowCreateForm(true)}
            onDeleteGroup={handleDeleteGroup}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
