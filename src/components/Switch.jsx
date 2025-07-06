"use client"

const Switch = ({ checked, onChange, disabled = false }) => {
  return (
    <label className={`switch ${disabled ? "disabled" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      <span className="switch-slider"></span>
    </label>
  )
}

export default Switch
