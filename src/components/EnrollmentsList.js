import React from "react";

import { ResourceList } from '@auth0/cosmos'
import { Collapse } from 'reactstrap'

import EnrollmentsListItem from "./EnrollmentsListItem";

const EnrollmentsList = (props) => {

  const { enrollments, visible, handleEnrollmentDelete } = props

  const makeEnrollmentsListItems = (enrollments) => enrollments.map(enrollment => {
    const item = { ...enrollment }

    return {
      key: item.id,
      type: item.authenticator_type === "otp" ? "totp" :
        item.authenticator_type === "recovery-code" ? "recovery" :
          item.oob_channel === "sms" ? "sms" :
            item.oob_channel === "auth0" ? "push" :
              item.oob_channel === "email" ? "email" : "",
      deviceId: item.name,
      status: item.active ? "active" : "disabled",
      deleteEnrollment: () => handleEnrollmentDelete(item.id)
    }
  })

  return (
    <Collapse isOpen={visible}>
      <ResourceList
        items={makeEnrollmentsListItems(enrollments)}
        renderItem={item => <EnrollmentsListItem {...item} />}
      />
    </Collapse>
  );
};

export default EnrollmentsList;
