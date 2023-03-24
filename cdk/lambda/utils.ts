export const lambdaResponse = (statusCode: number, body: string) => {
  return {
    statusCode,
    body,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
