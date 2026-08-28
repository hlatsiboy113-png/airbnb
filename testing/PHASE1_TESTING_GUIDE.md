# Phase 1 & 2 Testing Guide
## Backend API + Admin Dashboard Testing

### Prerequisites
1. Backend running on `http://localhost:5000`
2. MongoDB Atlas connected
3. Thunder Client or Postman installed
4. Admin frontend running on `http://localhost:3000`

---

## PART A: Backend API Testing (Phase 1)

### Step 1: Seed Test Users
**Request:**
```
POST http://localhost:5000/api/users/seed
Content-Type: application/json
```

**Expected Response (201):**
```json
{
  "status": "success",
  "data": [
    { "username": "John Doe", "email": "john@example.com", "role": "user" },
    { "username": "Jane Doe", "email": "jane@example.com", "role": "host" },
    { "username": "Admin User", "email": "admin@example.com", "role": "admin" }
  ]
}
```

**Verify:**
- [ ] Response status is 201
- [ ] 3 users returned
- [ ] Passwords are NOT visible in response (hashed in DB)
- [ ] Check MongoDB Atlas — passwords should be bcrypt hashes

---

### Step 2: Login Tests

#### 2a. Host Login (Success)
**Request:**
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password321"
}
```

**Expected Response (200):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "username": "Jane Doe",
    "email": "jane@example.com",
    "role": "host"
  }
}
```

**Verify:**
- [ ] Token is a valid JWT string
- [ ] User object contains username, email, role
- [ ] Password is NOT in response

#### 2b. Invalid Password
**Request:** Same email, wrong password

**Expected Response (401):**
```json
{
  "status": "fail",
  "message": "Invalid email or password"
}
```

**Verify:**
- [ ] Status is 401 (not 400 or 500)
- [ ] Message is generic (does not reveal if email exists)

#### 2c. Missing Fields
**Request:** Empty body or missing password

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "Please provide email and password"
}
```

**Verify:**
- [ ] Status is 400

---

### Step 3: Accommodation CRUD Tests

#### 3a. Create Accommodation (Authenticated Host)
**Request:**
```
POST http://localhost:5000/api/accommodations
Authorization: Bearer <jane_token>
Content-Type: multipart/form-data

Form fields:
- title: "Modern Apartment in New York"
- location: "New York"
- description: "Stay in the heart of NYC"
- type: "Entire apartment"
- guests: 4
- bedrooms: 2
- bathrooms: 2
- price: 320
- amenities: ["wifi", "kitchen", "free parking"]
- weeklyDiscount: 50
- cleaningFee: 50
- serviceFee: 50
- occupancyTaxes: 30
- images: [upload 1-5 image files]
```

**Expected Response (201):**
```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "title": "Modern Apartment in New York",
    "host": "...",
    "images": ["images-1234567890-1234567890.jpg"],
    ...
  }
}
```

**Verify:**
- [ ] Status is 201
- [ ] Accommodation created with correct fields
- [ ] Images array contains filenames (not empty)
- [ ] Host field matches Jane's user ID
- [ ] Images saved to `backend/uploads/` folder

#### 3b. Create Without Auth
**Request:** Same as above but NO Authorization header

**Expected Response (401):**
```json
{
  "status": "fail",
  "message": "Not authorized, no token"
}
```

**Verify:**
- [ ] Status is 401

#### 3c. Create as Regular User (John)
**Request:** Use John's token instead of Jane's

**Expected Response (403):**
```json
{
  "status": "fail",
  "message": "Access denied. Host privileges required."
}
```

**Verify:**
- [ ] Status is 403 (not 401)

#### 3d. Get All Accommodations
**Request:**
```
GET http://localhost:5000/api/accommodations
```

**Expected Response (200):**
```json
{
  "status": "success",
  "count": 1,
  "data": [...]
}
```

**Verify:**
- [ ] Status is 200
- [ ] Count matches number of created listings
- [ ] Host field is populated (shows username, not just ID)

#### 3e. Filter by Location
**Request:**
```
GET http://localhost:5000/api/accommodations?location=New York
```

**Verify:**
- [ ] Only accommodations matching "New York" returned
- [ ] Case-insensitive matching works (try "new york", "NEW YORK")

#### 3f. Get Single Accommodation
**Request:**
```
GET http://localhost:5000/api/accommodations/<id>
```

**Verify:**
- [ ] Returns correct accommodation
- [ ] Host populated with username and email

#### 3g. Invalid ObjectId
**Request:**
```
GET http://localhost:5000/api/accommodations/invalid-id
```

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "Invalid _id: invalid-id"
}
```

