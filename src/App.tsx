import React, { useEffect, useRef, useState } from 'react';
import weddingSong from './music/_Seetha_Kalyana_Vaibhogame.mp3';

/* Corner ornament (uses <symbol id="corner"> defined below) */
const Corner = ({ pos }: { pos: string }) => (
  <svg className={`corner ${pos}`} viewBox="0 0 60 60" aria-hidden="true">
    <use href="#corner" />
  </svg>
);

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const songRef = useRef<HTMLAudioElement>(null);

  const [opened, setOpened] = useState(false);
  const [open, setOpen] = useState(false);
  const [musicPaused, setMusicPaused] = useState(true);
  const [countHtml, setCountHtml] = useState('');

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    const target = new Date('2026-11-01T10:50:00+05:30').getTime();

    const tick = () => {
      let d = target - Date.now();

      if (d <= 0) {
        setCountHtml(
          '<b style="font-family:Cinzel,serif;color:#7a1526;letter-spacing:2px">WITH YOUR BLESSINGS</b>'
        );
        return;
      }

      const values = (
        [
          ['Days', 864e5],
          ['Hours', 36e5],
          ['Mins', 6e4],
          ['Secs', 1e3],
        ] as [string, number][]
      )
        .map(([label, ms]) => {
          const value = Math.floor(d / ms);
          d -= value * ms;
          return `
            <div>
              <b>${String(value).padStart(2, '0')}</b>
              <span>${label}</span>
            </div>
          `;
        })
        .join('');

      setCountHtml(values);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  /* ================= OPEN CARD + START MUSIC ================= */
  const openCard = async () => {
    if (opened) return;
    setOpened(true);

    const song = songRef.current;

    // play() must be called straight from the click (before any timeout)
    if (song) {
      song.volume = 0.8;
      song.currentTime = 0;
      try {
        await song.play();
        setMusicPaused(false);
      } catch (error) {
        console.error(
          'Wedding music could not play:',
          (error as Error).name,
          error
        );
        setMusicPaused(true);
      }
    }

    window.setTimeout(() => {
      setOpen(true);

      if (paperRef.current) {
        paperRef.current.style.maxHeight =
          paperRef.current.scrollHeight + 'px';
      }

      window.setTimeout(() => {
        if (paperRef.current) paperRef.current.style.maxHeight = 'none';
        if (ribbonRef.current) ribbonRef.current.style.display = 'none';
      }, 2600);
    }, 1000);
  };

  /* ================= MUSIC ON / OFF ================= */
  const toggleMusic = async () => {
    const song = songRef.current;
    if (!song) return;

    if (song.paused) {
      try {
        await song.play();
        setMusicPaused(false);
      } catch (error) {
        console.error('Music could not play:', (error as Error).name, error);
      }
    } else {
      song.pause();
      setMusicPaused(true);
    }
  };

  return (
    <>
      {/* BACKGROUND */}
      <div className="bg"></div>
      <div className="veil"></div>

      {/* SVG DEFINITIONS */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <symbol id="corner" viewBox="0 0 60 60">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M4 58V20C4 10 12 4 22 4H58" />
            <path d="M12 58V26C12 19 17 12 24 12H58" opacity=".55" />
            <path d="M22 22c-7-1-9 8-2 10 7 2 11-7 4-10-4-2-8 1-7 4" />
            <path d="M30 14c4 1 6 5 4 8M14 30c1 4 5 6 8 4" />
          </g>
          <circle cx="8" cy="8" r="2.4" fill="currentColor" />
        </symbol>

        <symbol id="lotus" viewBox="0 0 24 24">
          <path d="M12 2c2 3 2 6 0 9-2-3-2-6 0-9zm-7 5c3 0 5 2 6 5-3 0-5-2-6-5zm14 0c-1 3-3 5-6 5 1-3 3-5 6-5zM12 13c2 0 4 1 5 3-1 3-3 6-5 6s-4-3-5-6c1-2 3-3 5-3z" />
        </symbol>
      </svg>

      {/* WEDDING MUSIC */}
      <audio
        ref={songRef}
        src={weddingSong}
        loop
        preload="auto"
        onError={() => {
          const a = songRef.current;
          console.error(
            'Audio load error:',
            a?.error?.code,
            a?.error?.message,
            a?.currentSrc
          );
        }}
      />

      {/* MAIN STAGE */}
      <div className={`stage ${opened ? 'opened' : ''}`} id="stage">
        {/* TOP TEXT */}
        <div className="pre top">
          <p className="kicker">WEDDING INVITATION</p>
          <p className="names">Vishnuprasad &amp; Soorya</p>
        </div>

        {/* SCROLL */}
        <div
          className={`scroll ${open ? 'open' : ''} ${opened ? 'untie' : ''}`}
          id="scroll"
          role="button"
          tabIndex={0}
          aria-label="Open the invitation"
          ref={scrollRef}
          onClick={openCard}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openCard();
            }
          }}
        >
          {/* TOP ROLLER */}
          <div className="roller top"></div>

          {/* PAPER */}
          <div className="paper" id="paper" ref={paperRef}>
            <div className="frame" id="frame">
              {/* CORNERS */}
              <Corner pos="tl" />
              <Corner pos="tr" />
              <Corner pos="bl" />
              <Corner pos="br" />

              {/* LAMP + INVOCATION */}
              <div>
                <svg className="lamp" viewBox="0 0 80 100" aria-hidden="true">
                  <g className="flame">
                    <path d="M40 6c7 9 8 15 0 22-8-7-7-13 0-22z" fill="#e8a020" />
                    <path d="M40 13c3 5 3 8 0 11-3-3-3-6 0-11z" fill="#fff0b0" />
                  </g>
                  <path d="M22 34h36l-4 10H26z" fill="#b8892f" />
                  <path
                    d="M14 44h52c0 7-6 12-13 12H27c-7 0-13-5-13-12z"
                    fill="#c99a3f"
                  />
                  <path d="M36 56h8l3 16H33z" fill="#b8892f" />
                  <ellipse cx="40" cy="76" rx="14" ry="5" fill="#c99a3f" />
                  <path d="M24 80h32l6 14H18z" fill="#a67c2e" />
                </svg>

                <p className="invoke mal">ഹരിഃ ശ്രീ ഗണപതയേ നമഃ</p>
              </div>

              {/* TITLE */}
              <div>
                <p className="k2">WEDDING INVITATION</p>
                <h1 className="title-mal mal">ശുഭ വിവാഹ ക്ഷണക്കത്ത്</h1>
              </div>

              {/* DIVIDER */}
              <div className="divider">
                <i></i>
                <svg>
                  <use href="#lotus" />
                </svg>
                <i></i>
              </div>

              {/* GROOM */}
              <div>
                <div className="name">Vishnuprasad KS</div>
                <p className="parents">
                  <small>S/O</small>
                  Mr. Sadasivan &amp; Mrs. Jalaja Sadasivan
                </p>
              </div>

              <p className="weds">— WEDS —</p>

              {/* BRIDE */}
              <div>
                <div className="name">Soorya KS</div>
                <p className="parents">
                  <small>D/O</small>
                  Mr. Pradeep Kumar &amp; Mrs. Babitha Pradeep Kumar
                </p>
              </div>

              {/* DIVIDER */}
              <div className="divider">
                <i></i>
                <svg>
                  <use href="#lotus" />
                </svg>
                <i></i>
              </div>

              {/* WEDDING DETAILS */}
              <section className="details">
                <div className="date">01 · 11 · 2026</div>
                <div>Sunday</div>
                <div className="mal-date mal">
                  കൊല്ലവർഷം 1202 തുലാം 15
                </div>

                <div className="time">
                  Muhoortham <b>10:50 – 10:55 AM</b>
                </div>

                {/* GROOM HOME LOCATION */}
