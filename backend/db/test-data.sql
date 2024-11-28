-- Salads
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Greek Salad', 12, 10, 'https://example.com/food_1.jpg', 'Salad', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Greek Salad');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Veg Salad', 18, 12, 'https://example.com/food_2.jpg', 'Salad', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Veg Salad');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Clover Salad', 16, 15, 'https://example.com/food_3.jpg', 'Salad', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Clover Salad');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Chicken Salad', 24, 18, 'https://example.com/food_4.jpg', 'Salad', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Chicken Salad');

-- Rolls
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Lasagna Rolls', 14, 20, 'https://example.com/food_5.jpg', 'Rolls', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Lasagna Rolls');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Peri Peri Rolls', 12, 15, 'https://example.com/food_6.jpg', 'Rolls', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Peri Peri Rolls');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Chicken Rolls', 20, 18, 'https://example.com/food_7.jpg', 'Rolls', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Chicken Rolls');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Veg Rolls', 15, 12, 'https://example.com/food_8.jpg', 'Rolls', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Veg Rolls');

-- Deserts
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Ripple Ice Cream', 14, 8, 'https://example.com/food_9.jpg', 'Deserts', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Ripple Ice Cream');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Fruit Ice Cream', 22, 10, 'https://example.com/food_10.jpg', 'Deserts', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Fruit Ice Cream');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Jar Ice Cream', 10, 7, 'https://example.com/food_11.jpg', 'Deserts', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Jar Ice Cream');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Vanilla Ice Cream', 12, 9, 'https://example.com/food_12.jpg', 'Deserts', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Vanilla Ice Cream');

-- Sandwiches
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Chicken Sandwich', 12, 10, 'https://example.com/food_13.jpg', 'Sandwich', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Chicken Sandwich');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Vegan Sandwich', 18, 12, 'https://example.com/food_14.jpg', 'Sandwich', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Vegan Sandwich');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Grilled Sandwich', 16, 15, 'https://example.com/food_15.jpg', 'Sandwich', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Grilled Sandwich');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Bread Sandwich', 24, 18, 'https://example.com/food_16.jpg', 'Sandwich', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Bread Sandwich');

-- Cakes
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Cup Cake', 14, 12, 'https://example.com/food_17.jpg', 'Cake', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Cup Cake');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Vegan Cake', 12, 15, 'https://example.com/food_18.jpg', 'Cake', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Vegan Cake');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Butterscotch Cake', 20, 18, 'https://example.com/food_19.jpg', 'Cake', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Butterscotch Cake');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Sliced Cake', 15, 12, 'https://example.com/food_20.jpg', 'Cake', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Sliced Cake');

-- Pure Veg
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Garlic Mushroom', 14, 15, 'https://example.com/food_21.jpg', 'Pure Veg', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Garlic Mushroom');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Fried Cauliflower', 22, 20, 'https://example.com/food_22.jpg', 'Pure Veg', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Fried Cauliflower');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Mix Veg Pulao', 10, 18, 'https://example.com/food_23.jpg', 'Pure Veg', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Mix Veg Pulao');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Rice Zucchini', 12, 15, 'https://example.com/food_24.jpg', 'Pure Veg', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Rice Zucchini');

-- Pasta
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Cheese Pasta', 12, 15, 'https://example.com/food_25.jpg', 'Pasta', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Cheese Pasta');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Tomato Pasta', 18, 18, 'https://example.com/food_26.jpg', 'Pasta', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Tomato Pasta');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Creamy Pasta', 16, 20, 'https://example.com/food_27.jpg', 'Pasta', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Creamy Pasta');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Chicken Pasta', 24, 25, 'https://example.com/food_28.jpg', 'Pasta', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Chicken Pasta');

-- Noodles
INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Buttter Noodles', 14, 12, 'https://example.com/food_29.jpg', 'Noodles', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Buttter Noodles');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Veg Noodles', 12, 10, 'https://example.com/food_30.jpg', 'Noodles', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Veg Noodles');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Somen Noodles', 20, 18, 'https://example.com/food_31.jpg', 'Noodles', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Somen Noodles');

INSERT INTO items (name, price, preparation_time, image_url, category, description)
SELECT 'Cooked Noodles', 15, 20, 'https://example.com/food_32.jpg', 'Noodles', 'Food provides essential nutrients for overall health and well-being'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE name = 'Cooked Noodles');
