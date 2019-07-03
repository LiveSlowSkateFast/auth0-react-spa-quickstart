import React, { useState } from "react";
import { Button, Table } from '@auth0/cosmos'
import { Collapse } from 'reactstrap'

import Highlight from "./Highlight";
import { useAuth0 } from "../react-auth0-wrapper";
import config from "../auth_config.json";

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

  return (
    <>
      <Button color="primary" className="mt-5" onClick={getEnrollments} loading={awaitingResult}>
        Get Enrollments
      </Button>
      <Collapse isOpen={showResult}>
        <Table
          items={enrollments} >
          <Table.Column field="authenticator_type" title="Type" />
          <Table.Column field="oob_channel" title="Channel" />
          <Table.Column field="name" title="id" />
        </Table>
        <Highlight>{JSON.stringify(enrollments, null, 2)}</Highlight>
      </Collapse>
    </>
  );
};

export default GetEnrollmentsList;
