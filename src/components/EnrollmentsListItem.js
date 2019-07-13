import React from "react";

import { ResourceList, Button, Label } from '@auth0/cosmos'

const EnrollmentsListItem = (props) => {

  const { id, type, deviceId, status } = props

  return (
    <ResourceList.Item
      id={id}
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
        <Button icon="more" onClick={() => { }} label="More" />,
        <Button icon="delete" onClick={() => { }} label="Remove Enrollment" />
      ]}
    >
      {status === "active" ?
        <Label appearance="success">Active</Label> :
        <Label > Not Verified </Label>}
    </ResourceList.Item >
  )
}

export default EnrollmentsListItem;
