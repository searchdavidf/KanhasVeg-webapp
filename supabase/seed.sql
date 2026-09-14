-- Seed data — Existing menu items from Kanha's
-- Categories
insert into public.menu_categories (name, slug, sort_order) values
  ('South ka Nashta', 'south-nashta', 1),
  ('North ka Nashta', 'north-nashta', 2),
  ('Main Course', 'main-course', 3),
  ('Breads', 'breads', 4),
  ('Rice', 'rice', 5),
  ('Salads & Raita', 'salads-raita', 6),
  ('Combos', 'combos', 7),
  ('Chinese', 'chinese', 8),
  ('Chaat & Snacks', 'chaat-snacks', 9),
  ('Desserts', 'desserts', 10),
  ('Beverages', 'beverages', 11);

-- South ka Nashta
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Idly Sambar', 7, 1),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Vada Sambar', 7, 2),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Sada Dosa', 9, 3),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Paper Sada Dosa', 10, 4),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Masala Dosa', 9, 5),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Ghee Roast Masala Dosa', 16, 6),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Paper Masala Dosa', 15, 7),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Onion & Tomato Uttappam', 10, 8),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Uttappam', 15, 9),
  ((select id from public.menu_categories where slug = 'south-nashta'), 'Cheese Uttappam', 15, 10);

-- North ka Nashta
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Indori Poha', 12, 1),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Sevai Khichdi', 12, 2),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Maggie Masala', 10, 3),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Stuffed Parathas (Aloo / Mooli / Gobhi)', 10, 4),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Paneer Paratha', 15, 5),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Poori & Aloo Sabji', 12, 6),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Chhole Bhature', 15, 7),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Bedami Poori', 19, 8),
  ((select id from public.menu_categories where slug = 'north-nashta'), 'Veg Grill Sandwich', 15, 9);

-- Main Course - Paneer
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'main-course'), 'Paneer Lababdar', 22, 1),
  ((select id from public.menu_categories where slug = 'main-course'), 'Paneer Pasanda', 22, 2),
  ((select id from public.menu_categories where slug = 'main-course'), 'Paneer Bhurji', 19, 3),
  ((select id from public.menu_categories where slug = 'main-course'), 'Paneer Tikka Masala', 24, 4),
  ((select id from public.menu_categories where slug = 'main-course'), 'Butter Paneer', 24, 5),
  ((select id from public.menu_categories where slug = 'main-course'), 'Kadai Paneer', 24, 6),
  ((select id from public.menu_categories where slug = 'main-course'), 'Malai Kofta', 22, 7),
  ((select id from public.menu_categories where slug = 'main-course'), 'Palak Paneer', 22, 8),
  ((select id from public.menu_categories where slug = 'main-course'), 'Matar Paneer', 24, 9),
  ((select id from public.menu_categories where slug = 'main-course'), 'Shahi Paneer', 22, 10);

-- Main Course - Dal
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'main-course'), 'Dal Tadka', 14, 11),
  ((select id from public.menu_categories where slug = 'main-course'), 'Dal Makhani', 16, 12),
  ((select id from public.menu_categories where slug = 'main-course'), 'Yellow Dal', 12, 13),
  ((select id from public.menu_categories where slug = 'main-course'), 'Rajma Masala', 14, 14),
  ((select id from public.menu_categories where slug = 'main-course'), 'Chana Masala', 14, 15);

-- Main Course - Veg
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'main-course'), 'Veg Kofta', 18, 16),
  ((select id from public.menu_categories where slug = 'main-course'), 'Veg Kolhapuri', 18, 17),
  ((select id from public.menu_categories where slug = 'main-course'), 'Mix Veg', 16, 18),
  ((select id from public.menu_categories where slug = 'main-course'), 'Aloo Gobi', 14, 19),
  ((select id from public.menu_categories where slug = 'main-course'), 'Bhindi Masala', 14, 20),
  ((select id from public.menu_categories where slug = 'main-course'), 'Baingan Bharta', 16, 21);

-- Breads
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'breads'), 'Tandoori Roti', 3, 1),
  ((select id from public.menu_categories where slug = 'breads'), 'Butter Roti', 4, 2),
  ((select id from public.menu_categories where slug = 'breads'), 'Plain Naan', 5, 3),
  ((select id from public.menu_categories where slug = 'breads'), 'Butter Naan', 6, 4),
  ((select id from public.menu_categories where slug = 'breads'), 'Garlic Naan', 7, 5),
  ((select id from public.menu_categories where slug = 'breads'), 'Laccha Paratha', 6, 6),
  ((select id from public.menu_categories where slug = 'breads'), 'Aloo Paratha', 10, 7),
  ((select id from public.menu_categories where slug = 'breads'), 'Missi Roti', 5, 8);