**Verify:**
- [ ] Status is 400 (not 500)

#### 3h. Update Accommodation
**Request:**
```
PUT http://localhost:5000/api/accommodations/<id>
Authorization: Bearer <jane_token>
Content-Type: multipart/form-data

Form fields:
- title: "Updated Apartment Title"
- price: 350
```

**Verify:**
- [ ] Status is 200
- [ ] Title and price updated
- [ ] Other fields unchanged
- [ ] Using different user's token returns 403

#### 3i. Delete Accommodation
**Request:**
```
DELETE http://localhost:5000/api/accommodations/<id>
Authorization: Bearer <jane_token>
```

**Verify:**
- [ ] Status is 200
- [ ] Message says "Accommodation removed"
- [ ] GET request for same ID returns 404
- [ ] Using different user's token returns 403

---

### Step 4: Image Upload Tests

#### 4a. Valid Image Upload
**Request:** Upload 1-5 JPEG/PNG images

**Verify:**
- [ ] Images saved to `uploads/` with unique filenames
- [ ] Filenames contain timestamp + random suffix
- [ ] Images accessible at `http://localhost:5000/uploads/<filename>`

#### 4b. Invalid File Type
**Request:** Upload a `.txt` or `.pdf` file

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "Only .jpeg, .jpg, and .png files are allowed"
}
```

**Verify:**
- [ ] Status is 400
- [ ] No file saved to uploads

#### 4c. File Too Large
**Request:** Upload an image > 5MB

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "File too large"
}
```

**Verify:**
- [ ] Status is 400

---

### Step 5: Reservation Tests

#### 5a. Create Reservation
**Request:**
```
POST http://localhost:5000/api/reservations
Authorization: Bearer <john_token>
Content-Type: application/json

{
  "accommodation": "<accommodation_id>",
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-08",
  "guests": 2
}
```

**Expected Response (201):**
```json
{
  "status": "success",
  "data": {
    "accommodation": { ...populated... },
    "user": { ...populated... },
    "totalCost": 2370,
    "nights": 7
  }
}
```

**Verify:**
- [ ] Status is 201
- [ ] totalCost calculated correctly:
  - (price × nights) - weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes
- [ ] Host field set automatically from accommodation
- [ ] Accommodation and user are populated

#### 5b. Invalid Dates
**Request:** checkOut before checkIn

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "Check-out must be after check-in"
}
```

#### 5c. Get User Reservations
**Request:**
```
GET http://localhost:5000/api/reservations/user
Authorization: Bearer <john_token>
```

**Verify:**
- [ ] Returns only John's reservations
- [ ] Accommodations populated with title, location, price, images

#### 5d. Get Host Reservations
**Request:**
```
GET http://localhost:5000/api/reservations/host
Authorization: Bearer <jane_token>
```

**Verify:**
- [ ] Returns reservations for Jane's properties
- [ ] User populated with username and email

#### 5e. Delete Reservation
**Request:**
```
DELETE http://localhost:5000/api/reservations/<id>
Authorization: Bearer <john_token>
```

**Verify:**
- [ ] John can cancel his own reservation
- [ ] Jane can cancel reservations for her properties
- [ ] Other users get 403

---

### Step 6: Error Handling Tests

#### 6a. 404 Route
**Request:**
```
GET http://localhost:5000/api/nonexistent
```

**Expected Response (404):**
```json
{
  "status": "fail",
  "message": "Route not found"
}
```

#### 6b. Validation Error
**Request:**
```
POST http://localhost:5000/api/accommodations
Authorization: Bearer <jane_token>
Content-Type: application/json

