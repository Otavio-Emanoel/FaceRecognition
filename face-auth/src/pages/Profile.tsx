export default function Profile({ user, onLogout } : { user: any, onLogout: () => void }){
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Profile</h2>
      <div className="space-y-2 text-left">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}
