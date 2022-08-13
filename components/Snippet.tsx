import { Button, Card, H2, H3, Pre } from '@blueprintjs/core'
import React, { useRef } from 'react'
import { useToaster } from '../util/context'
import useCustomForm from './CustomForm'
import CustomPlaceholderOption from './CustomPlaceholderOption'
import PlaceholderOption from './PlaceholderOption'
import SnippetRenderer from './SnippetRenderer'
import {
  Choice,
  CustomPlaceholderProps,
  PlaceholderChoiceProps,
  PlaceholderInputs,
  PlaceholderProps,
  PrimitiveType,
  SnippetNodeTypes,
  SnippetOptions,
} from './_snippetTypes'

interface SnippetProps {
  name: string
  command?: string
  children: React.ReactElement | React.ReactElement[]
  description?: React.ReactNode
}

const Snippet = ({ name, command, description, children }: SnippetProps): JSX.Element => {
  if (!Array.isArray(children)) children = [children]

  const nodes: SnippetNodeTypes[] = children.map(({ type, props }) => {
    const displayName = ((type as any).displayName as string) || ((type as any).name as string)
    if (displayName in snippetNodeTypes) {
      return {
        type: displayName as keyof typeof snippetNodeTypes,
        props,
      }
    } else {
      for (const [name, factory] of Object.entries(snippetNodeTypes)) {
        if (type === factory) {
          return {
            type: name as keyof typeof snippetNodeTypes,
            props,
          }
        }
      }

      throw new Error(`Unknown snippet node type: ${type}`)
    }
  })

  for (const node of nodes) {
    if (node.type === 'Placeholder') {
      node.props = {
        // @ts-expect-error
        type: 'string',
        ...node.props,
      }
    }
  }

  const placeholders = nodes.filter(({ type }) => type !== 'Text')

  const { Form } = useCustomForm<SnippetOptions>({
    mode: 'onChange',
    onSubmit: (values) => {
      console.log(values)
    },
  })

  const snippetTextRef = useRef<HTMLElement>(null)
  const toaster = useToaster()

  return (
    <Card className="my-4 text-md">
      <Form>
        <div className="flex flex-col xl:flex-row xl:gap-4">
          <div className={`flex-1 flex flex-col ${placeholders.length && 'mb-4'}`}>
            {command && <H3 className="!text-gray-4">{command}</H3>}
            <H2>{name}</H2>
            <Pre
              className="whitespace-pre-wrap relative mb-0 text-md min-h-[8rem]"
              elementRef={snippetTextRef}
            >
              <SnippetRenderer nodes={nodes} />

              <Button
                className="absolute right-2 bottom-2"
                icon="clipboard"
                onClick={() => {
                  const text = snippetTextRef.current?.innerText
                  if (text) {
                    navigator.clipboard
                      .writeText(text)
                      .then(() => {
                        toaster.show({
                          intent: 'success',
                          icon: 'tick',
                          message: 'Copied to clipboard!',
                        })
                      })
                      .catch(() => {
                        toaster.show({
                          intent: 'danger',
                          icon: 'error',
                          message: 'Failed to copy! Check the browser console for details.',
                        })
                      })
                  }
                }}
              />
            </Pre>
            {description && <div className="mt-5 text-lg text-gray-5">{description}</div>}
          </div>
          {placeholders.length > 0 && (
            <aside className="flex flex-col xl:w-[30rem]">
              {placeholders.map(({ type, props }, index) =>
                type === 'Placeholder' ? (
                  <PlaceholderOption key={index} index={index} props={props} />
                ) : type === 'CustomPlaceholder' ? (
                  <CustomPlaceholderOption key={index} index={index} props={props} />
                ) : null
              )}
            </aside>
          )}
        </div>
      </Form>
    </Card>
  )
}

export default Snippet

export const Text = ({ children }: { children: string | string[] }): React.ReactElement => (
  <span>{children}</span>
)
Text.displayName = 'Text'

export function Placeholder<T extends keyof PrimitiveType>(
  props: PlaceholderProps<T>
): React.ReactElement
export function Placeholder<C extends string[]>(
  props: PlaceholderChoiceProps<C>
): React.ReactElement
export function Placeholder<T extends keyof PrimitiveType, C extends string[]>(
  props: PlaceholderProps<T> | PlaceholderChoiceProps<C>
): React.ReactElement {
  return <span>&lt;{props.name}&gt;</span>
}
Placeholder.displayName = 'Placeholder'

export const CustomPlaceholder = <T extends PlaceholderInputs>(
  props: CustomPlaceholderProps<T>
): React.ReactElement => {
  return <span>&lt;{props.name}&gt;</span>
}
CustomPlaceholder.displayName = 'CustomPlaceholder'

export const snippetNodeTypes = {
  Text,
  Placeholder,
  CustomPlaceholder,
}
export const choice = <T extends string[]>(...values: T): Choice<T> => new Choice(values)
