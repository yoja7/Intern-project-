/**
 * shareHelpers.js
 * Generates a formatted text summary of today's tasks and shares it
 * via the Web Share API, falling back to clipboard copy.
 */

/**
 * Returns a status emoji for a task.
 */
function statusEmoji(status) {
  if (status === "Completed")  return "✅";
  if (status === "In Progress") return "🔄";
  return "📌";
}

/**
 * Builds a formatted text summary of the given tasks for today.
 */
export function buildShareText(tasks) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  if (tasks.length === 0) {
    return `📅 My Tasks for ${today}\n\nNo tasks scheduled for today. 🎉`;
  }

  const lines = tasks.map((task) => {
    const emoji    = statusEmoji(task.status);
    const time     = task.dueTime ? ` 🕒 ${task.dueTime}` : "";
    const priority = task.priority !== "Medium" ? ` [${task.priority}]` : "";
    return `${emoji} ${task.title}${time}${priority}`;
  });

  return `📅 My Tasks for ${today}\n\n${lines.join("\n")}\n\n— Shared from Dainiki`;
}

/**
 * Shares today's tasks using the Web Share API.
 * Falls back to copying to clipboard if Web Share is not available.
 * Returns { method: "share" | "clipboard" | "error", message }
 */
export async function shareTodayTasks(tasks) {
  const text = buildShareText(tasks);

  // Try Web Share API first (works on mobile and some desktop browsers)
  if (navigator.share) {
    try {
      await navigator.share({
        title: "My Tasks for Today — Dainiki",
        text,
      });
      return { method: "share", message: "Tasks shared successfully!" };
    } catch (err) {
      // User cancelled the share dialog — not an error
      if (err.name === "AbortError") {
        return { method: "cancelled", message: "Share cancelled." };
      }
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return { method: "clipboard", message: "Tasks copied to clipboard!" };
  } catch {
    // Last resort: show the text in a prompt so the user can copy manually
    window.prompt("Copy your tasks summary:", text);
    return { method: "prompt", message: "Copy the text above." };
  }
}
