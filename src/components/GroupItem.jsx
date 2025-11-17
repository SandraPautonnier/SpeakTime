import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GroupItem({ group }) {
  const navigate = useNavigate();

  return (
    <div
      className="link-card"
      onClick={() => navigate(`/group/${group._id}`)}
    >
      <h4>{group.name}</h4>
      <p>{group.description || 'Pas de description'}</p>
      <p>
        <strong>{group.members?.length || 0}</strong> participant{group.members?.length > 1 ? 's' : ''}
      </p>
    </div>
  );
}
