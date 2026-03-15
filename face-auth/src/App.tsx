import { useState, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import FaceCamera from './components/FaceCamera'

async function loadModels() {
  const MODEL_URL = '/models'
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
}

function App() {
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [capture, setCapture] = useState<string | null>(null)

  useEffect(() => {
    loadModels()
      .then(() => setModelsLoaded(true))
      .catch((err) => {
        console.error('Failed to load face-api models', err)
      })
  }, [])

  async function handleCapture(dataUrl: string) {
    setCapture(dataUrl)

    try {
      const img = new Image()
      img.src = dataUrl
      await new Promise((res) => (img.onload = res))

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (detection) {
        console.log('Face descriptor:', detection.descriptor)
      } else {
        console.log('No face detected')
      }
    } catch (err) {
      console.error('Error processing capture', err)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Face Authentication</h1>
        <p>{modelsLoaded ? 'Models loaded' : 'Loading models...'}</p>
      </header>

      <main>
        <FaceCamera onCapture={handleCapture} />

        {capture && (
          <div className="preview">
            <h3>last capture</h3>
            <img src={capture} alt="capture" width={320} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
