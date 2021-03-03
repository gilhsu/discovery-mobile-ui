import React from 'react';

import { shape } from 'prop-types';
import CardBodyField from './CardBodyField';
import {
  getPatientAgeAtResourceDate,
  getReason,
  getOnsetDateTime,
  getAbatementDateTime,
  getOrderedBy,
  getAssertedDate,
  getStatus,
  getClinicalStatus,
  getVerficationStatus,
} from '../../../resources/fhirReader';
import CARD_BODY_LABEL from '../../../resources/cardBodyLabel';

const GenericCardBody = ({ resource, patientResource }) => {
  const { resourceType } = resource;
  const { subType } = resource;

  return (
    <>
      <CardBodyField
        dependency={getPatientAgeAtResourceDate(resource, patientResource)}
        label={CARD_BODY_LABEL.age}
        value={getPatientAgeAtResourceDate(resource, patientResource)}
      />
      <CardBodyField
        dependency={subType}
        label={CARD_BODY_LABEL[resourceType]}
        value={subType}
        bold
      />
      <CardBodyField
        dependency={getReason(resource)}
        label={CARD_BODY_LABEL.reason}
        value={getReason(resource)}
      />
      <CardBodyField
        dependency={getOnsetDateTime(resource)}
        label={CARD_BODY_LABEL.onset}
        value={getOnsetDateTime(resource)}
      />
      <CardBodyField
        dependency={getAbatementDateTime(resource)}
        label={CARD_BODY_LABEL.abatement}
        value={getAbatementDateTime(resource)}
      />
      <CardBodyField
        dependency={getOrderedBy(resource)}
        label={CARD_BODY_LABEL.orderedBy}
        value={getOrderedBy(resource)}
      />
      <CardBodyField
        dependency={getAssertedDate(resource)}
        label={CARD_BODY_LABEL.asserted}
        value={getAssertedDate(resource)}
      />
      <CardBodyField
        dependency={null}
        label={CARD_BODY_LABEL.provider}
        value={null}
      />
      <CardBodyField
        dependency={getStatus(resource)}
        label={CARD_BODY_LABEL.status}
        value={getStatus(resource)}
      />
      <CardBodyField
        dependency={getClinicalStatus(resource)}
        label={CARD_BODY_LABEL.clinicalStatus}
        value={getClinicalStatus(resource)}
      />
      <CardBodyField
        dependency={getVerficationStatus(resource)}
        label={CARD_BODY_LABEL.verificationStatus}
        value={getVerficationStatus(resource)}
      />
    </>
  );
};

GenericCardBody.propTypes = {
  resource: shape({}).isRequired,
  patientResource: shape({}).isRequired,
};

export default GenericCardBody;