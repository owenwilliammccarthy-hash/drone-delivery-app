import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { BrandMark } from './Icons'

// Flow node 1: Create account -> Sign up & verify
export default function CreateAccount() {
  const [, actions] = useAppState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('details') // 'details' | 'verify'
  const [error, setError] = useState('')

  function handleDetails(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email.')
    setError('')
    setStep('verify')
  }

  function handleVerify(e) {
    e.preventDefault()
    if (code.length !== 4) return setError('Enter the 4-digit code sent to your email.')
    actions.signUp({ name: name.trim(), email: email.trim() })
  }

  return (
    <div className="tab-page onboarding">
      <div className="onboarding-brand">
        <BrandMark width="40" height="40" />
        <span>Skyhatch</span>
      </div>
      <header className="page-head">
        <p className="eyebrow">{step === 'details' ? 'Create account' : 'Sign up & verify'}</p>
        <h1 className="page-title">{step === 'details' ? 'Food & medicine, flown to your door' : 'Verify it’s you'}</h1>
        <p className="page-sub">
          {step === 'details'
            ? 'One account gets you drone delivery from restaurants and pharmacies in eligible zones.'
            : `We sent a 4-digit code to ${email}. This is a demo, so any 4 digits work.`}
        </p>
      </header>

      {step === 'details' ? (
        <form className="card panel form" onSubmit={handleDetails} noValidate>
          <label className="field">
            <span className="stat-label">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Owen McCarthy" autoComplete="name" />
          </label>
          <label className="field">
            <span className="stat-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owen@example.com"
              autoComplete="email"
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-block" type="submit">
            Continue
          </button>
        </form>
      ) : (
        <form className="card panel form" onSubmit={handleVerify} noValidate>
          <label className="field">
            <span className="stat-label">Verification code</span>
            <input
              className="code-input mono"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="0000"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-block" type="submit">
            Verify & continue
          </button>
          <button className="link-btn" type="button" onClick={() => { setStep('details'); setError('') }}>
            Use a different email
          </button>
        </form>
      )}
    </div>
  )
}
