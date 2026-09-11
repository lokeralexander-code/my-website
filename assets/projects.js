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
    wet:true,
    wip:true,
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
            <h4>Assembly</h4>
            <p>The physical assembling is still in progress. <em>(TBD)</em></p>
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
    tags:['SolidWorks','Raspberry Pi','Electromechanical Assembly','Python','PID Controls','Soldering','3D Printing'],
    trackKey:'robot',
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
