# **Sidereal Year Clock PWA**

This project is a Progressive Web Application (PWA) that displays a unique clock based on a sidereal year, divided into custom time units. It offers an alternative way to visualize the passage of time, with units like Pings, Secs, Mins, and Hours, and a calendar system with Days, Months, Seasons, and Years.

## **Features**

* **Custom Time Units:** Visualizes time using a unique system where:  
  * 1 Sec \= 10 Pings  
  * 1 Min \= 10 Secs  
  * 1 Hour \= 50 Mins  
  * 1 Day \= 10 Hours  
  * 1 Month \= 50 Days  
  * 1 Season \= 5 Months  
  * 1 Year \= 4 Seasons  
* **Naming**: within the code, Time Units are named Pings, Secs, Dins, Nares, Days, Months, Seasons and Years.  
* **Sidereal Year Basis:** The entire system is anchored to the length of a sidereal year (approximately 365 days, 5 hours, 48 minutes, 45 seconds).  
* **Interactive Clock Face:** An SVG-based clock face with hands for Secs, Mins, and Hours, along with digital readouts for the current Hour and Min.  
* **Calendar Display:** Shows the current Season, Month, and Day within the custom year.  
* **Year Counter:** Tracks the number of sidereal years elapsed since the epoch (January 1, 2000 UTC).  
* **PWA Capabilities:** Can be installed on your device for an app-like experience, offering offline access and faster loading times (requires `manifest.json` and `service-worker.js` to be present).  
* **Responsive Design:** Optimized for viewing on various screen sizes, from mobile to desktop.  
* **Modern Styling:** Utilizes Tailwind CSS for a clean and modern user interface.

## **How to Use**

Simply open the `index.html` file in a web browser. If your browser supports PWA installation, you may be prompted to add it to your home screen or desktop.

The clock will automatically start running, displaying the current time according to its unique system.

## **Project Structure**

* `index.html`: The main HTML file containing the clock interface, logic, and styling.  
* `manifest.json`: (Assumed) The web app manifest file, enabling PWA features.  
* `service-worker.js`: (Assumed) The service worker script for offline capabilities and caching.

## **Technical Details**

* **HTML5:** Provides the structure of the web page.  
* **CSS3 (Tailwind CSS):** Used for styling and responsive design.  
* **JavaScript:** Powers the clock's logic, animations, and time calculations.  
* **SVG:** Used for drawing the dynamic clock face and hands.  
* **PWA:** Utilizes `manifest.json` and `service-worker.js` for installability and offline support.

## **Customization**
You can modify the time unit definitions and other constants in the JavaScript section of index.html to experiment with different temporal systems.
