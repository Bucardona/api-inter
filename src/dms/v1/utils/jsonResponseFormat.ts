import querystring from 'querystring'

interface MetadataParamsFormat {
  total: number
  totalPage: number | null
  pageSize: number
  page: number
  url: string
}
interface MetadataResponseFormat extends MetadataParamsFormat {
  lastPage: number
  links: {
    first: string
    previous: string | null
    next: string | null
    last: string
  }
}
interface JsonResponseFormat {
  success: boolean
  status: {
    statusCode: number
    message: string
  }
  metadata?: MetadataResponseFormat
  data?: any[]
}

const getMetadataUrl = (url: string, page: number, pageSize: number): string => {
  const baseUrl = url.slice(0, url.indexOf('?'))
  let queries = querystring.decode(url.slice(url.indexOf('?') + 1))

  queries = { ...queries, page: page.toString(), pageSize: pageSize.toString() }

  console.log(baseUrl + '?' + querystring.encode(queries))
  return baseUrl + '?' + querystring.encode(queries).replace('%5B', '[').replace('%5D', ']')
}
const getMetadataLinks = (url: string, page: number, pageSize: number, total: number): MetadataResponseFormat['links'] => {
  return {
    first: getMetadataUrl(url, 1, pageSize),
    previous: page > 1 ? getMetadataUrl(url, page - 1, pageSize) : null,
    next: page < Math.ceil(total / pageSize) ? getMetadataUrl(url, page + 1, pageSize) : null,
    last: getMetadataUrl(url, Math.ceil(total / pageSize), pageSize)
  }
}

export const jsonResponseFormat = (
  statusCode: number = 404,
  message: string = '',
  data: any[] | undefined = undefined,
  metadata: MetadataParamsFormat | undefined = undefined
): JsonResponseFormat => {
  return {
    success: statusCode === 200,
    status: {
      statusCode,
      message
    },
    metadata: metadata && {
      ...metadata,
      lastPage: Math.ceil(metadata.total / metadata.pageSize),
      url: getMetadataUrl(metadata.url, metadata.page, metadata.pageSize),
      links: getMetadataLinks(metadata.url, metadata.page, metadata.pageSize, metadata.total)
    },
    data
  }
}
