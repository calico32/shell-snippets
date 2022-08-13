import { Fragment } from 'react'
import { useWatch } from 'react-hook-form'
import { useFormContext } from './CustomForm'
import { Choice, PlaceholderInputs, PlaceholderValues, SnippetNodeTypes } from './_snippetTypes'

interface SnippetRendererProps {
  nodes: SnippetNodeTypes[]
}

const SnippetRenderer = ({ nodes }: SnippetRendererProps): JSX.Element => {
  const { control } = useFormContext()
  const values = useWatch({
    control,
  })

  console.log(values)

  let placeholderIndex = 0
  return (
    <>
      {nodes.map(({ type, props }, index) => {
        if (type === 'Text') {
          return <Fragment key={index}>{props.children}</Fragment>
        }

        const options = values.placeholders?.[placeholderIndex++]

        if (type === 'Placeholder') {
          if (options?.value == null || options.value === '') {
            return (
              <span className="text-red-4 font-bold" key={index}>
                &lt;{props.name.replaceAll(' ', '_')}&gt;
              </span>
            )
          }

          return (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            props.render?.(options.value as any, index) ?? <span key={index}>{options.value}</span>
          )
        }

        if (type === 'CustomPlaceholder') {
          const values = options?.value as PlaceholderValues<PlaceholderInputs>
          if (values == null || !isComplete(props.inputs, values)) {
            return (
              <span className="text-red-4 font-bold" key={index}>
                &lt;{props.name.replaceAll(' ', '_')}&gt;
              </span>
            )
          }

          cleanValues(props.inputs, values)

          return props.render(values, index)
        }

        throw new Error(`Unknown snippet node type: ${type}`)
      })}
    </>
  )
}

export default SnippetRenderer

const cleanValues = (
  inputs: PlaceholderInputs | PlaceholderInputs[],
  values: PlaceholderValues,
  path = ''
): void => {
  for (const [key, value] of Object.entries(values)) {
    if (value == null) {
      delete values[key]
      continue
    }

    let branch
    if (Array.isArray(inputs)) {
      for (const option of inputs) {
        if (option[key] != null) {
          branch = option
          break
        }
      }

      if (!branch) {
        throw new Error(`no match found for ${key} in ${JSON.stringify(inputs)}`)
      }
    } else {
      branch = inputs
    }

    const type = branch[key]

    if (typeof type === 'string') {
      // primitive
      if (type === 'boolean') {
        values[key] = Boolean(value)
      } else if (type === 'yesno' || type === 'string') {
        // leave as-is
      } else {
        values[key] = Number(value)
      }

      continue
    }

    if (typeof value === 'object') {
      cleanValues(branch[key] as PlaceholderInputs | PlaceholderInputs[], value, `${path}.${key}`)
      continue
    }
  }
}

const isComplete = (
  inputs: PlaceholderInputs,
  values: PlaceholderValues | undefined | null,
  path = ''
): boolean => {
  try {
    if (!values) throw new Error()

    for (const key in inputs) {
      if (values[key] == null) throw new Error()

      if (typeof inputs[key] === 'string' || inputs[key] instanceof Choice) {
        // primitive type or choice
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        if (['', 'null', 'undefined'].includes(values[key].toString())) throw new Error()
      } else if (Array.isArray(inputs[key])) {
        // union type
        if (!values[key]) throw new Error()

        // if none of the variants say it's complete, the whole thing is not complete
        if (
          (inputs[key] as PlaceholderInputs[]).every(
            (input, index) =>
              !isComplete(input, values[key] as PlaceholderValues, `${path}.${key}[${index}]`)
          )
        ) {
          throw new Error()
        }
      } else {
        // object type
        // if this branch is not complete, the whole thing is not complete
        if (
          !isComplete(
            inputs[key] as PlaceholderInputs,
            values[key] as PlaceholderValues,
            `${path}.${key}`
          )
        ) {
          throw new Error()
        }
      }
    }
  } catch {
    console.debug(`isComplete fail at ${path}`)
    return false
  }

  console.debug(`isComplete pass at ${path || '.'}`)
  return true
}
