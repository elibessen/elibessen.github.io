# Portfolio
> My portfolio and online resume designed purely with HTML and SCSS (and maybe a bit of JavaScript magic)

View it at: [elibessen.com](https://elibessen.com/)

## Technologies
- HTML
- Pug (For readability)
- SCSS (Sass)
- JavaScript (ES6+)
- Prettier (Code Formatting)

## Features

- **Responsive Design**  
  Adapts across desktop, tablet, and mobile using SCSS media queries.

- **Dark Mode Toggle**  
  Switch between light and dark themes with a custom toggle, powered by CSS variables and JavaScript.

- ⌨**Typewriter Title Animation**  
  Title cycles through multiple phrases with a smooth typing effect.

- **Scroll Progress Indicator**  
  Horizontal progress bar at the top tracks scroll position.

- **Dynamic Background**  
  Background color transitions based on scroll position near the footer.

- **Starfield**
  A dynamic starfield in the footer of the website.

- **Modular SCSS**  
  Organized SCSS using nesting, variables, and reusable styles.

- **Animated Timeline**  
  Visualizes job and education milestones with icons and transitions.

- **Animated Profile Section**  
  Pulsing profile image and styled About section layout.

- **Mobile Navigation**  
  Responsive hamburger menu with animated open/close state.

- **Optimized for GitHub Pages**  
  Compiled and deployed from the `/docs` folder for static hosting.

  Deployed from `/docs` folder and optimized for static hosting.


## Project Structure
- `/src` SCSS source files
- `/docs` Compiled site files, i.e HTML, CSS, JS served by Github Pages


## ✅ Project To-Do List

| Task                                  | Status   | Notes                                                             |
|---------------------------------------|----------|-------------------------------------------------------------------|
| Set up SCSS build process             | ✅ Done   | Using `sass` CLI to compile SCSS to `/docs/main.css`             |
| Structure HTML layout                 | ✅ Done   | Core sections (header, about, projects, timeline, footer) built  |
| Implement responsive layout           | ✅ Done   | Adaptive layout using SCSS media queries                         |
| Add basic JavaScript interactivity    | ✅ Done   | Includes scroll effects, DOM manipulation, and dynamic text       |
| Create animated timeline              | ✅ Done   | Vertical timeline with animations and icons                       |
| Add scroll progress indicator         | ✅ Done   | Horizontal scroll tracker at top of page                         |
| Implement typewriter title effect     | ✅ Done   | Switches between phrases with smooth transitions                  |
| Add favicon/logo                      | ✅ Done   | Vector icon with initials "EB" added                             |
| Implement dark mode                   | ✅ Done   | Theme switcher with toggle and CSS variables                     |
| Create dark mode toggle button        | ✅ Done   | Toggle switch styled like a real switch                          |
| Add color gradient and dynamic background | ✅ Done | Gradient title and scroll-triggered background color             |
| Add job and education timeline        | ✅ Done   | Includes pulsing icons, key events                               |
| Improve About section visuals         | ✅ Done   | Profile picture with animation, layout tweaks                    |
| Add 404 page                          | ✅ Done  | Provide fallback for broken routes                                |
| Add Pug -> HTML                       | ✅ Done  | Provides better readability for Markdown files                    |

---

## 🛠️ Still To Do

| Task                                      | Status   | Notes                                                             |
|-------------------------------------------|----------|-------------------------------------------------------------------|
| Organize SCSS using partials              | ⬜ To Do  | Split into `_variables.scss`, `_nav.scss`, `_layout.scss`, etc.   |
| Add SCSS mixins for reusability           | ⬜ To Do  | Create mixins for font sizes, media queries, shadows, etc.        |
| Improve accessibility (a11y)              | ⬜ To Do  | Add alt text, ARIA labels, semantic HTML, focus outlines          |
| Optimize for performance                  | ⬜ To Do  | Compress assets, lazy load images/icons, reduce JS where possible |
| Cross-browser testing                     | ⬜ To Do  | Chrome, Firefox, Safari, Edge — including dark mode toggling      |
| Add page load animation                   | ⬜ To Do  | Fade-in or slide animations for intro section                     |
| Add keyboard navigation support           | ⬜ To Do  | Focus management, skip links, keyboard menu toggle                |
| Expand documentation                      | ⬜ To Do  | Add file structure, build instructions, and comments in SCSS/JS   |
| Add project filtering/sorting             | ⬜ To Do  | Tag or sort repositories using JS                                 |
| Create light/dark theme color presets     | ⬜ To Do  | Define color schemes with consistent contrast                     |
| Optimize mobile layout for small screens  | ⬜ To Do  | Ensure text wraps correctly and elements stack effectively        |


## License

This project is licensed under the [MIT](https://github.com/elibessen/elibessen.github.io/blob/main/LICENSE) license.
