import React, { useState } from "react";

import { Dialog, Form, Select, TextInput } from '@auth0/cosmos'
import { Collapse } from 'reactstrap'
import QRCode from 'qrcode.react'

import Highlight from "./Highlight";
import EnrollmentsConfirmField from "./EnrollmentsConfirmField";

const EnrollmentAddDialog = (props) => {
  const { visible, closeDialog, addEnrollment, verifyEnrollment } = props
  const [authenticatorType, setAuthenticatorType] = useState('push')
  const [extendedForm, setExtendedForm] = useState(null)
  const [identifier, setIdentifier] = useState("")
  const [result, setResult] = useState()
  const [qrCode, setQrCode] = useState()

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
    const response = await addEnrollment(authenticatorType, identifier)
    setResult(response)
    if (response.barcode_uri) setQrCode(<QRCode value={response.barcode_uri} />)
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
                { text: "Push Notification", value: "push" },
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
          {qrCode}
          <EnrollmentsConfirmField
            verifyEnrollment={(otpCode) => verifyEnrollment(otpCode, result ? result.oob_code : null)}
          />
          <Highlight>{JSON.stringify(result, null, 2)}</Highlight>
        </Collapse>
      </Dialog>
    </div>
  );
};

export default EnrollmentAddDialog;
