import React from 'react';
import { formatDate, formatDuration, formatParticipants, generateMeetingTitleWithGroup } from '../utils/formatMeeting.js';

export default function MeetingItem({ meeting }) {
  return (
    <li className="meeting-item">
      <div className="meeting-info">
        <div className="meeting-details">
          <h4>{generateMeetingTitleWithGroup(meeting)}</h4>
          <p className="meeting-item-text date-text">
            📅 {formatDate(meeting.date)}
          </p>
          <p className="meeting-item-text duration-text">
            ⏱️ Durée: <strong>{formatDuration(meeting.duration)}</strong>
          </p>
          <p className="meeting-item-text participants-text">
            👥 Participants: {formatParticipants(meeting.participants)}
          </p>
          <p className="meeting-item-text group-text">
            📁 Groupe: <strong>{meeting.groupId ? meeting.groupId.name : 'Groupe non nommé'}</strong>
          </p>
        </div>
      </div>
    </li>
  );
}
