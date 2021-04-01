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

    setIdByName: (index, name) => this.table.set(`userId_${name}`, index),
    getIdByName: (name) => this.table.get(`userId_${name}`),
}

module.exports = model
