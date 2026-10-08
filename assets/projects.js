// Every project's content lives here - the home page and each project page both read from it.
// Add a project by adding an entry; `slug` is its URL (alexloker.com/<slug>).

// ============ PALETTES ============
const palettes=[
  ['#FF6B8A','#4ECDC4','#FFD93D','#7B61FF','#FF9F1C','#2EC4B6'],
  ['#FF8A5C','#7DCEA0','#A78BFA','#FF6B6B','#4CC9F0','#FFD166'],
  ['#FF69B4','#00CED1','#FFE066','#B983FF','#FF9F5C','#43AA8B'],
  ['#F77F00','#06D6A0','#EF476F','#118AB2','#8338EC','#FFB4A2'],
  ['#FF5E78','#36D6B6','#FFC947','#9D4EDD','#4EA8DE','#80FFDB'],
  ['#E056A0','#56CBF9','#F5E960','#FF8FAB','#70E4EF','#B5E48C'],
  ['#FF6F91','#67E8B4','#FFD166','#9D8CFF','#FF8C42','#4CC9A0'],
];
const palette=palettes[Math.floor(Math.random()*palettes.length)];

// ============ DIGITAL AUDIO PLAYER: IC CARDS ============
// One card per block of the schematic, grouped and ordered by the architecture
// (Power -> Audio -> Peripherals -> MCU). Add a `footprint` image to replace the placeholder.
const dapGroups = [
  { name:'Power', chain:'USB-C → BQ24250 → 3.9 V Buck-Boost → ±3V3 LDOs · 3V3 Digital', ics:[
    { title:'USB-C', part:'GCT USB4085-GF-A', img:'https://i.imgur.com/VYv6Hqc.png',
      desc:'USB 2.0, used for charging and file upload. ESD protection on all ports, alongside a ferrite-bead pi filter on the USB input. Verified in LTspice.' },
    { title:'Charger', part:'BQ24250RGET', img:'https://i.imgur.com/XAhwgGJ.png',
      desc:'The BQ24250 is a single-cell LiPo switching charger that charges the 1850 mAh battery at 500 mA and communicates over I²C, with very heavy output filtering to keep ripple downstream as low as possible. It has a 1 A input limit and powers the <button type="button" class="ic-link" data-ic="3.9 V Buck-Boost">3.9 V buck-boost</button>, the <button type="button" class="ic-link" data-ic="3V3 Buck-Boost (Digital)">3.3 V buck-boost</button> and the <button type="button" class="ic-link" data-ic="LED Driver">LED driver</button>.' },
    { title:'3.9 V Buck-Boost', part:'LTC3440', img:'https://i.imgur.com/bl4oz3n.png',
      desc:'This buck-boost turns the SYS rail (3.0 to 4.2 V) into a very steady 3.9 V with 7.7 mVpp of ripple, switching at 1.2 MHz. This rail feeds the two +3V3 LDOs and the inverter. The 3.9 V is intentionally set as close to the LDOs\' dropout as is safe, to minimize the thermal issues that come with LDOs. Verified in LTspice.' },
    { title:'+3V3 LDO (Analog)', part:'LT3042', img:'https://i.imgur.com/cyzvwPZ.png',
      desc:'A very low-noise, high-PSRR LDO that drops the 3.9 V from the buck-boost to an extremely stable output rail, +3V3_ANALOG, which powers the op-amps cleanly; any noise on their supply would directly influence the audio path. Verified in LTspice.' },
    { title:'+3V3 LDO (DAC)', part:'LT3042', img:'https://i.imgur.com/zA0fEQr.png',
      desc:'The second LT3042 is dedicated specifically to the DAC\'s analog supply inputs, because the DAC\'s output scales with this supply and can potentially create noise on it. Keeping it separate avoids making the op-amp power supply noisy, as detailed previously.' },
    { title:'Inverted Regulator (−3.9 V)', part:'LT3462A', img:'https://i.imgur.com/VnGrxME.png',
      desc:'An inverting regulator running at 2.7 MHz turns +3.9 V into −3.9 V for the negative LDO, as the op-amps run off a ± supply. Verified in LTspice.' },
    { title:'−3V3 LDO', part:'LT3093', img:'https://i.imgur.com/k3DBvRV.png',
      desc:'An ultralow-noise negative LDO that turns −3.9 V into the −3V3 rail, so the op-amps run on a clean, symmetric ±3.3 V supply. Verified in LTspice.' },
    { title:'3V3 Buck-Boost (Digital)', part:'LTC3440', img:'https://i.imgur.com/a5zvvVG.png',
      desc:'The other LTC3440 buck-boost takes the SYS rail and produces another 3.3 V rail, this time for the digital components, hence +3V3_DIG. It powers the MCU, microSD, buttons, LCD and the DAC\'s digital supply. Verified in LTspice.' },
  ]},
  { name:'Audio', chain:'DAC → I/V Conversion → Summing → Output', ics:[
    { title:'DAC', part:'ES9038Q2M', img:'https://i.imgur.com/hY5AZuC.png',
      desc:'A 32-bit stereo DAC with differential current outputs. It is the I²S master, clocked from one of two oscillators: 22.5792 MHz or 24.576 MHz, for the 44.1 kHz and 48 kHz families of music sample rates. It runs as master because slave mode, which relies on its DPLL, produces more noise at the audio output, even though master mode is more difficult to implement. The DAC has four differential current outputs: L+, L−, R+ and R−.' },
    { title:'I/V Conversion', part:'OPA1612', img:'https://i.imgur.com/pBAYwzZ.png',
      desc:'The DAC\'s four differential current outputs are converted into proportional differential voltages, alongside a basic filter.' },
    { title:'Summing Stage', part:'OPA1612', img:'https://i.imgur.com/diww6IE.png',
      desc:'The summing stage (one OPA1612) takes the four differential voltages and sums the difference between each positive and negative pair to create two clean left and right audio channels. The OPA1612 also forms an MFB Butterworth low-pass filter with fc at 69.4 kHz. This cancels out potential external noise while keeping the loss to just 0.068 dB at the top of human hearing (20 kHz) when combined with the I/V stage. Verified in PSpice.' },
    { title:'Headphone Output', part:'OPA1622', img:'https://i.imgur.com/RuZJSol.png',
      desc:'The OPA1622 drives the 3.5 mm headphone jack with an output impedance of 0.44 Ω at 20 kHz, suited to low-impedance IEMs. There is ESD protection on the tip and ring of the jack, and the enable pin allows for muting. Verified in PSpice.' },
  ]},
  { name:'Peripherals', chain:'Screen → LED Driver → Buttons → Encoder → SD Card', ics:[
    { title:'Screen', part:'ER-TFT024IPS-3', img:'https://i.imgur.com/dMlBKds.png',
      desc:'A 2.4 in, 240 × 320 IPS TFT display with an ST7789V controller, driven over SPI and connected through a 50-pin, 0.5 mm FPC connector. Its LEDs are controlled by the <button type="button" class="ic-link" data-ic="LED Driver">LED driver</button>, since the supply voltage is too low to push a meaningful current through them on its own.' },
    { title:'LED Driver', part:'BD1604MUV', img:'https://i.imgur.com/oPQiai7.png',
      desc:'Inductor-free charge-pump backlight driver run from SYS with four LED sinks. A MOSFET switches the ISET resistor between two brightness levels, keeping the LED current DC so no PWM lands in the audio band.' },
    { title:'Power / Volume', part:'TL1014BF220QG', img:'https://i.imgur.com/kxB6l3l.png',
      desc:'Three side-actuated switches for power, volume up and volume down, each with a pull-down and decoupling to the MCU.' },
    { title:'Encoder', part:'Alps EC12D', img:'https://i.imgur.com/MyAjGaO.png',
      desc:'Rotary encoder with a push switch used for scrolling and select. RC filtering on each line and an ESD array protect the MCU inputs.' },
    { title:'SD Card', part:'Same Sky MSD-1-A', img:'https://i.imgur.com/loSLMgX.png',
      desc:'microSD socket with card detect running 1-bit SDMMC. It holds the music library and is exposed to a computer over USB as a mass-storage drive. Pull-ups on the bus and an ESD array at the socket.' },
  ]},
  { name:'MCU', chain:'ESP32-S3', ics:[
    { title:'MCU', part:'ESP32-S3', img:'https://i.imgur.com/zCdBbGT.png',
      desc:'The ESP32-S3 is the brain of the PCB. It decodes FLAC/MP3, talks over I²S to the DAC and, through software, drives the display, reads the external buttons and negotiates with USB. It is paired with 8 MB of flash, and does so much more.' },
  ]},
];

