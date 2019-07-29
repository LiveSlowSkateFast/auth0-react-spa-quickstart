import React, { useState } from "react";

import { useAuth0 } from "../react-auth0-wrapper";

import { Button, Form, Select, Stack } from "@auth0/cosmos";

const EnrollmentsRedirectButton = () => {
  const {loginWithRedirect } = useAuth0();

  const [beginEnrollmentType, setBeginEnrollmentType] = useState()

  return (
    <Form.Field label="Add an Authenticator" helpText="This will redirect you">
      <Stack>
        <Select
          id="selectAuthenticatorType"
          value={beginEnrollmentType}
          placeholder="Choose an Authenticator"
          options={[
            { text: "Guardian Authenticator", value: "guardian" },
            { text: "Google Authenticator", value: "google" },
            { text: "Duo Authenticator", value: "duo" },
          ]}
          onChange={e => setBeginEnrollmentType(e.target.value)} />
        <Button
          disabled={!beginEnrollmentType}
          appearance="primary"
          onClick={(e) => {
            loginWithRedirect({
              redirect_uri: window.location.origin,
              scope: "enroll:" + document.getElementById("selectAuthenticatorType").value,
              appState: { targetUrl: 'enrollments' }
            })
          }} >Begin Enrollment</Button>
      </Stack>
    </Form.Field>
  );
};

export default EnrollmentsRedirectButton;
