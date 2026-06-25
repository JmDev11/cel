import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Calendar, Coffee, Copy, Utensils, Clock, Check, Eye } from 'lucide-react';
import './App.css';

// --- CANVAS HEART TRAIL & CONFETTI SYSTEM ---
const HeartCanvas = ({ triggerConfetti }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const confettiParticles = useRef([]);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Drawing a single heart particle
    const drawHeart = (ctx, x, y, size, color, alpha, angle = 0) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.bezierCurveTo(-size / 2, -size, -size, -size / 2, -size, 0);
      ctx.bezierCurveTo(-size, size / 2, -size / 2, size, 0, size * 1.2);
      ctx.bezierCurveTo(size / 2, size, size, size / 2, size, 0);
      ctx.bezierCurveTo(size, -size / 2, size / 2, -size, 0, -size / 2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    // Drawing standard confetti (squares/rectangles)
    const drawConfetti = (ctx, x, y, width, height, color, alpha, angle, skew) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.transform(1, 0, skew, 1, 0, 0);
      ctx.fillStyle = color;
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
    };

    const colors = ['#ec4899', '#f43f5e', '#a855f7', '#d946ef', '#c084fc', '#fbcfe8'];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Update & Draw Mouse Cursor Trail Particles
      particles.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0.02;
        p.alpha -= 0.015;
        p.size *= 0.98;
        p.angle += p.spin;

        drawHeart(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.alpha), p.angle);

        if (p.alpha <= 0 || p.size <= 2) {
          particles.current.splice(idx, 1);
        }
      });

      // 2. Update & Draw Confetti Particles
      confettiParticles.current.forEach((c, idx) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.angle += c.spin;
        c.alpha -= c.fadeRate || 0.005;

        if (c.isHeart) {
          drawHeart(ctx, c.x, c.y, c.size, c.color, Math.max(0, c.alpha), c.angle);
        } else {
          drawConfetti(ctx, c.x, c.y, c.width, c.height, c.color, Math.max(0, c.alpha), c.angle, c.skew);
        }

        // Remove if off-screen or faded
        if (c.alpha <= 0 || c.y > canvas.height + 50) {
          confettiParticles.current.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse handlers to spawn trail
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;

      // Spawn 1-2 trail particles per mouse move
      if (Math.random() < 0.4) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 1.2,
          size: Math.random() * 8 + 8,
          alpha: 1,
          spin: (Math.random() - 0.5) * 0.05,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        mouse.current.x = touch.clientX;
        mouse.current.y = touch.clientY;
        if (Math.random() < 0.4) {
          particles.current.push({
            x: touch.clientX,
            y: touch.clientY,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 1.2,
            size: Math.random() * 6 + 6,
            alpha: 1,
            spin: (Math.random() - 0.5) * 0.05,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Listen to external trigger for full celebration confetti explosion
  useEffect(() => {
    if (triggerConfetti > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const colors = ['#ec4899', '#f43f5e', '#a855f7', '#d946ef', '#fbbf24', '#38bdf8', '#34d399'];
      const count = 180;

      // Burst of confetti from bottom left, bottom right and center
      for (let i = 0; i < count; i++) {
        // Random starting positions near bottom/middle
        const originX = Math.random() * canvas.width;
        const originY = canvas.height + 20;

        const isHeart = Math.random() < 0.4;
        const speed = Math.random() * 15 + 10;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; // upwards with spread

        confettiParticles.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.25,
          size: Math.random() * 12 + 10,
          width: Math.random() * 10 + 6,
          height: Math.random() * 14 + 8,
          alpha: 1,
          fadeRate: Math.random() * 0.004 + 0.002,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.1,
          skew: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          isHeart
        });
      }
    }
  }, [triggerConfetti]);

  return <canvas ref={canvasRef} className="cursor-canvas" />;
};

// --- APP COMPONENT ---
export default function App() {
  const [stage, setStage] = useState('proposal'); // proposal -> planning -> ticket
  const [noButtonText, setNoButtonText] = useState('No');
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [hoverCount, setHoverCount] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(0);
  
  // Planner state variables
  const [selectedDateType, setSelectedDateType] = useState('Sushi & Drinks');
  const [selectedDay, setSelectedDay] = useState('Friday');
  const [specialRequest, setSpecialRequest] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  
  const noButtonRef = useRef(null);

  // Escaping texts for the "No" button
  const escapeTexts = [
    "No",
    "Are you sure? 🥺",
    "Think again! 🌸",
    "No is not an option! 🤫",
    "Error: button broken! 🛠️",
    "Nice try! 😜",
    "Click Yes! 👇",
    "Just accept it! ❤️",
    "Resistance is futile! 😉",
    "Okay, closing this option..."
  ];

  const dateTypes = [
    { name: 'Sushi & Drinks', emoji: '🍣', desc: 'Rolls, laughs, and delicious drinks' },
    { name: 'Cozy Coffee Date', emoji: '☕', desc: 'Sweet treats, warm mugs, and deep chats' },
    { name: 'Arcade & Gaming', emoji: '🎮', desc: 'Playful competition & neon lights' },
    { name: 'Fancy Candlelight', emoji: '🕯️', desc: 'Dressing up, soft music, and fine dining' },
    { name: 'Stargazing Picnic', emoji: '🌌', desc: 'Blankets, sweet treats, and stargazing' },
    { name: 'Surprise Me!', emoji: '✨', desc: 'Trust the vibes, it will be amazing' }
  ];

  const days = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle "No" button click (shrinking and text rotation)
  const handleNoClick = (e) => {
    e.preventDefault();
    setHoverCount(prev => prev + 1);

    // Shrink the No button
    setNoScale(prev => Math.max(0, prev - 0.2));

    // Grow the Yes button
    setYesScale(prev => Math.min(prev + 0.35, 4));

    // Rotate text
    const nextTextIndex = Math.min(hoverCount + 1, escapeTexts.length - 1);
    setNoButtonText(escapeTexts[nextTextIndex]);
  };

  const handleYesClick = () => {
    // Spark confetti explosion
    setTriggerConfetti(prev => prev + 1);
    
    // Smooth transition to planning page after 1.2s delay
    setTimeout(() => {
      setStage('planning');
    }, 1000);
  };

  // Toast notifier helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyTicket = () => {
    const textToCopy = `It's a date! 🥂\n\n` + 
                       `✨ Date Type: ${selectedDateType}\n` +
                       `📅 Selected Day: ${selectedDay}\n` +
                       `💌 Special Note: "${specialRequest || 'No special requests, just good vibes!'}"\n\n` +
                       `Can't wait! ❤️`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        triggerToast("Ticket copied to clipboard! Send it to me! 💌");
      })
      .catch(() => {
        triggerToast("Could not copy automatically. Please take a screenshot!");
      });
  };

  const handlePlannerSubmit = (e) => {
    e.preventDefault();
    setStage('ticket');
    setTriggerConfetti(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <HeartCanvas triggerConfetti={triggerConfetti} />

      {/* --- PROPOSAL STAGE --- */}
      {stage === 'proposal' && (
        <div className="proposal-card">
          <div className="mascot-container">
            💖
            <span className="floating-heart-bubble heart-bubble-1">🎈</span>
            <span className="floating-heart-bubble heart-bubble-2">✨</span>
          </div>

          <h1 className="card-title">Will you go on a date with me?</h1>
          <p className="card-subtitle">
            I promise delicious food, endless laughs, and zero awkward silences. Deal? 😉
          </p>

          <div className="buttons-container">
            <button
              className="btn-date btn-yes"
              style={{ transform: `scale(${yesScale})` }}
              onClick={handleYesClick}
            >
              <Heart size={20} fill="white" /> Yes, absolutely!
            </button>

            {noScale > 0.05 && (
              <button
                ref={noButtonRef}
                className="btn-date btn-no"
                style={{ transform: `scale(${noScale})` }}
                onClick={handleNoClick}
              >
                {noButtonText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- PLANNING STAGE --- */}
      {stage === 'planning' && (
        <div className="proposal-card">
          <div className="mascot-container" style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
            🥳🎉
          </div>
          <h1 className="card-title" style={{ fontSize: '2.1rem' }}>Yay! It's a Date!</h1>
          <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
            Let's design the perfect hangout. Pick your favorites:
          </p>

          <form className="planner-form" onSubmit={handlePlannerSubmit}>
            <div className="form-group">
              <span className="form-label">
                <Utensils size={16} /> 1. Choose the Vibe
              </span>
              <div className="options-grid">
                {dateTypes.map(item => (
                  <div
                    key={item.name}
                    className={`option-card ${selectedDateType === item.name ? 'selected' : ''}`}
                    onClick={() => setSelectedDateType(item.name)}
                  >
                    <span className="option-emoji">{item.emoji}</span>
                    <span className="option-name">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">
                <Calendar size={16} /> 2. Pick a Day
              </span>
              <div className="days-container">
                {days.map(day => (
                  <div
                    key={day}
                    className={`day-pill ${selectedDay === day ? 'selected' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">
                <Clock size={16} /> 3. Special Requests / Notes
              </span>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. 'Must include dessert', 'Dress code: comfy'"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-date btn-submit">
              Generate Official Ticket 🎫
            </button>
          </form>
        </div>
      )}

      {/* --- TICKET DISPLAY STAGE --- */}
      {stage === 'ticket' && (
        <div className="proposal-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
          <div className="ticket-wrapper">
            <div className="ticket">
              <div className="ticket-header">
                <div className="ticket-logo">💌</div>
                <div className="ticket-tag">Official Invite Receipt</div>
                <h2 className="ticket-title">Date Night Ticket</h2>
              </div>

              <div className="ticket-divider" />

              <div className="ticket-details">
                <div className="ticket-row">
                  <span className="ticket-label">Guest of Honor</span>
                  <span className="ticket-value">My Crush 💖</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Vibe / Activity</span>
                  <span className="ticket-value">{selectedDateType}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Target Day</span>
                  <span className="ticket-value">{selectedDay}</span>
                </div>
                <div className="ticket-row" style={{ alignItems: 'flex-start' }}>
                  <span className="ticket-label">Special Request</span>
                  <span className="ticket-value">
                    {specialRequest ? `"${specialRequest}"` : 'No special requests, just good vibes!'}
                  </span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Status</span>
                  <span className="ticket-value" style={{ color: '#059669', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Check size={16} strokeWidth={3} /> CONFIRMED
                  </span>
                </div>
              </div>

              <div className="ticket-divider" />

              <div className="ticket-footer">
                <div className="ticket-barcode">||| | |||| | || ||| || ||</div>
                <p style={{ fontSize: '0.7rem', color: '#85727a', marginTop: '0.4rem', textAlign: 'center' }}>
                  No refunds. Smiling & laughing is mandatory.
                </p>
              </div>
            </div>
          </div>

          <button className="btn-date btn-share" onClick={handleCopyTicket}>
            <Copy size={16} /> Copy Confirmation details & Send 💌
          </button>

          {toastMessage && <div className="toast-msg">{toastMessage}</div>}
        </div>
      )}
    </div>
  );
}
