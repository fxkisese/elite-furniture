import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ isAllowed, redirectPath = '/login', children }) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
