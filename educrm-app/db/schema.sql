-- EduCRM 360 — schema

CREATE TABLE IF NOT EXISTS students (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  grade         text NOT NULL,
  roll          int  NOT NULL,
  gender        text,
  dob           text,
  blood         text,
  house         text,
  status        text DEFAULT 'Active',
  attendance    int  DEFAULT 100,
  overall       numeric DEFAULT 0,
  grade_letter  text DEFAULT '—',
  rank          text DEFAULT '—',
  fee_annual    int  DEFAULT 180000,
  fee_paid      int  DEFAULT 0,
  fee_due       int  DEFAULT 180000,
  address       text,
  medical       text,
  sibling       text,
  father_name   text, father_occ text, father_phone text,
  parent_name   text, parent_rel  text, parent_phone text, parent_email text,
  subjects      jsonb DEFAULT '[]',
  photo         text,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (grade, roll)
);

CREATE TABLE IF NOT EXISTS staff (
  id serial PRIMARY KEY,
  name text NOT NULL, role text, dept text, phone text, status text DEFAULT 'On duty',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS classes (
  id text PRIMARY KEY, name text, teacher text, room text, students int DEFAULT 0,
  grid jsonb NOT NULL DEFAULT '[]', created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parent_creds (
  roll text PRIMARY KEY, password text NOT NULL
);

CREATE TABLE IF NOT EXISTS homework (
  id text PRIMARY KEY, title text, subject text, cls text, due text, descr text,
  attach_name text, attach_type text, attach_data text, status text DEFAULT 'Open',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS homework_submissions (
  homework_id text, roll text, submitted_at timestamptz DEFAULT now(),
  PRIMARY KEY (homework_id, roll)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id bigint PRIMARY KEY, title text, subject text, "by" text,
  questions jsonb NOT NULL, created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id serial PRIMARY KEY, quiz_id bigint, roll text, title text, subject text,
  score int, total int, at text, created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id serial PRIMARY KEY, thread text, from_role text, body text, at text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  roll text PRIMARY KEY, amount int, paid_date text, txn text, method text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_books (
  id serial PRIMARY KEY, title text, author text, category text, isbn text,
  total int DEFAULT 1, available int DEFAULT 1, created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_loans (
  id serial PRIMARY KEY, book_id int, book_title text, student text, roll text,
  issued text, due text, returned boolean DEFAULT false, created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id serial PRIMARY KEY, name text, category text, quantity int DEFAULT 0,
  unit text, min_stock int DEFAULT 0, created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
  id serial PRIMARY KEY, roll text, student text, title text, type text,
  descr text, issued_by text, issued_date text, created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id serial PRIMARY KEY, roll text, title text, body text, kind text DEFAULT 'info',
  read boolean DEFAULT false, created_at timestamptz DEFAULT now()
);
-- audience: for staff portals a notification targets a portal id (e.g. 'teacher','finance');
-- for student events `roll` is set and audience stays NULL (seen only by that student + their parent)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS audience text;
