# Sidereal Clock

A clock and calendar for the whole planet, built on the **sidereal year**. Everyone in the world sees the same time and the same date. Time zones only matter for deciding when *your* work hours fall, not for the clock itself.

Companion app: [Sidereal Calendar](https://jerichoart.github.io/SiderealCalendar/)

<!-- Add the address of this clock's GitHub Pages site here, and a screenshot: ![Sidereal Clock](screenshot.png) -->

## The idea

Today's timekeeping mixes two things: the Earth's rotation (the day) and its orbit (the year), then adds time zones and daylight saving on top. This clock keeps the parts that matter and removes the rest:

- The **year** is one lap of the Sun against the stars (the sidereal year).
- The **day** is the ordinary 24 hours, counted once for the whole planet.
- There are **no time zones and no daylight saving** in the clock. A banker in Sydney and a banker in London read the same hand at the same moment.

## The time system

### Year

| | |
|---|---|
| Length | 31,558,149.76 s (365.256363 days), one sidereal year |
| Year 0 begins | When the Sun crosses sidereal 0° (Lahiri): **2000-04-13 11:52:11 UTC** |
| Year 26 begins | 14 April 2026 |

Seasons mark positions in Earth's orbit against the stars, not the weather. This means the calendar never drifts against the stars, but it drifts against the climatic seasons by about one day every 70 years.

### Day

One day is one mean solar day, counted on Greenwich (UTC) time, with midnight at the top of the dial.

| Unit | Length |
|---|---|
| 1 day | 24 hours |
| 1 hour | 60 minutes (the same as ours) |
| 1 din | 1/50 of an hour = 72 s |
| 1 sec | 1/10 of a din = 7.2 s |
| 1 ping | 1/10 of a sec = 0.72 s |

So 1 day = 24 hours × 50 dins × 10 secs × 10 pings.

### Calendar

| Unit | Length |
|---|---|
| Week | 6 days: ☿ Mercury, ♀ Venus, ♂ Mars, ♃ Jupiter, ♄ Saturn, ☽ Moon |
| Month | 36 days (6 weeks), numbered I to X |
| Season | 90 days (15 weeks), named α β γ δ; a season can start partway through a month |
| Return days | 5 extra days after month X (6 in a leap year), outside the week and the months. In this world they are mandatory rest days |

Leap years follow a rule of **10 in every 39 years** (years 0, 3, 7, 11, 15, 19, 23, 27, 31 and 35, then repeating). Over any span, the calendar stays within about 12 hours of the true Sun crossing, and the rule errs by only a day in around 21,000 years.

A date is shown like **γ VI 11 ♄**: season γ, month VI, day 11, a Saturn day. During the Return days it shows **Return 2/5**.

## Reading the clock

From the outside in:

1. **Daylight bar** (yellow): the daylight at *your* location, placed on the shared 24-hour dial.
2. **Work bar** (green): your work window, 09:00 to 17:00 on the clock of your chosen work zone.
3. **Hours dial and hand**: 24 notches, numbered every 3 hours. Midnight (0) is at the top and noon at the bottom. The hand makes one lap per day.
4. **Dins dial and hand**: 50 notches, one lap per hour, with the current din number floating near the hand.
5. **Secs dial and hand**: 10 notches in the centre, one lap per 72 s. The red numbers (00 to 90) show the pings.

Below the face:

- **Digital time** as `hours:dins:secs` (for example `12:29:01`).
- **Pings** (0 to 9), counting on in their own box.

Under that are the date (for example `γ VI 11♄`), the year, and a link to the calendar.

## Your location and work hours

- **Location** is used only for the daylight bar. The browser asks for it on first visit. If you decline it, London is used. You can also set it in the calendar app.
- **Work zone**: choose any time zone in the picker, or leave it on your device's zone. Someone in Australia working UK hours picks Europe/London, and the green bar moves to where those hours fall on the dial.
- **Follow local daylight saving** is off by default, so the work bar never moves. Tick it for the bar to follow that zone's clock changes.

These settings are saved in the browser and shared with the calendar app, provided both are served from the same site (for example, both on `yourname.github.io`).

## Files

| File | What it does |
|---|---|
| `index.html` | The page: dial, boxes and legend |
| `style.css` | Styling |
| `app.js` | Draws the dial, runs the hands and rings, handles the work-zone picker |
| `sidereal-core.js` | All the calendar and time maths. **Shared with the calendar app, so keep the two copies identical** |
| `service-worker.js` | Offline support (network first, cache as a fallback) |
| `manifest.json` and icons | Makes the clock installable as an app |

To change the system itself (year length, epoch, leap rule, names), edit the constants at the top of `sidereal-core.js`.

## Running it yourself

There is nothing to build.

1. Clone or download the repository.
2. Serve the folder with a local web server. In VS Code, the *Live Server* extension works. Opening `index.html` directly will not work, because service workers need `http://localhost` or `https`.
3. To publish, turn on GitHub Pages for the repository.

When you change any file, raise the version in `CACHE_NAME` in `service-worker.js` so installed copies refresh.

## Built with

- [SunCalc](https://github.com/mourner/suncalc) for sunrise and sunset
- Tailwind CSS (CDN) and the Inter font
- Plain JavaScript, with no framework and no build step

## Good to know

- Each device uses its own clock, so two devices can differ by a fraction of a second. A ping is 0.72 s, so a very exact sync would need a shared time server, which this clock does not use.
- The clock's maths works for any year. The calendar app shows years 0 to 100 (April 2000 onwards).

## Licence

Released under the [MIT Licence](LICENSE). Copyright (c) 2025 Željko Ivanković.

You are welcome to use it, adapt it and build on it. A link back to the original is appreciated but not required.
