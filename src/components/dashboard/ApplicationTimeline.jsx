import React from 'react';
import { formatDate } from '../../utils/formatters';

const ApplicationTimeline = ({ timeline = [], currentStatus = 'Submitted' }) => {
  const isRejected = currentStatus === 'Rejected';

  return (
    <div className="py-3 px-2">
      <h6 className="brand-font fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-clock-history text-warning"></i>
        <span>Official Government Application Timeline</span>
      </h6>

      <div className="timeline-container ms-3">
        {timeline.map((step, index) => {
          let indicatorClass = 'indicator-pending';
          let iconClass = 'bi-circle';
          let textClass = 'text-muted';

          if (step.status === 'completed') {
            indicatorClass = 'indicator-completed';
            iconClass = 'bi-check-lg';
            textClass = 'text-main';
          } else if (step.status === 'current') {
            indicatorClass = 'indicator-current';
            iconClass = 'bi-arrow-right-short';
            textClass = 'text-main fw-bold';
          } else if (step.status === 'rejected') {
            indicatorClass = 'indicator-rejected';
            iconClass = 'bi-x-lg';
            textClass = 'text-danger fw-bold';
          }

          return (
            <div key={index} className="timeline-step">
              <div className={`timeline-indicator ${indicatorClass}`}>
                <i className={`bi ${iconClass}`}></i>
              </div>

              <div className="card glass-card border-0 p-3 mb-2 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className={`fw-bold ${textClass}`}>{step.title}</span>
                  <span className="badge bg-secondary-subtle text-muted rounded-pill small">
                    {formatDate(step.timestamp)}
                  </span>
                </div>

                <p className="small text-muted mb-2 mb-0">
                  {step.comment || 'Status updated by verification officer.'}
                </p>

                {step.officerName && (
                  <div className="d-flex align-items-center gap-1 small text-muted pt-2 border-top">
                    <i className="bi bi-shield-check text-success"></i>
                    <span>Verified By: <strong>{step.officerName}</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
