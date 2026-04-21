import { FiClock } from "react-icons/fi";

/**
 * ReminderCard — displays a single reminder.
 * Props:
 *   reminder: { id, taskTitle, reminderTime }
 */
function ReminderCard({ reminder }) {
  if (!reminder) return null;

  return (
    <div className="d-flex align-items-start gap-3 p-3 border rounded-lg bg-white mb-2">
      <div className="text-warning mt-1">
        <FiClock size={18} />
      </div>
      <div>
        <p className="fw-semibold mb-0">{reminder.taskTitle}</p>
        <p className="text-muted-sm">{reminder.reminderTime}</p>
      </div>
    </div>
  );
}

export default ReminderCard;
