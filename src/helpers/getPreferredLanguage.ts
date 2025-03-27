import { IRead } from "@rocket.chat/apps-engine/definition/accessors/IRead";

export async function getPreferredLanguage(
    user: any,
    read: IRead
): Promise<string> {
    return (
        user.settings?.preferences?.language ||
        (await read
            .getEnvironmentReader()
            .getServerSettings()
            .getValueById("Language")) ||
        "en"
    );
}
