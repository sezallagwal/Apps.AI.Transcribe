import { IMessageRaw } from "@rocket.chat/apps-engine/definition/messages";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages/IMessage";

export function isAudio(message: IMessage | IMessageRaw): boolean {
    if (message.attachments && message.attachments.length > 0) {
        const isAudio = message.attachments.some((attachment) => {
            return attachment.audioUrl && attachment.audioUrl.length > 0;
        });

        return isAudio;
    }
    return false;
}
