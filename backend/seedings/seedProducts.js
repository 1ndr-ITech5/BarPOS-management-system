require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const Menu = require("../models/menuModel.js")
const Workspace = require("../models/workspaceModel.js")
const connectDB = require('../config/db.js')

const insertProducts = async() => {
    try{
        await connectDB();
        await Menu.deleteMany()

        const mainWorkspace = await Workspace.findOne({ type: "main" })
        const demoWorkspace = await Workspace.findOne({ type: "demo" })

        const menu = [
        {
        productName: "Classic Tomato Bruschetta",
        category: "Appetizers",
        price: 350,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Baked Kackavall Cheese",
        category: "Appetizers",
        price: 450,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Crispy Potato Croquettes",
        category: "Appetizers",
        price: 400,
        offeredBy: mainWorkspace._id
        },

        {
        productName: "Traditional Village Salad",
        category: "Salads",
        price: 400,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Mediterranean Arugula Salad",
        category: "Salads",
        price: 550,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Caprese Salad with Mozzarella",
        category: "Salads",
        price: 600,
        offeredBy: mainWorkspace._id
        },

        {
        productName: "Herb-Crusted Chicken Fillet",
        category: "Main",
        price: 850,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Slow-Cooked Beef Ribs",
        category: "Main",
        price: 1600,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Pan-Seared Salmon Fillet",
        category: "Main",
        price: 1400,
        offeredBy: mainWorkspace._id
        },

        {
        productName: "Homemade Trilece",
        category: "Desserts",
        price: 300,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Chocolate Souffle with Ice Cream",
        category: "Desserts",
        price: 450,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Classic Tiramisu",
        category: "Desserts",
        price: 400,
        offeredBy: mainWorkspace._id
        },

        {
        productName: "Coca-Cola 0.33l",
        category: "Drinks",
        price: 180,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Local Craft Beer 0.33l",
        category: "Drinks",
        price: 300,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "Still Water 0.5l",
        category: "Drinks",
        price: 100,
        offeredBy: mainWorkspace._id
        },
        {
        productName: "House Red Wine (Glass)",
        category: "Drinks",
        price: 350,
        offeredBy: mainWorkspace._id
        },

        {
        productName: "Classic Cheeseburger",
        category: "Burgers",
        price: 450,
        offeredBy: demoWorkspace._id
        },
        {
        productName: "BBQ Bacon Burger",
        category: "Burgers",
        price: 580,
        offeredBy: demoWorkspace._id
        },

        {
        productName: "Pizza Margherita",
        category: "Pizzas",
        price: 500,
        offeredBy: demoWorkspace._id
        },
        {
        productName: "Pizza Diabola (Spicy)",
        category: "Pizzas",
        price: 650,
        offeredBy: demoWorkspace._id
        },
        {
        productName: "Four Cheese Pizza",
        category: "Pizzas",
        price: 700,
        offeredBy: demoWorkspace._id
        },

        {
        productName: "Creamy Mushroom Soup",
        category: "Soups",
        price: 300,
        offeredBy: demoWorkspace._id
        }
        ]

        await Menu.insertMany(menu)
        process.exit(0)
    }catch(error){
        console.log(`Error occured during the connection with DB: ${error}`)
        process.exit(1)
    }
}

insertProducts();