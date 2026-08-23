import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
    <span className="font-display text-6xl font-bold text-primary">404</span>
    <h1 className="mt-4 text-xl font-semibold text-ink">Page not found</h1>
    <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary mt-6">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
