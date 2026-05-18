import Session from "../models/Session.js";
import Problem from "../models/Problem.js";

// In-memory queue: Array of { socketId, userId, criteria: { difficulty, topic } }
const queue = [];

const matchingService = {
  handleFindMatch: async (io, socket, criteria) => {
    // 1. Check if user is already in queue and remove old entry to prevent duplicates
    matchingService.removeFromQueue(socket.id);

    const { difficulty, topic } = criteria;

    // 2. Find a compatible partner
    const partnerIndex = queue.findIndex(
      (entry) =>
        entry.criteria.difficulty === difficulty &&
        entry.criteria.topic === topic &&
        entry.userId !== socket.userId // ensure not matching self
    );

    if (partnerIndex !== -1) {
      // 3. Match found!
      const partner = queue[partnerIndex];
      // Remove partner from queue
      queue.splice(partnerIndex, 1);

      try {
        // Find matching problem
        let problem = await Problem.findOne({ 
          difficulty: difficulty.toLowerCase(), 
          topic: topic.toLowerCase() 
        });

        // Fallback: search case insensitive or select any problem if none matches
        if (!problem) {
          problem = await Problem.findOne({ difficulty: difficulty.toLowerCase() });
        }
        if (!problem) {
          problem = await Problem.findOne({});
        }
        if (!problem) {
          throw new Error("No algorithm problems exist in the database to bind to the session.");
        }

        // Create a new Session in MongoDB
        const session = new Session({
          users: [socket.userId, partner.userId],
          difficulty,
          topic,
          problem: problem._id,
          status: "active",
        });
        await session.save();

        console.log(`Match found! Session ${session._id} created with problem "${problem.title}" for ${socket.userId} and ${partner.userId}`);

        // Notify both users
        io.to(socket.id).emit("match_found", { sessionId: session._id, problemId: problem._id });
        io.to(partner.socketId).emit("match_found", { sessionId: session._id, problemId: problem._id });
      } catch (err) {
        console.error("Error creating match session:", err);
        // On error, let them try again later or emit error
        socket.emit("match_error", { message: "Failed to create match session" });
        io.to(partner.socketId).emit("match_error", { message: "Failed to create match session" });
      }
    } else {
      // 4. No match found immediately, add to queue
      console.log(`Adding ${socket.userId} to queue for ${difficulty} - ${topic}`);
      queue.push({
        socketId: socket.id,
        userId: socket.userId,
        criteria,
      });
    }
  },

  removeFromQueue: (socketId) => {
    const index = queue.findIndex((entry) => entry.socketId === socketId);
    if (index !== -1) {
      console.log(`Removing ${queue[index].userId} from matching queue`);
      queue.splice(index, 1);
    }
  },
};

export default matchingService;
