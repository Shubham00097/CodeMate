import Session from "../models/Session.js";
import { QUESTIONS } from "../utils/seedProblems.js";

// In-memory queue: Array of { socketId, userId, criteria, timerId }
let queue = [];

const createMatch = async (io, entry1, entry2) => {
  try {
    const isExactMatch =
      entry1.criteria.difficulty === entry2.criteria.difficulty &&
      entry1.criteria.topic === entry2.criteria.topic;

    let matchedProblem = null;
    const allQuestions = Object.values(QUESTIONS);

    if (allQuestions.length === 0) {
      throw new Error("Missing problems: seedProblems.js contains no questions.");
    }

    if (isExactMatch) {
      // 1. Try exact match (case-insensitive)
      matchedProblem = allQuestions.find(
        (q) =>
          q.difficulty.toLowerCase() === entry1.criteria.difficulty.toLowerCase() &&
          q.topic.toLowerCase() === entry1.criteria.topic.toLowerCase()
      );
    }

    if (!matchedProblem) {
      // 2. Try matching difficulty only
      const diffQuestions = allQuestions.filter(
        (q) => q.difficulty.toLowerCase() === entry1.criteria.difficulty.toLowerCase()
      );
      if (diffQuestions.length > 0) {
        matchedProblem = diffQuestions[Math.floor(Math.random() * diffQuestions.length)];
      }
    }

    if (!matchedProblem) {
      // 3. Random problem fallback
      matchedProblem = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }

    // Create a new Session in MongoDB using the integer id of the static question
    const session = new Session({
      users: [entry1.userId, entry2.userId],
      difficulty: matchedProblem.difficulty || entry1.criteria.difficulty,
      topic: matchedProblem.topic || entry1.criteria.topic,
      problem: matchedProblem.id,
      status: "active",
    });

    await session.save();

    console.log(`Match found! Session ${session._id} created with problem "${matchedProblem.title}"`);

    // Notify both users
    io.to(entry1.socketId).emit("match_found", { sessionId: session._id, problemId: matchedProblem.id });
    io.to(entry2.socketId).emit("match_found", { sessionId: session._id, problemId: matchedProblem.id });
  } catch (err) {
    console.error("Error creating match session:", err);
    io.to(entry1.socketId).emit("match_error", { message: err.message || "Failed to create match session" });
    io.to(entry2.socketId).emit("match_error", { message: err.message || "Failed to create match session" });
  }
};

const matchingService = {
  handleFindMatch: async (io, socket, criteria) => {
    // 1. Check if user is already in queue (by socket OR user id) and remove old entry to prevent duplicates
    matchingService.removeFromQueue(socket.id, socket.userId);

    const { difficulty, topic } = criteria;

    // 2. Find a compatible partner
    const partnerIndex = queue.findIndex(
      (entry) =>
        entry.criteria.difficulty === difficulty &&
        entry.criteria.topic === topic &&
        entry.userId !== socket.userId
    );

    if (partnerIndex !== -1) {
      // 3. Match found immediately!
      const partner = queue[partnerIndex];
      if (partner.timerId) clearTimeout(partner.timerId);

      // Remove partner from queue
      queue.splice(partnerIndex, 1);

      const userEntry = { socketId: socket.id, userId: socket.userId, criteria };
      await createMatch(io, userEntry, partner);
    } else {
      // 4. No exact match found immediately, add to queue
      console.log(`Adding ${socket.userId} to queue for ${difficulty} - ${topic}`);

      const newEntry = {
        socketId: socket.id,
        userId: socket.userId,
        criteria,
        timerId: null,
      };

      // 5. Timeout for random match (25 seconds)
      newEntry.timerId = setTimeout(() => {
        // Check if this user is still in the queue
        const myIndex = queue.findIndex((e) => e.userId === socket.userId);
        if (myIndex === -1) return;

        // Find ANY other user in the queue
        const otherIndex = queue.findIndex((e) => e.userId !== socket.userId);
        if (otherIndex !== -1) {
          const me = queue[myIndex];
          const other = queue[otherIndex];

          console.log(`Timeout reached for ${me.userId}. Matching randomly with ${other.userId}`);

          if (other.timerId) clearTimeout(other.timerId);

          // Remove both from queue
          queue = queue.filter((e) => e.userId !== me.userId && e.userId !== other.userId);

          createMatch(io, me, other);
        }
        // If no one else is in queue, they just keep waiting
      }, 25000);

      queue.push(newEntry);
    }
  },

  removeFromQueue: (socketId, userId = null) => {
    queue = queue.filter((entry) => {
      const isMatch = entry.socketId === socketId || (userId && entry.userId === userId);
      if (isMatch) {
        if (entry.timerId) clearTimeout(entry.timerId);
        console.log(`Removing ${entry.userId} from matching queue`);
      }
      return !isMatch;
    });
  },
};

export default matchingService;
