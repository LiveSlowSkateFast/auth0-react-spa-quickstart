import React from "react";

import { useAuth0 } from "../react-auth0-wrapper";

import { Container } from "reactstrap";
import { Spinner, PageHeader } from "@auth0/cosmos";

import ProfileFormField from "../components/ProfileFormField";
import Highlight from "../components/Highlight";

const Profile = () => {

  const { loading, user, profile, updateUserMetadata } = useAuth0();

  if (loading || !user) {
    return <Spinner size="large" />;
  }

  return (
    <Container className="mb-5">
      <PageHeader title="Profile" />
      <ProfileFormField fieldName='First Name' defaultValue={profile.firstName} update={(value) => updateUserMetadata('firstName', value)} />
      <ProfileFormField fieldName='Last Name' defaultValue={profile.lastName} update={(value) => updateUserMetadata('lastName', value)} />
      <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      <Highlight>{JSON.stringify(profile, null, 2)}</Highlight>

    </Container>
  );
};

export default Profile;
