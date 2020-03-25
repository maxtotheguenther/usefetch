export default async <T extends {}>(promise: Promise<T>): Promise<T | Error> =>
  await promise.then(data => data).catch((err: Error) => err);