{
  "title": "",
  "location": ""
}
```

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "Validation Error",
  "errors": ["Title is required", "Location is required", "Price per night is required"]
}
```

#### 6c. Duplicate Email (Seed Again)
**Request:** Run seed endpoint twice

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "email already exists"
}
```

---

## PART B: Admin Dashboard Testing (Phase 2)

### Step 7: Setup
1. Start backend: `cd backend && npm run dev`
2. Start admin frontend: `cd admin-frontend && npm start`
3. Open browser: `http://localhost:3000/admin/login`

---

### Step 8: Login Page Tests

#### 8a. Successful Login
- Enter email: `jane@example.com`
- Enter password: `password321`
- Click "Sign In"

**Verify:**
- [ ] Redirects to `/admin/dashboard`
- [ ] Header shows "Hi, Jane Doe" with avatar
- [ ] Dropdown menu has "View Reservations" and "Log Out"
- [ ] Token stored in localStorage
- [ ] Navigation links visible (Dashboard, Create Listing)

#### 8b. Validation Errors
- Leave fields empty and click "Sign In"

**Verify:**
- [ ] "Email is required" error displayed
- [ ] "Password is required" error displayed
- [ ] Form does not submit

#### 8c. Invalid Email Format
- Enter: `not-an-email`

**Verify:**
- [ ] "Please enter a valid email" error

#### 8d. Wrong Password
- Enter correct email, wrong password

**Verify:**
- [ ] "Invalid email or password" alert shown
- [ ] Form fields remain filled

#### 8e. Short Password
- Enter password: `123`

**Verify:**
- [ ] "Password must be at least 6 characters" error

---

### Step 9: View Listings Page Tests

#### 9a. Display Listings
- After login, navigate to Dashboard

**Verify:**
- [ ] All accommodations displayed in table
- [ ] Columns: Image, Title, Location, Price/Night, Type, Actions
- [ ] Images load correctly from `/uploads/`
- [ ] "Create New Listing" button visible

#### 9b. Responsive Table
- Resize browser to mobile width (< 768px)

**Verify:**
- [ ] Table scrolls horizontally OR switches to card layout
- [ ] Content remains readable

#### 9c. Delete Listing
- Click "Delete" on a listing
- Confirm in dialog

**Verify:**
- [ ] Listing removed from table immediately
- [ ] No page refresh needed
- [ ] Backend DELETE request sent
- [ ] Listing no longer appears in GET /accommodations

#### 9d. Update Navigation
- Click "Edit" on a listing

**Verify:**
- [ ] Navigates to `/admin/update/<id>`
- [ ] Form pre-filled with existing data

---

### Step 10: Create Listing Page Tests

#### 10a. Create New Listing
- Fill all required fields
- Upload 3 images
- Click "Create Listing"

**Verify:**
- [ ] Success message: "Listing created successfully!"
- [ ] Redirects to dashboard after 1.5 seconds
- [ ] New listing appears in table
- [ ] Images saved and displayed

#### 10b. Validation
- Leave title/location empty
- Enter negative price

**Verify:**
- [ ] Inline errors shown next to fields
- [ ] Form does not submit
- [ ] Red borders on invalid fields

#### 10c. Image Validation
- Try uploading 6 images

**Verify:**
- [ ] Error: "Maximum 5 images allowed"

#### 10d. Image Preview
- Select images

**Verify:**
- [ ] Preview thumbnails appear before submission
- [ ] Previews show selected files

---

### Step 11: Update Listing Page Tests

#### 11a. Pre-filled Form
- Navigate to update page for any listing

**Verify:**
- [ ] All fields pre-filled with existing data
- [ ] Existing images shown as previews
- [ ] Loading state shown while fetching data

#### 11b. Update Fields
- Change title and price
- Submit

