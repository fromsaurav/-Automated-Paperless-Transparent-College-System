# 📄 Automated Paperless Transparent College System

## 📌 Overview
The **Automated Paperless Transparent College System** is a web-based platform designed to enhance transparency and efficiency in college administration. The system digitizes key processes like student elections, complaint management, financial tracking, and approvals, ensuring fairness, accountability, and accessibility.

## 🔍 Problem Statement  
Colleges often struggle with transparency in administrative processes, student elections, financial tracking, and complaint management. Manual processes lead to delays, lack of accountability, and limited student involvement.  

### ❌ Problems in the Existing System:  
- Inefficient manual processes for approvals and complaints.  
- Lack of transparency in student elections and budget allocations.  
- No centralized digital system to manage key college functions.  

### ✅ Proposed Solution:  
A **paperless digital system** that streamlines administrative tasks, automates approvals, ensures fair elections, enables transparent budget tracking, and allows anonymous complaint submission.

---

## 🚀 Key Features & Functionalities  

### 1️⃣ **Student Election System**  
✔ Online voting platform for student council elections.  
✔ Candidate profiles with campaign details.  
✔ Secure voting mechanism using college email authentication.  
✔ **Live result tracking** for transparency.  

### 2️⃣ **Automated Health & Leave Notifications**  
✔ If a student is reported sick by the college doctor, an automatic email is sent to the class coordinator.  
✔ If a student leaves campus, an automated email is sent to their parents for safety tracking.  

### 3️⃣ **Campus Facility Booking System**  
✔ Online system for booking campus spaces (e.g., auditorium, sports courts).  
✔ Approval process from relevant authorities.  
✔ Availability status visible to students and faculty.  

### 4️⃣ **Transparent Application & Approval System**  
✔ **Single portal** for submitting applications related to:  
   - Event organization  
   - Budget approvals  
   - Sponsorships  
✔ Applications visible to all students and faculty for transparency.  
✔ **Approval workflow:** Requests are reviewed by designated authorities.  
✔ **Priority-based escalation:** Pending requests gain priority over time.  
✔ **Real-time tracking:** Applicants can track approval status.  

### 5️⃣ **Academic Integrity & Cheating Record System**  
✔ If a student is caught cheating in an exam, their details (name, reason, and proof) are **publicly visible** to all students.  

### 6️⃣ **Anonymous Complaint System**  
✔ Students can submit complaints anonymously.  
✔ Complaints are visible to all but undergo moderation.  
✔ **Vulgar content is blocked** (no inappropriate images/videos).  
✔ Identity of complainants is revealed **only if a majority of board members approve.**  

### 7️⃣ **Transparent College Budget & Sponsorship Tracking**  
✔ **All college sponsorships and budgets are publicly visible.**  
✔ Expense proofs (bills, receipts, images) must be uploaded for verification.  
✔ Transparency in mess budgets managed by students.  

### 8️⃣ **Restricted Access for College Members Only**  
✔ The system is **accessible only via college email IDs** to ensure authenticity.  

---

## 🛠️ Tech Stack  
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Cloud Storage:** Cloudinary  
- **Version Control:** Git & GitHub  

---

## 🚀 Installation & Setup  

### 1️⃣ Clone the repository  
```sh
git clone https://github.com/fromsaurav/-Automated-Paperless-Transparent-College-System.git
cd Automated-Paperless-Transparent-College-System
```

### 2️⃣ Setup backend  
```sh
cd backend1
npm install
```

### 3️⃣ Setup frontend  
```sh
cd UserInterface1
npm install
```
```sh
cd..
cd DashBoard1
npm install
```

### 4️⃣ Configure environment variables  
Create a `.env` file in the backend directory and configure:  

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=your_detail
FRONTEND_URL_ONE=http://localhost:5173
FRONTEND_URL_TWO=http://localhost:5174
COOKIE_EXPIRE=your_detail
EMAIL=your_college_email
PASSWORD=your_password

```

### 5️⃣ Run the project  
Start the **backend**:  
```sh
npm run start or nodemon server
```

Start the **frontend**:  
```sh
1. UserInterface1
npm run dev
2. DashBoard1
npm run dev
```

### 6️⃣ Open in browser  
Navigate to:  
```
http://localhost:5173
```

---

## 📷 Screenshots  
*Will Add Soon*  

---

## 🎯 Future Enhancements  
✅ Implement **Role-Based Access Control (RBAC)**.  
✅ Integrate **AI-based document processing** for efficiency.  
✅ Add **push notifications** for approvals and elections.  

---

## 🤝 Contributing  
We welcome contributions! If you'd like to contribute:  
1. **Fork the repository**  
2. **Create a new branch** (`git checkout -b feature-name`)  
3. **Commit changes** (`git commit -m "Added feature XYZ"`)  
4. **Push to GitHub** (`git push origin feature-name`)  
5. **Submit a Pull Request**  

---

## 📩 Contact  
🔗 **GitHub:** [fromsaurav](https://github.com/fromsaurav)  
📧 **Email:** telisaurav44@gmail.com 
💼 **LinkedIn:** [Saurav Teli](https://www.linkedin.com/in/saurav-teli-89a27a263)  

---

