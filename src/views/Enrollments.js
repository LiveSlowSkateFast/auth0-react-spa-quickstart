import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

import config from "../auth_config.json";

import { useAuth0 } from "../react-auth0-wrapper";
import { Spinner, PageHeader } from "@auth0/cosmos";
import EnrollmentsList from "../components/EnrollmentsList";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

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

  useEffect(() => {
    const loadEnrollments = async () => {
      await getEnrollments()
    }
    loadEnrollments();
  }, [])

  return (
    <Container className="mb-5">
      <PageHeader title="Multi-Factor Enrollments" />
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
