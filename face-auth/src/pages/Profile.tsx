export default function Profile({ user, onLogout } : { user: any, onLogout: () => void }){
  return (
    <div>
      <h2>Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}
