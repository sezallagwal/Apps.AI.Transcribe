import { IHttp, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import {
    IMessage,
    IMessageRaw,
} from "@rocket.chat/apps-engine/definition/messages";
import { isAudio } from "./attachment";

export async function transcribeAudio(
    read: IRead,
    http: IHttp,
    message: IMessage | IMessageRaw,
    preferredLanguage: string
): Promise<string> {
    console.log("Transcribing audio...");
    try {
        if (!isAudio(message)) {
            console.log("Message is not an audio file.");
            return "Message is not an audio file.";
        }
        console.log("getting audio buffer");
        const audioBuffer = await read
            .getUploadReader()
            .getBufferById(message!.file?._id!);
        const audioBase64 = audioBuffer.toString("base64");

        const response = await http.post(`http://host.docker.internal:8000/`, {
            headers: {
                "Content-Type": "application/json",
            },
            content: JSON.stringify({
                audio_base64: audioBase64,
                preferred_language: preferredLanguage,
            }),
        });

        console.log("Response: ", response);

        if (!response || !response.data) {
            console.error("No response data received");
            return "No response data received.";
        }

        return response.data.text;
    } catch (error) {
        console.error("Error in transcribeAudio function:", error);
        throw new Error("Failed to transcribe audio.");
    }
}
