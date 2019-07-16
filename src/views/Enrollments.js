import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

import config from "../auth_config.json";

import { useAuth0 } from "../react-auth0-wrapper";
import { Spinner, PageHeader, Button } from "@auth0/cosmos";
import EnrollmentsList from "../components/EnrollmentsList";
import EnrollmentAddDialog from "../components/EnrollmentsAddDialog.js";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false)

  const { getTokenSilently } = useAuth0();

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

      setEnrollments(await response.json())
      setLoadingEnrollments(false);

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

  useEffect(() => {
    const loadEnrollments = async () => {
      await getEnrollments()
    }
    loadEnrollments();
  }, [])

  return (
    <Container className="mb-5">
      <PageHeader title="Multi-Factor Enrollments" />
      <Button onClick={() => setShowAddDialog(true)}>Add Enrollment</Button>
      <EnrollmentAddDialog
        visible={showAddDialog}
        closeDialog={() => setShowAddDialog(!showAddDialog)}
        addEnrollment={(type, identifier) => addEnrollement(type, identifier)}
      />
      {enrollments.length === 0 ?
        <Spinner size="large" /> :
        <EnrollmentsList
          enrollments={enrollments}
          visible={!loadingEnrollments}
          handleEnrollmentDelete={(enrollmentId) => deleteEnrollment(enrollmentId)}
        />}
    </Container>
  );
};

export default Enrollments;
