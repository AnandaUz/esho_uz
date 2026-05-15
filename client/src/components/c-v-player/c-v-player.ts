import "./c-v-player.scss";

/**
 * <c-v-player> — кастомный элемент для воспроизведения видео
 *
 * Атрибуты:
 *   data-src     — путь к видеофайлу (обязательный)
 *   data-poster  — путь к постеру/превью (необязательный)
 *   data-label   — текст на плашке (необязательный, по умолчанию «Смотреть»)
 *
 * Эмитирует CustomEvent на себе:
 *   vp:start     — первое воспроизведение
 *   vp:half      — просмотрено ≥ 50 %
 *   vp:complete  — просмотрено ≥ 95 %
 */
export class CVPlayer extends HTMLElement {
  private video!: HTMLVideoElement;
  private strip!: HTMLElement;

  private startFired = false;
  private halfFired = false;
  private completeFired = false;

  // ─── Lifecycle ──────────────────────────────────────────

  connectedCallback(): void {
    const src = this.dataset.src ?? "";
    const poster = this.dataset.poster ?? "";

    this.render(src, poster);
    this.bindEvents();

    this.addEventListener("vp:start", () => {
      const track = (window as any).guestTrack;
      if (track) {
        track("v:start");
      }
    });
    this.addEventListener("vp:half", () => {
      const track = (window as any).guestTrack;
      if (track) {
        track("v:half");
      }
    });
    this.addEventListener("vp:complete", () => {
      const track = (window as any).guestTrack;
      if (track) {
        track("v:complete");
      }
    });
  }

  // ─── Render ─────────────────────────────────────────────

  private render(src: string, poster: string): void {
    this.innerHTML = `
      <div class="vp-preview">        
        ${poster ? `<img class="vp-poster-thumb" src="${poster}" alt="">` : ""}
      </div>

      <div class="vp-strip"></div>
      <video
        class="vp-video"
        playsinline
        preload="metadata"
      >
        <source src="${src}" type="video/mp4">
      </video>      
    `;

    this.video = this.querySelector(".vp-video") as HTMLVideoElement;
    this.strip = this.querySelector(".vp-strip") as HTMLElement;
  }

  // ─── Events ─────────────────────────────────────────────

  private bindEvents(): void {
    const preview = this.querySelector(".vp-preview") as HTMLElement;

    preview.addEventListener("click", () => {
      // console.log(this.video.paused);
      this.expand();
    });
    this.video.addEventListener("click", () => this.togglePlayback());
    this.video.addEventListener("timeupdate", () => this.onTimeUpdate());
  }

  // ─── Expand ─────────────────────────────────────────────

  private expand(): void {
    if (this.classList.contains("is-expanded")) return;

    const naturalHeight = this.offsetWidth * (14 / 9);
    this.style.setProperty("--vp-natural-height", `${naturalHeight}px`);
    this.style.setProperty("height", `${naturalHeight}px`);

    this.classList.add("is-expanded");

    // Доскроллить: элемент к верхнему краю viewport
    setTimeout(() => {
      const top = this.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }, 60);

    // Запуск видео после начала CSS-перехода
    setTimeout(() => this.play(), 300);
  }

  // ─── Playback ───────────────────────────────────────────

  private play(): void {
    this.video.play().catch(() => {});
  }

  private togglePlayback(): void {
    if (!this.classList.contains("is-expanded")) return;

    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  // ─── Progress & custom events ───────────────────────────

  private onTimeUpdate(): void {
    const { currentTime, duration } = this.video;
    if (!duration) return;

    // Полоска прогресса
    this.strip.style.width = `${(currentTime / duration) * 100}%`;

    const ratio = currentTime / duration;

    if (!this.startFired && currentTime > 0) {
      this.startFired = true;
      this.emit("vp:start");
    }

    if (!this.halfFired && ratio >= 0.5) {
      this.halfFired = true;
      this.emit("vp:half");
    }

    if (!this.completeFired && ratio >= 0.95) {
      this.completeFired = true;
      this.emit("vp:complete");
    }
    if (ratio >= 1) {
      this.classList.remove("is-expanded");
      this.style.setProperty("height", "");
    }
  }

  // ─── Emit ───────────────────────────────────────────────

  private emit(name: string): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true }));
  }
}

customElements.define("c-v-player", CVPlayer);
