const events_1 = require("events");
const WebSocket = require("ws");
const OPCode = require("../util/OPCodes");
const SafePromise = require("../API/SafePromise");
const SafeJsonParse = require("../API/SafeJsonParse");
const HttpsRequest = require("../API/HttpRequest");
const STANDARD_TIMEOUT = 1000, REQUEST_RETRY_COUNT = 5, API_VERSION = 6, API_PATH = `https://discord.com/api/v${API_VERSION}`;
class Client extends events_1.EventEmitter {
    constructor() {
        super();
        this.#lastSequence = 0;
        this.#lastHeartbeatAck = false;
        this.#WsConnect = async (resume) => {
            this.#WsDisconnect();
            if (!resume) {
                this.#sessionId = undefined;
                this.#lastSequence = 0;
            }
            const response = await SafePromise(this.Request('GET', '/gateway/bot'));
            if (!response)
                return this.emit('fatal', 'Unable to retrieve a gateway.');
            if (typeof response.url != 'string')
                return this.emit('fatal', 'Unexpected gateway API response.');
            this.#ws = new WebSocket(`${response.url}?v=${API_VERSION}`);
            this.#ws.on('message', this.#OnMessage);
            this.#ws.on('close', this.#OnClose);
            this.#ws.on('error', this.#OnError);
        };
        this.#WsDisconnect = (code = 1012) => {
            if (!this.#ws)
                return;
            this.emit('disconnect', code);
            this.#ws.removeAllListeners();
            this.#ws.close(code);
            this.#ws = undefined;
        };
        this.#OnMessage = (data) => {
            if (typeof data != 'string')
                data = data.toString();
            const packet = SafeJsonParse(data);
            if (!packet)
                return;
            if (packet.s && (packet.s > this.#lastSequence))
                this.#lastSequence = packet.s;
            const op = packet.op;
            if (op == OPCode.DISPATCH) {
                const t = packet.t;
                if ((t == 'READY') || (t == 'RESUMED')) {
                    if (packet.d.session_id)
                        this.#sessionId = packet.d.session_id;
                    this.#lastHeartbeatAck = true;
                    this.#SendHeartbeat();
                    this.emit('connect');
                }
                this.emit('packet', packet);
            }
            else if (op == OPCode.HELLO) {
                this.#Identify();
                this.#lastHeartbeatAck = true;
                this.#SetHeartbeatTimer(packet.d.heartbeat_interval);
            }
            else if (op == OPCode.HEARTBEAT_ACK) {
                this.#lastHeartbeatAck = true;
            }
            else if (op == OPCode.HEARTBEAT) {
                this.#SendHeartbeat();
            }
            else if (op == OPCode.INVALID_SESSION) {
                this.emit('warn', `Invalid session. Resumable: ${packet.d}`);
                this.#WsConnect(packet.d);
            }
            else if (op == OPCode.RECONNECT) {
                this.emit('warn', 'Server forced reconnect.');
                this.#WsConnect(true);
            }
        };
        this.#Identify = () => {
            this.#ws && this.#ws.send(JSON.stringify(this.#sessionId ?
                {
                    op: OPCode.RESUME,
                    d: {
                        token: this.#token,
                        session_id: this.#sessionId,
                        seq: this.#lastSequence,
                    },
                } :
                {
                    op: OPCode.IDENTIFY,
                    d: {
                        token: this.#token,
                        properties: { $os: 'linux', $browser: 'bot', $device: 'bot' },
                        intents: this.#intents,
                    },
                }));
        };
        this.#SendHeartbeat = () => {
            if (this.#lastHeartbeatAck) {
                if (this.#ws && (this.#ws.readyState == 1)) {
                    this.#lastHeartbeatAck = false;
                    this.#ws.send(JSON.stringify({ op: OPCode.HEARTBEAT, d: this.#lastSequence }));
                }
            }
            else {
                this.emit('warn', 'Heartbeat timeout.');
                this.#WsConnect(true);
            }
        };
        this.#SetHeartbeatTimer = (interval) => {
            if (this.#heartbeatTimer) {
                clearInterval(this.#heartbeatTimer);
                this.#heartbeatTimer = undefined;
            }
            if (interval)
                this.#heartbeatTimer = setInterval(this.#SendHeartbeat, interval);
        };
        this.#OnClose = (code) => {
            this.#WsDisconnect(code);
            this.#WsConnect(true);
        };
        this.#OnError = (error) => this.emit('error', error);
    }
    #token;
    #auth;
    #sessionId;
    #lastSequence;
    #lastHeartbeatAck;
    #heartbeatTimer;
    #ws;
    #intents;
    #WsConnect;
    #WsDisconnect;
    #OnMessage;
    #Identify;
    #SendHeartbeat;
    #SetHeartbeatTimer;
    #OnClose;
    #OnError;
    Auth(token) {
        if (!token)
            throw 'Token required.';
        if (typeof token != 'string')
            throw 'Token must be a string.';
        this.#token = token;
        this.#auth = `Bot ${token}`;
    }
    Connect(intents) {
        if ((intents != null) && !Number.isInteger(intents))
            throw 'Intents must be an integer.';
        this.#intents = intents;
        if (this.#token)
            this.#WsConnect();
        else
            throw 'Authorization required.';
    }
    Disconnect(code) {
        this.#WsDisconnect(code);
    }
    Request(method, route, data, auth) {
        if (method == null)
            throw 'Method required.';
        if (typeof method != 'string')
            throw 'Method must be a string.';
        if (route == null)
            throw 'Route required.';
        if (typeof route != 'string')
            throw 'Route must be a string.';
        const url = API_PATH + route;
        if ((auth != null) && (typeof auth != 'string'))
            throw 'Auth must be a string.';
        let content, contentType = 'application/x-www-form-urlencoded', contentLength = 0;
        if (data) {
            if (typeof data == 'object') {
                content = JSON.stringify(data);
                contentType = 'application/json';
            }
            else if (typeof data == 'string') {
                content = data;
            }
            else {
                throw 'Data must be an object or a string.';
            }
            contentLength = Buffer.byteLength(content);
        }
        const options = {
            method: method,
            headers: {
                'Authorization': auth || this.#auth || '',
                'Content-Type': contentType,
                'Content-Length': contentLength,
            },
        };
        return new Promise((resolve, reject) => {
            let retryCount = 0;
            const RequestResult = (result) => {
                const code = result.code;
                if ((code >= 200) && (code < 300)) {
                    resolve(SafeJsonParse(result.data));
                }
                else if ((code >= 400) && (code < 500)) {
                    const response = SafeJsonParse(result.data);
                    if (code == 429) {
                        retryCount++;
                        this.emit('warn', `${response.message} Global: ${response.global}`);
                        this.emit('warn', `Try ${retryCount}/${REQUEST_RETRY_COUNT} was failed.`);
                        if (retryCount < REQUEST_RETRY_COUNT)
                            setTimeout(TryRequest, response.retry_after || STANDARD_TIMEOUT);
                        else
                            RequestError({ code: 429, message: 'Unable to complete operation because of rate limit.' });
                    }
                    else {
                        RequestError({ code, message: response ? (response.message || response.error || '') : '' });
                    }
                }
                else {
                    RequestError({ code, message: `Unknown request error.` });
                }
            };
            const RequestError = (error) => reject(error);
            const TryRequest = () => HttpsRequest(url, options, content).then(RequestResult).catch(RequestError);
            TryRequest();
        });
    }
    WsSend(packet) {
        if (this.#ws)
            this.#ws.send((packet && (typeof packet == 'object')) ? JSON.stringify(packet) : packet);
        else
            throw 'Unable to send packet: no connection.';
    }
}

module.exports = Client;
module.exports.Host = 'https://discord.com', module.exports.API = 'https://discord.com/api', module.exports.CDN = 'https://cdn.discordapp.com';