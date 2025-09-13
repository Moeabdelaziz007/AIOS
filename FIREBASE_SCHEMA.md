# 🗄️ Firebase Firestore Schema - AIOS Operating System Platform

## 📋 **Collection Structure**

### **1. Users Collection**
```javascript
// Collection: users
// Document ID: Firebase Auth UID
{
  uid: string,                    // Firebase Auth UID (document ID)
  username: string,               // Unique username
  email: string,                  // User email
  displayName: string,            // Display name
  profilePictureUrl: string,       // Profile picture URL
  createdAt: timestamp,           // Account creation date
  updatedAt: timestamp,           // Last update date
  role: string,                   // 'user', 'admin', 'superadmin'
  preferences: {
    theme: string,                // 'light', 'dark'
    notifications: boolean,       // Notification preferences
    language: string,             // 'en', 'es', 'fr', etc.
    timezone: string              // User timezone
  },
  profile: {
    bio: string,                  // User biography
    location: string,             // User location
    website: string,              // Personal website
    socialLinks: {
      twitter: string,
      github: string,
      linkedin: string
    }
  },
  stats: {
    totalReviews: number,         // Number of reviews written
    totalFavorites: number,       // Number of favorite OSs
    reputation: number,           // User reputation score
    lastActiveAt: timestamp       // Last activity timestamp
  }
}
```

### **2. Operating Systems Collection**
```javascript
// Collection: operating_systems
// Document ID: Auto-generated
{
  id: string,                     // Document ID
  name: string,                   // OS name (e.g., "Windows 11", "macOS Ventura")
  slug: string,                   // URL-friendly name
  releaseDate: timestamp,         // Official release date
  developer: string,              // Company/Developer (e.g., "Microsoft", "Apple")
  createdAt: timestamp,           // Record creation date
  updatedAt: timestamp,           // Last update date
  version: string,                // Version number
  architecture: string[],         // Supported architectures ['x64', 'ARM', 'x86']
  license: string,                // License type
  description: string,            // Detailed description
  shortDescription: string,       // Brief description
  officialWebsite: string,        // Official website URL
  downloadUrl: string,            // Download link
  systemRequirements: {
    minimumRAM: string,          // Minimum RAM requirement
    minimumStorage: string,       // Minimum storage requirement
    processor: string,           // Processor requirements
    graphics: string             // Graphics requirements
  },
  pricing: {
    isFree: boolean,             // Is the OS free?
    price: number,               // Price in USD
    currency: string,            // Currency code
    licenseType: string          // License type description
  },
  images: {
    logo: string,                // OS logo URL
    screenshots: string[],       // Screenshot URLs
    icon: string                 // OS icon URL
  },
  categories: string[],           // ['Desktop', 'Mobile', 'Server', 'Embedded']
  tags: string[],                // Search tags
  stats: {
    totalReviews: number,        // Total number of reviews
    averageRating: number,       // Average rating (1-5)
    totalFavorites: number,      // Number of users who favorited
    viewCount: number,           // Total views
    downloadCount: number        // Total downloads
  },
  status: string,                // 'active', 'deprecated', 'beta'
  isVerified: boolean,            // Verified by admin
  createdBy: string,             // User ID who created
  lastReviewedAt: timestamp      // Last review date
}
```

### **3. Features Collection**
```javascript
// Collection: features
// Document ID: Auto-generated
{
  id: string,                    // Document ID
  name: string,                  // Feature name
  slug: string,                  // URL-friendly name
  description: string,           // Feature description
  category: string,              // Feature category
  icon: string,                 // Feature icon URL
  createdAt: timestamp,         // Creation date
  updatedAt: timestamp,         // Last update date
  isActive: boolean,            // Is feature active?
  usage: {
    totalOSs: number,           // Number of OSs with this feature
    popularity: number          // Popularity score
  }
}
```

### **4. OS Features Collection (Many-to-Many)**
```javascript
// Collection: os_features
// Document ID: Auto-generated
{
  id: string,                    // Document ID
  operatingSystemId: string,     // Reference to operating_systems
  featureId: string,             // Reference to features
  createdAt: timestamp,          // Creation date
  addedBy: string,               // User ID who added
  isVerified: boolean,           // Verified by admin
  metadata: {
    implementation: string,      // How the feature is implemented
    version: string,             // Feature version
    notes: string               // Additional notes
  }
}
```

### **5. Reviews Collection**
```javascript
// Collection: reviews
// Document ID: Auto-generated
{
  id: string,                    // Document ID
  userId: string,                // Reference to users
  operatingSystemId: string,     // Reference to operating_systems
  rating: number,                // Rating 1-5
  title: string,                 // Review title
  reviewText: string,            // Review content
  createdAt: timestamp,          // Review date
  updatedAt: timestamp,          // Last update date
  isVerified: boolean,           // Verified purchase/usage
  helpful: {
    helpfulCount: number,        // Number of helpful votes
    notHelpfulCount: number,     // Number of not helpful votes
    voters: string[]             // User IDs who voted
  },
  pros: string[],               // Pros list
  cons: string[],                // Cons list
  usageContext: {
    useCase: string,             // Primary use case
    duration: string,            // How long used
    hardware: string             // Hardware used
  },
  images: string[],              // Review images
  status: string,                // 'published', 'pending', 'rejected'
  moderation: {
    moderatedBy: string,         // Admin who moderated
    moderatedAt: timestamp,      // Moderation date
    notes: string                // Moderation notes
  }
}
```

