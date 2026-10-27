# Instructions to Fix Database Issue

To resolve the persistent `MongoServerError: E11000 duplicate key error` and enable multiple user registrations, you need to connect your application to a **new, fresh MongoDB database**. This will ensure that no old, stale indexes (like the `username_1` index) interfere with your testing.

Please follow these steps carefully:

1.  **Locate your `.env` file:**
    This file is typically found in your `backend` directory: `E:\Shramik_Seva_web\backend\.env`

2.  **Edit the `MONGO_URI` variable:**
    Open the `.env` file in a text editor. Find the line that starts with `MONGO_URI=`.

    Your current `MONGO_URI` might look something like this:
    `MONGO_URI=mongodb+srv://totanpatra459:hqivrAGERPqvhoe2@totan.5smqamw.mongodb.net/?retryWrites=true&w=majority&appName=shramik-seva`

    You need to **insert a new database name** into this URI. The database name should go right after `.net/` and before `?retryWrites`.

    **Example of how to modify it:**
    Change it to something like this (you can choose any new, unique name for your database, e.g., `shramik_seva_dev_test`):
    `MONGO_URI=mongodb+srv://totanpatra459:hqivrAGERPqvhoe2@totan.5smqamw.mongodb.net/shramik_seva_dev_test?retryWrites=true&w=majority&appName=shramik-seva`

    **Important:**
    *   Ensure there are **no spaces** around the `=` sign in the `.env` file.
    *   Choose a database name that is distinct from any previous databases you might have used for this project (e.g., avoid `test`).

3.  **Save the `.env` file.**

4.  **Restart your Node.js application:**
    After saving the changes to `.env`, stop your running Node.js server (if it's running) and then start it again. This will ensure your application picks up the new `MONGO_URI`.

**What this achieves:**
By changing the database name in the `MONGO_URI`, your application will connect to a brand new MongoDB database. This new database will be empty and will not contain any of the old, problematic indexes. You will then be able to register multiple users without encountering the `E11000 duplicate key error`.

Once you have completed these steps, please let me know."