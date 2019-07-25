import React from "react";

import { ResourceList, Button, Label } from '@auth0/cosmos'

const EnrollmentsListItem = (props) => {

  const { key, type, deviceId, status, deleteEnrollment } = props

  return (
    <ResourceList.Item
      id={key}
      title={type === "totp" ? "Time Based One Time Password" :
        type === "recovery" ? "Recovery Code" :
          type === "sms" ? "SMS" :
            type === "push" ? "Push Notification" :
              type === "email" ? "Email" :
                ""}
      subtitle={deviceId}
      icon={type === "totp" ? "clock" :
        type === "recovery" ? "check-circle" :
          type === "sms" ? "phone-portrait" :
            type === "push" ? "push-notifications" :
              type === "email" ? "email" :
                ""}
      actions={[
        <Button icon="delete" onClick={() => {deleteEnrollment()}} label="Remove Enrollment" />,
      ]}
    >
      {status === "active" ?
        <Label appearance="success">Active</Label> :
        <Label > Not Verified </Label>}
    </ResourceList.Item >
  )
}

export default EnrollmentsListItem;
