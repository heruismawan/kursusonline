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
// 1. Definisikan "Kontrak" (Interface/Base Class)
class StorageEngine {
    save(data) {
        throw new Error("Metode save() harus diimplementasi!");
    }
}

// 2. Buat kelas spesifik untuk setiap jenis penyimpanan
class MySQLStorage extends StorageEngine {
    save(data) {
        console.log("Writing data to MySQL tables...");
    }
}

class MongoDBStorage extends StorageEngine {
    save(data) {
        console.log("Inserting document into MongoDB collection...");
    }
}

class PostgreSQLStorage extends StorageEngine {
    save(data) {
        console.log("Executing SQL INSERT for PostgreSQL...");
    }
}

// 3. DatabaseManager sekarang bersih dan tidak peduli jenis engine-nya
class DatabaseManager {
    saveToStorage(data, storageEngine) {
        // Cukup panggil metode save tanpa peduli isinya apa (Polimorfisme)
        storageEngine.save(data);
    }
}

// --- Cara Penggunaan ---
const manager = new DatabaseManager();

const mySql = new MySQLStorage();
manager.saveToStorage({ id: 1 }, mySql);

const mongo = new MongoDBStorage();
manager.saveToStorage({ id: 2 }, mongo);

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
