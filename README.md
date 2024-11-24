# **Taskify**

Taskify is a lightweight and efficient task management application built using Node.js, Express, EJS, and PostgreSQL. It provides an intuitive interface for managing members and their associated tasks, enabling seamless task organization and productivity.

---

## **Features**
- **Members**: Add, view, and delete members.
- **Tasks**: Add, edit, view, and delete tasks for each member.
- **Responsive Design**: Works seamlessly on desktop and mobile.

---

## **Technologies Used**
- **Frontend**: HTML, CSS, EJS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

---

## **How to Run**
1. Clone the repository:
   ```bash
   git clone https://github.com/AliZagham1/Taskify.git
   cd Taskify
2. **Install Dependencies**
   npm install

3. **Set up PostgreSQL Database**
    1. CREATE TABLE members (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

  2. CREATE TABLE items (
     id SERIAL PRIMARY KEY,
     member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


4. **Start the server**
     node app.js


5. **Project Structure**
Taskify/
 public/              
├── views/               
├── app.js               
└── README.md           

6. **Future Enhancements**
    1. Add user authentication.
    2. Implement task prioritization.
    3. Add search and filtering functionality.
