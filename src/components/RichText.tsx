import {
  DefaultNodeTypes,
  type DefaultTypedEditorState,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

type NodeTypes = DefaultNodeTypes

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // Add your custom block converters here
  upload: ({ node }) => {
    const uploadDetails =
      typeof node.value === 'object' && 'mimeType' in node.value
        ? {
            type: node.value?.mimeType,
            url: node.value.url,
            alt: node.value.alt,
          }
        : ''

    if (typeof uploadDetails !== 'object') {
      return null
    }

    const { url, type, alt } = uploadDetails

    if (type?.includes('video') && url) {
      return (
        <video
          className='aspect-video h-full w-full rounded'
          src={url}
          title={alt ?? ''}
          controls
        />
      )
    }

    if (url) {
      return (
        <Image
          placeholder='blur'
          src={url}
          className='aspect-video object-cover'
          height={1200}
          width={1200}
          alt={alt ?? ''}></Image>
      )
    }

    return null
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
        },
        enableProse &&
          'prose prose-invert prose-table:text-lg prose-gray md:prose-lg lg:prose-xl prose-img:rounded-xl prose-img:shadow-md prose-a:text-primary hover:prose-a:underline prose-headings:scroll-mt-24 prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-primary prose-pre:bg-muted prose-pre:text-sm prose-li:marker:text-muted-foreground prose-th:bg-muted/50 prose-th:text-left prose-hr:border-border max-w-none',
        className,
      )}
      {...rest}
    />
  )
}
