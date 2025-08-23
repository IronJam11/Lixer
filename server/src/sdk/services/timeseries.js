module.exports = (client) => ({

    async getVolume(){
        const res = await client.get('/timseries/volume');
        return res.data;
    }
})