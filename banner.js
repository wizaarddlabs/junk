export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set("Accept-Encoding", "identity");

    const host = url.hostname;
    const isAioStreams = host.includes('aiostreams');

    const response = await fetch(request, {
      headers: modifiedHeaders,
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }

    const bannerHTML = '<div class="tb-banner"><div class="tb-left"><div class="tb-icon">⚡</div><div><div class="tb-label">Our recommendation</div><div class="tb-title">Faster streams with TorBox</div><div class="tb-desc">Instant cached streams, zero buffering, premium hosters.</div></div></div><div class="tb-pills"><span class="tb-pill">4K ready</span><span class="tb-pill">No waiting</span><span class="tb-pill">Affordable</span></div><div class="tb-right"><a class="tb-btn" href="https://torbox.app/subscription?referral=161b1366-85ce-4e36-8339-94fe27c4e49f" target="_blank">Try TorBox →</a><div class="tb-note">Not sponsored · we earn referral credit</div></div></div>';

    const inject = `
<style>
  #tb-banner-wrapper {
    all: initial !important;
    display: block !important;
    width: 100% !important;
    box-sizing: border-box !important;

    /* FIX: remove black bar */
    padding: 0.75rem 0 !important;
    margin: 0 !important;
    position: relative !important;
    z-index: 10 !important;
    background: transparent !important;
  }

  #tb-banner-wrapper * {
    box-sizing: border-box !important;
  }

  .tb-banner {
    all: initial !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
    background: #111 !important;
    border: 1px solid #333 !important;
    border-radius: 12px !important;
    padding: 1rem 1.25rem !important;

    /* center nicely */
    margin: 0 auto !important;

    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 1.5rem !important;
    flex-wrap: wrap !important;
    width: 100% !important;
    max-width: 1024px !important;
    color: white !important;
    line-height: 1.4 !important;
  }

  .tb-left {
    all: initial !important;
    display: flex !important;
    align-items: center !important;
    gap: 1rem !important;
    flex: 1 !important;
    min-width: 200px !important;
    color: white !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }

  .tb-icon {
    all: initial !important;
    width: 36px !important;
    height: 36px !important;
    background: #222 !important;
    border: 1px solid #444 !important;
    border-radius: 9px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 17px !important;
    flex-shrink: 0 !important;
  }

  .tb-label {
    all: initial !important;
    display: block !important;
    font-size: 10px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    color: #777 !important;
    margin-bottom: 2px !important;
    letter-spacing: 0.05em !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }

  .tb-title {
    all: initial !important;
    display: block !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    color: #eee !important;
    margin: 0 !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }

  .tb-desc {
    all: initial !important;
    display: block !important;
    font-size: 12px !important;
    color: #999 !important;
    margin: 0 !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }

  .tb-pills {
    all: initial !important;
    display: flex !important;
    gap: 6px !important;
    flex-shrink: 0 !important;
  }

  .tb-pill {
    all: initial !important;
    font-size: 11px !important;
    color: #999 !important;
    background: #1a1a1a !important;
    border: 1px solid #333 !important;
    border-radius: 100px !important;
    padding: 2px 10px !important;
    white-space: nowrap !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }

  .tb-right {
    all: initial !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    gap: 4px !important;
    flex-shrink: 0 !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }

  .tb-btn {
    all: initial !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #fff !important;
    background: #333 !important;
    border: 1px solid #444 !important;
    border-radius: 8px !important;
    padding: 0.5rem 1rem !important;
    text-decoration: none !important;
    cursor: pointer !important;
    transition: background 0.2s !important;
    display: inline-block !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }

  .tb-btn:hover {
    background: #444 !important;
  }

  .tb-note {
    all: initial !important;
    font-size: 9px !important;
    color: #444 !important;
    display: block !important;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
  }
</style>

<script>
(function() {
  const HTML = ${JSON.stringify(bannerHTML)};
  const IS_AIO_STREAMS = ${isAioStreams};

  function injectBanner() {
    if (document.getElementById('tb-banner-wrapper')) return;

    const container = document.createElement('div');
    container.id = 'tb-banner-wrapper';
    container.innerHTML = HTML;

    if (document.body) {
      document.body.prepend(container);
    }
  }

  function replaceLogo() {
    if (!IS_AIO_STREAMS) return;

    const selectors = ["img[alt='Logo']", "img[alt='logo']"];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(logo => {
        if (!logo.dataset.replaced) {
          const isDefault = !logo.src || logo.src.endsWith('/logo.png');
          if (isDefault) {
            logo.src = "https://github.com/wizaardd-bot/junk/blob/main/IMG_6445.jpeg?raw=true";
          }
          logo.dataset.replaced = "true";
        }
      });
    }
  }

  function waitForBody() {
    if (document.body) {
      injectBanner();
      replaceLogo();

      const observer = new MutationObserver(() => {
        if (!document.getElementById('tb-banner-wrapper')) injectBanner();
        replaceLogo();
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });
    } else {
      setTimeout(waitForBody, 50);
    }
  }

  waitForBody();
})();
<\/script>`;

    return new HTMLRewriter()
      .on("body", {
        element(el) {
          el.prepend(inject, { html: true });
        },
      })
      .transform(response);
  },
};
