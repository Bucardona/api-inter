interface JsonResponseFormat {
  success: boolean
  status: {
    statusCode: number
    message: string
  }
  data_length: number
  data?: any[]
}

export const jsonResponseFormat = (
  statusCode: number = 404,
  message: string = '',
  data: any[] | undefined = undefined,
): JsonResponseFormat => {
  return {
    success: statusCode === 200,
    status: {
      statusCode,
      message,
    },
    data_length: data ? data.length : 0,
    data,
  }
}
