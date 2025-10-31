import RichText from '@/components/RichText'

interface MessageField {
  message?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  id?: string | null
  blockName?: string | null
  blockType: 'message'
}
const Message: React.FC<MessageField> = ({ message }) => {
  return (
    <div className=' prose max-w-none! text-base-content/80 md:prose-xl prose-h1:text-primary-content prose-h2:text-primary-content prose-h3:text-primary-content prose-h4:text-primary-content prose-h5:text-primary-content prose-h6:text-primary-content text-justify  [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded'>
      <RichText
        data={
          message ?? {
            root: {
              type: 'root',
              children: [],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          }
        }
      />
    </div>
  )
}
export default Message
