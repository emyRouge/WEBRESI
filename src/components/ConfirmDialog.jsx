"use client"

import { useEffect } from "react"

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "default", // default, danger, warning
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "danger":
        return "⚠️"
      case "warning":
        return "⚡"
      default:
        return "❓"
    }
  }

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "btn-danger"
      case "warning":
        return "btn-warning"
      default:
        return "btn-primary"
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">{getIcon()}</div>
        <div className="confirm-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className={getConfirmButtonClass()} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
