import { useState } from 'react'
import FaceCamera from '../components/FaceCamera'
import { loginWithDescriptor, loginWithCredentials } from '../services/api'

export default function Login({ modelsLoaded, detectDescriptor, onLogged }:
  { modelsLoaded: boolean, detectDescriptor: (dataUrl: string) => Promise<number[] | null>, onLogged: (user: any) => void }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleFaceCapture(dataUrl: string){
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
      const user = await loginWithDescriptor(descriptor)
      onLogged(user)
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  async function handleCredentials(){
    setLoading(true)
    setMessage(null)
    try {
      const user = await loginWithCredentials(email, password)
      onLogged(user)
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2>Login</h2>
      <div>
        <h3>By credentials</h3>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleCredentials}>Login</button>
      </div>

      <div>
        <h3>Or by face</h3>
        <FaceCamera onCapture={handleFaceCapture} />
      </div>

      {loading && <p>Processing...</p>}
      {message && <p>{message}</p>}
    </div>
  )
}
