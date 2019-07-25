import React, { useState } from "react";

import { Form, TextInput, Button } from '@auth0/cosmos'

const ProfileFormField = (props) => {
  const { fieldName, defaultValue, update, updateError } = props

  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState(updateError)
  const [isActive, setIsActive] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)


  const edit = e => {
    e.preventDefault()
    setIsActive(true)
  }

  const save = async e => {
    e.preventDefault()
    setIsUpdating(true)

    const response = await update(value)
    console.log(response)
    setIsUpdating(false)
    setIsActive(false)
  }

  const cancel = e => {
    e.preventDefault()
    setIsActive(false)
    setValue(defaultValue)
  }

  const handleChange = e => {
    console.log(e.target.value)
    setValue(e.target.value)
  }


  return (
    <Form fullWidth onSubmit={e => save(e)} layout="label-on-top" style={{paddingBottom:"20px"}}>
      <Form.Field label={fieldName}>
        <TextInput
          readOnly={!isActive || isUpdating}
          type="text"
          placeholder={fieldName}
          defaultValue={defaultValue}
          value={value}
          error={updateError ? updateError : error}
          actions={!isActive ? [
            <Button label="Edit" icon="pencil" onClick={(e) => edit(e)} />
          ] : [
              <Button label="Save" icon="check" onClick={(e) => save(e)} />,
              <Button label="Cancel" icon="close" onClick={(e) => cancel(e)} />
            ]}
          onChange={e => handleChange(e)}
        />
      </Form.Field>
    </Form>
  );
};

export default ProfileFormField;
