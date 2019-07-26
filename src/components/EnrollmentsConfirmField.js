import React, { useState } from "react";

import { Form, TextInput, Button } from '@auth0/cosmos'

const EnrollmentsConfirmField = (props) => {
  const { defaultValue, verifyEnrollment, updateError } = props

  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState(updateError)
  const [isUpdating, setIsUpdating] = useState(false)

  const save = async e => {
    e.preventDefault()
    setIsUpdating(true)

    const response = await verifyEnrollment(value)
    console.log(response)
    setIsUpdating(false)
  }

  const handleChange = e => {
    console.log(e.target.value)
    setValue(e.target.value)
  }


  return (
    <Form fullWidth onSubmit={e => save(e)} layout="label-on-top" style={{ paddingBottom: "20px" }}>
      <Form.Field label="Enter Code">
        <TextInput
          readOnly={isUpdating}
          type="text"
          placeholder=""
          defaultValue=""
          value={value}
          error={updateError ? updateError : error}
          actions={ [
              <Button label="Save" icon="check" onClick={(e) => save(e)} />
            ]}
          onChange={e => handleChange(e)}
        />
      </Form.Field>
    </Form>
  );
};

export default EnrollmentsConfirmField;
