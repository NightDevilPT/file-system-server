// src/cone/queries/get-all-folders.query.ts
export class GetFoldersQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
