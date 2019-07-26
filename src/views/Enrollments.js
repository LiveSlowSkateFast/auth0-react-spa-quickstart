import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

import config from "../auth_config.json";

import { useAuth0 } from "../react-auth0-wrapper";
import { Spinner, PageHeader, Button, Form, Switch, Select, Stack, Heading } from "@auth0/cosmos";
import EnrollmentsList from "../components/EnrollmentsList";
import EnrollmentAddDialog from "../components/EnrollmentsAddDialog.js";
import Highlight from "../components/Highlight.js";

const Enrollments = () => {
  const { getTokenSilently, profile, loginWithRedirect, updateUserMetadata } = useAuth0();
  const [enrollments, setEnrollments] = useState();
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [canEnable, setCanEnable] = useState(false)
  const [beginEnrollmentType, setBeginEnrollmentType] = useState()
  const [toggleMfaError, setToggleMfaError] = useState()


  const getMFAToken = async () => getTokenSilently({
    audience: "https://" + config.domain + "/mfa/",
    scope: "enroll read:authenticators remove:authenticators"
  });

  const getEnrollments = async () => {
    setLoadingEnrollments(true)
    try {
      const response = await fetch("https://" + config.domain + "/mfa/authenticators", {
        headers: {
          Authorization: `Bearer ${await getMFAToken()}`
        }
      });
      const enrollments = await response.json()
      setLoadingEnrollments(false);
      return enrollments
    } catch (error) {
      console.error(error);
      setLoadingEnrollments(false);
    }
  };

  const deleteEnrollment = async (enrollmentId) => {
    try {
      const response = await fetch("https://" + config.domain + "/mfa/authenticators/" + enrollmentId, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await getMFAToken()}`
        }
      });
      if (response.status === 204) setEnrollments(await enrollments.filter((enrollment) => enrollment.id !== enrollmentId))
    }
    catch (error) {
      console.log(error);
    }
  }

  const addEnrollement = async (type, identifier) => {
    const requestBody = {
      authenticator_types: type === "totp" ? ["otp"] : ["oob"],
    }
    if (type === "email") {
      requestBody.oob_channels = ["email"]
      requestBody.email = identifier
    }
    if (type === "sms") {
      requestBody.oob_channels = ["sms"]
      requestBody.phone_number = identifier
    }
    try {
      const response = await fetch("https://" + config.domain + "/mfa/associate", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getMFAToken()}`,
        },
        body: JSON.stringify(requestBody)
      });

      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  // DO NOT DO THIS IN REAL LIFE.  THIS SHOULD BE SERVER BASED
  const verifyEnrollment = async (otpCode, bindingCode) => {

    const requestBody = {
      grant_type: 'http://auth0.com/oauth/grant-type/mfa-otp',
      client_id: config.clientId,
      mfa_token: await getMFAToken(),
      //THIS LINE COMPROMISES THE ENTIRE SECURITY OF THE APP
      client_secret: config.clientSecret,
      otp: otpCode,
    }

    if (bindingCode) requestBody.binding_code = bindingCode

    try {
      const response = await fetch("https://" + config.domain + "/oauth/token", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMFA = async () => {
    updateUserMetadata("mfaOnLogin", profile.mfaOnLogin ? false : true)
  }

  useEffect(() => {
    const loadEnrollments = async () => {
      const enrollments = await getEnrollments()
      setEnrollments(enrollments)
      const activeEnrollments = await enrollments.filter(enrollment => (
        enrollment.active && enrollment.authenticator_type !== 'recovery-code'))
      setCanEnable(activeEnrollments.length > 0)
    }
    loadEnrollments();
    // eslint-disable-next-line
  }, [])

  return (
    <Container className="mb-5">
      <PageHeader title="Multi-Factor Enrollments" />
      <Form.Field label="Enable MFA On Login" helpText="You must have an active enrollment inorder to enable MFA on login.">
        <Switch
          label="Enable MFA" on={profile.mfaOnLogin}
          onChange={() => toggleMFA()}
          readOnly={!canEnable}
        />
      </Form.Field>

      {/* <Form.Field label="Add an Authenticator" helpText="This will redirect you">
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
      </Form.Field> */}

      <Button onClick={() => setShowAddDialog(true)}>Add Enrollment</Button>

      <EnrollmentAddDialog
        visible={showAddDialog}
        closeDialog={() => setShowAddDialog(!showAddDialog)}
        addEnrollment={(type, identifier) => addEnrollement(type, identifier)}
        verifyEnrollment={ (otpCode, bindingCode) => verifyEnrollment(otpCode, bindingCode)}
      />
      {!enrollments ?
        <Spinner size="large" /> :
        <>
          <Heading size="4">Current Enrollments</Heading>
          <EnrollmentsList
            enrollments={enrollments}
            visible={!loadingEnrollments}
            handleEnrollmentDelete={(enrollmentId) => deleteEnrollment(enrollmentId)}
          />
        </>}
      <Highlight>{JSON.stringify(enrollments, null, 2)}</Highlight>
    </Container>
  );
};

export default Enrollments;
