import { useState, useEffect } from 'react'
let faceapi: any = null
import FaceCamera from './components/FaceCamera'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'

async function loadModels() {
  const BASE = '/models'
  // ensure tf backend is available for face-api
  try {
    const tf = await import('@tensorflow/tfjs')
    await import('@tensorflow/tfjs-backend-webgl')
    await tf.setBackend('webgl')
    await tf.ready()
    console.log('TensorFlow backend ready')
  } catch (err) {
    console.error('Failed to load TensorFlow or set backend. Make sure @tensorflow/tfjs and @tensorflow/tfjs-backend-webgl are installed.', err)
    throw err
  }
  // import face-api after tf is ready so it picks up the same backend
  try {
    const mod = await import('face-api.js')
    faceapi = (mod && (mod.default || mod))
  } catch (err) {
    console.error('Failed to import face-api.js', err)
    throw err
  }
  try {
    console.log('Loading tinyFaceDetector from', `${BASE}/tiny_face_detector_model`)
    await faceapi.nets.tinyFaceDetector.loadFromUri(`${BASE}/tiny_face_detector_model`)
    console.log('Loaded tinyFaceDetector')
  } catch (e) {
    console.error('Failed loading tinyFaceDetector', e)
    throw e
  }

  try {
    console.log('Loading faceLandmark68Net from', `${BASE}/face_landmark_68_model`)
    await faceapi.nets.faceLandmark68Net.loadFromUri(`${BASE}/face_landmark_68_model`)
    console.log('Loaded faceLandmark68Net')
  } catch (e) {
    console.error('Failed loading faceLandmark68Net', e)
    throw e
  }

  try {
    console.log('Loading faceRecognitionNet from', `${BASE}/face_recognition_model`)
    await faceapi.nets.faceRecognitionNet.loadFromUri(`${BASE}/face_recognition_model`)
    console.log('Loaded faceRecognitionNet')
  } catch (e) {
    console.error('Failed loading faceRecognitionNet', e)
    throw e
  }
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
      <header className="bg-white dark:bg-gray-800 border-b py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
          <div>
            <h1 className="text-2xl font-semibold">Face Authentication</h1>
            <p className="text-sm text-gray-500">{modelsLoaded ? 'Models loaded' : 'Loading models...'}</p>
          </div>
          <nav className="flex gap-2">
            <button className="px-3 py-2 rounded bg-transparent hover:bg-gray-100" onClick={() => setRoute('register')}>Register</button>
            <button className="px-3 py-2 rounded bg-transparent hover:bg-gray-100" onClick={() => setRoute('login')}>Login</button>
            <button className="px-3 py-2 rounded bg-transparent hover:bg-gray-100" onClick={() => setRoute('profile')} disabled={!user}>Profile</button>
          </nav>
        </div>
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
