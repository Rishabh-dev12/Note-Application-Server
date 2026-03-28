export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join-note", (noteId) => {
      socket.join(noteId);
    });

    socket.on("edit-note", ({ noteId, content }) => {
      socket.to(noteId).emit("receive-changes", content);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
