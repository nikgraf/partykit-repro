import type * as Party from "partykit/server";

const sessionId = "current-session-id";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    const session = await this.getSession(sessionId);
    console.log("SESSION onConnect", session);
    if (session.length > 0) {
      conn.send(JSON.stringify({ type: "session", session, sessionId }));
    }

    // let's send a message to the connection
    // conn.send("hello from server");
  }

  async getSession(sessionId: string) {
    return (
      (await this.room.storage.get<string[]>(`session:${sessionId}`)) ?? []
    );
  }

  async onMessage(message: string, sender: Party.Connection) {
    // console.log(`connection ${sender.id} sent message: ${message}`);

    // TODO verify it's a valid message

    // broadcast the message to all the other connections except the sender
    this.room.broadcast(message, [sender.id]);

    // store the final-text messages
    const { sessionId, type } = JSON.parse(message);
    if (type === "reset-session") {
      console.log("reset session");
      await this.room.storage.delete(`session:${sessionId}`);
      const session = await this.getSession(sessionId);
      console.log("SESSION reset", session);
    } else if (type === "final-text") {
      const session = await this.getSession(sessionId);
      session.push(message);
      this.room.storage.put(`session:${sessionId}`, session);
    }
  }

  async onRequest(req: Party.Request) {
    return new Response(JSON.stringify({ test: "hello" }));
  }
}

Server satisfies Party.Worker;
