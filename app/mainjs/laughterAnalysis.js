import fetch from 'node-fetch';

async function analysisUrl(url) {
	const res = await fetch(`https://api.ohsloth.com/laughter/classify?url=${url}`);
  const jBody = res.json();
  return jBody;
}

export default analysisUrl;
