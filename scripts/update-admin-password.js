import bcrypt from 'bcryptjs';

const password = '12345678';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Email: omarabokhalel9@gmail.com');
console.log('Password: 12345678');
console.log('Hashed Password:', hashedPassword);
console.log('');
console.log('Run this SQL in phpMyAdmin:');
console.log(`UPDATE users SET password = '${hashedPassword}', role = 'admin' WHERE email = 'omarabokhalel9@gmail.com';`);
