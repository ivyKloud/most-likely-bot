const model = {
    table: null,
    setTable: (table) => {
        this.table = table
    },
    getNextIndex: async () => {
        await this.table.add('index', 1)
        return this.table.get('index')
    },

    setUser: (index, user) => this.table.set(`user_${index}`, user),
    getUser: (index) => this.table.get(`user_${index}`)

}

module.exports = model