// // import asyncHandler from '../middlewares/asyncHandler.middleware.js';
// // import LiveClass from '../models/LiveClass.model.js';
// // import { Server } from "socket.io";

// // // 📌 Create a new live class
// // export const createLiveClass = asyncHandler(async (req, res) => {
// //     const { courseId, title, startTime } = req.body;
// //     const instructorId = req.user.id; // Get instructor from auth middleware

// //     console.log(req.body)

// //     const newLiveClass = await LiveClass.create({ courseId, instructorId, title, startTime });
// //     console.log(newLiveClass)

// //     res.status(201).json({ success: true, message: 'Live class created', data: newLiveClass });
// // });

// // // 📌 Get all live classes for a course
// // export const getLiveClassesByCourse = asyncHandler(async (req, res) => {
// //     const { courseId } = req.params;
// //     const liveClasses = await LiveClass.find({ courseId });

// //     res.status(200).json({ success: true, data: liveClasses });
// // });

// // // 📌 Join a live class
// // export const joinLiveClass = asyncHandler(async (req, res) => {
// //     const { classId } = req.params;
// //     const userId = req.user._id;

// //     const liveClass = await LiveClass.findById(classId);
// //     if (!liveClass) {
// //         res.status(404);
// //         throw new Error('Live class not found');
// //     }

// //     if (!liveClass.participants.includes(userId)) {
// //         liveClass.participants.push(userId);
// //         await liveClass.save();
// //     }

// //     res.status(200).json({ success: true, message: 'Joined live class', data: liveClass });
// // });

// // // 📌 End a live class
// // export const endLiveClass = asyncHandler(async (req, res) => {
// //     const { classId } = req.params;
// //     const liveClass = await LiveClass.findById(classId);

// //     if (!liveClass) {
// //         res.status(404);
// //         throw new Error('Live class not found');
// //     }

// //     liveClass.isActive = false;
// //     liveClass.endTime = new Date();
// //     await liveClass.save();

// //     res.status(200).json({ success: true, message: 'Live class ended', data: liveClass });
// // });





// // export const initializeLiveClass = (server) => {
// //     const io = new Server(server, {
// //         cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }
// //     });

// //     io.on("connection", (socket) => {
// //         console.log(`🔗 User Connected for Live Class: ${socket.id}`);

// //         socket.on("join-class", ({ classId, userId }) => {
// //             socket.join(classId);
// //             socket.broadcast.to(classId).emit("user-joined", userId);
// //         });

// //         socket.on("signal", (data) => {
// //             io.to(data.target).emit("signal", { userId: data.userId, signal: data.signal });
// //         });

// //         socket.on("disconnect", () => {
// //             console.log(`❌ User Disconnected: ${socket.id}`);
// //         });
// //     });
// // };




// // import { v4 as uuidv4 } from "uuid";

// // const activeClasses = new Map(); // Store classId and participants

// // // Create a new class
// // export const createClass = (req, res) => {
// //   const { username } = req.body;
// //   if (!username) return res.status(400).json({ error: "Username is required" });

// //   const classId = uuidv4();
// //   activeClasses.set(classId, { host: username, participants: [] });

// //   res.json({ classId, message: "Class created successfully" });
// // };

// // // Handle WebRTC signaling and socket events
// // export const handleSocketEvents = (io) => {
// //   io.on("connection", (socket) => {
// //     console.log("New user connected:", socket.id);

// //     socket.on("join-class", ({ classId, userId }) => {
// //       if (!activeClasses.has(classId)) {
// //         activeClasses.set(classId, { participants: [] });
// //       }
// //       activeClasses.get(classId).participants.push(userId);

// //       socket.join(classId);
// //       socket.to(classId).emit("user-joined", userId);

// //       console.log(`User ${userId} joined class ${classId}`);
// //     });

// //     socket.on("offer", ({ to, from, offer }) => {
// //       io.to(to).emit("offer", { from, offer });
// //     });

// //     socket.on("answer", ({ to, from, answer }) => {
// //       io.to(to).emit("answer", { from, answer });
// //     });

// //     socket.on("ice-candidate", ({ to, from, candidate }) => {
// //       io.to(to).emit("ice-candidate", { from, candidate });
// //     });

