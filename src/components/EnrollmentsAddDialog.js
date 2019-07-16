import React, { useState } from "react";

import { Dialog, Form, Select, TextInput } from '@auth0/cosmos'
import { Collapse } from 'reactstrap'

import Highlight from "./Highlight";

const EnrollmentAddDialog = (props) => {
  const { visible, closeDialog, addEnrollment } = props
  const [authenticatorType, setAuthenticatorType] = useState('totp')
  const [extendedForm, setExtendedForm] = useState(null)
  const [identifier, setIdentifier] = useState("")
  const [result, setResult] = useState(null)

  const handleChooseAutnenticatorType = (authenticatorType) => {
    setAuthenticatorType(authenticatorType)
    setIdentifier("")
    setExtendedForm(
      authenticatorType === 'sms' ? (
        <Form.Field label='Phone Number' >
          <TextInput
            type="text"
            placeholder="5555555555"
            onChange={e => setIdentifier(e.target.value)}
          />
        </Form.Field>) :
        authenticatorType === 'email' ? (
          <Form.Field label='Email'>
            <TextInput
              type="text"
              placeholder="you@email.com"
              onChange={e => setIdentifier(e.target.value)}
            />
          </Form.Field>) : null
    )
  }

  const sendVerification = async (e) => {
    e.preventDefault()
    setResult(await addEnrollment(authenticatorType, identifier))
  }

  return (
    <div>
      <Dialog
        open={visible}
        title="Add Enrollment"
        onClose={() => closeDialog()}
      >
        <Form>
          <Form.Field label="Authentication Type">
            <Select
              value={authenticatorType}
              options={[
                { text: "Time Based One Time Password", value: "totp" },
                { text: "SMS", value: "sms" },
                { text: "Email", value: "email" },
              ]}
              onChange={e => handleChooseAutnenticatorType(e.target.value)}
            />
          </Form.Field>
          <Collapse isOpen={extendedForm}>
            {extendedForm}
          </Collapse>
          <Form.Actions
            primaryAction={{ label: 'Send Verification', handler: e => sendVerification(e) }}
            secondaryActions={[{ label: "Cancel", handler: () => closeDialog() }]}
          />
        </Form>
        <Collapse isOpen={result} >
          <Highlight>{JSON.stringify(result, null, 2)}</Highlight>
        </Collapse>
      </Dialog>
    </div>
  );
};

export default EnrollmentAddDialog;
