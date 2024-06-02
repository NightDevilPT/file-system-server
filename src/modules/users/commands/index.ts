import { CreateUserHandler } from "./handler/create-user.handler";
import { ForgetPasswordHandler } from "./handler/forget-password-user.handler";
import { LoginUserHandler } from "./handler/login-user.handler";
import { UpdatePasswordHandler } from "./handler/update-password-user.handler";
import { VerifyUserHandler } from "./handler/veirfy-user.handler";

export const UserCommands = [
	CreateUserHandler,
	VerifyUserHandler,
	LoginUserHandler,
	ForgetPasswordHandler,
	UpdatePasswordHandler
];