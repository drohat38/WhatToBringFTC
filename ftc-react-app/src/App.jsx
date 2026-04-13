import './index.css'

function App() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <p style={{
        fontFamily: 'Anton, sans-serif',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: 'var(--orange)',
        marginBottom: '12px',
      }}>
        Feed the City
      </p>
      <h1 style={{
        fontFamily: 'Anton, sans-serif',
        fontSize: 'clamp(32px, 10vw, 56px)',
        color: 'var(--navy)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        lineHeight: 1.1,
      }}>
        Volunteer Planner
      </h1>
      <p style={{
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '13px',
        color: 'var(--muted)',
        marginTop: '16px',
      }}>
        React foundation ready — Step 2 components coming next.
      </p>
    </div>
  )
}

export default App
