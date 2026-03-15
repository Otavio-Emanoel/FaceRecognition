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
    <div>
      <h2>Register</h2>
      <div>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div>
        <p>Capture face to register</p>
        <FaceCamera onCapture={handleCapture} />
      </div>

      {loading && <p>Processing...</p>}
      {message && <p>{message}</p>}
    </div>
  )
}
