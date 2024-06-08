// src/cone/queries/get-folder-by-id.query.ts
export class GetFolderByIdQuery {
  constructor(
    public readonly folderId: string,
    public readonly userId: string,
  ) {}
}
