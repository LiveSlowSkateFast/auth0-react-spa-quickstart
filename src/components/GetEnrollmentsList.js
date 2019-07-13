import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-wrapper";

import config from "../auth_config.json";

import { Button, ResourceList } from '@auth0/cosmos'
import { Collapse, Container, Row } from 'reactstrap'

import Highlight from "./Highlight";
import EnrollmentsListItem from "./EnrollmentsListItem";

const GetEnrollmentsList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [awaitingResult, setAwaitingResult] = useState(false);
  const { getTokenSilently } = useAuth0();

  const getEnrollments = async () => {
    setShowResult(false);
    setAwaitingResult(true)
    try {
      const token = await getTokenSilently({
        audience: "https://" + config.domain + "/mfa/",
        scope: "enroll read:authenticators"
      });

      const response = await fetch("https://" + config.domain + "/mfa/authenticators", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      setEnrollments(responseData);
      setShowResult(true);
      setAwaitingResult(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function loadEnrollments() {
      await getEnrollments()}
      loadEnrollments();
    }, [])

  const makeEnrollmentsListItems = (enrollments) => enrollments.map(enrollment => {
    const item = { ...enrollment }

    return {
      id: item.id,
      type: item.authenticator_type === "otp" ? "totp" :
        item.authenticator_type === "recovery-code" ? "recovery" :
          item.oob_channel === "sms" ? "sms" :
            item.oob_channel === "auth0" ? "push" :
              item.oob_channel === "email" ? "email" : "",
      deviceId: item.name,
      status: item.active ? "active" : "disabled",
    }
  })

  return (
    <Container>
      <Row>
        <Button color="primary" className="mt-5" onClick={getEnrollments} loading={awaitingResult}>
          Get Enrollments
        </Button>
      </Row>
      <Row>
        <Collapse isOpen={showResult}>
          <ResourceList
            items={makeEnrollmentsListItems(enrollments)}
            renderItem={item => <EnrollmentsListItem {...item} />}
          />
          <Highlight>{JSON.stringify(enrollments, null, 2)}</Highlight>
        </Collapse>
      </Row>
    </ Container>
  );
};

export default GetEnrollmentsList;
