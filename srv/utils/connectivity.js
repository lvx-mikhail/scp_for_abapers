"use strict";

const request = require('request-promise');
const xsenv = require('@sap/xsenv');

class Connectivity {

	constructor(destination, logger) {
		this._destination = destination;
		this._logger = logger;

		xsenv.loadEnv();
		this._servicesConfig = xsenv.getServices({
			connectivity: {
				tag: 'connectivity'
			}
		});

		this._proxy_host = this._servicesConfig.connectivity.onpremise_proxy_host;
		this._proxy_port = this._servicesConfig.connectivity.onpremise_proxy_port;

		this._clientIdCon = this._servicesConfig.connectivity.clientid;
		this._clientSecretCon = this._servicesConfig.connectivity.clientsecret;

		this._sapClient = 100;

		this._tokenCon = '';
		this._expiresAtCon = 0;
	}

	async getTokenConnectivity() {

		if (this._tokenCon) {
			if (Date.now() < this._expiresAtCon - (60 * 1000)) {
				return this._tokenCon;
			}
		}

		const post_options_con = {
			url: this._servicesConfig.connectivity.url + '/oauth/token',
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + Buffer.from(this._clientIdCon + ':' + this._clientSecretCon).toString('base64'),
				'Content-type': 'application/x-www-form-urlencoded'
			},
			form: {
				'client_id': this._clientIdCon,
				'grant_type': 'client_credentials'
			}
		}

		const data = await request(post_options_con);
		const json = JSON.parse(data);
		this._tokenCon = json.access_token;
		this._expiresAtCon = Date.now() + (json.expires_in * 1000);

		return this._tokenCon;
	}

	async getRequestOptions(options, endpoint) {
		let tokenCon = await this.getTokenConnectivity();
		if (!('headers' in options)) {
			options.headers = {};
		}
		if (!('qs' in options)) {
			options.qs = {};
		}
		options.url = destination.destinationConfiguration.URL + endpoint;
		options.headers['Proxy-Authorization'] = 'Bearer ' + tokenCon,
		options.headers['Authorization'] = 'Basic ' 
			+ new Buffer(destination.destinationConfiguration.User 
			+ ':' 
			+ destination.destinationConfiguration.Password).toString('base64')
		options.qs['sap-client'] = this._sapClient;
		options.proxy = 'http://' + this._proxy_host + ':' + this._proxy_port;
		return options;
	}

}

module.exports = Connectivity;