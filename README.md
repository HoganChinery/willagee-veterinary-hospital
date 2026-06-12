# Willagee Veterinary Hospital — website

A four-page static website (Home, About, Services, Contact & Book) in the
"Warm Clinical" design. Hosted on GitHub Pages.

## Pages
- `index.html` — Home
- `about.html` — About / facilities / team
- `services.html` — Full list of services
- `contact.html` — Contact details, hours, embedded map, and the appointment form
- `styles.css` — shared design system
- `main.js` — mobile menu + appointment-form handling
- `images/` — photos (currently **watermarked stock previews — replace before launch**)

## ⚙️ Activate the appointment form (one-time, ~2 minutes)

The form on the Contact page is wired to **Web3Forms** (free, no server, no account
needed — submissions are emailed to the clinic). To switch it on:

1. Go to **https://web3forms.com**
2. Enter the clinic email — **Willageeveterinaryhospital@gmail.com** — and it emails you a free **Access Key**.
3. In `contact.html`, find this line:
   ```html
   <input type="hidden" name="access_key" value="REPLACE_WITH_WEB3FORMS_ACCESS_KEY" />
   ```
   Replace `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` with the key from the email.
4. Save, commit, push. Done — appointment requests now arrive in the clinic inbox.

Until then, the form shows a friendly "not connected yet" message instead of sending.

## Before going live
- Replace the **watermarked stock photos** in `images/` with licensed photos or the clinic's own.
- (Optional) Add a real online booking widget (Acuity / Calendly) if self-service scheduling is wanted.
- Point a custom domain (e.g. `willageevet.com.au`) at the GitHub Pages site.

## Contact details used throughout
- Address: 90 Bawdan St, Willagee WA 6156
- Phone: (08) 9474 9589 · Mobile: 0421 339 300
- Email: Willageeveterinaryhospital@gmail.com
- Hours: Mon–Fri 8am–6pm · Sat 9am–1pm · Sun by appointment · Public holidays closed
- After-hours emergency: WAVES (08) 9412 5700
