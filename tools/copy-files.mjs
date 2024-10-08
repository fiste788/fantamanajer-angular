// Copy the files over so that they can be uploaded by the pages publish command.
import fs from 'node:fs';
import { join } from 'node:path';
import { client, cloudflare, worker, ssr, ssg } from './paths.mjs';
import * as cheerio from 'cheerio';

fs.cpSync(client, cloudflare, { recursive: true });
fs.cpSync(ssr, worker, { recursive: true });
//fs.cpSync(join(cloudflare, 'index.html'), join(cloudflare, '404.html'));
//fs.cpSync(join(cloudflare, 'index.html'), join(worker, '404.html'));

const ngswConf = join(cloudflare, 'ngsw.json');
if (fs.existsSync(ngswConf)) {
  const data = fs.readFileSync(ngswConf);
  const json = JSON.parse(data);
  json.index = json.index + '.html';
  //fs.writeFileSync(ngswConf, JSON.stringify(json, null, 2), 'utf8');
}

const index = join(worker, 'index.server.html');
if (fs.existsSync(index)) {
  const indexData = fs.readFileSync(index);
  const $ = cheerio.load(indexData);
  $('link[href^=pre-bootstrap]').prop('disabled', true);
  fs.writeFileSync(index, $.html());
}

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
