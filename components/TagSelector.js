export default function TagSelector({ value, onChange, name }) {
  const purposes = [
    'Student Visit',
    'Faculty Meeting',
    'Campus Tour',
    'Event Attendance',
    'Job Interview',
    'Research',
    'Other'
  ];

  return (
    <div>
      <label htmlFor={name}>Purpose of Visit</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="input"
        required
      >
        <option value="">Select purpose...</option>
        {purposes.map((purpose) => (
          <option key={purpose} value={purpose}>
            {purpose}
          </option>
        ))}
      </select>
    </div>
  );
}