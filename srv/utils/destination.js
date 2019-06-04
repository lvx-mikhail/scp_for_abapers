"use strict";

const request = require('request-promise');
const xsenv = require('@sap/xsenv');

class Destination {

	constructor(logger) {
		this._logger = logger;

		xsenv.loadEnv();
		this._servicesConfig = xsenv.getServices({
			destination: {
				tag: 'destination'
			}
		});

		this._clientIdDest = this._servicesConfig.destination.clientid;
		this._clientSecretDest = this._servicesConfig.destination.clientsecret;

		this._tokenDestination = '';
		this._expiresAtDestination = 0;
	}

	async getTokenDestination() {
		if (this._tokenDest) {
			if (Date.now() < this._expiresAtDest - (60 * 1000)) {
				return this._tokenDest;
			}
		}

		const post_options_dest = {
			url: this._servicesConfig.destination.url + '/oauth/token',
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + Buffer.from(this._clientIdDest + ':' + this._clientSecretDest).toString('base64'),
				'Content-type': 'application/x-www-form-urlencoded'
			},
			form: {
				'client_id': this._clientIdDest,
				'grant_type': 'client_credentials'
			}
		}

		const data = await request(post_options_dest);
		const json = JSON.parse(data);
		this._tokenDest = json.access_token;
		this._expiresAtDest = Date.now() + (json.expires_in * 1000);

		return this._tokenDest;
	}

	async getDestinationList() {
		let token = await this.getTokenDestination();

		const get_options = {
			url: this._servicesConfig.destination.uri + '/destination-configuration/v1/subaccountDestinations',
			headers: {
				'Authorization': 'Bearer ' + token
			}
		}

		const data = await request(get_options);

		this._logger.info(`!!!!getDestinationList: ${data}`);

		return JSON.parse(data);
	}

	async getDestination(destinationName) {
		if (this._destinationName && this._destinationName === destinationName) {
			if (this._destination) {
				return this._destination;
			}
		}

		let token = await this.getTokenDestination();
		const get_options = {
			url: this._servicesConfig.destination.uri + '/destination-configuration/v1/subaccountDestinations/' + destinationName,
			headers: {
				'Authorization': 'Bearer ' + token
			}
		}

		const data = await request(get_options);
		this._destination = JSON.parse(data);
		this._destinationName = destinationName;
		return this._destination;
	}

}

module.exports = Destination;