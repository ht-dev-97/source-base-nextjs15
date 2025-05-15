import React, { ComponentType, ReactNode } from 'react'

type ComponentWithProps<T = Record<string, unknown>> = [
  ComponentType<T & { children: ReactNode }>,
  T?
]

const buildProvidersTree = (
  componentsWithProps: ComponentWithProps[]
): ComponentType<{ children: ReactNode }> => {
  const initialComponent: ComponentType<{ children: ReactNode }> = ({
    children
  }) => <>{children}</>

  return componentsWithProps.reduce<ComponentType<{ children: ReactNode }>>(
    (AccumulatedComponents, [Provider, props = {}]) => {
      const WrappedComponent: ComponentType<{ children: ReactNode }> = ({
        children
      }) => (
        <AccumulatedComponents>
          <Provider {...props}>{children}</Provider>
        </AccumulatedComponents>
      )

      return WrappedComponent
    },
    initialComponent
  )
}

export default buildProvidersTree
