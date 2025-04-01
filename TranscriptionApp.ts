import {
    IAppAccessors,
    IAppInstallationContext,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { TranscribeCommand } from "./src/commands/TranscribeCommand";
import {
    IMessage,
    IPostMessageSent,
} from "@rocket.chat/apps-engine/definition/messages";
import { sendHelperMessageOnInstall, sendMessage } from "./src/helpers/message";
import { Settings, settings } from "./src/settings/settings";
import { getData } from "./src/helpers/persistance";
import { isAudio } from "./src/helpers/isAudio";
import {
    UIKitActionButtonInteractionContext,
    IUIKitResponse,
} from "@rocket.chat/apps-engine/definition/uikit";
import { UIActionButtonContext } from "@rocket.chat/apps-engine/definition/ui";
import { transcribeAudio } from "./src/helpers/transcribeAudio";
import { getPreferredLanguage } from "./src/helpers/getPreferredLanguage";

export class TranscriptionApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        await Promise.all([
            settings.map((setting) =>
                configuration.settings.provideSetting(setting)
            ),
            configuration.slashCommands.provideSlashCommand(
                new TranscribeCommand()
            ),
            configuration.ui.registerButton({
                actionId: "transcribe",
                labelI18n: "transcribe",
                context: UIActionButtonContext.MESSAGE_ACTION,
            }),
        ]);
    }

    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        try {
            const { actionId, user, room, message } =
                context.getInteractionData();

            // console.log(
            //     "context get interaction date: ",
            //     context.getInteractionData()
            // );

            if (actionId === "transcribe" && message) {
                const preferredLanguage = await getPreferredLanguage(
                    user,
                    read
                );

                const transcription = await transcribeAudio(
                    read,
                    http,
                    message,
                    preferredLanguage
                );

                console.log("transcription", transcription);

                if (transcription) {
                    await sendMessage(
                        read,
                        user,
                        room,
                        transcription,
                        message.threadId
                    );
                }
            }
            return context.getInteractionResponder().successResponse();
        } catch (error) {
            return context.getInteractionResponder().errorResponse();
        }
    }

    public async checkPostMessageSent(
        message: IMessage,
        read: IRead
    ): Promise<boolean> {
        if (isAudio(message)) {
            const isAutoTranscriptionAllowed = await read
                .getEnvironmentReader()
                .getSettings()
                .getValueById(Settings.AUTO_TRANSCRIPTION);

            if (isAutoTranscriptionAllowed) {
                return true;
            }
        }

        return false;
    }

    public async executePostMessageSent(
        message: IMessage,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {
        const allowedUserIds = await getData(
            read.getPersistenceReader(),
            "ALLOWED_USERS"
        );

        console.log("allowed user ids", allowedUserIds);

        if (Array.isArray(allowedUserIds) && allowedUserIds.length > 0) {
            for (const allowedUserId of allowedUserIds) {
                const userLanguage = await getData(
                    read.getPersistenceReader(),
                    `${allowedUserId}#PREFERRED_LANGUAGE`
                );

                console.log(
                    `${allowedUserId} language`,
                    userLanguage.preferredLanguage
                );

                if (!userLanguage.preferredLanguage) {
                    console.log(
                        `${allowedUserId} does not have a preferred language set.`
                    );

                    await sendMessage(
                        read,
                        message.sender,
                        message.room,
                        `User ${allowedUserId} does not have a preferred language set.`,
                        message.threadId
                    );

                    continue;
                } else {
                    const transcription = await transcribeAudio(
                        read,
                        http,
                        message,
                        userLanguage.preferredLanguage
                    );

                    console.log("transcription", transcription);

                    const allowedUser = await read
                        .getUserReader()
                        .getById(String(allowedUserId));

                    if (!allowedUser && transcription) {
                        console.log(`User with ID ${allowedUserId} not found.`);
                        continue;
                    }

                    await sendMessage(
                        read,
                        allowedUser,
                        message.room,
                        transcription,
                        message.threadId
                    );
                }
            }
        }
    }

    public async onInstall(
        context: IAppInstallationContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {
        const { user } = context;
        await sendHelperMessageOnInstall(user, read, modify);
        return;
    }
}
