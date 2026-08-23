import React from "react";

const Loader = ({ label = "Loading...", fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[60vh] items-center justify-center">{content}</div>;
  }
  return content;
};

export default Loader;
