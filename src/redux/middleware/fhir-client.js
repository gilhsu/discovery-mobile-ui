import Client from 'fhir-kit-client';
// import { Alert } from 'react-native';

const { Buffer } = require('buffer');

const RESOURCE_TYPES = [
  // 'Patient',
  // 'ExplanationOfBenefit',
  // 'Claim',
  // 'Condition', // "A required element is missing."
  'Encounter',
  'Immunization',
  'MedicationRequest',
  // 'CarePlan',
  'DiagnosticReport',
  'Procedure',
  // 'Observation',
];

// JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants
//     https://datatracker.ietf.org/doc/html/rfc7523
// JSON Web Token Best Current Practices
//     https://datatracker.ietf.org/doc/html/rfc8725
export const decodeIdToken = (idToken) => idToken.split('.').map((data, index) => {
  // return `https://launch.smarthealthit.org/v/r4/sim/${Buffer.from(issDataString).toString('base64')}/fhir`;
  // const buffer = new Buffer(data, 'base64');
  const buffer = Buffer.from(data, 'base64');
  const segment = buffer.toString('ascii');
  if (index < 2) {
    try {
      return JSON.parse(segment.toString());
    } catch (e) {
      console.error('decodeIdToken ERROR: ', e); // eslint-disable-line no-console
    }
  }
  return segment;
});

export default class FhirClient {
  constructor(baseUrl, accessToken, idToken) {
    this.decodedIdToken = decodeIdToken(idToken);
    this.patientId = this.decodedIdToken[1].sub;

    console.info('baseUrl: ', baseUrl);
    console.info('accessToken: ', accessToken);
    console.info('patientId: ', this.patientId);

    this.client = new Client({
      baseUrl,
      customHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  queryPatient() {
    const { patientId } = this;
    const requests = [() => this.client.request(`Patient/${patientId}`)];

    return requests.concat(RESOURCE_TYPES.map((resourceType) => () => (this.client.search({
      resourceType,
      searchParams: {
        patient: patientId,
      },
    }))));
  }

  async request(url) {
    return this.client.request(url);
  }

  async resolve(params) {
    return this.client.resolve(params);
  }
}
