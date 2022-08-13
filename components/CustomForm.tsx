import React, { createContext, HTMLProps, useState } from 'react'
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form'

interface CustomUseFormReturn<T extends FieldValues> extends Omit<UseFormReturn<T>, 'register'> {
  register: <TFieldName extends FieldPath<T> = FieldPath<T>>(
    name: TFieldName,
    options?: RegisterOptions<T, TFieldName>
  ) => Omit<UseFormRegisterReturn<TFieldName>, 'ref'> & {
    inputRef: Exclude<React.Ref<HTMLInputElement>, null>
  }

  forceUpdate: () => void
}

interface FormProps<T extends FieldValues> extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
  children: React.ReactNode | ((data: CustomUseFormReturn<T>) => React.ReactNode)
}

interface UseCustomFormProps<T extends FieldValues> extends UseFormProps<T> {
  onSubmit: SubmitHandler<T>
}

interface UseCustomForm<T extends FieldValues> extends CustomUseFormReturn<T> {
  Form: React.FC<FormProps<T>>
}

const FormContext = createContext<CustomUseFormReturn<any>>({} as CustomUseFormReturn<any>)
export const useFormContext = <T extends FieldValues>(): CustomUseFormReturn<T> => {
  const context = React.useContext(FormContext)
  if (context === undefined) {
    throw new Error('useFormContext must be used within a Form')
  }
  return context as unknown as CustomUseFormReturn<T>
}

const useCustomForm = <T extends FieldValues>({
  onSubmit,
  ...formOptions
}: UseCustomFormProps<T>): UseCustomForm<T> => {
  const useFormReturn = useForm<T>({
    ...formOptions,
    mode: 'onChange',
  })

  const [, _forceUpdate] = useState({})
  const forceUpdate = (): void => _forceUpdate({})

  const customUseFormReturn: CustomUseFormReturn<T> = {
    ...useFormReturn,
    forceUpdate,
    register(name, options) {
      const { ref, ...register } = useFormReturn.register(name, options)

      return {
        ...register,
        inputRef: ref,
      }
    },
  }

  const Form = ({ children, className, ...props }: FormProps<T>): React.ReactElement => {
    return (
      <form
        className={`${className}`}
        onSubmit={customUseFormReturn.handleSubmit(onSubmit)}
        {...props}
      >
        <FormContext.Provider value={customUseFormReturn}>
          {typeof children === 'function' ? children(customUseFormReturn) : children}
        </FormContext.Provider>
      </form>
    )
  }

  return {
    Form,
    ...customUseFormReturn,
  }
}

export default useCustomForm
