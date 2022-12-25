import type * as Lambda from "aws-lambda";

export abstract class BaseLambda {
  protected abstract handle(
    event: Lambda.APIGatewayProxyEventV2,
    context: Lambda.Context
  ): Promise<Lambda.APIGatewayProxyResultV2>;

  async execute(
    event: Lambda.APIGatewayProxyEventV2,
    context: Lambda.Context
  ): Promise<Lambda.APIGatewayProxyResultV2> {
    try {
      return await this.handle(event, context);
    } catch (err) {
      console.log(JSON.stringify({ event, context }));
      console.error(
        JSON.stringify({
          message: (err as any)?.message,
          err: JSON.stringify(err, Object.getOwnPropertyNames(err)),
        })
      );

      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: "internal error occurred. please check logs.",
        }),
      };
    }
  }
}

export const createLambdaHandler =
  (lambda: BaseLambda): Lambda.Handler =>
  async (event, context) =>
    lambda.execute(event, context);