-- Rice
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'rice'), 'Steamed Rice', 8, 1),
  ((select id from public.menu_categories where slug = 'rice'), 'Jeera Rice', 10, 2),
  ((select id from public.menu_categories where slug = 'rice'), 'Veg Pulao', 14, 3),
  ((select id from public.menu_categories where slug = 'rice'), 'Veg Biryani', 18, 4),
  ((select id from public.menu_categories where slug = 'rice'), 'Paneer Biryani', 22, 5);

-- Salads & Raita
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'salads-raita'), 'Green Salad', 8, 1),
  ((select id from public.menu_categories where slug = 'salads-raita'), 'Onion Raita', 6, 2),
  ((select id from public.menu_categories where slug = 'salads-raita'), 'Mixed Raita', 8, 3),
  ((select id from public.menu_categories where slug = 'salads-raita'), 'Boondi Raita', 8, 4);

-- Combos
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'combos'), 'Thali (Dal + Sabji + Roti × 4 + Rice)', 28, 1),
  ((select id from public.menu_categories where slug = 'combos'), 'Special Thali', 35, 2),
  ((select id from public.menu_categories where slug = 'combos'), 'Chole Bhature Combo', 22, 3),
  ((select id from public.menu_categories where slug = 'combos'), 'Chhole Chawal', 18, 4),
  ((select id from public.menu_categories where slug = 'combos'), 'Rajma Chawal', 18, 5);

-- Chinese
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'chinese'), 'Veg Fried Rice', 16, 1),
  ((select id from public.menu_categories where slug = 'chinese'), 'Veg Hakka Noodles', 16, 2),
  ((select id from public.menu_categories where slug = 'chinese'), 'Veg Manchurian', 18, 3),
  ((select id from public.menu_categories where slug = 'chinese'), 'Chilli Paneer', 22, 4),
  ((select id from public.menu_categories where slug = 'chinese'), 'Paneer Chilli', 22, 5),
  ((select id from public.menu_categories where slug = 'chinese'), 'Veg Schezwan Rice', 18, 6);

-- Chaat & Snacks
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Samosa (2 pcs)', 6, 1),
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Samosa Chaat', 12, 2),
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Papdi Chaat', 12, 3),
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Aloo Tikki Chaat', 12, 4),
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Dahi Puri', 14, 5),
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Sev Puri', 12, 6),
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Bhel Puri', 10, 7),
  ((select id from public.menu_categories where slug = 'chaat-snacks'), 'Dahi Vada', 12, 8);

-- Desserts
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'desserts'), 'Gulab Jamun (2 pcs)', 8, 1),
  ((select id from public.menu_categories where slug = 'desserts'), 'Rasmalai', 12, 2),
  ((select id from public.menu_categories where slug = 'desserts'), 'Gajar Halwa', 14, 3),
  ((select id from public.menu_categories where slug = 'desserts'), 'Kulfi', 8, 4),
  ((select id from public.menu_categories where slug = 'desserts'), 'Rasgulla (2 pcs)', 8, 5);

-- Beverages
insert into public.menu_items (category_id, name, price, sort_order) values
  ((select id from public.menu_categories where slug = 'beverages'), 'Masala Chai', 4, 1),
  ((select id from public.menu_categories where slug = 'beverages'), 'Cold Coffee', 10, 2),
  ((select id from public.menu_categories where slug = 'beverages'), 'Fresh Juice', 12, 3),
  ((select id from public.menu_categories where slug = 'beverages'), 'Lassi (Sweet)', 10, 4),
  ((select id from public.menu_categories where slug = 'beverages'), 'Lassi (Salted)', 10, 5),
  ((select id from public.menu_categories where slug = 'beverages'), 'Butter Milk', 6, 6),
  ((select id from public.menu_categories where slug = 'beverages'), 'Mineral Water', 3, 7),
  ((select id from public.menu_categories where slug = 'beverages'), 'Soft Drink', 5, 8);

-- Staff / Admin roles setup (run after first user signs up)
-- To make a user an admin, run:
-- insert into public.staff (user_id, full_name, role) values ('USER_UUID', 'Admin Name', 'admin');

-- Default admin email
insert into public.profiles (id, full_name, email, role, loyalty_points, tier)
values (
  '00000000-0000-0000-0000-000000000000',
  'System Admin',
  'admin@kanhasveg.com',
  'admin',
  99999,
  'platinum'
)
on conflict (id) do nothing;
