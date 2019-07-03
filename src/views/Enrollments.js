import React from "react";
import { Container } from "reactstrap";

import { useAuth0 } from "../react-auth0-wrapper";
import GetEnrollmentsList from "../components/GetEnrollmentsList";
import { Spinner, PageHeader } from "@auth0/cosmos";

const Enrollments = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <Container className="mb-5">
        <PageHeader title="Multi-Factor Enrollments" />
        <GetEnrollmentsList />
    </Container>
  );
};

export default Enrollments;
