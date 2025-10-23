-- Database Initialization Script
-- This file initializes both the main application database and Keycloak database

-- Create the keycloak database
CREATE DATABASE keycloak;

-- Connect to the main database (this script runs in the context of POSTGRES_DB)
-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Todo items table
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table for organizing todos
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Junction table for todo-category many-to-many relationship
CREATE TABLE todo_categories (
    todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, category_id)
);

-- Tags table for flexible labeling
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280', -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Junction table for todo-tag many-to-many relationship
CREATE TABLE todo_tags (
    todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for development/testing
INSERT INTO users (email, username, password_hash) VALUES
    ('demo@example.com', 'demo_user', '$2b$10$example_hash_here'),
    ('test@example.com', 'test_user', '$2b$10$example_hash_here');

-- Insert sample categories
INSERT INTO categories (user_id, name, color) 
SELECT id, 'Work', '#EF4444' FROM users WHERE username = 'demo_user'
UNION ALL
SELECT id, 'Personal', '#10B981' FROM users WHERE username = 'demo_user'
UNION ALL
SELECT id, 'Shopping', '#F59E0B' FROM users WHERE username = 'demo_user';

-- Insert sample tags
INSERT INTO tags (user_id, name, color)
SELECT id, 'urgent', '#DC2626' FROM users WHERE username = 'demo_user'
UNION ALL
SELECT id, 'important', '#7C3AED' FROM users WHERE username = 'demo_user'
UNION ALL
SELECT id, 'low-priority', '#6B7280' FROM users WHERE username = 'demo_user';

-- Insert sample todos
INSERT INTO todos (user_id, title, description, completed, priority, due_date)
SELECT id, 'Complete project proposal', 'Write and submit the Q1 project proposal by Friday', false, 'high', NOW() + INTERVAL '3 days'
FROM users WHERE username = 'demo_user'
UNION ALL
SELECT id, 'Buy groceries', 'Milk, bread, eggs, and vegetables for the week', false, 'medium', NOW() + INTERVAL '1 day'
FROM users WHERE username = 'demo_user'
UNION ALL
SELECT id, 'Call dentist', 'Schedule annual checkup appointment', false, 'low', NOW() + INTERVAL '7 days'
FROM users WHERE username = 'demo_user'
UNION ALL
SELECT id, 'Review code changes', 'Review and approve pending pull requests', true, 'high', NOW() - INTERVAL '1 day'
FROM users WHERE username = 'demo_user';

-- Link todos to categories
INSERT INTO todo_categories (todo_id, category_id)
SELECT t.id, c.id
FROM todos t
JOIN users u ON t.user_id = u.id
JOIN categories c ON c.user_id = u.id
WHERE u.username = 'demo_user'
AND (
    (t.title = 'Complete project proposal' AND c.name = 'Work') OR
    (t.title = 'Buy groceries' AND c.name = 'Shopping') OR
    (t.title = 'Call dentist' AND c.name = 'Personal') OR
    (t.title = 'Review code changes' AND c.name = 'Work')
);

-- Link todos to tags
INSERT INTO todo_tags (todo_id, tag_id)
SELECT t.id, tag.id
FROM todos t
JOIN users u ON t.user_id = u.id
JOIN tags tag ON tag.user_id = u.id
WHERE u.username = 'demo_user'
AND (
    (t.title = 'Complete project proposal' AND tag.name = 'urgent') OR
    (t.title = 'Complete project proposal' AND tag.name = 'important') OR
    (t.title = 'Review code changes' AND tag.name = 'important') OR
    (t.title = 'Call dentist' AND tag.name = 'low-priority')
);