// pixel sizes of the schematic crops, so each image reserves its aspect ratio before it loads
const dapDims = {
  'VYv6Hqc':[1040,655],
  'XAhwgGJ':[1545,867],
  'bl4oz3n':[1245,737],
  'cyzvwPZ':[1250,742],
  'zA0fEQr':[1362,807],
  'VnGrxME':[1362,802],
  'k3DBvRV':[1355,797],
  'a5zvvVG':[1700,645],
  'hY5AZuC':[1507,1440],
  'pBAYwzZ':[1707,1150],
  'diww6IE':[1455,1475],
  'RuZJSol':[1710,1192],
  'dMlBKds':[975,1337],
  'oPQiai7':[890,847],
  'kxB6l3l':[890,562],
  'MyAjGaO':[957,675],
  'loSLMgX':[1170,835],
  'zCdBbGT':[2395,1307],
  'VQUsPY6':[2230,1570],
  'PGQ47Zk':[2145,1582],
  'YDPhXR5':[2190,1355],
};
const dapSize = src => { const d = dapDims[(src.match(/imgur\.com\/(\w+)\./) || [])[1]]; return d ? ` width="${d[0]}" height="${d[1]}"` : ''; };

// Every IC in architecture order, each tagged with its group
const dapICs = dapGroups.flatMap((g, gi) => g.ics.map(ic => Object.assign({ group: g, gi }, ic)));

// The page shows a launcher; the cards themselves live in a pop-up you click through.
function dapICLauncherHtml() {
  return `
    <div class="ic-launch">
      <p class="ic-launch-sub">${dapICs.length} parts · ${dapGroups.map(g => g.name).join(' → ')}</p>
      <div class="ic-launch-groups">
        ${dapGroups.map((g, gi) => {
          const first = dapICs.findIndex(ic => ic.gi === gi);
          return `
          <button class="ic-launch-group" onclick="openIcBrowser(${first})">
            <span class="ic-launch-num">0${gi + 1}</span>
            <span class="ic-launch-name">${g.name}</span>
            <span class="ic-launch-count">${g.ics.length} ${g.ics.length === 1 ? 'part' : 'parts'}</span>
          </button>`;
        }).join('')}
      </div>
      <div style="text-align:center">
        <button class="subassembly-btn" onclick="openIcBrowser(0)">Browse Each IC →</button>
      </div>
    </div>`;
}

function dapCardHtml(ic) {
  return `
    <article class="ic-card">
      <h5 class="ic-card-title">${ic.title} <span class="ic-card-part">- ${ic.part}</span></h5>
      <div class="ic-card-panes">
        <figure class="ic-pane">
          <img decoding="async" class="zoomable" src="${ic.img}"${dapSize(ic.img)} alt="${ic.title} - ${ic.part} schematic" onclick="openLightbox(this.src,this.alt)">
          <figcaption>Schematic</figcaption>
        </figure>
        <figure class="ic-pane">
          ${ic.footprint
            ? `<img decoding="async" class="zoomable" src="${ic.footprint}" alt="${ic.title} - ${ic.part} footprint" onclick="openLightbox(this.src,this.alt)">`
            : `<div class="ic-pane-empty">Footprint<br>coming soon</div>`}
          <figcaption>Footprint</figcaption>
        </figure>
      </div>
      <p class="ic-card-desc">${ic.desc}</p>
    </article>`;
}

// ============ IC BROWSER (pop-up) ============
let icIndex = 0;

function icBrowserEl() {
  let el = document.getElementById('ic-modal');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'ic-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'See each IC');
  el.innerHTML = `
    <div class="ic-modal-panel">
      <div class="ic-modal-top">
        <div class="ic-modal-tabs">
          ${dapGroups.map((g, gi) => `<button class="ic-modal-tab" data-gi="${gi}" onclick="openIcBrowser(${dapICs.findIndex(ic => ic.gi === gi)})">${g.name}</button>`).join('')}
        </div>
        <span class="ic-modal-count" id="ic-modal-count"></span>
        <button class="ic-modal-close" onclick="closeIcBrowser()" aria-label="Close">✕</button>
      </div>
      <div class="ic-modal-steps" id="ic-modal-steps"></div>
      <div class="ic-modal-body" id="ic-modal-body"></div>
      <div class="ic-modal-nav">
        <button class="ic-modal-btn" id="ic-modal-prev" onclick="stepIcBrowser(-1)">← <span id="ic-modal-prev-name"></span></button>
        <button class="ic-modal-btn ic-modal-btn-next" id="ic-modal-next" onclick="stepIcBrowser(1)"><span id="ic-modal-next-name"></span> →</button>
      </div>
    </div>`;
  el.addEventListener('click', e => {
    if (e.target === el) { closeIcBrowser(); return; }
    const link = e.target.closest('.ic-link');   // part names in a description jump to that part
    if (link) openIcBrowser(dapICs.findIndex(ic => ic.title === link.dataset.ic));
  });
  // swipe left/right on touch screens
  let sx = null, sy = null;
  el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepIcBrowser(dx < 0 ? 1 : -1);
    sx = null;
  });
  document.body.appendChild(el);
  return el;
}

function renderIcBrowser() {
  const ic = dapICs[icIndex];
  const body = document.getElementById('ic-modal-body');
  body.innerHTML = dapCardHtml(ic);
  body.scrollTop = 0;
  body.classList.remove('ic-fade'); void body.offsetWidth; body.classList.add('ic-fade');
  document.getElementById('ic-modal-count').textContent = `${icIndex + 1} / ${dapICs.length}`;
  document.querySelectorAll('.ic-modal-tab').forEach(t => t.classList.toggle('active', +t.dataset.gi === ic.gi));
  // this group's parts in architecture order, current one highlighted
  document.getElementById('ic-modal-steps').innerHTML = dapICs
    .map((x, i) => x.gi === ic.gi
      ? `<button class="ic-step${i === icIndex ? ' active' : ''}" onclick="openIcBrowser(${i})">${x.title}</button>` : '')
    .filter(Boolean).join('<span class="ic-step-arrow">→</span>');
  const prev = dapICs[icIndex - 1], next = dapICs[icIndex + 1];
  document.getElementById('ic-modal-prev').disabled = !prev;
  document.getElementById('ic-modal-next').disabled = !next;
  document.getElementById('ic-modal-prev-name').textContent = prev ? prev.title : 'Start';
  document.getElementById('ic-modal-next-name').textContent = next ? next.title : 'End';
  // warm the neighbours so clicking through feels instant
  [prev, next].forEach(n => { if (n) new Image().src = n.img; });
}

function openIcBrowser(i) {
  const el = icBrowserEl();
  const wasOpen = el.classList.contains('open');
  icIndex = Math.max(0, Math.min(dapICs.length - 1, i));
  renderIcBrowser();
  if (!wasOpen) {
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    track('ic_browser_opened', { ic: dapICs[icIndex].title });
  }
}

function stepIcBrowser(d) {
  const n = icIndex + d;
  if (n < 0 || n >= dapICs.length) return;
  icIndex = n;
  renderIcBrowser();
}

function closeIcBrowser() {
  const el = document.getElementById('ic-modal');
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  const el = document.getElementById('ic-modal');
  const lb = document.getElementById('lightbox');
  if (!el || !el.classList.contains('open') || (lb && lb.classList.contains('open'))) return;
  if (e.key === 'ArrowRight') stepIcBrowser(1);
  else if (e.key === 'ArrowLeft') stepIcBrowser(-1);
});

