CREATE TABLE users (
    user_id serial NOT NULL PRIMARY KEY,
    google_id text DEFAULT NULL,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    email varchar(254) NOT NULL UNIQUE,
    password text DEFAULT NULL,
    address_line1 varchar(100) NOT NULL,
    address_line2 varchar(100) NOT NULL,
    address_suburb varchar(100) NOT NULL,
    address_city varchar(100) NOT NULL,
    address_postcode integer NOT NULL,
    phone varchar(30) NOT NULL,
    password_reset_token text DEFAULT NULL,
    password_reset_token_expiry timestamptz DEFAULT NULL,
    admin boolean NOT NULL DEFAULT false
);

CREATE INDEX users_index_google_id on users(google_id);
CREATE INDEX users_index_email on users(email);
CREATE INDEX users_index_password_reset_token on users(password_reset_token);

CREATE TABLE orders (
    order_id serial NOT NULL PRIMARY KEY,
    user_id serial NOT NULL REFERENCES users,
    date date NOT NULL,
    archive boolean NOT NULL DEFAULT false,
    order_status integer NOT NULL,

    CONSTRAINT status CHECK (order_status >= 0 AND order_status <= 2)
);

CREATE TABLE order_items (
    order_id serial NOT NULL,
    item_id serial NOT NULL,
    quantity integer NOT NULL,

    CONSTRAINT pk PRIMARY KEY (order_id, item_id),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES
    orders (order_id) MATCH SIMPLE 
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES
    items (item_id) MATCH SIMPLE 
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE items (
    item_id serial NOT NULL PRIMARY KEY,
    item_name varchar(30) NOT NULL,
    item_description text NOT NULL,
    item_category serial NOT NULL REFERENCES category (category_id),
    item_origin varchar(30) NOT NULL,
    item_price money NOT NULL,
    item_stock_quantity integer NOT NULL,
    item_image text NOT NULL
);

CREATE TABLE category (
    category_id serial NOT NULL PRIMARY KEY,
    category_name varchar(30) NOT NULL
);

INSERT INTO category (category_name) VALUES
('meat'),
('fruits'),
('vegetable');

INSERT INTO items (item_name, item_description, item_category, item_origin, item_price, item_stock_quantity, item_image) VALUES
('Fresh Produce Apples Envy', 'Made in India', 2, 'India', 3.50, 100, '/src/assets/fruits/Fresh Produce Apples Envy $3.5.png'),
('Fresh Produce Avocado', ' ', 2, 'New Zealand', 4.99, 100, '/src/assets/fruits/Fresh Produce Avocado $4.99.png'),
('Fresh Produce Bananas Yellow', ' ', 2, 'New Zealand', 2.99, 100, '/src/assets/fruits/Fresh Produce Bananas Yellow $2.99.png'),
('Fresh Produce Grapes Green', ' ', 2, 'Cuba', 6.00, 100, '/src/assets/fruits/Fresh Produce Grapes Green $6.png'),
('Fresh Produce Lemons', ' ', 2, 'America', 3.99, 100, '/src/assets/fruits/Fresh Produce Lemons $3.99.png'),
('Fresh Produce Limes Imported', ' ', 2, 'America', 29.90, 100, '/src/assets/fruits/Fresh Produce Limes Imported $29.90.png'),
('Fresh Produce Mandarins', ' ', 2, 'China', 5.00, 100, '/src/assets/fruits/Fresh Produce Mandarins Imported $5.png'),
('Fresh Produce Pineapple', ' ', 2, 'Fiji', 3.00, 100, '/src/assets/fruits/Fresh Produce Pineapple Whole $3.png'),
('Fresh Produce Strawberries', ' ', 2, 'Canada', 6.99, 100, '/src/assets/fruits/Fresh Produce Strawberries $6.99.png'),
('Fresh Produce Watermelon', ' ', 2, 'China', 4.99, 100, '/src/assets/fruits/Fresh Produce Watermelon Whole Red $4.99.png'),
('Fresh Produce Mango', ' ', 2, 'Thailand', 3.00, 100, '/src/assets/fruits/Fresh Produce Mango $3.png'),
('Fresh Produce Pomegranate', ' ', 2, 'America', 6.99, 100, '/src/assets/fruits/Fresh Produce Pomegranate $6.99.png'),
('Fresh Produce Cherry', ' ', 2, 'America', 6.99, 100, '/src/assets/fruits/Fresh Produce Cherry $ 6.99.png'),
('Fresh Produce Peach', ' ', 2, 'Australia', 4, 100, '/src/assets/fruits/Fresh Produce Peach $ 4.png'),
('Fresh Produce Pear', ' ', 2, 'Australia', 4.99, 100, '/src/assets/fruits/Fresh Produce Pear $4.99.png'),
('Fresh Produce Plum', ' ', 2, 'America', 4.99, 100, '/src/assets/fruits/Fresh Produce Plum $4.99.png'),
('Fresh Produce Kiwifruit', ' ', 2, 'New Zealand', 5.99, 100, '/src/assets/fruits/Fresh Produce Kiwifruit $5.99.png'),
('Fresh Produce Blueberries', ' ', 2, 'America', 12.99, 100, '/src/assets/fruits/Fresh Produce Blueberries $12.99.png'),
('Fresh Produce Coconut', ' ', 2, 'America', 3.99, 100, '/src/assets/fruits/Fresh Produce Coconut $3.99.png'),
('Fresh Produce Feijoa', ' ', 2, 'Fiji', 6.99, 100, '/src/assets/fruits/Fresh Produce Feijoa $6.99.png');

INSERT INTO items (item_name, item_description, item_category, item_origin, item_price, item_stock_quantity, item_image) VALUES
('Beef Porterhouse', ' ', 1, 'New Zealand', 6.99, 100, '/src/assets/meat/beef-porterhouse.jpeg'),
('Beef Ribeye', ' ', 1, 'New Zealand', 8.99, 100, '/src/assets/meat/beef-ribeye.jpeg'),
('Beef Rump', ' ', 1, 'New Zealand', 6.99, 100, '/src/assets/meat/beef-rump.jpg'),
('Beef Sirloin', ' ', 1, 'New Zealand', 6.99, 100, '/src/assets/meat/beef-sirloin.jpg'),
('Beef Wagyu', ' ', 1, 'New Zealand', 12.00, 100, '/src/assets/meat/beef-wagyu.jpg'),
('Chicken Breasts Cooked', ' ', 1, 'New Zealand', 8.00, 100, '/src/assets/meat/chicken-breasts-cooked.jpg'),
('Chicken Breasts', ' ', 1, 'New Zealand', 6.00, 100, '/src/assets/meat/chicken-breasts.jpg'),
('Chicken Nuggets', ' ', 1, 'New Zealand', 8.99, 100, '/src/assets/meat/chicken-nuggets.jpeg'),
('Chicken Wings Cooked', ' ', 1, 'New Zealand', 5.99, 100, '/src/assets/meat/chicken-wings-cooked.jpg'),
('Chicken Wings', ' ', 1, 'New Zealand', 3.99, 100, '/src/assets/meat/chicken-wings.jpg'),
('Lamb Chops Cooked', ' ', 1, 'New Zeland', 12.99, 100, '/src/assets/meat/lamb-chops-cooked.jpeg'),
('Lamb Chops', ' ', 1, 'New Zealand', 10.99, 100, '/src/assets/meat/lamb-chops.jpeg'),
('Lamb Shank Cooked', ' ', 1, 'New Zealand', 9.50, 100, '/src/assets/meat/lamb-shank-cooked.jpg'),
('Lamb Shank', ' ', 1, 'New Zealand', 8.00, 100, '/src/assets/meat/lamb-shank.jpg'),
('Lamb Shoulder', ' ', 1, 'New Zealand', 12.00, 100, '/src/assets/meat/lamb-shoulder.jpg'),
('Pork Belly Cooked', ' ', 1, 'New Zealand', 10.00, 100, '/src/assets/meat/pork-belly-cooked.jpg'),
('Pork Belly', ' ', 1, 'New Zealand', 8.00, 100, '/src/assets/meat/pork-belly.jpg'),
('Pork Chops', ' ', 1, 'New Zealand', 9.99, 100, '/src/assets/meat/pork-chops.jpg'),
('Pork Loin', ' ', 1, 'New Zealand', 14.50, 100, '/src/assets/meat/pork-loin.jpg'),
('Pork Ribs', ' ', 1, 'New Zealand', 16.99, 100, '/src/assets/meat/pork-ribs.jpg');

INSERT INTO items (item_name, item_description, item_category, item_origin, item_price, item_stock_quantity, item_image) VALUES
('Asparagus', ' ', 3, 'New Zealand', 4.99, 100, '/src/assets/vegetables/asparagus.jpg'),
('Beans', ' ', 3, 'UK', 6.99, 100, '/src/assets/vegetables/beans.jpg'),
('Beetroot', ' ', 3, 'New Zealand', 4.99, 100, '/src/assets/vegetables/beetroot.jpg'),
('Bitter Gourd', ' ', 3, 'China', 8.99, 100, '/src/assets/vegetables/bitter-gourd.jpg'),
('Broccoli', ' ', 3, 'New Zealand', 4.99, 100, '/src/assets/vegetables/broccoli.jpg'),
('Carrot', ' ', 3, 'America', 2.99, 100, '/src/assets/vegetables/carrot.jpg'),
('Cauliflower', ' ', 3, 'New Zealand', 5.99, 100, '/src/assets/vegetables/cauliflower.jpg'),
('Eggplant', ' ', 3, 'America', 5.99, 100, '/src/assets/vegetables/eggplant.jpg'),
('Garlic', ' ', 3, 'China', 12.99, 100, '/src/assets/vegetables/garlic.jpg'),
('Ginger', ' ', 3, 'China', 9.99, 100, '/src/assets/vegetables/ginger.jpg'),
('Kumara', ' ', 3, 'Australia', 6.50, 100, '/src/assets/vegetables/kumara.jpg'),
('Lettuce', ' ', 3, 'New Zealand', 3.50, 100, '/src/assets/vegetables/lettuce.jpg'),
('Okra', ' ', 3, 'Canada', 7.50, 100, '/src/assets/vegetables/okra.jpg'),
('Onion Red', ' ', 3, 'New Zealand', 4.99, 100, '/src/assets/vegetables/onion-red.png'),
('Onion', ' ', 3, 'China', 5.99, 100, '/src/assets/vegetables/onion.jpg'),
('Potato', ' ', 3, 'Australia', 3.99, 100, '/src/assets/vegetables/potato.jpg'),
('Radish Red', ' ', 3, 'America', 5.99, 100, '/src/assets/vegetables/radish-red.jpg'),
('Rhubarb', ' ', 3, 'Fiji', 7.99, 100, '/src/assets/vegetables/rhubarb.jpg'),
('Silverbeet', ' ', 3, 'China', 5.99, 100, '/src/assets/vegetables/silverbeet.png'),
('Spinach', ' ', 3, 'China', 3.99, 100, '/src/assets/vegetables/spinach.jpg'),
('Sweet Corn', ' ', 3, 'America', 3.50, 100, '/src/assets/vegetables/sweet-corn.jpg'),
('Yams', ' ', 3, 'Japan', 6.99, 100, '/src/assets/vegetables/yams.png');