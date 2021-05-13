import Websocket from 'ws';
import { TypedEmitter } from 'tiny-typed-emitter';
import { 
    PermissionFlagsBits, 
    AuditLogEvent, 
    ChannelType, 
    MessageType, 
    MessageActivityType, 
    MessageFlags as MessageFlag, 
    GuildDefaultMessageNotifications, 
    GuildExplicitContentFilter,
    GuildMFALevel, 
    GuildVerificationLevel, 
    GuildPremiumTier, 
    InviteTargetUserType, 
    ActivityType,
    GatewayDispatchPayload
} from 'discord-api-types/v6';

interface StringResolvable {
	toString(): string;
}

type Identifier = { id: string } | string;

interface ClientEvents {
    'fatal': (error: string) => void;
    'disconnect': (code: number) => void;
    'connect': () => void;
    'packet': (packet: GatewayDispatchPayload) => void;
    'warn': (error: string) => void;
    'error': (error: Error) => void;
}

export class Client extends TypedEmitter<ClientEvents> {
    #token?: string;
    #auth?: string;
    #sessionId?: string;
    #lastSequence: number;
    #lastHeartbeatAck: boolean;
    #heartbeatTimer?: number;
    #ws?: Websocket;
    #intents?: number;

    #WsConnect: (resume?: boolean) => Promise<boolean | void>;
    #WsDisconnect: (code?: number) => void;
    #OnMessage: (data: Websocket.Data) => void;
    #Identify: () => void;
    #SendHeartbeat: () => void;
    #SetHeartbeatTimer: (interval: number) => void;
    #OnClose: (code: number) => void;
    #OnError: (error: Error) => void;

    public Auth(token: string): void;
    public Connect(intents: number): void;
    public Disconnect(code?: number): void;
    public Request<T = Record<string, any>>(method: string, route: string, data?: any): Promise<T>;
    public WsSend(packet: any): void;
}

export const Routes: {
    User: (user: Identifier) => string;
    Server: (server: Identifier) => string;
    Channel: (channel: Identifier) => string;
    Invite: (invite: string) => string;
    Webhook: (webhook: Identifier, token: string) => string;
    Member: (server: Identifier, member: Identifier) => string;
    Role: (server: Identifier, member: Identifier, role: Identifier) => string;
    Emoji: (server: Identifier, emoji: Identifier) => string;
    Message: (channel: Identifier, message: Identifier) => string;
    Reaction: (channel: Identifier, message: Identifier, emoji: Identifier) => string;
    Pin: (channel: Identifier, message: Identifier) => string;
    Recipient: (channel: Identifier, user: Identifier) => string;
    Relationship: (fromUser: Identifier, toUser: Identifier) => string;
    Note: (user: Identifier, note: string) => string;
    Application: (application: Identifier) => string;
    Command: (command: Identifier) => string;
    ApplicationCommand: (application: Identifier, command: Identifier) => string;
    ApplicationServerCommand: (application: Identifier, server: Identifier, command: Identifier) => string;
    Interaction: (interaction: Identifier, token: string) => string;
}

type MessageStickerFormatStrings = 
    | 'PNG'
    | 'APNG'
    | 'LOTTIE'

export function Intents(Intents: any): void;

export const Permissions: typeof PermissionFlagsBits;
export const AuditLogEvents: typeof AuditLogEvent;
export const ChannelTypes: typeof ChannelType;
export const MessageTypes: typeof MessageType
export const MessageActivityTypes: typeof MessageActivityType;
export const MessageFlags: typeof MessageFlag;
export const MessageStickerFormatTypes: Record<MessageStickerFormatStrings, number>;
export const DefaultMessageNotificationLevelStrings:typeof GuildDefaultMessageNotifications
export const ExplicitContentFilterLevel:typeof GuildExplicitContentFilter;
export const MFA_Level: typeof GuildMFALevel;
export const VerificationKevel: typeof GuildVerificationLevel;
export const PremiumTier: typeof GuildPremiumTier;
export const TargetUserTypes: typeof InviteTargetUserType;
export const ActivityTypes: typeof ActivityType;

export const version: string;