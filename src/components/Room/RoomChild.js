const RoomChild = (old = {}) => {
    return {
        ...old,
        path:"/room/:room_id",
        lazy: async () => ({
        Component: (await import("./Room")).default,
        })


    }
}

export default RoomChild