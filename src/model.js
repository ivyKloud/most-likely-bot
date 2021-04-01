const model = {
    table: null,
    setTable: (table) => {
        this.table = table
    },
    getNextIndex: async () => {
        await this.table.add('index', 1)
        return this.table.get('index')
    },

    setUserById: (index, user) => this.table.set(`user_${index}`, user),
    getUserById: (index) => this.table.get(`user_${index}`),

    setIdByName: (index, name) => this.table.set(`userId_${name}`, index),
    getIdByName: (name) => this.table.get(`userId_${name}`),

}

module.exports = model