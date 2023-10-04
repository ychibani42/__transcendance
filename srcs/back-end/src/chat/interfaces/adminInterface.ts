import { FindUserOptions } from "src/user/interfaces/findUserInterface";

export interface admin {
	userId: number;
	channelId: string;
	user: FindUserOptions;
}
