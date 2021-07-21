const model = {
    table: null,
    setTable: (table) => {
        this.table = table
    },

    clearDb: () => {
        const all = this.table.all()

        all.forEach(({ ID }) => {
            this.table.delete(ID)
        })
    },
    getNextIndex: async () => {
        await this.table.add('index', 1)
        return this.table.get('index')
    },

    getCurrentIndex: () => this.table.get('index'),

    setUserById: (index, user) => this.table.set(`user_${index}`, user),
    getUserById: (index) => this.table.get(`user_${index}`),
    removeUserById: (index) => this.table.delete(`user_${index}`),

    setIdByName: (index, name) => this.table.set(`userId_${name}`, index),
    getIdByName: (name) => this.table.get(`userId_${name}`),
    removeIdByName: (name) => this.table.delete(`userId_${name}`),


    getAllUsers: () =>
        this.table
            .all()
            .filter(({ ID }) => ID.startsWith('user_'))
            .map(({ ID, data }) => ({
                id: ID.replace('user_', ''),
                name: JSON.parse(data).name,
                emoji: JSON.parse(data).emoji
            })),
}

module.exports = model
