CREATE TABLE users (
    user_id serial NOT NULL PRIMARY KEY,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    email varchar(30) NOT NULL,
    password varchar(30) NOT NULL,
    address_line1 varchar(100) NOT NULL,
    address_line2 varchar(100) NOT NULL,
    address_suburb varchar(100) NOT NULL,
    address_city varchar(100) NOT NULL,
    address_postcode integer NOT NULL,
    phone varchar(30) NOT NULL    
);

CREATE TABLE orders (
    order_id serial NOT NULL PRIMARY KEY,
    user_id serial NOT NULL REFERENCES users,
    date date NOT NULL,
    order_status integer NOT NULL,

    CONSTRAINT status CHECK (order_status >= 0 AND order_status <= 2)
);

CREATE TABLE order_items (
    order_id serial NOT NULL,
    item_id serial NOT NULL,
    price money NOT NULL,
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
('Fresh Produce Apples Envy', 'Made in India', '2', 'India', 3.50, 100, '/src/assets/fruits/Fresh Produce Apples Envy $3.5.png');