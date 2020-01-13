const mongoose = require('mongoose')
const config = require('config')

//ЭТО НЕОБХОДИМО ЧТО БЫ МОЖНО БЫЛО ИСПОЛЬЗОВАТЬ MONGOOSE С KOA
//ЛИБО МОЖНО ТАК: mongoose.Promise = Promise; 
//НО ПРОИЗВОДИТЕЛЬНОСТЬ У ТАКОГО ВАРИАНТА НИЖЕ, ЧЕМ У ПАКЕТА 'bluebird'
mongoose.Promise = require('bluebird')  

// ВЫВОДИТЬ В КОНСОЛЬ ВСЕ ЗАПРОСЫ К БД В РЕЖИМЕ ОТЛАДКИ
if(process.env.MONGOOSE_DEBUG) {
    mongoose.set('debug', true)
}

mongoose.connect(
    config.get('mongoUri'),  
    { 
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    },
    () => console.log(`DB connected`)
);

const db = mongoose.connection

db.on('error', () => {        
    console.error(error)
    process.exit(1)
})

module.exports = mongoose