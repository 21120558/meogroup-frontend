/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/homepage/header/header.component.{html,ts}",
    "./src/app/homepage/hero-section/hero-section.component.{html,ts}",
    "./src/app/homepage/homepage.component.{html,ts}",
    "./src/app/loading/loading.component.{html,ts}",
    "./src/app/authen/authen.component.{html,ts}",
    "./src/app/authen/signin/signin.component.{html,ts}",
    "./src/app/authen/signup/signup.component.{html,ts}",
    "./src/app/authen/complete-regis/complete-regis.component.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
