import http from "http";

import { configuration } from "./app/config.js";
import { app } from "./app/index.js";
import { connect } from "./app/database.js";
import {
  lessonExpiredStatusThread,
  lessonFinishedStatusThread,
  lessonOngoingStatusThread,
} from "./app/statusThread.js";

const { port } = configuration.server;

// Connect to database
connect();
// Create web server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at ${port} port`);
});

setInterval(lessonExpiredStatusThread, 60 * 2 * 1000); // Every 30 seconds
setInterval(lessonFinishedStatusThread, 60 * 2 * 1000); // Should be every e minutes
setInterval(lessonOngoingStatusThread, 60 * 2 * 1000);
