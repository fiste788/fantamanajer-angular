// Copy the files over so that they can be uploaded by the pages publish command.
import fs from 'node:fs';
import { join } from 'node:path';
import { client, cloudflare, worker, ssr, ssg } from './paths.mjs';

fs.cpSync(client, cloudflare, { recursive: true });
fs.cpSync(ssr, worker, { recursive: true });
fs.cpSync(join(cloudflare, 'index.html'), join(cloudflare, '404.html'));
fs.cpSync(join(cloudflare, 'index.html'), join(worker, '404.html'));

if (fs.existsSync(join(ssr, '../prerendered-routes.json'))) {
  const data = fs.readFileSync();
  if (!fs.existsSync(ssg)) {
    fs.mkdirSync(ssg);
  }

  const routes = JSON.parse(data).routes;
  routes
    .map((r) => (r.indexOf('/', 2) > 0 ? undefined : r.substring(1)))
    .filter((r) => r !== undefined && r !== '/' && r !== '')
    .forEach((path) => {
      fs.renameSync(join(cloudflare, path), join(ssg, path));
    });
}
fs.renameSync(join(worker, 'server.mjs'), join(worker, 'index.js'));
