function base32ToUint8Array(base32: string): Uint8Array {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = ""
  for (let i = 0; i < base32.length; i++) {
    const val = base32chars.indexOf(base32.charAt(i).toUpperCase())
    bits += val.toString(2).padStart(5, "0")
  }
  const array = new Uint8Array(bits.length / 8)
  for (let i = 0; i < bits.length; i += 8) {
    array[i / 8] = Number.parseInt(bits.substr(i, 8), 2)
  }
  return array
}

async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, message)
  return new Uint8Array(signature)
}

export async function generateTOTP(secret: string): Promise<string> {
  let now = Math.floor(Date.now() / 1000 / 30)
  const time = new Uint8Array(8)
  for (let i = 0; i < 8; i++) {
    time[7 - i] = now & 0xff
    now >>= 8
  }

  const key = base32ToUint8Array(secret)
  const hmacResult = await hmacSha1(key, time)

  const offset = hmacResult[hmacResult.length - 1] & 0xf
  const code =
    ((hmacResult[offset] & 0x7f) << 24) |
    (hmacResult[offset + 1] << 16) |
    (hmacResult[offset + 2] << 8) |
    hmacResult[offset + 3]

  return (code % 1000000).toString().padStart(6, "0")
}

