const mongoose = require('mongoose');

// Use your SAME connection string here!
const mongoURI = "mongodb+srv://konchadajeevan3_db_user:6x7n4TgymstqGkqn@foodweb.qsiiaal.mongodb.net/?appName=foodweb"; 

mongoose.connect(mongoURI).then(async () => {
    console.log("Connected to seed data...");
    
    // Define the schema again for this script
    const Food = mongoose.model('FoodItem', new mongoose.Schema({
        name: String, description: String, price: Number, 
        image: String, rating: Number, deliveryTime: String
    }));

    // Some sample data inspired by your screenshots
    const foodItems = [
    // 🍕 PIZZAS (10)
    { name: "Margherita Pizza", description: "Classic cheese and tomato base with fresh basil.", price: 299, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600", rating: 4.5, deliveryTime: "30" },
    { name: "Pepperoni Overload", description: "Double pepperoni with extra mozzarella cheese.", price: 499, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600", rating: 4.8, deliveryTime: "35" },
    { name: "BBQ Chicken Pizza", description: "Smoky BBQ sauce, grilled chicken, and red onions.", price: 549, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", rating: 4.7, deliveryTime: "35" },
    { name: "Veggie Supreme", description: "Loaded with bell peppers, olives, mushrooms, and onions.", price: 399, image: "https://images.unsplash.com/photo-1590947132387-15d176130b9e?w=600", rating: 4.4, deliveryTime: "30" },
    { name: "Hawaiian Paradise", description: "Sweet pineapple chunks and savory ham slices.", price: 450, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600", rating: 4.2, deliveryTime: "30" },
    { name: "Mushroom Truffle", description: "Earthy mushrooms with a drizzle of rich truffle oil.", price: 599, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600", rating: 4.9, deliveryTime: "40" },
    { name: "Four Cheese Blast", description: "Mozzarella, cheddar, parmesan, and gouda blend.", price: 520, image: "https://images.unsplash.com/photo-1573821663171-56cb840b2a3b?w=600", rating: 4.6, deliveryTime: "35" },
    { name: "Spicy Paneer Tikka Pizza", description: "Indian fusion with spicy paneer cubes and mint mayo.", price: 480, image: "https://images.unsplash.com/photo-1599813892797-400a4025d0bb?w=600", rating: 4.5, deliveryTime: "35" },
    { name: "Garlic Bread Crust Pizza", description: "Pizza baked on a buttery, garlicky thick crust.", price: 350, image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600", rating: 4.3, deliveryTime: "25" },
    { name: "Meat Lovers Volcano", description: "Sausage, bacon, pepperoni, and grilled chicken.", price: 650, image: "https://images.unsplash.com/photo-1604381536136-189f78fb5650?w=600", rating: 4.8, deliveryTime: "40" },

    // 🍔 BURGERS (10)
    { name: "Classic Cheeseburger", description: "Beef patty with cheddar, lettuce, and tomato.", price: 199, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600", rating: 4.5, deliveryTime: "20" },
    { name: "Double Bacon Smash", description: "Two smashed beef patties with crispy bacon.", price: 349, image: "https://images.unsplash.com/photo-1594212686850-8b06afbd126b?w=600", rating: 4.9, deliveryTime: "25" },
    { name: "Spicy Crispy Chicken", description: "Deep-fried chicken breast with spicy mayo.", price: 249, image: "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=600", rating: 4.7, deliveryTime: "20" },
    { name: "Veggie Bean Burger", description: "Healthy black bean patty with avocado smash.", price: 180, image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600", rating: 4.3, deliveryTime: "20" },
    { name: "Mushroom Swiss Burger", description: "Sautéed mushrooms and melted Swiss cheese.", price: 279, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600", rating: 4.6, deliveryTime: "25" },
    { name: "Crunchy Fish Fillet", description: "Golden fried fish with tangy tartar sauce.", price: 299, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600", rating: 4.4, deliveryTime: "25" },
    { name: "Texas BBQ Burger", description: "Topped with onion rings and smoky BBQ sauce.", price: 320, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600", rating: 4.8, deliveryTime: "30" },
    { name: "Tandoori Chicken Burger", description: "Indian style grilled chicken with mint chutney.", price: 220, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600", rating: 4.5, deliveryTime: "25" },
    { name: "Blue Cheese Volcano", description: "Gourmet burger stuffed with melting blue cheese.", price: 380, image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600", rating: 4.7, deliveryTime: "30" },
    { name: "Mega Tower Burger", description: "Three patties, egg, bacon, and double cheese.", price: 450, image: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=600", rating: 4.9, deliveryTime: "35" },

    // 🍣 SUSHIS (10)
    { name: "California Roll", description: "Crab, avocado, and cucumber rolled in seaweed.", price: 450, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600", rating: 4.6, deliveryTime: "35" },
    { name: "Spicy Tuna Roll", description: "Fresh tuna mixed with spicy mayo and scallions.", price: 520, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600", rating: 4.8, deliveryTime: "35" },
    { name: "Salmon Nigiri", description: "Fresh slices of raw salmon over pressed sushi rice.", price: 480, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600", rating: 4.7, deliveryTime: "30" },
    { name: "Dragon Roll", description: "Eel and cucumber topped with sliced avocado.", price: 650, image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600", rating: 4.9, deliveryTime: "40" },
    { name: "Tempura Shrimp Roll", description: "Crispy fried shrimp rolled with avocado.", price: 550, image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600", rating: 4.5, deliveryTime: "35" },
    { name: "Veggie Maki", description: "Fresh cucumber, carrot, and avocado roll.", price: 350, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600", rating: 4.2, deliveryTime: "25" },
    { name: "Rainbow Roll", description: "California roll topped with assorted raw fish.", price: 720, image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600", rating: 4.8, deliveryTime: "40" },
    { name: "Spider Roll", description: "Soft shell crab tempura with spicy mayo.", price: 680, image: "https://images.unsplash.com/photo-1558985250-27af40f39cbf?w=600", rating: 4.7, deliveryTime: "40" },
    { name: "Yellowtail Sashimi", description: "Premium slices of fresh, raw yellowtail fish.", price: 750, image: "https://images.unsplash.com/photo-1611143669814-219717544081?w=600", rating: 4.9, deliveryTime: "30" },
    { name: "Eel Avocado Roll", description: "Sweet BBQ eel with creamy avocado slices.", price: 590, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600", rating: 4.6, deliveryTime: "35" },

    // 🥞 DOSAS (10)
    { name: "Plain Dosa", description: "Crispy, golden, paper-thin rice crepe.", price: 90, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600", rating: 4.3, deliveryTime: "20" },
    { name: "Masala Dosa", description: "Stuffed with spiced potato and onion curry.", price: 120, image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=600", rating: 4.7, deliveryTime: "25" },
    { name: "Mysore Masala Dosa", description: "Spicy red garlic chutney spread inside with potato filling.", price: 150, image: "https://images.unsplash.com/photo-1627308595229-7830f5c92f75?w=600", rating: 4.8, deliveryTime: "25" },
    { name: "Cheese Burst Dosa", description: "Loaded with melting cheese and mild spices.", price: 180, image: "https://images.unsplash.com/photo-1630409351058-2936e7884ff3?w=600", rating: 4.5, deliveryTime: "25" },
    { name: "Paneer Dosa", description: "Filled with grated paneer and South Indian spices.", price: 170, image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600", rating: 4.6, deliveryTime: "25" },
    { name: "Onion Rava Dosa", description: "Crispy semolina crepe mixed with chopped onions.", price: 140, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600", rating: 4.4, deliveryTime: "30" },
    { name: "Paper Roast Dosa", description: "Extra-long, ultra-thin, and super crispy.", price: 160, image: "https://images.unsplash.com/photo-1633366961367-e95bb39a888c?w=600", rating: 4.7, deliveryTime: "20" },
    { name: "Ghee Roast Dosa", description: "Roasted in pure desi ghee for an authentic rich flavor.", price: 150, image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600", rating: 4.9, deliveryTime: "25" },
    { name: "Egg Dosa", description: "Street-style dosa layered with a spiced beaten egg.", price: 130, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600", rating: 4.5, deliveryTime: "25" },
    { name: "Spring Dosa", description: "Stuffed with stir-fried Chinese style vegetables.", price: 160, image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600", rating: 4.3, deliveryTime: "30" },

    // 🍟 SNACKS & APPETIZERS (10)
    { name: "Classic French Fries", description: "Crispy golden shoestring fries with salt.", price: 120, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600", rating: 4.5, deliveryTime: "15" },
    { name: "Loaded Cheese Nachos", description: "Tortilla chips with liquid cheese, jalapenos, and salsa.", price: 250, image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600", rating: 4.6, deliveryTime: "20" },
    { name: "Spicy Chicken Wings", description: "6 pieces of fiery buffalo wings with ranch dip.", price: 320, image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600", rating: 4.8, deliveryTime: "25" },
    { name: "Crispy Onion Rings", description: "Thick-cut, batter-fried onion rings.", price: 150, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600", rating: 4.3, deliveryTime: "20" },
    { name: "Mozzarella Cheese Sticks", description: "Fried cheese sticks with a gooey center.", price: 280, image: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=600", rating: 4.7, deliveryTime: "20" },
    { name: "Punjabi Veg Samosa (2 Pcs)", description: "Crispy pastry stuffed with spiced potatoes and peas.", price: 60, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600", rating: 4.5, deliveryTime: "15" },
    { name: "Cheesy Garlic Bread", description: "Freshly baked bread with garlic butter and mozzarella.", price: 180, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600", rating: 4.6, deliveryTime: "20" },
    { name: "Veg Spring Rolls", description: "Crispy fried rolls filled with shredded cabbage and carrots.", price: 190, image: "https://images.unsplash.com/photo-1544025162-8360bd69e4a3?w=600", rating: 4.4, deliveryTime: "25" },
    { name: "Chicken Nuggets (8 Pcs)", description: "Bite-sized crispy chicken with honey mustard.", price: 220, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600", rating: 4.5, deliveryTime: "20" },
    { name: "Jalapeno Cheese Poppers", description: "Spicy jalapenos stuffed with cream cheese and fried.", price: 260, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600", rating: 4.7, deliveryTime: "25" },

    // 🥤 DRINKS & BEVERAGES (10)
    { name: "Cold Coffee with Ice Cream", description: "Rich blended coffee topped with vanilla scoop.", price: 180, image: "https://images.unsplash.com/photo-1461023058943-07cb1ce89b65?w=600", rating: 4.8, deliveryTime: "15" },
    { name: "Classic Coca-Cola (Can)", description: "Chilled 330ml Coke can.", price: 60, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600", rating: 4.9, deliveryTime: "10" },
    { name: "Mango Lassi", description: "Traditional sweet yogurt drink blended with fresh mangoes.", price: 120, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600", rating: 4.7, deliveryTime: "15" },
    { name: "Iced Lemon Tea", description: "Refreshing black tea with ice and fresh lemon.", price: 110, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600", rating: 4.4, deliveryTime: "10" },
    { name: "Strawberry Milkshake", description: "Thick shake made with real strawberries and milk.", price: 160, image: "https://images.unsplash.com/photo-1572656306390-40a9fc3899f7?w=600", rating: 4.6, deliveryTime: "15" },
    { name: "Fresh Lime Soda", description: "Sweet and salty fizzy lemon drink.", price: 80, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600", rating: 4.5, deliveryTime: "10" },
    { name: "Virgin Mojito", description: "Mint, lime, and soda water mocktail.", price: 150, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600", rating: 4.6, deliveryTime: "15" },
    { name: "Fresh Orange Juice", description: "100% freshly squeezed orange juice. No added sugar.", price: 140, image: "https://images.unsplash.com/photo-1600271886742-f049cd451b02?w=600", rating: 4.8, deliveryTime: "15" },
    { name: "Watermelon Slush", description: "Icy blended fresh watermelon.", price: 130, image: "https://images.unsplash.com/photo-1589859546258-2936e7884ff3?w=600", rating: 4.7, deliveryTime: "10" },
    { name: "Mineral Water Bottle", description: "1 Liter packaged drinking water.", price: 40, image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600", rating: 4.9, deliveryTime: "10" }
];
    


    await Food.insertMany(foodItems);
    console.log("✅ Food items added to your Cloud Database!");
    process.exit();
});
