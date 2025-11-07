import React, { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

export default function LoginPage() {
    const [Email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)
    const { login }              = useAuth()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const ok = await login({ Email, password })
        setLoading(false)
        if (!ok) {
            setError('Невірний Email або пароль')
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h1>Увійти в систему</h1>
                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Email:</label>
                        <input
                            type="text"
                            value={Email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Завантаження...' : 'Увійти'}
                    </button>
                </form>
            </div>
        </div>
    )
}