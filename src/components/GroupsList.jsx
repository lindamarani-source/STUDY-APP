export function GroupsList({ groups, onSelectGroup, onCreateGroup, onDeleteGroup }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Study Groups</h2>
          <button onClick={onCreateGroup} className="btn btn-primary btn-lg gap-2">
            <span className="text-xl">+</span> New Group
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <p className="text-gray-600 text-lg">No groups yet. Create your first study group!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="card card-hover bg-gradient-to-br from-white to-gray-50 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                  <button
                    onClick={() => onDeleteGroup(group.id)}
                    className="btn btn-sm bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4 min-h-10">{group.description}</p>
                <div className="flex gap-4 mb-6 pb-4 border-b border-gray-200">
                  <span className="badge badge-primary">
                    👥 {group.members.length} members
                  </span>
                  <span className="badge badge-gold">
                    ✓ {group.tasks.length} tasks
                  </span>
                </div>
                <button
                  onClick={() => onSelectGroup(group)}
                  className="btn btn-secondary w-full justify-center"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupsList;
