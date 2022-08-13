import { Card, Elevation, FormGroup } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import { ChoiceInput } from './ChoiceInput'
import { useFormContext } from './CustomForm'
import PrimitiveInput from './PrimitiveInput'
import { Choice, PlaceholderInputs, SnippetNode } from './_snippetTypes'

interface OptionRendrerProps {
  inputs: PlaceholderInputs
  path?: string
  group?: boolean
  card?: boolean
  selected?: boolean
  label?: string
}

interface CustomPlaceholderOptionProps {
  index: number
  props: SnippetNode<'CustomPlaceholder'>['props']
}

const CustomPlaceholderOption: React.VFC<CustomPlaceholderOptionProps> = ({
  index,
  props: { name: label, inputs, presets },
}) => {
  const { register, getValues, setValue, forceUpdate, resetField } = useFormContext()

  const internal = (path: string): string => `placeholders.${index}.internal.${path}`
  const name = (path: string): string => `placeholders.${index}.value.${path}`
  const factoryName = `placeholders.${index}.factory`

  const OptionRenderer = ({
    inputs,
    path = '',
    group = false,
    card = false,
    selected = false,
    label,
  }: OptionRendrerProps): JSX.Element => {
    const children = Object.entries(inputs).map(([itemLabel, props], index) => {
      // primitive
      if (typeof props === 'string') {
        return (
          <PrimitiveInput
            key={index}
            name={name(`${path ? `${path}.` : ''}${itemLabel}`)}
            props={{ name: itemLabel, type: props }}
            className={group || card ? 'mb-0' : 'mb-2'}
            group={group}
            disabled={!selected}
          />
        )
      }

      // choice
      if (props instanceof Choice) {
        return <ChoiceInput key={index} name={itemLabel} props={{ name: itemLabel, type: props }} />
      }

      // union
      if (Array.isArray(props)) {
        const unionPath = `${path ? path + '.' : ''}${itemLabel}`
        const unionSelectedPath = `${unionPath}.$$selected`
        const selectedIndex = getValues(internal(unionSelectedPath))
        const hideLabel = props.every((p) => {
          const keys = Object.keys(p)
          return keys.length === 1 && keys[0] === Object.keys(props[0])[0]
        })

        const options = props.map((type, index) => (
          <OptionRenderer
            inputs={type}
            key={index}
            path={unionPath}
            card
            label={hideLabel ? '' : undefined}
            selected={selectedIndex === index}
          />
        ))

        return (
          <FormGroup
            key={index}
            label={itemLabel}
            contentClassName="flex xl:flex-col flex-col md:flex-row items-stretch h-max"
          >
            {options.map((option, index) => (
              <Fragment key={index}>
                <Card
                  className="p-3 min-h-0 pb-4 flex flex-col gap-4"
                  interactive={selectedIndex !== index}
                  elevation={selectedIndex === index ? Elevation.THREE : 0}
                  onClick={
                    selectedIndex !== index
                      ? () => {
                          setValue(name(unionPath), {})
                          setValue(internal(unionSelectedPath), index)
                          forceUpdate()
                        }
                      : undefined
                  }
                >
                  {option}
                </Card>
                {index !== options.length - 1 && (
                  <div className="or-divider">
                    <span>or</span>
                  </div>
                )}
              </Fragment>
            ))}
          </FormGroup>
        )
      }

      // group
      if (typeof props === 'object') {
        return (
          <OptionRenderer
            inputs={props}
            key={index}
            path={`${path ? path + '.' : ''}${itemLabel}`}
            group
            card
            selected={selected}
            label={label === '' ? '' : itemLabel}
          />
        )
      }

      throw new Error(`Unknown placeholder input type: ${typeof props}`)
    })

    return group ? (
      <FormGroup
        label={label}
        disabled={!selected}
        contentClassName="flex gap-2"
        className={`${card && 'mb-0'}`}
      >
        {children}
      </FormGroup>
    ) : (
      <>{children}</>
    )
  }

  return <OptionRenderer inputs={inputs} label={label} />
}

export default CustomPlaceholderOption
