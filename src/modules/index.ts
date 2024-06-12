import { BffModule } from "./bff/bff.module";
import { FilesModule } from "./files/files.module";
import { FoldersModule } from "./folders/folders.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { UsersModule } from "./users/users.module";

export const AllModules = [
	UsersModule,
	ProfilesModule,
	FoldersModule,
	FilesModule,
	BffModule
]