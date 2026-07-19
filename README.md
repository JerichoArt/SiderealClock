Sidereal Year Clock PWA
This project is a Progressive Web Application (PWA) that displays a unique clock based on a sidereal year, divided into a custom time-unit hierarchy. It offers an alternative way to visualize the passage of time, featuring internal units like Pings, Secs, Dins, and Nares, alongside an advanced concentric dual-ring outer track that mirrors real-world Earth daylight hours and standard business windows based on shared browser location tracking.

Features
Custom Time Hierarchy: Visualizes time using a unified system ordered from the macro-year down to the sub-second:

1 Year = 4 Seasons

1 Season = 5 Months

1 Month = 50 Days

1 Day = 10 Hours (Nares)

1 Hour = 50 Mins (Dins)

1 Min = 10 Secs

1 Sec = 10 Pings

Sidereal Year Basis: The entire clock system is anchored precisely to the true geometric orbital length of a sidereal year (365 days, 5 hours, 48 minutes, and 45 seconds).

24-Hour Real-World Overlays: Features two independent outer tracking rings that act as a dynamic 24-hour radial timeline rotating counter-clockwise beneath a static red 00 index marker at 12 o'clock:

Local Daylight Track (Yellow): Dynamically scales and renders your local solar horizon window (Sunrise to Sunset) based on coordinates.

Work Shift Window Track (Green): Displays standard 9-to-5 working hours.

Automatic Cross-Repository Sync: Connects directly with the Sidereal Calendar PWA using shared local browser storage. Any manual coordinate adjustment or UK Time-Lock preference selected in your calendar dashboard automatically updates the environment tracking arrays on the clock face without requiring cross-tab reload management.

Interactive SVG Interface: A responsive vector clock face with dedicated needles for Secs, Dins, and Nares, featuring a tracking readout floating dynamically at the tip of the minute hand.

PWA Installability: Fully compliant with PWA service worker configurations for asset caching, ultra-fast performance, and offline capability.

Project Architecture
The application has been engineered into clean, specialized asset modules:

index.html: Holds the application structure, the SVG dial architecture, and the color-coded matrix legend.

style.css: Powers the dark slate #0F172A theme framework and handles the layered text overrides for the multi-colored component calendar displays.

app.js: Calculates structural sidereal math, operates requestAnimationFrame rendering loops, maps timezone offset arrays, and calculates astronomical vectors using the integrated SunCalc system.

service-worker.js & manifest.json: Manages assets, provisions fallback offline execution protocols, and defines system installation profiles.

Technical Dependencies
HTML5 & CSS3 (Tailwind CSS): Structural interface and rapid layouts.

JavaScript (ES6+): Pure actinic temporal conversions and event systems.

SunCalc.js: Integrated via CDN to accurately parse solar horizon configurations using complex latitude and longitude coordinates.

PWA Toolkit: Implements service worker file caches to guarantee functional consistency across mobile or desktop hardware environments without persistent network access.

How to Use
Simply launch the clock directly in any modern browser via your GitHub Pages deployment path.

For a fully hands-free personalized setup, launch your Sidereal Calendar tab to establish your geographic tracking configuration. The clock will quietly detect your coordinates and instantly update its outer timeline ring assets.

If your system configuration matches mobile or progressive web specifications, accept the browser notification prompt to install the clock as a dedicated local application asset on your home screen or system dock.
