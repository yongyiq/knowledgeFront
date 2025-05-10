import SHA256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import PBKDF2 from 'crypto-js/pbkdf2'
import Hex from 'crypto-js/enc-hex'

/**
 * 使用SHA-256对密码进行哈希处理
 * @param password 原始密码
 * @param salt 可选的盐值，增加安全性
 * @returns 哈希后的密码
 */
export function hashPassword(password: string, salt: string = ''): string {
  // 将密码和盐值组合
  const passwordWithSalt = password + salt

  // 使用SHA-256进行哈希
  const hash = SHA256(passwordWithSalt)

  // 转换为Base64字符串
  return Base64.stringify(hash)
}

/**
 * 生成随机盐值
 * @param length 盐值长度
 * @returns 随机盐值
 */
export function generateSalt(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  let salt = ''

  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return salt
}

/**
 * 使用固定的应用盐值对密码进行哈希
 * 这个盐值应该是应用特定的，增加安全性
 * @param password 原始密码
 * @returns 哈希后的密码
 */
export function hashPasswordWithAppSalt(password: string): string {
  // 应用盐值，可以是一个固定的字符串
  // 在实际应用中，可以考虑从环境变量或配置文件中获取
  const appSalt = 'HuaweiClub2023SecretSalt'

  return hashPassword(password, appSalt)
}

/**
 * 使用PBKDF2算法对密码进行哈希，这是一种更安全的哈希方法
 * PBKDF2会多次迭代哈希函数，增加破解难度
 * @param password 原始密码
 * @param salt 盐值
 * @param iterations 迭代次数，越高越安全，但计算时间也越长
 * @param keySize 生成的密钥长度（字节数除以4）
 * @returns 哈希后的密码
 */
export function hashPasswordWithPBKDF2(password: string, salt: string, iterations: number = 10000, keySize: number = 512/32): string {
  return PBKDF2(password, salt, {
    keySize: keySize,
    iterations: iterations
  }).toString(Hex)
}

/**
 * 使用PBKDF2和应用盐值对密码进行哈希
 * 这是最推荐的密码哈希方法
 * @param password 原始密码
 * @returns 哈希后的密码
 */
export function hashPasswordSecure(password: string): string {
  // 应用盐值
  const appSalt = 'HuaweiClub2023SecretSalt'

  // 使用PBKDF2进行哈希，10000次迭代
  return hashPasswordWithPBKDF2(password, appSalt, 10000)
}
