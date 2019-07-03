import React from "react";

import { Container } from "reactstrap";

import { useAuth0 } from "../react-auth0-wrapper";
import ProfileForm from "../components/ProfileForm";
import { Spinner, PageHeader } from "@auth0/cosmos";

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <Container className="mb-5">
        <PageHeader title="Profile" />
        <ProfileForm user={user} />
    </Container>
  );
};

export default Profile;
