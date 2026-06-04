import React, { forwardRef } from 'react';
import './Posters.css';

export const Poster1 = forwardRef(({ program, category, winners }, ref) => {
  const first = winners?.find(w => w.position === 1);
  const second = winners?.find(w => w.position === 2);
  const third = winners?.find(w => w.position === 3);

  return (
    <div className="poster-container" ref={ref}>
      <img src="/Poster1.png" alt="Poster Background" className="poster-bg" />
      <div className="poster-content">
        <div className="overlay-text p1-category">{category}</div>
        <div className="overlay-text p1-program">{program}</div>
        
        {first && (
          <>
            <div className="overlay-text p1-first-label">FIRST PLACE</div>
            <div className="overlay-text p1-first-name">{first.student_name}</div>
            <div className="overlay-text p1-first-unit">{first.unit_name}</div>
          </>
        )}
        
        {second && (
          <>
            <div className="overlay-text p1-second-label">SECOND PLACE</div>
            <div className="overlay-text p1-second-name">{second.student_name}</div>
            <div className="overlay-text p1-second-unit">{second.unit_name}</div>
          </>
        )}
        
        {third && (
          <>
            <div className="overlay-text p1-third-label">THIRD PLACE</div>
            <div className="overlay-text p1-third-name">{third.student_name}</div>
            <div className="overlay-text p1-third-unit">{third.unit_name}</div>
          </>
        )}
      </div>
    </div>
  );
});

export const Poster2 = forwardRef(({ program, category, winners }, ref) => {
  const first = winners?.find(w => w.position === 1);
  const second = winners?.find(w => w.position === 2);
  const third = winners?.find(w => w.position === 3);

  return (
    <div className="poster-container" ref={ref}>
      <img src="/Poster2 actual base image.png" alt="Poster Background" className="poster-bg" />
      <div className="poster-content">
        <div className="overlay-text p2-category">{category}</div>
        <div className="overlay-text p2-program">{program}</div>
        
        {first && (
          <>
            <div className="overlay-text p2-first-label">FIRST PLACE</div>
            <div className="overlay-text p2-first-name">{first.student_name}</div>
            <div className="overlay-text p2-first-unit">{first.unit_name}</div>
          </>
        )}
        
        {second && (
          <>
            <div className="overlay-text p2-second-label">SECOND PLACE</div>
            <div className="overlay-text p2-second-name">{second.student_name}</div>
            <div className="overlay-text p2-second-unit">{second.unit_name}</div>
          </>
        )}
        
        {third && (
          <>
            <div className="overlay-text p2-third-label">THIRD PLACE</div>
            <div className="overlay-text p2-third-name">{third.student_name}</div>
            <div className="overlay-text p2-third-unit">{third.unit_name}</div>
          </>
        )}
      </div>
    </div>
  );
});

export const Poster3 = forwardRef(({ program, category, winners }, ref) => {
  const first = winners?.find(w => w.position === 1);
  const second = winners?.find(w => w.position === 2);
  const third = winners?.find(w => w.position === 3);

  return (
    <div className="poster-container" ref={ref}>
      <img src="/Poster3 actual base image.png" alt="Poster Background" className="poster-bg" />
      <div className="poster-content">
        <div className="overlay-text p3-category">{category}</div>
        <div className="overlay-text p3-program">{program}</div>
        
        {first && (
          <>
            <div className="overlay-text p3-first-label">WINNER</div>
            <div className="overlay-text p3-first-name">{first.student_name}</div>
            <div className="overlay-text p3-first-unit">{first.unit_name}</div>
          </>
        )}
        
        {second && (
          <>
            <div className="overlay-text p3-second-label">SECOND</div>
            <div className="overlay-text p3-second-name">{second.student_name}</div>
            <div className="overlay-text p3-second-unit">{second.unit_name}</div>
          </>
        )}
        
        {third && (
          <>
            <div className="overlay-text p3-third-label">THIRD</div>
            <div className="overlay-text p3-third-name">{third.student_name}</div>
            <div className="overlay-text p3-third-unit">{third.unit_name}</div>
          </>
        )}
      </div>
    </div>
  );
});


