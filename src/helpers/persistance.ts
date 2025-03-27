import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

export const storeData = async (
    persistence: IPersistence,
    associationId: string,
    data: object
): Promise<void> => {
    const association = new RocketChatAssociationRecord(
        RocketChatAssociationModel.USER,
        associationId
    );
    try {
        await persistence.updateByAssociation(association, data, true);
    } catch (error) {
        console.error(`Error storing data for ${associationId}:`, error);
    }
};

export const getData = async (
    persistenceRead: IPersistenceRead,
    associationId: string
): Promise<any> => {
    const association = new RocketChatAssociationRecord(
        RocketChatAssociationModel.USER,
        associationId
    );

    try {
        const data = (await persistenceRead.readByAssociation(
            association
        )) as Array<object>;
        return data.length ? data[0] : null;
    } catch (error) {
        console.error(`Error retrieving data for ${associationId}:`, error);
        return null;
    }
};

export const clearData = async (
    persistence: IPersistence,
    associationId: string
): Promise<void> => {
    const association = new RocketChatAssociationRecord(
        RocketChatAssociationModel.USER,
        associationId
    );
    try {
        await persistence.removeByAssociation(association);
    } catch (error) {
        console.error(`Error clearing data for ${associationId}:`, error);
    }
};
