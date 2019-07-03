import React from "react";

import { Avatar, Form, TextInput } from '@auth0/cosmos'
import { Row, Col } from 'reactstrap'
import Highlight from "./Highlight";

const ProfileForm = (props) => {

  const { user } = props

  return (
    <>
    <Row>
      <Col lg="1">
        <Avatar
          type="user"
          image={user.picture}
          size="xlarge" />
      </Col>
      <Col>
        <Form>
          <Form.Field label="Name">
            <TextInput
              type="text"
              placeholder="Name"
              defaultValue={user.name} />
          </Form.Field>
          <Form.Field label="Email">
            <TextInput
              type="text"
              placeholder="Email"
              defaultValue={user.email}
              disabled="true" />
          </Form.Field>
          <Form.Field label="Nickname">
            <TextInput
              type="text"
              placeholder="Nickname"
              defaultValue={user.nickname} />
          </Form.Field>
          <Form.Actions primaryAction={{
            label: 'Save Changes',
            handler: (e) => { e.preventDefault() }
          }} />
        </Form>
      </Col>
    </Row>
    <Row></Row>
    <Row>
      <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
    </Row>
    </>
  );
};

export default ProfileForm;
