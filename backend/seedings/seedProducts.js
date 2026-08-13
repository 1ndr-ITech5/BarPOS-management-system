require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const Menu = require("../models/menuModel.js")
const connectDB = require('../config/db.js')

const insertProducts = async() => {
    const menu = [
        {
            productName: "Pizza Margharitta",
            category: "Food",
            price: 500
        },
        {
            productName: "Calzone",
            category: "Food",
            price: 300
        },
        {
            productName: "Burger",
            category: "Food",
            price: 300
        },
        {
            productName: "Trilece",
            category: "Dessert",
            price: 180
        },
        {
            productName: "Baklava",
            category: "Dessert",
            price: 100
        },
        {
            productName: "Water Glina",
            category: "Drinks",
            price: 80
        },
        {
            productName: "Korca Beer",
            category: "Drinks",
            price: 120
        },
        {
            productName: "Alfa Beer",
            category: "Drinks",
            price: 150
        }
    ]

    try{
        // connect with database
        await connectDB();

        // insert the menu products
        await Menu.deleteMany()
        await Menu.insertMany(menu)

        process.exit(0)
    }catch(error){
        console.log(`Error occured during the connection with DB: ${error}`)
        process.exit(1)
    }
}

insertProducts();