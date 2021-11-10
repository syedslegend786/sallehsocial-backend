

let users = []
export const socketServer = (socket) => {
    //userjoin
    socket.on("userjoin", (id) => {
        users.push({
            id,
            socketId: socket.id
        })
    })
    socket.on("disconnect", () => {
        users = users.filter(u => u.socketId !== socket.id)
    })
    //userjoin
    //likes...
    socket.on("likepost", (post) => {
        const uids = [...post.user.followers, post.user._id]
        const clientsToSend = users.filter(u => uids.includes(u.id))
        if (clientsToSend.length > 0) {
            clientsToSend.forEach(val => {
                socket.to(`${val.socketId}`).emit("updatedPost", post)
            })
        }
    })
    //unlikepost
    socket.on("unlikepost", (post) => {
        const uids = [...post.user.followers, post.user._id]
        const clientsToSend = users.filter(u => uids.includes(u.id))
        if (clientsToSend.length > 0) {
            clientsToSend.forEach(val => {
                socket.to(`${val.socketId}`).emit("unlikepostToClient", post)
            })
        }
    })
    //comments on post...
    socket.on("commentCreate", (post) => {
        const ids = [...post.user.followers, post.user._id]
        const clients = users.filter(u => ids.includes(u.id))
        if (clients.length > 0) {
            clients.forEach(val => {
                socket.to(`${val.socketId}`).emit("commentCreateToClient", post)
            })
        }
    })
    socket.on("deleteComment", (post) => {
        const ids = [...post.user.followers, post.user._id]
        const clients = users.filter(u => ids.includes(u.id))
        if (clients.length > 0) {
            clients.forEach(val => {
                socket.to(`${val.socketId}`).emit("deleteCommentToClient", post)
            })
        }
    })
    socket.on("updatePost", (post) => {
        const ids = [...post.user.followers, post.user._id]
        const clients = users.filter(u => ids.includes(u.id))
        if (clients.length > 0) {
            clients.forEach(val => {
                socket.to(`${val.socketId}`).emit("updatePostToClient", post)
            })
        }
    })
    //follow unfollow user...
    socket.on("followUser", (user) => {
        const client = users.filter(u => u.id === user.user._id)
        if (client.length > 0) {
            client.forEach(val => {
                socket.to(`${val.socketId}`).emit('followUserToClient', user.followedBy)
            })
        }
    })
    socket.on("unfollowUser", (user) => {
        const client = users.filter(u => u.id === user.user._id)
        if (client.length > 0) {
            client.forEach(val => {
                socket.to(`${val.socketId}`).emit('unfollowUserToUser', user.unfollowedBy)
            })
        }
    })
    //notify...
    socket.on("createNotify", (notify) => {
        console.log('notify===>', notify)
        const clients = users.filter(u => notify.recipents.includes(u.id))
        console.log(clients)
        if (clients.length > 0) {
            clients.forEach(val => {
                socket.to(`${val.socketId}`).emit("createNotifyToClient", notify);
            })
        }
    })
    socket.on("deleteNotify", (notify) => {
        console.log('notify==>', notify)
        const clients = users.filter(u => notify.recipents.includes(u.id))
        if (clients.length > 0) {
            console.log('client==>', clients)
            clients.forEach(val => {
                socket.to(`${val.socketId}`).emit("deleteNotifyToClient", notify);
            })
        }
    })
    //real time messages...
    socket.on("sendMessage", (message) => {
        const client = users.find(u => u.id === message.receiver)
        if (client) {
            socket.to(`${client.socketId}`).emit("sendMessageToClient", message)
        }
    })

}