<div className="venue">
  <b>Kuzhiparambhil House</b>
  <br />
  Kadalmad Post
  <br />
  Vaduvanchal, Wayanad
</div>

                {/* GOOGLE MAPS */}
                <a
                  className="btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.google.com/maps/dir/?api=1&destination=11.5738211,76.1847763"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  VIEW LOCATION
                </a>
              </section>

              {/* COUNTDOWN */}
              <div
                className="count"
                id="count"
                dangerouslySetInnerHTML={{ __html: countHtml }}
              ></div>

              {/* FOOTER MESSAGE */}
              <p className="foot">
                Your presence and blessings will make our day complete.
                <span className="mal">
                  നിങ്ങളുടെ സാന്നിധ്യവും അനുഗ്രഹവും ഞങ്ങളുടെ ഈ വിവാഹത്തിന് ഉണ്ടാകണമെന്ന് സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു
                </span>
              </p>

              <p className="foot-name">Vishnu &amp; Soorya</p>
            </div>
          </div>

          {/* BOTTOM ROLLER */}
          <div className="roller bottom"></div>

          {/* RIBBON */}
          <div className="ribbon" id="ribbon" aria-hidden="true" ref={ribbonRef}>
            <div className="band"></div>

            <svg className="bow" viewBox="0 0 84 84">
              <path
                d="M42 42 30 80l9-5 4 8 2-38z"
                fill="#7a1526"
                stroke="#f1d999"
                strokeWidth="1"
              />
              <path
                d="M42 42 54 80l-9-5-4 8-2-38z"
                fill="#a3182e"
                stroke="#f1d999"
                strokeWidth="1"
              />
              <path
                d="M42 42C8 8 4 46 42 42z"
                fill="#a3182e"
                stroke="#f1d999"
                strokeWidth="1.2"
              />
              <path
                d="M42 42C76 8 80 46 42 42z"
                fill="#8c1428"
                stroke="#f1d999"
                strokeWidth="1.2"
              />
              <circle
                cx="42"
                cy="42"
                r="7"
                fill="#c9243c"
                stroke="#f1d999"
                strokeWidth="1.2"
              />
            </svg>
          </div>
        </div>

        {/* BOTTOM TEXT */}
        <div className="pre bottom">
          <p className="hint">
            TAP THE SCROLL TO OPEN
            <span>തുറക്കാൻ സ്പർശിക്കുക</span>
          </p>
        </div>
      </div>

      {/* MUSIC BUTTON */}
      <button
        id="music"
        aria-label={musicPaused ? 'Play music' : 'Pause music'}
        title={musicPaused ? 'Play music' : 'Pause music'}
        onClick={toggleMusic}
      >
        <svg id="ico" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 3v11.3A3.5 3.5 0 1 0 11 17.5V7h8V3z" />
        </svg>
      </button>
    </>
  );
}