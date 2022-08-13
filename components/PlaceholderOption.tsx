import React from 'react'
import { ChoiceInput } from './ChoiceInput'
import PrimitiveInput from './PrimitiveInput'
import { Choice, SnippetNode } from './_snippetTypes'

interface PlaceholderOptionProps {
  index: number
  props: SnippetNode<'Placeholder'>['props']
}

const PlaceholderOption: React.VFC<PlaceholderOptionProps> = ({
  index,
  props: { name: label, type },
}) => {
  const name = `placeholders.${index}.value`

  return (
    <div>
      {type instanceof Choice ? (
        <ChoiceInput name={name} props={{ name: label, type }} />
      ) : (
        <PrimitiveInput name={name} props={{ name: label, type }} />
      )}
    </div>
  )
}

export default PlaceholderOption
