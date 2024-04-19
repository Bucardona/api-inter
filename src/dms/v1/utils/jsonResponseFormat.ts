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
      links: {
        first: `${metadata.url}?pageSize=${metadata.pageSize}&page=1`,
        previous: metadata.page > 1 ? `${metadata.url}?pageSize=${metadata.pageSize}&page=${metadata.page - 1}` : null,
        next: metadata.page < Math.ceil(metadata.total / metadata.pageSize) ? `${metadata.url}?pageSize=${metadata.pageSize}&page=${metadata.page + 1}` : null,
        last: `${metadata.url}?pageSize=${metadata.pageSize}&page=${Math.ceil(metadata.total / metadata.pageSize)}`
      }
    },
    data
  }
}
