import React from "react";
import { RowLayout, AvatarBlock } from '@auth0/cosmos'

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-wrapper";

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <RowLayout gutter="small">
      <div>
        <AvatarBlock
          type="user"
          image={user.picture}
          size="large"
          title={user.name}
          subtitle={user.email}
        />
      </div>
      <div>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </div>
    </RowLayout>

  );
};

export default Profile;
