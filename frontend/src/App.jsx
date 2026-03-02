import { useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './services/firebase'
import api from './services/api'
import './App.css'

function formatDate(dateValue) {
  if (!dateValue) {
    return null
  }

  const date = new Date(dateValue)
  return Number.isNaN(date.getTime()) ? dateValue : date.toISOString()
}

function buildClientUserData(firebaseUser) {
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    phoneNumber: firebaseUser.phoneNumber,
    photoURL: firebaseUser.photoURL,
    providerId: firebaseUser.providerId,
    tenantId: firebaseUser.tenantId,
    isAnonymous: firebaseUser.isAnonymous,
    metadata: {
      creationTime: formatDate(firebaseUser.metadata?.creationTime),
      lastSignInTime: formatDate(firebaseUser.metadata?.lastSignInTime),
    },
    providerData: firebaseUser.providerData?.map((provider) => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      photoURL: provider.photoURL,
    })),
  }
}

function App() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [authDebug, setAuthDebug] = useState(null)

  async function handleGoogleLogin() {
    setLoading(true)
    setMessage('')

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      const tokenResult = await result.user.getIdTokenResult()

      const response = await api.post(
        '/auth/google',
        {
          email: result.user.email,
          name: result.user.displayName,
          photoUrl: result.user.photoURL,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )

      const meResponse = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      setUser(response.data.user)
      setAuthDebug({
        idTokenPreview: `${idToken.slice(0, 30)}...${idToken.slice(-20)}`,
        clientUser: buildClientUserData(result.user),
        tokenResult: {
          authTime: tokenResult.authTime,
          issuedAtTime: tokenResult.issuedAtTime,
          expirationTime: tokenResult.expirationTime,
          signInProvider: tokenResult.signInProvider,
          signInSecondFactor: tokenResult.signInSecondFactor,
          claims: tokenResult.claims,
        },
        backendGoogleLoginResponse: response.data,
        backendMeResponse: meResponse.data,
      })
      setMessage('Login realizado com sucesso!')
    } catch (error) {
      const backendMessage = error.response?.data?.message
      setMessage(backendMessage || 'Erro ao autenticar com Google.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await signOut(auth)
    setUser(null)
    setAuthDebug(null)
    setMessage('Sessão encerrada.')
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Login com Google + Firebase</h1>
        <p className="subtitle">Exemplo básico integrado com Express e PostgreSQL.</p>

        {!user ? (
          <button onClick={handleGoogleLogin} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </button>
        ) : (
          <>
            <div className="profile">
              {user.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : null}
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout}>Sair</button>
          </>
        )}

        {message ? <p className="message">{message}</p> : null}

        {authDebug ? (
          <section className="debug-panel">
            <h2>Dados completos para aula</h2>

            <div className="debug-item">
              <h3>Preview do ID Token</h3>
              <pre>{authDebug.idTokenPreview}</pre>
            </div>

            <div className="debug-item">
              <h3>Firebase User (frontend)</h3>
              <pre>{JSON.stringify(authDebug.clientUser, null, 2)}</pre>
            </div>

            <div className="debug-item">
              <h3>Token Result (frontend)</h3>
              <pre>{JSON.stringify(authDebug.tokenResult, null, 2)}</pre>
            </div>

            <div className="debug-item">
              <h3>Resposta /auth/google (backend)</h3>
              <pre>{JSON.stringify(authDebug.backendGoogleLoginResponse, null, 2)}</pre>
            </div>

            <div className="debug-item">
              <h3>Resposta /auth/me (backend)</h3>
              <pre>{JSON.stringify(authDebug.backendMeResponse, null, 2)}</pre>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}

export default App
