import { FormGroup, FormGroupProps, InputGroup, Switch } from '@blueprintjs/core'
import React from 'react'
import { useFormContext } from './CustomForm'
import { PrimitiveType } from './_snippetTypes'

interface PrimitiveInputProps extends FormGroupProps {
  name: string
  props: {
    name: string
    type: keyof PrimitiveType
  }
  group?: boolean
}

const PrimitiveInput: React.VFC<PrimitiveInputProps> = ({
  name,
  group,
  props: { name: label, type },
  ...props
}) => {
  const { register } = useFormContext()

  const numeric: Array<keyof PrimitiveType> = ['integer', 'number', 'positive', 'natural']
  const text: Array<keyof PrimitiveType> = ['string']
  const boolean: Array<keyof PrimitiveType> = ['boolean', 'yesno']

  return (
    <FormGroup
      {...props}
      label={label}
      className={`${props.className} ${group && 'inline-flex'}`}
      inline={boolean.includes(type)}
    >
      {boolean.includes(type) ? (
        <Switch
          className="!mb-0 !mt-1"
          disabled={props.disabled}
          {...(props.disabled ? {} : register(name))}
        />
      ) : (
        <InputGroup
          disabled={props.disabled}
          placeholder={type}
          type={numeric.includes(type) ? 'number' : 'text'}
          {...(props.disabled ? {} : register(name))}
        />
      )}
    </FormGroup>
  )
}

export default PrimitiveInput
