import React from 'react'

const Wrapper: React.FC = ({ children }) => {
  return <div className="max-w-4xl mx-auto p-4 xl:max-w-7xl">{children}</div>
}

export default Wrapper
