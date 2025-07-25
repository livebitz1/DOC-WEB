import { FiBell } from "react-icons/fi";

export default function NotificationBell({ hasNotification, onClick }: { hasNotification: boolean; onClick?: () => void }) {
  return (
    <button
      className="mx-2 text-gray-500 hover:text-black relative"
      aria-label="Notifications"
      onClick={onClick}
      style={{ outline: "none", background: "none", border: "none" }}
    >
      <FiBell size={22} />
      {hasNotification && (
        <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping" />
      )}
      {hasNotification && (
        <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}
