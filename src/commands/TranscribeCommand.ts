import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { sendMessage } from "../helpers/message";
import { HELP_MESSAGE } from "../constants/dialogue";
import { clearData, getData, storeData } from "../helpers/persistance";
import { Settings } from "../settings/settings";
import { getPreferredLanguage } from "../helpers/getPreferredLanguage";
import { transcribeAudio } from "../helpers/transcribeAudio";
export class TranscribeCommand implements ISlashCommand {
    public command = "tr";
    public i18nParamsExample = "Transcribes a message.";
    public i18nDescription = "";
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const user = context.getSender();
        const room = context.getRoom();
        const command = context.getArguments();
        const threadId = context.getThreadId();

        if (command.length === 0) {
            const preferredLanguage = await getPreferredLanguage(user, read);

            const lastMessage = threadId
                ? (await read.getThreadReader().getThreadById(threadId))?.slice(
                      -1
                  )[0]
                : (await read.getRoomReader().getMessages(room.id))
                      .reverse()
                      .find((message) => !message.threadId);

            if (!lastMessage) {
                console.log("No valid audio message found.");
                return;
            }

            const transcription = await transcribeAudio(
                read,
                http,
                lastMessage,
                preferredLanguage
            );

            console.log("transcription", transcription);

            if (transcription) {
                await sendMessage(read, user, room, transcription, threadId);
            }
            return;
        }

        switch (command[0]) {
            case "help":
                sendMessage(read, user, room, HELP_MESSAGE, threadId);
                break;
            case "auto":
                return this.handleAutoTranscription(
                    command[1],
                    user,
                    room,
                    read,
                    persistence
                );
            default:
                sendMessage(
                    read,
                    user,
                    room,
                    `Invalid command\n${HELP_MESSAGE}`,
                    threadId
                );
                break;
        }
    }

    private async handleAutoTranscription(
        subCommand: string,
        user: any,
        room: any,
        read: IRead,
        persistence: IPersistence
    ): Promise<void> {
        const isAutoTranscriptionAllowed = await read
            .getEnvironmentReader()
            .getSettings()
            .getValueById(Settings.AUTO_TRANSCRIPTION);

        if (!isAutoTranscriptionAllowed) {
            return sendMessage(
                read,
                user,
                room,
                "Auto transcription is not allowed."
            );
        }

        let allowedUserIds =
            (await getData(read.getPersistenceReader(), "ALLOWED_USERS")) || [];

        console.log("allowed user ids", allowedUserIds);

        if (subCommand === "off") {
            await this.turnAutoTranscriptionOff(
                user,
                room,
                read,
                persistence,
                allowedUserIds
            );
        } else if (subCommand === "on") {
            await this.turnAutoTranscriptionOn(
                user,
                room,
                read,
                persistence,
                allowedUserIds
            );
        } else {
            const userLanguage = await getData(
                read.getPersistenceReader(),
                `${user.id}#PREFERRED_LANGUAGE`
            );

            console.log("user language", userLanguage);

            if (userLanguage) {
                sendMessage(
                    read,
                    user,
                    room,
                    `Your preferred language is set to ${userLanguage.preferredLanguage}.`
                );
            } else {
                sendMessage(
                    read,
                    user,
                    room,
                    "Your preferred language is not set."
                );
            }
        }
    }

    private async turnAutoTranscriptionOff(
        user: any,
        room: any,
        read: IRead,
        persistence: IPersistence,
        allowedUserIds: string[]
    ): Promise<void> {
        const allowedUserSet = new Set(allowedUserIds);
        if (allowedUserSet.has(user.id)) {
            allowedUserSet.delete(user.id);
            allowedUserIds = Array.from(allowedUserSet);
            await storeData(persistence, "ALLOWED_USERS", allowedUserIds);
            await clearData(persistence, `${user.id}#PREFERRED_LANGUAGE`);
            return sendMessage(
                read,
                user,
                room,
                "✅ Auto transcription turned off."
            );
        } else {
            return sendMessage(
                read,
                user,
                room,
                "Auto transcription is already off."
            );
        }
    }

    private async turnAutoTranscriptionOn(
        user: any,
        room: any,
        read: IRead,
        persistence: IPersistence,
        allowedUserIds: string[]
    ): Promise<void> {
        const allowedUserSet = new Set(allowedUserIds);
        if (!allowedUserSet.has(user.id)) {
            allowedUserSet.add(user.id);
            allowedUserIds = Array.from(allowedUserSet);
            await storeData(persistence, "ALLOWED_USERS", allowedUserIds);
            const preferredLanguage = await getPreferredLanguage(user, read);
            await storeData(persistence, `${user.id}#PREFERRED_LANGUAGE`, {
                preferredLanguage,
            });
            return sendMessage(
                read,
                user,
                room,
                "✅ Auto transcription turned on."
            );
        } else {
            return sendMessage(
                read,
                user,
                room,
                "Auto transcription is already enabled."
            );
        }
    }
}
