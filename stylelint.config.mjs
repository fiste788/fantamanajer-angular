/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-prettier/recommended",
    "stylelint-config-standard-scss",
    "stylelint-config-prettier-scss"
  ],
  rules: {
    "no-empty-source": null,
    "block-no-empty": null
  }
}
