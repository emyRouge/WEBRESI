"use client"
import { AlertCircle, RefreshCw } from "lucide-react"

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <AlertCircle size={48} />
        </div>
        <h3 className="error-title">¡Oops! Algo salió mal</h3>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            <RefreshCw size={16} />
            <span>Intentar de nuevo</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .error-container {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .error-content {
          text-align: center;
          color: white;
          max-width: 400px;
        }
        
        .error-icon {
          margin-bottom: 20px;
          opacity: 0.8;
        }
        
        .error-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .error-message {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 25px;
          line-height: 1.5;
        }
        
        .retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 20px;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .retry-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

export default ErrorMessage