### **6. Favorites Collection**
```javascript
// Collection: favorites
// Document ID: Auto-generated
{
  id: string,                    // Document ID
  userId: string,                // Reference to users
  operatingSystemId: string,     // Reference to operating_systems
  createdAt: timestamp,          // Favorite date
  category: string,              // Favorite category
  notes: string                  // Personal notes
}
```

### **7. Comparisons Collection**
```javascript
// Collection: comparisons
// Document ID: Auto-generated
{
  id: string,                    // Document ID
  userId: string,                // Reference to users
  title: string,                 // Comparison title
  description: string,            // Comparison description
  operatingSystems: string[],    // Array of OS IDs
  createdAt: timestamp,          // Creation date
  updatedAt: timestamp,          // Last update date
  isPublic: boolean,             // Public comparison
  views: number,                 // View count
  likes: number,                 // Like count
  tags: string[],                // Comparison tags
  criteria: {
    performance: number,         // Performance score
    usability: number,           // Usability score
    features: number,            // Features score
    stability: number,           // Stability score
    support: number              // Support score
  }
}
```

### **8. System Logs Collection**
```javascript
// Collection: system_logs
// Document ID: Auto-generated
{
  id: string,                    // Document ID
  level: string,                 // 'info', 'warn', 'error', 'debug'
  message: string,               // Log message
  timestamp: timestamp,          // Log timestamp
  userId: string,                // User ID (if applicable)
  action: string,                // Action performed
  resource: string,              // Resource affected
  metadata: {
    ip: string,                  // User IP
    userAgent: string,           // User agent
    sessionId: string,           // Session ID
    requestId: string            // Request ID
  },
  context: {
    component: string,           // Component name
    function: string,            // Function name
    line: number                 // Line number
  }
}
```

---

## 🔥 **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other profiles
    }
    
    // Operating systems - public read, admin write
    match /operating_systems/{osId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
    
    // Features - public read, admin write
    match /features/{featureId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
    
    // OS Features - public read, admin write
    match /os_features/{osFeatureId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
    
    // Reviews - users can read all, write their own
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
    
    // Favorites - users can read/write their own
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Comparisons - public read, users can write their own
    match /comparisons/{comparisonId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
    
    // System logs - admin only
    match /system_logs/{logId} {
      allow read, write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
  }
}
```

---

## 📊 **Firestore Indexes**

```json
{
  "indexes": [
    {
      "collectionGroup": "operating_systems",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "developer", "order": "ASCENDING" },
        { "fieldPath": "releaseDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "operating_systems",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "categories", "arrayConfig": "CONTAINS" },
        { "fieldPath": "stats.averageRating", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "operatingSystemId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "favorites",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "os_features",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "operatingSystemId", "order": "ASCENDING" },
        { "fieldPath": "featureId", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 🚀 **Implementation Guide**

### **1. Initialize Collections**
```javascript
// Initialize with sample data
const initializeCollections = async () => {
  // Create sample operating systems
  const sampleOSs = [
    {
      name: "Windows 11",
      slug: "windows-11",
      developer: "Microsoft",
      releaseDate: new Date("2021-10-05"),
      version: "22H2",
      architecture: ["x64", "ARM"],
      license: "Commercial",
      description: "Latest Windows operating system",
      categories: ["Desktop"],
      tags: ["windows", "microsoft", "desktop"]
    },
    {
      name: "macOS Ventura",
      slug: "macos-ventura", 
      developer: "Apple",
      releaseDate: new Date("2022-10-24"),
      version: "13.0",
      architecture: ["ARM", "x64"],
      license: "Commercial",
      description: "Latest macOS operating system",
      categories: ["Desktop"],
      tags: ["macos", "apple", "desktop"]
    }
  ];
  
  // Create sample features
  const sampleFeatures = [
    {
      name: "Multi-tasking",
      slug: "multi-tasking",
      description: "Ability to run multiple applications simultaneously",
      category: "Productivity"
    },
    {
      name: "Security",
      slug: "security", 
      description: "Built-in security features and protections",
      category: "Security"
    }
  ];
};
```

### **2. Data Validation Functions**
```javascript
// Validate operating system data
const validateOperatingSystem = (data) => {
  const required = ['name', 'developer', 'releaseDate'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  return true;
};

// Validate review data
const validateReview = (data) => {
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  if (!data.reviewText || data.reviewText.length < 10) {
    throw new Error('Review text must be at least 10 characters');
  }
  
  return true;
};
```

### **3. Query Examples**
```javascript
// Get operating systems by developer
const getOSByDeveloper = async (developer) => {
  const q = query(
    collection(db, 'operating_systems'),
    where('developer', '==', developer),
    orderBy('releaseDate', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get reviews for an OS
const getOSReviews = async (osId, limit = 10) => {
  const q = query(
    collection(db, 'reviews'),
    where('operatingSystemId', '==', osId),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(limit)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get user favorites
const getUserFavorites = async (userId) => {
  const q = query(
    collection(db, 'favorites'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

This comprehensive Firebase schema provides a solid foundation for your operating system comparison platform with proper relationships, security, and scalability! 🚀
