
import { CommonModule } from "./common/common.module";
import { FilesModule } from "./files/files.module";
import { FoldersModule } from "./folders/folders.module";
import { HistoryModule } from "./history/history.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { UsersModule } from "./users/users.module";

export const AllModules = [
	UsersModule,
	ProfilesModule,
	FoldersModule,
	FilesModule,
	CommonModule,
	HistoryModule
]