const USERS_STORAGE_KEY = 'addis_eats_users';

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

function getAllUsers() {
    try {
        const data = localStorage.getItem(USERS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function registerUser(userData) {
    const { email, phone, password, name, area, address } = userData;

    if (!email || !phone || !password || !name) {
        return { success: false, error: 'All required fields must be filled' };
    }

    if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
    }

    const users = getAllUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    const phoneExists = users.some(u => u.phone === phone);

    if (emailExists) {
        return { success: false, error: 'Email already registered' };
    }

    if (phoneExists) {
        return { success: false, error: 'Phone number already registered' };
    }

    const newUser = {
        id: `usr-${Date.now()}`,
        email: email.toLowerCase(),
        phone,
        name,
        passwordHash: hashPassword(password),
        area: area || 'Bole (Medhanialem, Atlas)',
        address: address || '',
        createdAt: new Date().toISOString(),
        verified: false,
    };

    users.push(newUser);
    saveUsers(users);

    const { passwordHash, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
}

export function loginUser(email, password) {
    if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
    }

    const users = getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, error: 'Email not found. Please sign up first.' };
    }

    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
        return { success: false, error: 'Incorrect password' };
    }

    // eslint-disable-next-line no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
}

export function getUserById(id) {
    const users = getAllUsers();
    const user = users.find(u => u.id === id);
    if (!user) return null;

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export function updateUser(id, updates) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return { success: false, error: 'User not found' };
    }

    const updatedUser = {
        ...users[index],
        ...updates,
        id: users[index].id,
        passwordHash: users[index].passwordHash,
    };

    users[index] = updatedUser;
    saveUsers(users);

    // eslint-disable-next-line no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return { success: true, user: userWithoutPassword };
}

export function changePassword(id, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
        return { success: false, error: 'Both passwords are required' };
    }

    if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters' };
    }

    const users = getAllUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    const oldPasswordHash = hashPassword(oldPassword);
    if (user.passwordHash !== oldPasswordHash) {
        return { success: false, error: 'Incorrect current password' };
    }

    user.passwordHash = hashPassword(newPassword);
    saveUsers(users);

    // eslint-disable-next-line no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
}

export function deleteAccount(id, password) {
    if (!password) {
        return { success: false, error: 'Password is required to delete account' };
    }

    const users = getAllUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
        return { success: false, error: 'Incorrect password' };
    }

    const filtered = users.filter(u => u.id !== id);
    saveUsers(filtered);

    return { success: true };
}