// ============ PROJECTS ============
const projects = [
  {
    name:'DMX\nTester',
    displayName:'DMX Handheld Tester',
    catalog:'AL-004',side:'A',year:'2026',
    slug:'dmx-tester',
    tone:'dark',            // artwork tone: 'light' art gets dark type, 'dark' art gets light type
    cover:'https://i.imgur.com/I25zgLJ.png',
    sleeve:'block',
    color:palette[0],
    tags:['Raspberry Pi','Altium Designer','Python','SolidWorks','BMS','DMX, I<sup>2</sup>C, UART, and SPI Protocols'],
    trackKey:'dmx',
    dates:"Jun – Aug '26",       // shown under the title on the project page
    wet:true,
    html:`
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">DMX Handheld Tester</h2>
      <p class="detail-note">* Developed during my internship at WET Designs (Summer 2026).</p>
      <div class="detail-tags" style="margin-bottom:30px">
        <span class="detail-tag">Raspberry Pi</span>
        <span class="detail-tag">Altium Designer</span>
        <span class="detail-tag">Python</span>
        <span class="detail-tag">SolidWorks</span>
        <span class="detail-tag">BMS</span>
        <span class="detail-tag">DMX, I<sup>2</sup>C, UART, and SPI Protocols</span>
      </div>
      <div class="detail-body">
        <div style="background:rgba(0,0,0,.03);border:2px solid #eee;border-radius:16px;padding:24px 30px;margin-bottom:28px;text-align:center">
          <h3 style="margin-top:0;margin-bottom:14px">Project Goal</h3>
          <p style="margin:0">The DMX Light Tester is a handheld device meant to be used both in-house and sold commercially as a cheaper, voltage-protected, and modular DMX-rig testing device.</p>
        </div>
        <div class="detail-img-trio">
          <figure>
            <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/I25zgLJ.png" alt="DMX Tester PCB, front" onclick="openLightbox(this.src,this.alt)">
            <figcaption>Front of PCB</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/JUeLQiT.png" alt="DMX Tester PCB, back" onclick="openLightbox(this.src,this.alt)">
            <figcaption>Back of PCB</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/OMblFu9.png" alt="DMX Tester shell design" onclick="openLightbox(this.src,this.alt)">
            <figcaption>Shell</figcaption>
          </figure>
        </div>
        <h3>How It Works</h3>
        <p>To use the device, you have 4 simple buttons and an encoder-button. These 4 buttons' features are shown on the PyGame UI. This UI, alongside the code for the DMX device, can be changed via injecting a script on the USB-A on the bottom of the device. This allows for a complete overhaul of the function of the DMX tester, and lots of modularity. The base version of the DMX tester has the following features:</p>
        <div style="text-align:center;margin-bottom:28px">
          <button class="subassembly-btn" onclick="toggleSection('dmx-features', this)">Show Features</button>
        </div>
        <div id="dmx-features" class="feature-list" style="display:none;margin-top:-6px;margin-bottom:28px">
          <p><code>boolAll</code> - Selects all lights; once a color is set (R, G, B, W), all lights increase in that given color value.</p>
          <p><code>boolMult</code> - All selected channels or lights (see <code>addToSelected</code> and <code>removeFromSelected</code>) will increase or decrease in sync.</p>
          <p><code>cycleLights</code> - Move up or down a channel or light depending on your CH/L mode (see <code>setLIGHTMODE</code>).</p>
          <p><code>up/downColorChann</code> - Scroll the encoder right to increase DMX value, or left to decrease.</p>
          <p><code>turnOffController</code> - Turn off the controller via the power button.</p>
          <p><code>addToSelected</code> - Add the current channel or light to your selected.</p>
          <p><code>removeFromSelected</code> - Remove the current channel or light from your selected.</p>
          <p><code>designateColor</code> - Designate r, g, b, or w as your current "set" color for <code>boolALL</code>/<code>tryColor</code>/<code>setLIGHTMODE</code>.</p>
          <p><code>tryColor</code> - Depending on your "set" color, turn ALL light fixtures into that color at max brightness. Is a hold-down.</p>
          <p><code>turnOffExcCurr</code> - Turn off all lights except the current light. Is reversible.</p>
          <p><code>setLIGHTMODE</code> - Turn the CH/L to L, indicating that when using <code>up/downColorChann</code>, or <code>boolMult</code>, the changing of value will be dependent on <code>designateColor</code>, or your "selected" will be Lights instead of channels respectively.</p>
          <p><code>switchFullscreen</code> - Instead of seeing only your "cursor's" DMX value, see all DMX channels' values in "selected".</p>
          <p><code>goBack</code> - Undo.</p>
          <p><code>redo</code> - Redo.</p>
          <p><code>creativeMode</code> - See all your currently "selected" DMX channels OR Lights represented as circles, with either a dimness corresponding to channel strength or a color corresponding to the real-life light color.</p>
          <p><code>reset</code> - Go back to the state the device would be in upon powering on (e.g. all lights off, no modes selected).</p>
          <p><code>interpolationState</code> - Save two different distinct states of the light-rig you are testing, and once confirmed, gradient between the two states using the encoder.</p>
        </div>
        <p>Furthermore, the PCB for the DMX tester has a 5V USB-C charging port with voltage protection on all ports to ensure the device is not broken, alongside more safety features such as room for battery expansion, thickness on the device to ensure nothing breaks, and lots of pins/screws on the internals designed for reliability.</p>
        <h3>Internals &amp; Communication</h3>
        <p>The device communicates with its internals using I<sup>2</sup>C and SPI, communicating with the BMS and LCD screen respectively. Furthermore, it communicates with the in-house DMX port using UART protocols, and therefore communicates with the light fixtures via UART. The device has internal ventilation with a fan, and a buck-boost for proper power distribution from the BMS (3.2V-4.2V) to other devices (5V). The 3.3V rail is supplied via the Raspi CM4. Lastly, the device has side ridges for holdability.</p>
        <p>The device was built from the ground up, starting with a Raspi CM4, a DMX Master Shield, UART, and some peripherals; the initial code was constructed to determine what functions would be necessary. This was done in Python, and tested with in-house DMX fixtures. This led to the core-level features listed above.</p>
        <div style="text-align:center">
          <button class="subassembly-btn is-open" data-static-label="1" aria-expanded="true" onclick="toggleSection('dmx-more', this)">Development · In Depth<span class="btn-toggle-x"></span></button>
        </div>
        <div id="dmx-more" style="display:block;margin-top:22px">
          <div class="sub-section">
            <h4>PyGame Interface</h4>
            <p>After the features were approved, a very preliminary interface was constructed in PyGame, and eventually finalized into a macro-encoder style system. The final interface is also developed using PyGame.</p>
          </div>
          <div class="sub-section">
            <h4>SolidWorks UI</h4>
            <p>The second portion of the UI (physical) was developed in SolidWorks. The first preliminary design was eventually scrapped to make more space on the PCB.</p>
            <img loading="lazy" decoding="async" src="https://i.imgur.com/OMblFu9.png" alt="DMX Tester SolidWorks Shell Design">
          </div>
          <div class="sub-section">
            <h4>Altium Schematic</h4>
            <p>The schematic was developed in Altium in sync with the SolidWorks UI, as UI choices directly influenced the parts needed and pins required (especially GPIO) on a schematic level. Below is the "main" schematic developed, combining "Brain," "Power," and "Interface" for this project.</p>
            <img loading="lazy" decoding="async" class="nda-blur" src="https://i.imgur.com/2o2PfUw.png" alt="DMX Tester Altium Schematic">
            <p style="text-align:center;font-size:11px;color:#999;font-style:italic;margin-top:-8px">Blurred for NDA reasons.</p>
            <div class="detail-img-row-3">
              <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/I25zgLJ.png" alt="DMX Tester PCB 3D Render 1" onclick="openLightbox(this.src,this.alt)">
              <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/JUeLQiT.png" alt="DMX Tester PCB 3D Render 2" onclick="openLightbox(this.src,this.alt)">
              <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/ylxllao.png" alt="DMX Tester PCB 3D Render 3" onclick="openLightbox(this.src,this.alt)">
            </div>
            <p style="text-align:center;font-size:11px;color:#999;font-style:italic;margin-top:-8px">Note: the green, wide, opaque object is the screen.</p>
          </div>
          <div class="sub-section">
            <h4>PCB</h4>
            <p>The PCB was also developed in Altium, and led to a plethora of UI redesigns as realizations about spacing came to the forefront. This also led to a redesign of certain aspects of the internals of the SolidWorks assembly, as ports were shifted.</p>
          </div>
          <div class="sub-section">
            <h4>Protocol Programming</h4>
            <p>I wrote the software in Python, building DMX512 framing and timing on top of UART alongside I<sup>2</sup>C and SPI drivers for the BMS and LCD.</p>
          </div>
          <div class="sub-section">
            <h4>Assembly</h4>
            <p>I was not able to witness the assembly, as my co-op ended right as the board completed.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    name:'Companion\nRobot',
    displayName:'Companion Robot',
    catalog:'AL-001',side:'A',year:'2026',
    slug:'companion-robot',
    tone:'light',            // artwork tone: 'light' art gets dark type, 'dark' art gets light type
    cover:'https://i.imgur.com/41vTl4Z.png',
    sleeve:'window',
    color:palette[1],
    tags:['SolidWorks','Altium Designer','Raspberry Pi','Electromechanical Assembly','Python','PID Controls','Soldering','3D Printing'],
    trackKey:'robot',
    dates:"Jan – Apr, Sep '26",       // shown under the title on the project page
    wip:true,
    subpage:`
<div id="subpage-detail" style="position:fixed;inset:0;background:#fff;z-index:1100;display:none;overflow-y:auto">
  <div class="detail-content">
    <button class="detail-back" onclick="closeSubpage()">← Back to Companion Robot</button>
    <h2 class="detail-title">Subassemblies · In Depth</h2>
    <div class="detail-body">
      <p style="background:rgba(0,0,0,.03);border:1px solid #ddd;border-radius:10px;padding:10px 16px;font-size:12px;color:#888;font-style:italic;margin:20px 0">⚠ Due to the assembly being still in progress, descriptions may be incomplete/unavailable.</p>

      <div class="sub-section">
        <h3>Base</h3>
        <div class="detail-img-row">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/6iodtGe.png" alt="Base 1">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/W1v8pqx.png" alt="Base 2">
        </div>
        <h4>Overview</h4>
        <p>The base consists of two main features and their connectors: an electrical housing-framework, and the omniwheels.</p>
        <h4>Omniwheel Design</h4>
        <p>The omni-wheels were developed with three key features in mind: Functionality, quiet movement and a compact design. Since the robot is to serve as a soothing therapeutic companion, it is important that the movement of the robot does not disrupt the user during their interaction. The 55 millimeter diameter of the rim plate was judged to be appropriate such that the complete design could have a small stature as the entire robot was further scaled from that single decision.</p>
        <p>Sixteen rollers were fitted into the omni-wheels to achieve quiet movement as they maximized the time a roller was in contact with the floor at a given moment. TPU was chosen as the material to manufacture the wheels due to its renowned elasticity compared to PLA, PETG, and other printable materials available at my University. A motor hub attaches to four rim plates on each side via interference fit with a tolerance fit to the motor shaft, and is pinned with a washer for the best long-term hold. An additional pin runs through holes between each "leg" of the rim plates, on which a roller is placed loosely. Due to gravity, the rollers make a strong contact with the ground whilst remaining disconnected from the plate itself, thus allowing for full rolling capability.</p>
        <h4>Electrical Housing & Framework</h4>
        <p>The rest of the base is structured to allow for proper electrical housing. An elevated interference fit accepts the standoffs of the Raspberry Pi, and a dedicated space fits a waffle-board for the Pi Pico and motor boards. Additionally, blocks printed separately sit above the motors and hold them down via the frictional force of the interlocking space, with an extrusion pressing against the omniwheel hub to keep each wheel firmly in place.</p>
      </div>

      <div class="sub-section">
        <h3>Shell</h3>
        <div class="detail-img-row">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/ng5JVDy.png" alt="Shell 1">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/pWKM7z6.png" alt="Shell 2">
        </div>
        <h4>Overview</h4>
        <p>The shell is composed of arm housings, a speaker, four microphones and a camera. These components help accomplish the overall purpose of the robot.</p>
        <h4>Assembly & Structure</h4>
        <p>To aid in assembly, the shell is cut into four parts, each carrying holes for square-shaped and L-shaped mounting brackets. The square-shaped brackets are used to attach each of the parts to each other whilst the L-shaped brackets are used to attach the shell to the base.</p>
        <h4>Microphones</h4>
        <p>For the microphones, a grommet-insert sound decoupling system was created alongside a housing for further noise reduction from the inside of the shell.</p>
        <h4>Speaker</h4>
        <p>An angled extrude was designed from the inside of the shell, with four mounting holes for screws alongside a grille to allow for clean audio output from the speaker.</p>
        <h4>Camera</h4>
        <p>A simple extrusion below the intended hole of the camera module was made with holes allowing for a pin-in placement of a back-wall.</p>
        <h4>Lessons Learned & Design Challenges</h4>
        <p>In general, creating the shell taught many useful skills: different patterns (such as fill for the grille), how to create any angled plane, how to design for long-term stability, and most importantly how to optimize a design both aesthetically and space-wise.</p>
        <p>As described in the base section, the wheels are approximately 55 mm. This led to a shell and head design that was far too large, requiring a full redesign: I was forced to move every component, introduce systems such as the grommet-insert above, and create novel solutions to accommodate for the reduced space.</p>
      </div>

      <div class="sub-section">
        <h3>Head</h3>
        <div class="detail-img-row">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/nPu71xb.png" alt="Head 1">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/OvQ3wHt.png" alt="Head 2">
        </div>
        <h4>Overview</h4>
        <p>The head consists of three main components: a shell, an LCD screen, and a connector to the main body.</p>
        <h4>Connection to Main Body</h4>
        <p>The head is connected to the main body via a matching-fit which locks into place on the top of the body. This design choice allows for easy detachability and reliable securement of the head.</p>
        <h4>The Redesign</h4>
        <p>For reference, pictured below is the previous final design of the head.</p>
        <img loading="lazy" decoding="async" src="https://i.imgur.com/9QjugDr.png" alt="Previous Head" style="max-width:500px">
      </div>
    </div>
  </div>
</div>

`,
    html:`
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">Companion Robot</h2>
      <div class="detail-tags" style="margin-bottom:30px">
        <span class="detail-tag">SolidWorks</span>
        <span class="detail-tag">Altium Designer</span>
        <span class="detail-tag">Raspberry Pi</span>
        <span class="detail-tag">Electromechanical Assembly</span>
        <span class="detail-tag">Python</span>
        <span class="detail-tag">PID Controls</span>
        <span class="detail-tag">Soldering</span>
        <span class="detail-tag">3D Printing</span>
      </div>
      <div class="detail-body">
        <div style="background:rgba(0,0,0,.03);border:2px solid #eee;border-radius:16px;padding:24px 30px;margin-bottom:28px;text-align:center">
          <h3 style="margin-top:0;margin-bottom:14px">Project Goal</h3>
          <p style="margin:0">The purpose of this project is to develop an interactive therapeutic robotic companion. The neutral appearance of the small robot serves to adhere to its functional use by a wide demographic. Interactive software is implemented into the design including microphones, speakers, automated movement systems, and an LCD screen for emotive responses. This project is intended to help learn the fundamentals of being an engineer through mechanical, electrical, and software design.</p>
        </div>
        <h3>SolidWorks Assembly</h3>
        <p>As the lead engineer responsible for the development of the mechanical design I was able to learn new skills experientially throughout this process. The design shown below is the first finished prototype. If you would like to see the individual sub-assemblies, how I developed them, as well as my thought process and obstacles I overcame, please click below.</p>
        <iframe src="https://www.youtube.com/embed/D7X9jYpiPsQ?si=VZEJJJCJZ5qbOjga" title="SolidWorks Assembly" allowfullscreen></iframe>
        <div style="text-align:center">
          <button class="subassembly-btn" onclick="openSubpage()">Subassemblies · In Depth</button>
        </div>
        <h3>Custom BMS PCB</h3>
        <p>Before resuming this project this September, I realized something after my time being an intern at WET, that the battery was in grave danger and I had no protection or proper power distribution from the battery, and furthermore, if the servos stall and I'm running them from the raspberry pi, it will overcurrent and potentially break. So, I decided to make a BQ Charger, and two independent boost chips on one PCB for the Companion Robot to keep the battery properly charged and safe, while properly distributing power.</p>
        <div class="detail-img-row">
          <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/8A9O206.png" alt="Companion Robot PCB, 3D view" onclick="openLightbox(this.src,this.alt)">
          <img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/mgEva7n.png" alt="Companion Robot PCB schematic" onclick="openLightbox(this.src,this.alt)">
        </div>
        <div style="text-align:center">
          <button class="subassembly-btn" data-static-label="1" aria-expanded="false" onclick="toggleSection('robot-pcb-layers', this)">PCB Layers<span class="btn-toggle-x"></span></button>
        </div>
        <div id="robot-pcb-layers" style="display:none;margin-top:22px">
          <div class="pcb-layer-grid">
            <figure><img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/XmN199r.png" alt="Top layer" onclick="openLightbox(this.src,this.alt)"><figcaption>Top Layer</figcaption></figure>
            <figure><img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/2yImrA4.png" alt="GND layer" onclick="openLightbox(this.src,this.alt)"><figcaption>GND Layer</figcaption></figure>
            <figure><img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/KkrbtKV.png" alt="Power (SYS) layer" onclick="openLightbox(this.src,this.alt)"><figcaption>Power (SYS) Layer</figcaption></figure>
            <figure><img loading="lazy" decoding="async" class="zoomable" src="https://i.imgur.com/hqRvEFm.png" alt="Bottom layer" onclick="openLightbox(this.src,this.alt)"><figcaption>Bottom Layer</figcaption></figure>
          </div>
        </div>
        <h3>Demo:</h3>
        <p>Will record once finished custom BMS PCB, for now see this video below from February, and the arm video from April.</p>
        <iframe src="https://www.youtube.com/embed/3BMh1MimUH4?si=PDeN6alPbzbswrNz" title="Movement Demo · February" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/-AL4-MPjDz8?si=2oNmssdj8Eq2eI_4" title="Arm Demo · April" allowfullscreen></iframe>
      </div>
    `
  },
  {
    name:'Biotron',
    displayName:'Biotron',
    catalog:'AL-003',side:'B',year:'2026',
    slug:'biotron',
    tone:'light',            // artwork tone: 'light' art gets dark type, 'dark' art gets light type
    cover:'https://i.imgur.com/8sH0tmw.png',
    sleeve:'split',
    color:palette[2],
    tags:['Altium Designer','LTspice'],
    trackKey:'biotron',
    archived:true,          // shown under the Archived button on the home page
    html:`
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">Biotron</h2>
      <div class="detail-tags" style="margin-bottom:30px">
        <span class="detail-tag">Altium Designer</span>
        <span class="detail-tag">LTspice</span>
      </div>
      <div class="detail-body">
        <h3>UVLO</h3>
        <h4>LTSpice · Schematic</h4>
        <p>All electronic parts have a minimum threshold voltage. The exoskeleton is no different. The exoskeleton has a typical input voltage from the 7S battery power supply of 29.4V, although naturally batteries are not always consistent, and may fluctuate in voltage due to any variety of reasons. Due to this, an under-voltage lockout circuit is crucial, as any voltage too low flowing to various motors or other electronics may permanently damage the device. For my teams' purposes, 21V will fry the motors (3V each), so 24.1V is a safe voltage to cutoff the circuit, hence my circuit design.</p>
        <p>For the UVLO, there are three crucial components: a Schmitt trigger, switch logic using MOSFETs, and voltage supply management using diodes, capacitors, and an LDO. For the Schmitt trigger, I used an op-amp comparator with a hysteresis switching from the positive rail (15V out) to the negative rail (0V) at an input voltage at the non-inverting input of ~12.4V. This allowed for proper identification of when the voltage input from the battery was too low. Of course, this was made possible through the use of an external LDO, connected with two capacitors, a ceramic and aluminum capacitor, decoupling the noise and creating a smooth signal to ensure a smooth output. Furthermore, a N-MOSFET is connected to the output voltage at the gate, and a zener at the drain, that is further connected to a dual-P-MOSFET switch system to control when the input voltage "can" flow to the output terminal.</p>
        <p>Overall, designing this circuit taught me so much, even beyond the op-amp logic and transistor specifications, I learned about the applications of diodes, how to adjust a circuit to your specific needs, and most importantly how to debug and test a schematic.</p>
        <img loading="lazy" decoding="async" src="https://i.imgur.com/8sH0tmw.png" alt="UVLO Schematic">
        <h4>Altium · PCB</h4>
        <p>I learned plenty from transforming my schematic into a manufacturable PCB board. Of course, I started with finding real, applicable parts matching the needs of my circuit board, although the challenge was not great, it was still useful to learn the quickest method of finding these parts, how to read a data-sheet, and how to balance cost with effectiveness. Then began the hard part, making the actual PCB. I had to learn many important lessons: First of all, calculate the wire thickness you need to carry the relatively large 5 Amps through the circuit. I did this using <a href="https://www.advancedpcb.com/en-us/tools/trace-width-calculator/" target="_blank">advancedPCB</a>. I learned this after thinking that routing with 10 mil would be trivial, but routing with 100 mil forced me to use more tools. Specifically, two layer-routing, and signal-efficient routing practices. Two-layer routing is self-explanatory, but very useful, and you can see below I used it a good bit. Signal-efficient routing is more complicated; I learned from my lead how 90 degree turns are bad for impedance, and the shorter the wire the better. Especially for capacitors. So I adapted, and eventually developed a solid routing scheme, that I am proud of.</p>
        <p>In general, the hardest part of making the PCB was making it compact. The schematic is large, complicated, and full of wires going all over the place, but I managed to cut it down, and shorten the board to 5.5cm x 4cm. Additionally, for ease of installation, the output and input terminals are aligned.</p>
        <div style="background:rgba(0,0,0,.03);border:2px solid #eee;border-radius:16px;padding:24px;margin-top:30px;text-align:center">
          <h3 style="margin-top:0;margin-bottom:20px">Overall Powerboard</h3>
          <div class="detail-img-row">
            <img loading="lazy" decoding="async" src="https://i.imgur.com/8sH0tmw.png" alt="Schematic">
            <img loading="lazy" decoding="async" src="https://i.imgur.com/2eqVgzw.png" alt="PCB Board">
          </div>
        </div>
      </div>
    `
  },
  {
    name:'AHDM',
    displayName:'Autonomous Air Hockey Defense Machine',
    catalog:'AL-002',side:'A',year:'2025',
    slug:'ahdm',
    tone:'light',            // artwork tone: 'light' art gets dark type, 'dark' art gets light type
    cover:'https://i.imgur.com/yyUza6V.jpeg',
    sleeve:'band',
    color:palette[3],
    tags:['C++','Actuators','Gantry'],
    trackKey:'hockey',
    archived:true,          // shown under the Archived button on the home page
    html:`
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">Autonomous Air Hockey Defense Machine</h2>
      <div class="detail-tags" style="margin-bottom:30px">
        <span class="detail-tag">C++</span>
        <span class="detail-tag">Actuators</span>
        <span class="detail-tag">Gantry</span>
      </div>
      <div class="detail-body">
        <iframe src="https://www.youtube.com/embed/yuQoU-QTGQw?rel=0" title="AHDM Demo" allowfullscreen></iframe>
        <p>The Air Hockey Defense Machine (AHDM for short) is an autonomous robot built upon a small scale air hockey table intended to block incoming pucks from the opposing human player. To do so, my team and I designed AHDM to have a single axis gantry system for widthwise movement alongside a linear actuator for "hitting" the puck, and one singular distance sensor for calculations and a prediction of what widthwise location to move AHDM's handle to.</p>
        <div class="detail-img-row">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/8e4SU1C.png" alt="AHDM Diagram 1">
          <img loading="lazy" decoding="async" src="https://i.imgur.com/U1498qC.png" alt="AHDM Diagram 2">
        </div>
        <p>Upon the pressing of the touch sensor, the robot calibrates to the exact center of the gantry, lifts the barrier, and signals the game may begin. Additionally, the optical sensor is now active to detect and prevent any cheating such as the human player crossing the foul line with their handle. Now, the robot waits for the first detection from the distance sensor.</p>
        <p>Once the distance sensor picks up the first reading of the puck, and the final reading of the puck, using trigonometric principles and constants of the diameter of the puck, length of the table, and distance between the sensor and the gantry, the final x position upon crossing the AHDM's mallet's widthwise line is calculated. Additionally, the estimated time of arrival is calculated, which is important later.</p>
        <p>As soon as the VEX IQ Brain processes this information, the gantry system consisting of a geared motor, grooved wheels, and a belt precisely and quickly (one rotation spans the width of the table) arrives at the location. Immediately following the arrival of the mallet, AHDM, using a motor and two gears attached to a rod, would spin the gear when appropriate to allow for a proper return of the puck back to the user.</p>
        <p>Once the puck is returned, the system skips the data, returns back to the middle of the gantry, and restarts the sequence all over again infinitely. To account for error, every 5 detections and returns the barrier lowers, the gantry recalibrates and then the barrier lifts again for further gameplay.</p>
        <p>Upon a foul or a touching of the touch sensor, the game ends, as seen in the video above.</p>
      </div>
    `
  },
  {
    name:'Waterglo',
    displayName:'Waterglo',
    catalog:'AL-005',side:'B',year:'2026',
    slug:'waterglo',
    tone:'dark',            // artwork tone: 'light' art gets dark type, 'dark' art gets light type
    cover:'https://i.imgur.com/biTFGzA.jpeg',
    sleeve:'frame',
    color:palette[4],
    tags:['SolidWorks','Flow/Fluid Design','Prototyping'],
    trackKey:'waterglo',
    archived:true,          // shown under the Archived button on the home page
    wet:true,
    html:`
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">Waterglo</h2>
      <p class="detail-note">* Developed during my internship at WET Designs (Summer 2026).</p>
      <div class="detail-tags" style="margin-bottom:30px">
        <span class="detail-tag">SolidWorks</span>
        <span class="detail-tag">Flow/Fluid Design</span>
        <span class="detail-tag">Prototyping</span>
      </div>
      <div class="detail-body">
        <iframe src="https://www.youtube.com/embed/ykclXV86JBs?si=1M1KWLgjWS3AuFOz" title="Waterglo Demo" allowfullscreen></iframe>
        <p>The Waterglo project is a consumer-level product that, using an air pump and water pump alongside a specialized nozzle that releases water at a high rate (7 GAL/min), creates "cool" effects. The work my fellow intern and I did on this project was the prototype/mock-up initial step.</p>
        <p>SolidWorks was used to model potential interesting shapes to be used in the project, and a test rig was also modeled in SolidWorks and eventually semi-assembled in real life via the Wood Shop team. After approval, using Coke bottles and snap bottles (2L), the shapes were mocked up using a heat gun, a hot glue gun, and a piping/lighting setup that conformed to the given nozzle, introducing air and water to the system controlled by a DMX-converted power supply.</p>
        <p>Eventually, after testing the "Coke bottle" shapes, the final "test" shape, which is significantly larger, was created by 3D printing the negative of the shape and vacuum forming acrylic over the shape, then using Weld-On to make the seal water-tight. See the video above for a demonstration.</p>
      </div>
    `
  },
  {
    name:'Digital\nAudio Player',
    displayName:'Digital Audio Player',
    catalog:'AL-007',side:'B',year:'2026',
    slug:'digital-audio-player',
    tone:'light',            // artwork tone: 'light' art gets dark type, 'dark' art gets light type
    cover:'https://i.imgur.com/ppxJ8ec.png',   // PCB Rev 2 render
    sleeve:'stamp',
    color:palette[5],
    tags:['Altium Designer','PCB Design','Mixed-Signal Design','Analog Audio Design','LTspice','PSpice','ESP32-S3'],
    trackKey:'dap',
    wip:true,
    dates:"Sep '26 – Present",       // shown under the title on the project page
    html:`
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">Digital Audio Player</h2>
      <div class="detail-tags" style="margin-bottom:30px">
        <span class="detail-tag">Altium Designer</span>
        <span class="detail-tag">PCB Design</span>
        <span class="detail-tag">Mixed-Signal Design</span>
        <span class="detail-tag">Analog Audio Design</span>
        <span class="detail-tag">LTspice</span>
        <span class="detail-tag">PSpice</span>
        <span class="detail-tag">ESP32-S3</span>
      </div>
      <div class="detail-body">
        <h3>Schematic Revision 1 Complete</h3>
        <div class="dap-quad">
          <figure><img decoding="async" class="zoomable" src="https://i.imgur.com/VQUsPY6.png" width="2230" height="1570" alt="Power schematic" onclick="openLightbox(this.src,this.alt)"><figcaption>Power</figcaption></figure>
          <figure><img decoding="async" class="zoomable" src="https://i.imgur.com/PGQ47Zk.png" width="2145" height="1582" alt="Audio schematic" onclick="openLightbox(this.src,this.alt)"><figcaption>Audio</figcaption></figure>
          <figure><img decoding="async" class="zoomable" src="https://i.imgur.com/YDPhXR5.png" width="2190" height="1355" alt="Peripherals schematic" onclick="openLightbox(this.src,this.alt)"><figcaption>Peripherals</figcaption></figure>
          <figure><img decoding="async" class="zoomable" src="https://i.imgur.com/zCdBbGT.png" width="2395" height="1307" alt="MCU schematic" onclick="openLightbox(this.src,this.alt)"><figcaption>MCU</figcaption></figure>
        </div>

        <h3>PCB Revision 2</h3>
        <p class="dap-note">PCB still in progress, IC pictures, explanation, and further refining coming soon!</p>
        <div class="dap-quad dap-pcb">
          <figure><img decoding="async" class="zoomable" src="https://i.imgur.com/ppxJ8ec.png" width="1545" height="1522" alt="PCB Revision 2, front" onclick="openLightbox(this.src,this.alt)"><figcaption>Front</figcaption></figure>
          <figure><img decoding="async" class="zoomable" src="https://i.imgur.com/Iz8a0Nm.png" width="1510" height="1382" alt="PCB Revision 2, back" onclick="openLightbox(this.src,this.alt)"><figcaption>Back</figcaption></figure>
        </div>

        <h3>Architecture</h3>
        <figure class="arch-diagram">
          <div class="arch-scroll">
<svg class="arch-svg" viewBox="-2 -2 644 712" role="img" aria-labelledby="arch-title">
<title id="arch-title">Digital Audio Player architecture: power tree, signal chain and controls</title>
<defs>
<marker id="ah-8E44AD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8E44AD"/></marker>
<marker id="ahs-8E44AD" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" fill="#8E44AD"/></marker>
<marker id="ah-2E9A63" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2E9A63"/></marker>
<marker id="ahs-2E9A63" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" fill="#2E9A63"/></marker>
<marker id="ah-2F6FB3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2F6FB3"/></marker>
<marker id="ahs-2F6FB3" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" fill="#2F6FB3"/></marker>
<marker id="ah-444" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#444"/></marker>
<marker id="ahs-444" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" fill="#444"/></marker>
<marker id="ah-8a8a8a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a8a8a"/></marker>
<marker id="ahs-8a8a8a" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" fill="#8a8a8a"/></marker>
<marker id="ah-E8682E" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#E8682E"/></marker>
<marker id="ahs-E8682E" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" fill="#E8682E"/></marker>
<marker id="ah-111" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#111"/></marker>
<marker id="ahs-111" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" fill="#111"/></marker>
</defs>
<rect x="0" y="0" width="34.3" height="18" rx="9.0" fill="#8a8a8a"/>
<text class="arch-pill" x="17.15" y="12.2">SYS</text>
<rect x="42.3" y="0" width="83.1" height="18" rx="9.0" fill="#E8682E"/>
<text class="arch-pill" x="83.85" y="12.2">+3V3_ANALOG</text>
<rect x="133.39999999999998" y="0" width="83.1" height="18" rx="9.0" fill="#2F6FB3"/>
<text class="arch-pill" x="174.95" y="12.2">−3V3_ANALOG</text>
<rect x="224.49999999999997" y="0" width="64.8" height="18" rx="9.0" fill="#8E44AD"/>
<text class="arch-pill" x="256.9" y="12.2">+3V3_DAC</text>
<rect x="297.29999999999995" y="0" width="64.8" height="18" rx="9.0" fill="#2E9A63"/>
<text class="arch-pill" x="329.69999999999993" y="12.2">+3V3_DIG</text>
<text class="arch-num" x="0" y="52">01</text>
<text class="arch-h" x="22" y="52">Power</text>
<line x1="0" y1="60" x2="640" y2="60" stroke="#111" stroke-width="1.5"/>
<rect class="arch-box" x="0" y="196" width="100" height="48" rx="7"/>
<text class="arch-t" x="50.0" y="219.0">USB4085</text>
<text class="arch-s" x="50.0" y="233.0">USB-C · 5 V</text>
<rect class="arch-box" x="0" y="284" width="100" height="48" rx="7"/>
<text class="arch-t" x="50.0" y="307.0">LP605060JU</text>
<text class="arch-s" x="50.0" y="321.0">LiPo 1850 mAh</text>
<rect class="arch-box" x="130" y="232" width="100" height="58" rx="7"/>
<text class="arch-t" x="180.0" y="260.0">BQ24250</text>
<text class="arch-s" x="180.0" y="274.0">charger</text>
<path d="M100 220 H114 V250 H128" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<path d="M100 308 H114 V272 H128" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)" marker-start="url(#ahs-111)"/>
<path d="M230 261 H250" fill="none" stroke="#8a8a8a" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M250 158 V342" fill="none" stroke="#8a8a8a" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M250 158 H268" fill="none" stroke="#8a8a8a" stroke-width="2.2" stroke-linejoin="round" marker-end="url(#ah-8a8a8a)"/>
<path d="M250 342 H268" fill="none" stroke="#8a8a8a" stroke-width="2.2" stroke-linejoin="round" marker-end="url(#ah-8a8a8a)"/>
<text class="arch-lbl" x="256" y="294" fill="#8a8a8a" style="text-anchor:start">SYS</text>
<text class="arch-lbl" x="256" y="306" fill="#8a8a8a" style="text-anchor:start">3.0–4.2 V</text>
<rect class="arch-box" x="270" y="136" width="100" height="44" rx="7"/>
<text class="arch-t" x="320.0" y="157.0">LTC3440</text>
<text class="arch-s" x="320.0" y="171.0">buck-boost → 3.9 V</text>
<rect class="arch-box" x="270" y="320" width="100" height="44" rx="7"/>
<text class="arch-t" x="320.0" y="341.0">LTC3440</text>
<text class="arch-s" x="320.0" y="355.0">buck-boost → 3.3 V</text>
<path d="M370 158 H385" fill="none" stroke="#444" stroke-width="2" stroke-linejoin="round"/>
<path d="M385 102 V214" fill="none" stroke="#444" stroke-width="2" stroke-linejoin="round"/>
<path d="M385 102 H398" fill="none" stroke="#444" stroke-width="2" stroke-linejoin="round" marker-end="url(#ah-444)"/>
<path d="M385 158 H398" fill="none" stroke="#444" stroke-width="2" stroke-linejoin="round" marker-end="url(#ah-444)"/>
<path d="M385 214 H398" fill="none" stroke="#444" stroke-width="2" stroke-linejoin="round" marker-end="url(#ah-444)"/>
<rect class="arch-box" x="400" y="80" width="100" height="44" rx="7"/>
<text class="arch-t" x="450.0" y="101.0">LT3042</text>
<text class="arch-s" x="450.0" y="115.0">+3V3 LDO</text>
<rect class="arch-box" x="400" y="136" width="100" height="44" rx="7"/>
<text class="arch-t" x="450.0" y="157.0">LT3042</text>
<text class="arch-s" x="450.0" y="171.0">+3V3 LDO</text>
<rect class="arch-box" x="400" y="192" width="100" height="44" rx="7"/>
<text class="arch-t" x="450.0" y="213.0">LT3462A</text>
<text class="arch-s" x="450.0" y="227.0">inverter → −3.9 V</text>
<rect class="arch-box" x="400" y="256" width="100" height="44" rx="7"/>
<text class="arch-t" x="450.0" y="277.0">LT3093</text>
<text class="arch-s" x="450.0" y="291.0">−3V3 LDO</text>
<path d="M450 236 V254" fill="none" stroke="#2F6FB3" stroke-width="1.8" stroke-linejoin="round" marker-end="url(#ah-2F6FB3)"/>
<path d="M500 102 H512" fill="none" stroke="#E8682E" stroke-width="2" stroke-linejoin="round"/>
<rect x="512" y="93" width="128" height="18" rx="9.0" fill="#E8682E"/>
<text class="arch-pill" x="576.0" y="105.2">+3V3_ANALOG</text>
<path d="M500 158 H512" fill="none" stroke="#8E44AD" stroke-width="2" stroke-linejoin="round"/>
<rect x="512" y="149" width="128" height="18" rx="9.0" fill="#8E44AD"/>
<text class="arch-pill" x="576.0" y="161.2">+3V3_DAC</text>
<path d="M500 278 H512" fill="none" stroke="#2F6FB3" stroke-width="2" stroke-linejoin="round"/>
<rect x="512" y="269" width="128" height="18" rx="9.0" fill="#2F6FB3"/>
<text class="arch-pill" x="576.0" y="281.2">−3V3_ANALOG</text>
<path d="M370 342 H512" fill="none" stroke="#2E9A63" stroke-width="2" stroke-linejoin="round"/>
<rect x="512" y="333" width="128" height="18" rx="9.0" fill="#2E9A63"/>
<text class="arch-pill" x="576.0" y="345.2">+3V3_DIG</text>
<text class="arch-n" x="441" y="358">MCU · screen · SD · buttons</text>
<text class="arch-num" x="0" y="412">02</text>
<text class="arch-h" x="22" y="412">Audio</text>
<line x1="0" y1="420" x2="640" y2="420" stroke="#111" stroke-width="1.5"/>
<rect class="arch-box" x="0" y="462" width="90" height="56" rx="7"/>
<text class="arch-t" x="45.0" y="489.0">ESP32-S3</text>
<text class="arch-s" x="45.0" y="503.0">MCU · decode</text>
<rect class="arch-box" x="110" y="462" width="90" height="56" rx="7"/>
<text class="arch-t" x="155.0" y="489.0">ES9038Q2M</text>
<text class="arch-s" x="155.0" y="503.0">DAC</text>
<rect class="arch-box" x="220" y="462" width="90" height="56" rx="7"/>
<text class="arch-t" x="265.0" y="489.0">OPA1612</text>
<text class="arch-s" x="265.0" y="503.0">I/V ×4</text>
<rect class="arch-box" x="330" y="462" width="90" height="56" rx="7"/>
<text class="arch-t" x="375.0" y="489.0">OPA1612</text>
<text class="arch-s" x="375.0" y="503.0">sum + LPF</text>
<rect class="arch-box" x="440" y="462" width="90" height="56" rx="7"/>
<text class="arch-t" x="485.0" y="489.0">OPA1622</text>
<text class="arch-s" x="485.0" y="503.0">LPF · low-Z</text>
<rect class="arch-box arch-box-jack" x="550" y="462" width="90" height="56" rx="7"/>
<text class="arch-t" x="595.0" y="489.0">3.5 mm</text>
<text class="arch-s" x="595.0" y="503.0">headphones</text>
<rect x="0" y="438" width="90" height="15" rx="7.5" fill="#2E9A63"/>
<text class="arch-pill" x="45.0" y="448.7">+3V3_DIG</text>
<rect x="110" y="438" width="90" height="15" rx="7.5" fill="#8E44AD"/>
<text class="arch-pill" x="155.0" y="448.7">+3V3_DAC</text>
<rect x="220" y="438" width="43" height="15" rx="7.5" fill="#E8682E"/>
<text class="arch-pill" x="241.5" y="448.7">+3V3</text>
<rect x="267" y="438" width="43" height="15" rx="7.5" fill="#2F6FB3"/>
<text class="arch-pill" x="288.5" y="448.7">−3V3</text>
<rect x="330" y="438" width="43" height="15" rx="7.5" fill="#E8682E"/>
<text class="arch-pill" x="351.5" y="448.7">+3V3</text>
<rect x="377" y="438" width="43" height="15" rx="7.5" fill="#2F6FB3"/>
<text class="arch-pill" x="398.5" y="448.7">−3V3</text>
<rect x="440" y="438" width="43" height="15" rx="7.5" fill="#E8682E"/>
<text class="arch-pill" x="461.5" y="448.7">+3V3</text>
<rect x="487" y="438" width="43" height="15" rx="7.5" fill="#2F6FB3"/>
<text class="arch-pill" x="508.5" y="448.7">−3V3</text>
<path d="M90 490.0 H108" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<text class="arch-lbl" x="100" y="532">I²S</text>
<line x1="200" y1="482.5" x2="220" y2="482.5" stroke="#111" stroke-width="1.3"/>
<line x1="200" y1="487.5" x2="220" y2="487.5" stroke="#111" stroke-width="1.3"/>
<line x1="200" y1="492.5" x2="220" y2="492.5" stroke="#111" stroke-width="1.3"/>
<line x1="200" y1="497.5" x2="220" y2="497.5" stroke="#111" stroke-width="1.3"/>
<text class="arch-lbl" x="210" y="532">L± R±</text>
<line x1="310" y1="482.5" x2="330" y2="482.5" stroke="#111" stroke-width="1.3"/>
<line x1="310" y1="487.5" x2="330" y2="487.5" stroke="#111" stroke-width="1.3"/>
<line x1="310" y1="492.5" x2="330" y2="492.5" stroke="#111" stroke-width="1.3"/>
<line x1="310" y1="497.5" x2="330" y2="497.5" stroke="#111" stroke-width="1.3"/>
<text class="arch-lbl" x="320" y="532">L± R±</text>
<line x1="420" y1="487.0" x2="440" y2="487.0" stroke="#111" stroke-width="1.3"/>
<line x1="420" y1="493.0" x2="440" y2="493.0" stroke="#111" stroke-width="1.3"/>
<text class="arch-lbl" x="430" y="532">L R</text>
<line x1="530" y1="487.0" x2="550" y2="487.0" stroke="#111" stroke-width="1.3"/>
<line x1="530" y1="493.0" x2="550" y2="493.0" stroke="#111" stroke-width="1.3"/>
<text class="arch-lbl" x="540" y="532">L R</text>
<rect x="0.75" y="578" width="638.5" height="108" rx="12" fill="none" stroke="#bbb" stroke-width="1.2" stroke-dasharray="5 4"/>
<rect x="430" y="570" width="196" height="16" fill="#fff"/>
<text class="arch-num" x="436" y="583" style="text-anchor:start">03</text>
<text class="arch-h arch-h-sm" x="456" y="583">Control, Storage &amp; UI</text>
<path d="M45 518 V600" fill="none" stroke="#111" stroke-width="1.5"/>
<path d="M45 600 H586.0" fill="none" stroke="#111" stroke-width="1.5"/>
<path d="M58.0 600 V616" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<rect class="arch-box" x="12.0" y="618" width="92" height="54" rx="7"/>
<text class="arch-t" x="58.0" y="637">Screen</text>
<text class="arch-s" x="58.0" y="650">ER-TFT024IPS-3</text>
<text class="arch-n" x="58.0" y="662">SPI · 2.4 in</text>
<path d="M163.6 600 V616" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<rect class="arch-box" x="117.6" y="618" width="92" height="54" rx="7"/>
<text class="arch-t" x="163.6" y="637">LED Driver</text>
<text class="arch-s" x="163.6" y="650">BD1604MUV</text>
<text class="arch-n" x="163.6" y="662">backlight · SYS</text>
<path d="M269.2 600 V616" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<rect class="arch-box" x="223.2" y="618" width="92" height="54" rx="7"/>
<text class="arch-t" x="269.2" y="637">Buttons</text>
<text class="arch-s" x="269.2" y="650">TL1014BF220QG</text>
<text class="arch-n" x="269.2" y="662">power · vol ±</text>
<path d="M374.79999999999995 600 V616" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<rect class="arch-box" x="328.79999999999995" y="618" width="92" height="54" rx="7"/>
<text class="arch-t" x="374.79999999999995" y="637">Encoder</text>
<text class="arch-s" x="374.79999999999995" y="650">Alps EC12D</text>
<text class="arch-n" x="374.79999999999995" y="662">scroll · select</text>
<path d="M480.4 600 V616" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<rect class="arch-box" x="434.4" y="618" width="92" height="54" rx="7"/>
<text class="arch-t" x="480.4" y="637">SD Card</text>
<text class="arch-s" x="480.4" y="650">MSD-1-A</text>
<text class="arch-n" x="480.4" y="662">music library</text>
<path d="M586.0 600 V616" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#ah-111)"/>
<rect class="arch-box" x="540.0" y="618" width="92" height="54" rx="7"/>
<text class="arch-t" x="586.0" y="637">USB-C</text>
<text class="arch-s" x="586.0" y="650">USB4085</text>
<text class="arch-n" x="586.0" y="662">import to SD</text>
<text class="arch-n" x="320" y="704">all on +3V3_DIG except the LED driver, which runs from SYS for LED headroom</text>
</svg>
          </div>
        </figure>
        <div class="arch-text">
          <p>In order to create a PCB to play clean digital audio, I implemented this very specific architecture. First, you need to understand the power layer.</p>
          <p>The power layer consists of a LiPo rechargeable 1850mAh 3.7V nominal battery <span class="pn">(Jauch LP605060JU+PCM)</span>, charged by a BQ charger IC <span class="pn">(BQ24250RGET)</span> that is then fed by a USB-C <span class="pn">(GCT USB4085-GF-A)</span>. The SYS (system) rail outputted by the BQ is then given to two different buck-boost converters:</p>
          <p>The analog (3.9V) buck-boost converter <span class="pn">(LTC3440)</span> takes the 3.0-4.2V output and properly regulates it to 3.9V. This is because of the low-noise requirement for the audio devices' power rails, which I will get to shortly. This 3.9V is intentionally an odd number because it safely creates headroom, verified in LTspice, for the +3V3 and -3V3 analog LDO output rails that are translated via the 3.9V rail, while also not being so high that the naturally low efficiency of the LDO creates dangerous levels of heat within the board. The 3.9V is then given to two +3V3 LDOs <span class="pn">(LT3042)</span>, which give power rail #1, +3V3_ANALOG, and #2, +3V3_DAC, and is also fed to an inverted regulator <span class="pn">(LT3462A)</span>, which reverses the sign of the 3.9V to -3.9V, which is then fed to an LDO <span class="pn">(LT3093)</span> that outputs -3V3_ANALOG. This will be important later.</p>
          <p>Next, the other buck-boost <span class="pn">(LTC3440)</span> is for the digital parts (less sensitive) of the circuit, whether it be the MCU, screen, LED driver, SD card <span class="pn">(Same Sky MSD-1-A)</span>, etcetera. This buck-boost outputs a clean 3.3V.</p>
          <p>Now, onto the Audio.</p>
          <p>The digital-to-analog converter (DAC) <span class="pn">(ES9038Q2M)</span> is fed +3V3_DAC, as well as information from the ESP32-S3, to translate digital audio into an analog current-varying output. This output is then fed to an I/V op-amp <span class="pn">(OPA1612)</span>, which translates the varying current to a varying voltage, powered with +3V3_ANALOG and -3V3_ANALOG. After this stage, the audio is then fed to a summing op-amp stage <span class="pn">(OPA1612)</span>, powered with +3V3_ANALOG and -3V3_ANALOG, as the DAC outputs four audio rails, L-, L+, R-, R+ (right and left neg/pos). These four rails are then summed into Left and Right, alongside a low-pass filter, and then given to the final headphone output <span class="pn">(OPA1622)</span>, powered with +3V3_ANALOG and -3V3_ANALOG, with another low-pass filter, with a low impedance output to ensure proper audio crispness is delivered.</p>
          <p>The helping hands in this process in terms of UI and compute are of course the microcontroller, the ESP32-S3, which takes data from the SD card <span class="pn">(Same Sky MSD-1-A)</span> and is then fed to the DAC, as well as a screen <span class="pn">(ER-TFT024IPS-3)</span> for the user to understand what is occurring, power, volume+/- <span class="pn">(TL1014BF220QG)</span>, select, and encoder <span class="pn">(Alps EC12D)</span> for user control, and an LED driver <span class="pn">(BD1604MUV)</span> for the screen due to the fact that 3V3 is not enough headroom for the LEDs on its own. Lastly, the USB-C will import into the SD card if not in charging mode.</p>
        </div>

        <a class="dap-github" href="https://github.com/lokeralexander-code/DAP_PCB/tree/main" target="_blank" rel="noopener" onclick="track('github_opened',{project:'Digital Audio Player'})">
          <svg viewBox="0 0 16 16" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          <span class="dap-github-text">
            <span class="dap-github-title">View on GitHub ↗</span>
            <span class="dap-github-sub">For further detail on version history and documentation.</span>
          </span>
        </a>

        <h3>See Each IC</h3>
        ${dapICLauncherHtml()}
      </div>
    `
  },
  /* Weigl card temporarily disabled, uncomment to bring it back
  {
    name:'Weigl',
    displayName:'Weigl ProCommander HXi',
    catalog:'AL-006',side:'A',year:'2026',
    slug:'weigl',
    tone:'dark',            // artwork tone: 'light' art gets dark type, 'dark' art gets light type
    cover:'',                 // <- cover art: point this at a project photo, e.g. 'images/dmx.jpg'
    sleeve:'stamp',
    color:palette[5],
    tags:['HTML/CSS/JS','Claude Code','Technical Documentation'],
    trackKey:'weigl',
    wet:true,
    wip:true,
    locked:true,
    html:`
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">Weigl ProCommander HXi</h2>
      <p class="detail-note">* Developed during my internship at WET Designs (Summer 2026).</p>
      <div class="detail-tags" style="margin-bottom:30px">
        <span class="detail-tag">HTML/CSS/JS</span>
        <span class="detail-tag">Claude Code</span>
        <span class="detail-tag">Technical Documentation</span>
      </div>
      <div class="detail-body">
        <h3>Interactive Presentation Tool</h3>
        <p>Built an interactive website demonstrating how to use the Weigl ProCommander HXi and its partner software, Showforge. Using HTML and Claude Code, I built the presentation layer alongside sorting logic that determines device compatibility with the software, tracks electrical limitations, and monitors hardware port counts on the Weigl hardware. It's designed as a streamlined reference for non-technical users to accelerate testing and prototyping workflows, and was presented professionally to potential users.</p>
        <div style="text-align:center">
          <a class="subassembly-btn" href="https://alexander-code-wet-weigl-demo.vercel.app/" target="_blank" style="text-decoration:none;display:inline-block">View Presentation ↗</a>
        </div>
      </div>
    `
  },
  */
];
