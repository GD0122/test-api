export function generateSalt(length) {
    let i, r = [];
    for (i = 0; i < length; ++i) {
      r.push(SALTCHARS[Math.floor(Math.random() * SALTCHARS.length)]);
    }
    return r.join('');
  }
  
  let SALTCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  