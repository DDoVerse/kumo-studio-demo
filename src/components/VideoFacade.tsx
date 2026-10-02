"use client";

import { useState } from "react";

/**
 * Click-to-load Vimeo facade.
 *
 * Nothing is requested from Vimeo until someone presses play. An embed
 * usually drags in a few hundred KB of third-party JavaScript, so this is
 * the single largest thing keeping the page inside its budget.
 *
 * It is typographic rather than a poster image, because the site carries no
 * decorative imagery — which also means the facade itself weighs nothing.
 *
 * One of the only two files on the site that ship client JavaScript.
 */
export default function VideoFacade({
  vimeoId,
  title,
  playLabel,
  note,
  length,
}: {
  vimeoId: string;
  title: string;
  playLabel: string;
  note: string;
  length?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full border border-rule bg-paper">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&dnt=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group flex aspect-video w-full flex-col justify-end border border-rule p-6 text-left transition-colors hover:border-ink-3 md:p-10"
      >
        <span className="text-[clamp(1.4rem,3.6vw,2.6rem)] leading-tight tracking-[-0.03em] underline underline-offset-[10px] decoration-1 decoration-rule-2 group-hover:decoration-ink">
          {playLabel}
        </span>
        {length ? (
          <span className="tnum mt-3 text-[13px] text-ink-3">{length}</span>
        ) : null}
      </button>
      <p className="mt-3 text-[13px] text-ink-3">{note}</p>
    </div>
  );
}
