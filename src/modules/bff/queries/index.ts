import { GetResourceByTokenHandler } from "./handler/get-resouce-by-token.handler";
import { GetResourcesHandler } from "./handler/get-resources.handler";

export const BffQueries = [
	GetResourcesHandler,
	GetResourceByTokenHandler
]