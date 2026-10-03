# Fertile Crescent Quiz

A practice quiz website for World History & Geography 1 (Mesopotamia and Ancient Egypt).
Students open it on their phones, pick a packet and a part, and get instant feedback and a score.

Quizzes:
- Packet 1: Map of the Fertile Crescent (word bank, map, reading)
- Hammurabi's Code: Laws by the River (word bank, map, reading, the laws)

## Put it online with GitHub Pages
1. Sign in at github.com. Click **+** (top right) > **New repository**. Name it `fertile-crescent-quiz`, choose **Public**, click **Create repository**.
2. On the new repository page, click **uploading an existing file**. Drag in everything inside this folder (index.html, style.css, README.md, and the `js` and `img` folders). Click **Commit changes**.
3. Go to **Settings** > **Pages**. Under "Branch", pick **main** and **/(root)**, then click **Save**.
4. Wait a minute or two, then refresh. The link appears at the top of the Pages screen, like `https://YOUR-USERNAME.github.io/fertile-crescent-quiz/`. Share that link (or a QR code of it) with students.

## Add or change questions
Questions live in `js/packet1.js` and `js/hammurabi.js`. In each question, the **first choice is the right answer**; the website mixes up the order. Edit the file on GitHub (pencil icon), commit, and the site updates in a minute or two.

To add a new packet, copy `js/hammurabi.js` to a new file, change the `id`, title, and questions, and add a `<script>` line for it in `index.html` above `js/app.js`.

Notes: no logins, no data leaves the phone. A student's name and best scores are saved only in their own browser. Map data: Natural Earth (public domain) and d-maps.com base map.
