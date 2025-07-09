"use client"

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #fafafa;
        }
        
        .loading-spinner {
          text-align: center;
          color: #374151;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        p {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
