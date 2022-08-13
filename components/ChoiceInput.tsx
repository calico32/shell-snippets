import { Button, ButtonGroup, FormGroup } from '@blueprintjs/core'
import React from 'react'
import { useFormContext } from './CustomForm'
import { Choice } from './_snippetTypes'

interface ChoiceProps {
  name: string
  props: {
    name: string
    type: Choice<string[]>
  }
}

export const ChoiceInput: React.VFC<ChoiceProps> = ({ name, props: { name: label, type } }) => {
  const { getValues, setValue, forceUpdate } = useFormContext()

  return (
    <FormGroup label={label}>
      <ButtonGroup className="flex w-full flex-wrap">
        {type.values.map((choice, index) => (
          <Button
            className="!flex-grow"
            key={index}
            onClick={() => {
              setValue(name, choice)
              forceUpdate()
            }}
            active={getValues(name) === choice}
          >
            {choice}
          </Button>
        ))}
      </ButtonGroup>
    </FormGroup>
  )
}
