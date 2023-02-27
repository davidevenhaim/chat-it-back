import server from './server'
import io from './socket_server'


server.listen(process.env.PORT || 3000, async () => {
    io(server)
    console.log('Server started on port: ', process.env.PORT);
})

export = server

