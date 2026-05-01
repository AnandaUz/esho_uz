export class CYtPlayer extends HTMLElement {
  private started = false;
  private elapsed = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private fired30 = false;
  private firedFull = false;
  private duration = 0;

  get videoId() {
    return this.getAttribute("video-id") ?? "";
  }
  get collapsedHeight() {
    return this.getAttribute("collapsed-height") ?? "200px";
  }
  get expandedHeight() {
    return this.getAttribute("expanded-height") ?? "640px";
  }

  connectedCallback() {
    this.render();
    this.querySelector(".yt-play-btn")!.addEventListener("click", () =>
      this.handlePlay(),
    );
  }

  private render() {
    this.innerHTML = `
      <div class="yt-container collapsed">
        <img class="yt-thumb"
          src="https://img.youtube.com/vi/${this.videoId}/hqdefault.jpg" alt="">
        <div class="yt-overlay">
          <button class="yt-play-btn">▶</button>
        </div>
        <iframe class="yt-frame" src="" allow="autoplay; fullscreen" allowfullscreen></iframe>
      </div>
    `;
  }

  private handlePlay() {
    if (this.started) return;
    this.started = true;

    const wrap = this.querySelector(".yt-container")!;
    wrap.classList.remove("collapsed");
    wrap.classList.add("expanded");
    this.querySelector(".yt-overlay")!.classList.add("hidden");

    const frame = this.querySelector<HTMLIFrameElement>(".yt-frame")!;
    frame.src = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&enablejsapi=1&rel=0`;

    this.emit("yt:play");
    this.startTimer();
  }

  private startTimer() {
    this.timer = setInterval(() => {
      this.elapsed++;
      if (!this.fired30 && this.elapsed >= 30) {
        this.fired30 = true;
        this.emit("yt:watch_30s");
      }
      if (
        !this.firedFull &&
        this.duration > 0 &&
        this.elapsed >= this.duration
      ) {
        this.firedFull = true;
        this.emit("yt:watch_complete");
        clearInterval(this.timer!);
      }
    }, 1000);
  }

  private emit(name: string) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { videoId: this.videoId },
        bubbles: true,
      }),
    );
  }

  disconnectedCallback() {
    if (this.timer) clearInterval(this.timer);
  }
}

customElements.define("c-yt-player", CYtPlayer);
