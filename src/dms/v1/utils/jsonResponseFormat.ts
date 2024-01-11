type jsonResponseFormat = {
  status: number;
  message: string;
  data?: {};
};

export const jsonResponseFormat = ({status, message, data}: jsonResponseFormat): {} => {

  return {
    success: status === 200 ? true : false,
    status: {
      statusCode: status,
      message,
    },
    data_length: data ? Object.keys(data).length : 0,
    data
  };
}