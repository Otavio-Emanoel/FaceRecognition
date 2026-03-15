import { useState } from 'react'
import FaceCamera from '../components/FaceCamera'
import { registerUser } from '../services/api'

export default function Register({ modelsLoaded, detectDescriptor, onRegistered }:
  { modelsLoaded: boolean, detectDescriptor: (dataUrl: string) => Promise<number[] | null>, onRegistered: (user: any) => void }) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleCapture(dataUrl: string){
    if (!modelsLoaded) { setMessage('Models not loaded'); return }
    setLoading(true)
    setMessage(null)

    const descriptor = await detectDescriptor(dataUrl)
    if (!descriptor) {
      setMessage('No face detected. Try again.')
      setLoading(false)
      return
    }

    try {
      const user = await registerUser({ name, email, password, descriptor })
      setMessage('Registered')
      onRegistered(user)
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Register</h2>
      <div className="grid grid-cols-1 gap-3 mb-4">
        <input className="p-2 border rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className="mb-4">
        <p className="mb-2">Capture face to register</p>
        <FaceCamera onCapture={handleCapture} />
      </div>

      <div className="flex items-center gap-4">
        {loading && <p>Processing...</p>}
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
    </div>
  )
}
