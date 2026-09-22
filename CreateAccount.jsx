import { useState } from 'react'
import { useOrderFlow } from '../state/OrderFlowContext'

export default function CreateAccount() {
  const [, actions] = useOrderFlow()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState('details') // 'details' | 'verify'
  const [error, setError] = useState('')

  function handleSubmitDetails(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email.')
    setError('')
    setStage('verify')
  }

  function handleVerify(e) {
    e.preventDefault()
    if (code.trim().length !== 4) return setError('Enter the 4-digit code sent to your email.')
    setError('')
    actions.createAccount({ name: name.trim(), email: email.trim() })
  }

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">01 · Create account</p>
        <h1 className="screen-title">
          {stage === 'details' ? 'Let’s get you set up' : 'Verify it’s you'}
        </h1>
        <p className="screen-sub">
          {stage === 'details'
            ? 'One account gets you drone delivery for food and pharmacy orders in eligible zones.'
            : `We sent a 4-digit code to ${email}. It's demo data — any 4 digits work.`}
        </p>
      </div>

      {stage === 'details' ? (
        <form className="screen-body" onSubmit={handleSubmitDetails}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jamie Rivers" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jamie@example.com"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>
      ) : (
        <form className="screen-body" onSubmit={handleVerify}>
          <div className="field">
            <label htmlFor="code">Verification code</label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="0000"
              inputMode="numeric"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>
      )}

      <div className="screen-footer">
        <span />
        <button className="btn btn-primary" onClick={stage === 'details' ? handleSubmitDetails : handleVerify}>
          {stage === 'details' ? 'Continue' : 'Verify & continue'}
        </button>
      </div>
    </>
  )
}
