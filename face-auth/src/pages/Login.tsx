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
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Login</h2>

      <div className="mb-4">
        <h3 className="mb-2">By credentials</h3>
        <div className="flex gap-2">
          <input className="p-2 border rounded flex-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="p-2 border rounded flex-1" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleCredentials}>Login</button>
        </div>
      </div>

      <div>
        <h3 className="mb-2">Or by face</h3>
        <FaceCamera onCapture={handleFaceCapture} />
      </div>

      <div className="mt-4">
        {loading && <p>Processing...</p>}
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
    </div>
  )
}
