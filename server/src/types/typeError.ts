export type tMongoDuplicateError = {
  code: 11000;
  index: number;
  statusCode: number;
  status: string;
  keyValue: Record<string, unknown>;
};
