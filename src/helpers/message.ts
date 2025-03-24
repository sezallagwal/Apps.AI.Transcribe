import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { BlockBuilder } from "@rocket.chat/apps-engine/definition/uikit";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { getOrCreateDirectRoom } from "./getOrCreateDirectRoom";
import { WELCOME_MESSAGE } from "../constants/dialogue";

export async function sendMessage(
    read: IRead,
    user: IUser,
    room: IRoom,
    message: string,
    threadId?: string | null,
    blocks?: BlockBuilder
): Promise<void> {
    const notifier = read.getNotifier();
    const messageBuilder = notifier.getMessageBuilder();
    messageBuilder.setText(message);
    messageBuilder.setRoom(room);

    if (threadId) {
        messageBuilder.setThreadId(threadId);
    }

    if (blocks) {
        messageBuilder.setBlocks(blocks);
    }

    return notifier.notifyUser(user, messageBuilder.getMessage());
}

export async function sendMessageToAll(
    read: IRead,
    room: IRoom,
    message: string,
    threadId?: string | null,
    blocks?: BlockBuilder
): Promise<void> {
    const notifier = read.getNotifier();
    const messageBuilder = notifier.getMessageBuilder();
    messageBuilder.setText(message);
    messageBuilder.setRoom(room);

    if (threadId) {
        messageBuilder.setThreadId(threadId);
    }

    if (blocks) {
        messageBuilder.setBlocks(blocks);
    }

    return notifier.notifyRoom(room, messageBuilder.getMessage());
}

export async function sendHelperMessageOnInstall(
    user: IUser,
    read: IRead,
    modify: IModify
) {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const members = [user.username, appUser.username];

    const room = await getOrCreateDirectRoom(read, modify, members);

    const textMessageBuilder = modify
        .getCreator()
        .startMessage()
        .setRoom(room)
        .setSender(appUser)
        .setGroupable(true)
        .setParseUrls(false)
        .setText(WELCOME_MESSAGE);

    await modify.getCreator().finish(textMessageBuilder);
}
