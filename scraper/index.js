const Promise = require('bluebird');
const Nightmare = require('nightmare');

const config = require('./config.json');

function getUrl(query, page) {
  const url = `http://www.freesound.org/search/?q=laughter&f=duration%3A%5B0+TO+30%5D&s=score+desc&advanced=1&g=1&page=${page}`;
  return url;
}

function fetch(url) {
  let result;

  return Nightmare()
    .goto(url)
    .wait('.clear')
    .evaluate(() => {
      return Array.from(document.querySelectorAll('.mp3_file')).map(d => d.href);
    }).end()
    .catch(error => {
      throw error;
    });;
}

const runner = Promise.coroutine(function*() {
  const category = config.category;
  console.log('---');
  for (let i = 1; i <= 21; i++) {
    for (let j = 1; j <= 3; j++) {
      try {
        const urls = yield fetch(getUrl('', i));
        (urls || []).forEach(t => console.log(t));
        break;
      } catch (e) {
      }
    }
  }

  yield Promise.delay(10);
});

runner();
