/**
 * SkillUp - Web Course System
 * Core logic for handling courses, database, and subscriptions.
 */

// 1. [PELANGGARAN SRP] - Menggabungkan data, UI, dan Persistence
class WebCourse {
    constructor(name, price, category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }

    // Handles the UI representation of the course
    getInfo() {
        return `
            <div class="course-card">
                <h3>${this.name}</h3>
                <p>Category: ${this.category}</p>
                <div class="price">$${this.price}</div>
                <button onclick="courseService.registerNewCourse('${this.name}')" class="btn">Enroll Now</button>
            </div>
        `;
    }

    // Directly saves data to the local storage
    save() {
        console.log("Connecting to core database...");
        localStorage.setItem(`course_${this.name}`, JSON.stringify(this));
        console.log(`Course ${this.name} has been successfully saved.`);
    }
}

// 2. [PELANGGARAN OCP] - Logika penyimpanan kaku (if-else)
class DatabaseManager {
    saveToStorage(data, engineType) {
        if (engineType === 'MySQL') {
            console.log("Writing data to MySQL tables...");
        } else if (engineType === 'MongoDB') {
            console.log("Inserting document into MongoDB collection...");
        } else if (engineType === 'PostgreSQL') {
            console.log("Executing SQL INSERT for PostgreSQL...");
        } else {
            console.log("Saving to default local storage...");
        }
    }
}

// 3. [PELANGGARAN LSP] - Subclass merusak kontrak parent (throw error)
class Subscription {
    constructor(user) {
        this.user = user;
    }
}

class RenewableSubscription extends Subscription {
    renew() {
        console.log(`Subscription for ${this.user} has been renewed.`);
        alert("Success! Your subscription is extended.");
    }
}

class TrialSubscription extends Subscription {

    getRemainingDays() {
        return 7;
    }
}

class PremiumSubscription extends RenewableSubscription {}

// 4. [PELANGGARAN DIP] - Bergantung langsung pada DatabaseManager
class CourseService {
    constructor() {
        // Tight Coupling: Instansiasi langsung di constructor
        this.db = new DatabaseManager();
    }

    registerNewCourse(courseName) {
        console.log(`Initializing registration for: ${courseName}`);
        this.db.saveToStorage(courseName, 'MySQL');
        alert(`Successfully enrolled in ${courseName}!`);
    }

    handleRenewal(type) {
        let sub;
        if (type === 'trial') {
            sub = new TrialSubscription('Guest User');
        } else {
            sub = new CourseSubscription('Premium User');
        }
        sub.renew();
    }
}

// Initialize global service
const courseService = new CourseService();