// //     socket.on("disconnect", () => {
// //       console.log("User disconnected:", socket.id);
// //       activeClasses.forEach((value, classId) => {
// //         activeClasses.set(classId, {
// //           ...value,
// //           participants: value.participants.filter((id) => id !== socket.id),
// //         });
// //       });
// //     });
// //   });
// // };



// import { v4 as uuidv4 } from "uuid";

// const activeClasses = new Map(); // Stores classId with host & participants

// // ✅ Create a new class (Teacher)
// export const createClass = (req, res) => {
//   const { username } = req.body;
//   if (!username) {
//     return res.status(400).json({ error: "Username is required" });
//   }

//   const classId = uuidv4();
//   activeClasses.set(classId, { host: username, participants: [] });

//   console.log(`📢 Class ${classId} created by ${username}`,classId);
//   res.json({ classId, message: "Class created successfully" });
// };

// // ✅ Handle WebRTC signaling & video stream
// export const handleSocketEvents = (io) => {
//   io.on("connection", (socket) => {
//     console.log(`🔹 User connected: ${socket.id}`);

//     // ✅ Teacher or Student joins a class
//     socket.on("join-class", ({ classId, userId, isTeacher }) => {
//       if (!classId || !userId) {
//         console.error("⚠️ join-class missing classId or userId");
//         return;
//       }

//       if (!activeClasses.has(classId)) {
//         activeClasses.set(classId, { participants: [] });
//       }

//       const classData = activeClasses.get(classId);

//       // Set teacher for class if not already assigned
//       if (isTeacher) {
//         classData.host = userId;
//       } else if (!classData.participants.includes(userId)) {
//         classData.participants.push(userId);
//       }

//       socket.join(classId);
//       io.to(classId).emit("user-joined", { userId, classId, isTeacher });

//       console.log(`✅ ${isTeacher ? "Teacher" : "Student"} ${userId} joined class ${classId}`);
//     });

//     // ✅ Send teacher's video stream to students
//     socket.on("send-stream", ({ classId, teacherId, stream }) => {
//       if (!classId || !teacherId || !stream) {
//         console.error("⚠️ send-stream missing classId, teacherId, or stream");
//         return;
//       }

//       console.log(`📡 Teacher ${teacherId} streaming in class ${classId}`);
//       socket.to(classId).emit("receive-stream", { teacherId, stream });
//     });

//     // ✅ WebRTC Offer
//     socket.on("offer", ({ to, from, offer }) => {
//       if (!to || !from || !offer) {
//         console.error("⚠️ Offer event missing data");
//         return;
//       }
//       io.to(to).emit("offer", { from, offer });
//       console.log(`📡 Offer sent from ${from} to ${to}`);
//     });

//     // ✅ WebRTC Answer
//     socket.on("answer", ({ to, from, answer }) => {
//       if (!to || !from || !answer) {
//         console.error("⚠️ Answer event missing data");
//         return;
//       }
//       io.to(to).emit("answer", { from, answer });
//       console.log(`✅ Answer sent from ${from} to ${to}`);
//     });

//     // ✅ ICE Candidate Exchange
//     socket.on("ice-candidate", ({ to, from, candidate }) => {
//       if (!to || !from || !candidate) {
//         console.error("⚠️ ICE Candidate event missing data");
//         return;
//       }
//       io.to(to).emit("ice-candidate", { from, candidate });
//       console.log(`🌐 ICE Candidate sent from ${from} to ${to}`);
//     });

//     // ✅ User Disconnects
//     socket.on("disconnect", () => {
//       console.log(`🔻 User disconnected: ${socket.id}`);

//       activeClasses.forEach((value, classId) => {
//         const updatedParticipants = value.participants.filter((id) => id !== socket.id);
//         activeClasses.set(classId, { ...value, participants: updatedParticipants });

//         if (updatedParticipants.length === 0) {
//           activeClasses.delete(classId);
//           console.log(`🚫 Class ${classId} removed (No Participants)`);
//         }
//       });
//     });
//   });
// };




import { Server } from "socket.io"


let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("SOMETHING CONNECTED")

        socket.on("join-call", (path) => {

            if (connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // connections[path].forEach(elem => {
            //     io.to(elem)
            // })

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })

        socket.on("disconnect", () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key

            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index, 1)


                        if (connections[key].length === 0) {
                            delete connections[key]
                        }
                    }
                }

            }


        })


    })


    return io;
}


