/**
 * SkillUp - Web Course System
 * Core logic for handling courses, database, and subscriptions.
 */

// 1. [PELANGGARAN SRP] - Menggabungkan data, UI, dan Persistence
// 1. Class ini hanya bertanggung jawab sebagai data course
class WebCourse {
    constructor(name, price, category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }
}

// 2. Class ini hanya bertanggung jawab membuat tampilan HTML
class CourseRenderer {
    render(course) {
        return `
            <div class="course-card">
                <h3>${course.name}</h3>
                <p>Category: ${course.category}</p>
                <div class="price">$${course.price}</div>
                <button 
                    onclick="courseService.registerNewCourse('${course.name}')" 
                    class="btn">
                    Enroll Now
                </button>
            </div>
        `;
    }
}

// 3. Class ini hanya bertanggung jawab menyimpan data course
class CourseRepository {
    save(course) {
        console.log("Connecting to core database...");
        localStorage.setItem(
            `course_${course.name}`,
            JSON.stringify(course)
        );
        console.log(`Course ${course.name} has been successfully saved.`);
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
class CourseSubscription {
    constructor(user) {
        this.user = user;
    }

    renew() {
        console.log(`Subscription for ${this.user} has been renewed.`);
        alert("Success! Your subscription is extended.");
    }
}

class TrialSubscription extends CourseSubscription {
    renew() {
        console.error("Critical Error: Cannot renew trial account.");
        throw new Error("System Failure: Trial accounts cannot call renew().");
    }
}

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