**Verify:**
- [ ] Success message shown
- [ ] Redirects to dashboard
- [ ] Changes reflected in table

#### 11c. Update Images
- Upload new images
- Submit

**Verify:**
- [ ] New images saved
- [ ] Old images replaced

---

### Step 12: Authentication Flow Tests

#### 12a. Logout
- Click profile dropdown
- Click "Log Out"

**Verify:**
- [ ] Redirected to login page
- [ ] Header shows "Become a host" and "Log in"
- [ ] localStorage cleared (no token)
- [ ] Cannot access `/admin/dashboard` directly (redirects to login)

#### 12b. Token Expiry Handling
- Manually clear token from localStorage
- Refresh page on dashboard

**Verify:**
- [ ] Redirected to login page
- [ ] No errors in console

#### 12c. Unauthorized Access
- Log out
- Try to visit `/admin/create` directly

**Verify:**
- [ ] Redirected to `/admin/login`

---

## PART C: Integration Tests (Backend + Frontend)

### Step 13: End-to-End Flow

1. **Seed users** via API
2. **Login as Jane** (host) in admin dashboard
3. **Create 3 listings** with images
4. **Verify** listings appear in View Listings
5. **Update** one listing (change price)
6. **Verify** price updated in table
7. **Delete** one listing
8. **Verify** listing removed
9. **Login as John** (user) via API
10. **Create a reservation** for one of Jane's listings
11. **Login as Jane** again
12. **Check** if reservation appears (if viewing reservations page exists)

---

## Testing Checklist Summary

### Backend
- [ ] Server starts without errors
- [ ] MongoDB connection stable
- [ ] All 3 schemas created and validated
- [ ] JWT login works and returns valid token
- [ ] Passwords hashed in database
- [ ] All 5 accommodation endpoints work (GET all, GET one, POST, PUT, DELETE)
- [ ] Image upload works with type/size validation
- [ ] Auth middleware protects routes correctly (401/403)
- [ ] Error handler returns proper status codes (400, 401, 403, 404, 500)
- [ ] Reservation CRUD works with cost calculation
- [ ] Population works (host username visible, accommodation details in reservations)
- [ ] At least 3 test accommodations exist with images
- [ ] At least 1 test reservation exists

### Admin Frontend
- [ ] Login page validates inputs
- [ ] Successful login redirects to dashboard
- [ ] Header shows user greeting and dropdown
- [ ] Dropdown has "View Reservations" and "Log Out"
- [ ] View Listings displays all accommodations
- [ ] Create Listing form validates all fields
- [ ] Image upload with preview works
- [ ] Update Listing pre-fills data correctly
- [ ] Delete removes listing immediately
- [ ] Logout clears session and redirects
- [ ] Protected routes redirect unauthenticated users
- [ ] Responsive design works on mobile
- [ ] Error messages are clear and user-friendly

---

## Debugging Tips

1. **Backend not starting?**
   - Check `.env` file exists with MONGO_URI and JWT_SECRET
   - Run `npm install` in backend folder
   - Check port 5000 is not in use: `lsof -i :5000`

2. **Images not uploading?**
   - Ensure `uploads/` directory exists
   - Check Multer fileFilter allows your file type
   - Verify `Content-Type: multipart/form-data` (not `application/json`)

3. **CORS errors in frontend?**
   - Backend must have `app.use(cors())`
   - Check `proxy` in admin-frontend/package.json points to `http://localhost:5000`

4. **Token not working?**
   - Verify token format: `Bearer <token>` (with space)
   - Check JWT_SECRET matches between login and verify
   - Token may be expired (24h limit)

5. **FormData not sending?**
   - Do NOT set `Content-Type` header manually when using FormData with Axios
   - Let the browser set the multipart boundary automatically

---

## Git Commit Checklist

After passing all tests:
```bash
cd backend
git add .
git commit -m "feat: complete Phase 1 backend API with auth, CRUD, uploads, error handling"

cd ../admin-frontend
git add .
git commit -m "feat: complete Phase 2 admin dashboard with login, CRUD, protected routes"
```
