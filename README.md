live link- https://startup-network-three.vercel.app/
# Startup Network Project

## Overview
The **Startup Network Project** is a web platform that connects startups with investors and mentors based on their domain. Users can log in with Google, search for relevant investors or mentors, and receive AI-powered recommendations. The platform includes a credit system, email-based recharge, and an automated response mechanism.

## Features
- **User Authentication:** Google OAuth-based login.
- **Investor & Mentor Matching:** AI-based matching of user queries to relevant investors/mentors.
- **Credit System:** Users have 5 initial credits; each search reduces 1 credit.
- **Email-Based Recharge:** Users can recharge credits by sending an email with "recharge 5 credits".
- **Admin Controls:** Restrict additional credit recharges beyond the first request.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Google OAuth
- **AI API:** Gemini API (or ChatGPT API)
- **Email API:** Gmail API

## Database Schema
### **Investors & Mentors Table**
```markdown
| Name  | Category  | Type     |
|-------|----------|---------|
| Ria   | AI       | Investor |
| Martin | Blockchain | Mentor |
| Leo   | EV       | Mentor |
| Zack  | Ecommerce | Mentor |
| Honia | Video    | Investor |
```

### **Users Table**
```markdown
| Email           | Credits | Timestamp |
|----------------|---------|----------------|
| Georgie@gmail.com | 5       | 2025-02-02T00:02:02 |
| Hash@gmail.com | 5       | 2025-02-03T05:28:27 |
```

## Setup Instructions
### **1. Clone the Repository**
```sh
git clone https://github.com/Devansh-Maheshwari/startup-network.git
cd startup-network
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add:


### **4. Run the Server**
```sh
npm start
```
The backend will run at `http://localhost:5000`

### **5. Start the Frontend**
```sh
cd frontend
npm install
npm start
```
The frontend will run at `http://localhost:3000`

## API Endpoints
### **User Authentication**
```http
POST /auth/google - Google OAuth Login
```

### **Search API**
```http
POST /search - Takes a query, sends it to Gemini/ChatGPT API along with investor/mentor data, and returns a response.


## Usage Flow
1. **Login** - Users log in using their Google account.
2. **Search Query** - Users enter a query in the search box.
3. **AI Matching** - The backend forwards the query + database to AI (Gemini/ChatGPT) for the best match.
4. **Credit Deduction** - One credit is deducted per search.
5. **Recharge System** - If credits reach 0, users must send an email to recharge (automatically detected by the Gmail API) there is only one recharge available.



## Contributors
- **Your Name** - [GitHub](https://github.com/Devansh-Maheshwari)

## License
This project is licensed under the MIT License.

