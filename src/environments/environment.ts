// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiEndpoint: 'http://127.0.0.1/fantamanajer/',
  vapidPublicKey:
    'BEtTz3mWJt9vnMu759pONVf-KeKBv2isIgpfuCgpm_cxqBTwwUyS_eI6Dx7tKuutl0DzgYARKG6vuhfAszr5JBw',
  notificationSubscription: {
    email: [
      { name: 'score', label: 'Punteggio giornata' },
      { name: 'lost_member', label: 'Giocatore rubato' },
      { name: 'lineups', label: 'Formazioni' }
    ],
    push: [
      { name: 'score', label: 'Punteggio giornata' },
      { name: 'lost_member', label: 'Giocatore rubato' }
    ],
  }
};
