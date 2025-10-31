'use client'

import { JSONTree } from 'react-json-tree'

const JsonView = ({ data }: { data: unknown }) => {
  return (
    <div className='font-mono [&>ul]:max-h-96 [&>ul]:overflow-y-scroll [&>ul]:rounded [&>ul]:px-6! [&>ul]:py-3!'>
      <JSONTree data={data} />
    </div>
  )
}

export default JsonView
