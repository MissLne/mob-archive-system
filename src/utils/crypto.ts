import CryptoJS from 'crypto-js'

// let key: any = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(Math.floor(Math.random() * (12 - 5 + 1) + 5))
let key:any  = "8759603845968548"
key = CryptoJS.enc.Utf8.parse(key)
const iv = CryptoJS.enc.Base64.parse('******KKKKKKKKKKKKKKKKK******');
function encrypt(data: any) {
  let aesEncrypt = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return aesEncrypt.toString()
}
function decrypto(data: any) {
  let aesUnEncrypt = CryptoJS.AES.decrypt(data, key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return aesUnEncrypt.toString(CryptoJS.enc.Utf8);
}

const crypto = {
  setLocal(strName: string, localData: any) {
    localStorage.setItem(strName, encrypt(JSON.stringify(localData)));
  },
  getLocal(strName: string) {
    return decrypto(localStorage.getItem(strName))
  }
}

export default crypto
