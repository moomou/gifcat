const Gfycat = require('gfycat-sdk');

const client_id = '2_QP_H2Q';
const client_secret = 'APUXSwSLoYb3YFVzisfF-ga1wUJU3ams66ELAki-sX0jlGPVi-HOUgoEZceJhwte';
const gfycat = new Gfycat({clientId: client_id, clientSecret: client_secret});

let setupPromise = null;
const svc = {
	async search(query='laughing') {
		await svc.ensureSetup();

		const options = {
			search_text: query,
			count: 10,
			first: 1,
			random: true,
		};

		return gfycat.search(options).then(data => {
			console.log('gfycats', data);
      return data;
		});
  },

	async ensureSetup() {
    if (setupPromise) return setupPromise;
    setupPromise = gfycat.authenticate();
		return setupPromise;
	},
};

export default svc;
