"use client";

import { useState } from "react";

/**
 * Vimeo 클릭 후 로드 파사드.
 *
 * 누르기 전까지 Vimeo 로 아무 요청도 나가지 않는다 — 임베드는 보통
 * 수백 KB 의 서드파티 JS 를 끌고 오므로, 이것이 성능 예산을 지키는
 * 가장 큰 한 수다.
 *
 * 포스터 이미지를 쓰지 않고 타이포그래피만으로 만든다. 이 사이트는
 * 장식용 이미지를 두지 않기 때문이고, 덕분에 파사드 자체의 무게도 0 이다.
 *
 * 이 파일이 사이트 전체에서 클라이언트 JS 가 실리는 두 곳 중 하나다.
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
