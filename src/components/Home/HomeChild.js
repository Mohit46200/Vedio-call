const Homechild = (old = {}) => {
    return {
        ...old,
        path:"/home",
        lazy: async () => ({
        Component: (await import("./Home")).default,
        })


    }
}

export default Homechild