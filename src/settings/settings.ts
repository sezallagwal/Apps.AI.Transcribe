import { IRead } from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISetting,
    SettingType,
} from "@rocket.chat/apps-engine/definition/settings";

export enum Settings {
    MODEL_TYPE = "model_type",
    API_KEY = "api_key",
    API_ENDPOINT = "api_endpoint",
    AUTO_TRANSCRIPTION = "auto_transcription",
}

export const settings: ISetting[] = [
    // {
    //     id: Settings.MODEL_TYPE,
    //     type: SettingType.SELECT,
    //     i18nLabel: "Model selection",
    //     i18nDescription: "AI model to use for transcription.",
    //     values: [{ key: "openai/whisper-medium", i18nLabel: "Whisper Medium" }],
    //     required: true,
    //     public: true,
    //     packageValue: "openai/whisper-medium",
    // },
    // {
    // 	id: Settings.API_KEY,
    // 	type: SettingType.PASSWORD,
    //     i18nLabel: 'API Key',
    //     i18nDescription: "API Key to access the LLM Model",
    // 	i18nPlaceholder: '',
    // 	required: true,
    // 	public: false,
    //     packageValue: '',
    // },
    // {
    //     id: Settings.API_ENDPOINT,
    //     type: SettingType.STRING,
    //     i18nLabel: "API Endpoint",
    //     i18nDescription: "API endpoint to use for transcription.",
    //     required: true,
    //     public: true,
    //     packageValue: "",
    // },
    {
        id: Settings.AUTO_TRANSCRIPTION,
        public: true,
        type: SettingType.BOOLEAN,
        value: false,
        packageValue: "",
        hidden: false,
        i18nLabel: "Allow Auto Transcription",
        i18nDescription: "Allow auto transcription of audio files.",
        required: false,
    },
];

// export async function getAPIConfig(read: IRead) {
//     const envReader = read.getEnvironmentReader().getSettings();
//     return {
//         modelType: await envReader.getValueById("model_type"),
//         apiEndpoint: await envReader.getValueById("api_endpoint"),
//     };
// }
