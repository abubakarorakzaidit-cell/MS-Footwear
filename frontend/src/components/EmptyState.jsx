import React from "react";

const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
    {Icon && (
      <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon size={26} />
      </div>
    )}
    <h3 className="text-lg font-semibold text-ink">{title}</h3>
    {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
    {action}
  </div>
);

export default EmptyState;
