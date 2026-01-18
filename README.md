# Shared Todo Application (v3)

A modern, shared Todo list application built with Next.js and Supabase.
Features Daily/Weekly views, recurring todos, and strict access control with manual user management.

## Features

- **Authentication**: Email/Password login (Sign up disabled).
- **Access Control**: Only whitelisted users can access.
- **Views**: Today, Weekly, Day Detail.
- **Recurring Todos**: Flexible scheduling logic.

## Setup Instructions

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Supabase Setup**
    - Run the latest `schema.sql` logic in Supabase SQL Editor.
    - **Add Allowed Users**:
      ```sql
      -- Replace with actual email and name
      INSERT INTO allowed_users (email, display_name) VALUES ('sanjay@example.com', 'Sanjay');
      ```
    - **Invite User**: Since sign-up is disabled, you must invite the user via Supabase Dashboard -> Authentication -> Users -> Invite User.

3.  **Environment Variables**
    - Configure `.env.local`:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=your-project-url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
      ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
