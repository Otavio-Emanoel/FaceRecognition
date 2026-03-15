import { useState, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import FaceCamera from './components/FaceCamera'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'

async function loadModels() {
  const MODEL_URL = '/models'
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
}

function App() {
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [route, setRoute] = useState<'home'|'register'|'login'|'profile'>('home')
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    loadModels()
      .then(() => setModelsLoaded(true))
      .catch((err) => {
        console.error('Failed to load face-api models', err)
      })
  }, [])

  async function detectDescriptorFromDataUrl(dataUrl: string){
    const img = new Image()
    img.src = dataUrl
    await new Promise((res) => (img.onload = res))

    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor()

    return detection?.descriptor ? Array.from(detection.descriptor) : null
  }

  return (
    <div className="app">
      <header>
        <h1>Face Authentication</h1>
        <p>{modelsLoaded ? 'Models loaded' : 'Loading models...'}</p>
        <nav>
          <button onClick={() => setRoute('register')}>Register</button>
          <button onClick={() => setRoute('login')}>Login</button>
          <button onClick={() => setRoute('profile')} disabled={!user}>Profile</button>
        </nav>
      </header>

      <main>
        {route === 'register' && (
          <Register
            modelsLoaded={modelsLoaded}
            detectDescriptor={detectDescriptorFromDataUrl}
            onRegistered={(u: any) => { setUser(u); setRoute('profile') }}
          />
        )}

        {route === 'login' && (
          <Login
            modelsLoaded={modelsLoaded}
            detectDescriptor={detectDescriptorFromDataUrl}
            onLogged={(u: any) => { setUser(u); setRoute('profile') }}
          />
        )}

        {route === 'profile' && user && (
          <Profile user={user} onLogout={() => { setUser(null); setRoute('home') }} />
        )}

        {route === 'home' && (
          <div>
            <p>Escolha uma opção acima para começar.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
