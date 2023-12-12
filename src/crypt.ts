const ALGO_NAME = "AES-GCM";
const iv = new TextEncoder().encode('18,34,223,44,42,194,98,224,121,148,243,191');

const operations = window.crypto.subtle; // || window.crypto.webkitSubtle;

export const generateKey = async (): Promise<string> => {
  const key = await operations.generateKey(
    { name: ALGO_NAME, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await operations.exportKey("jwk", key);

  return btoa(JSON.stringify(exportedKey));
};

const importKey = async (rawKey: string) => {
  const jwkKey = JSON.parse(atob(rawKey));
  return await operations.importKey(
    "jwk",
    jwkKey,
    {
      name: ALGO_NAME,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const encrypt = async ({
  content,
  rawKey,
}: {
  content: string;
  rawKey: string;
}): Promise<string> => {
  const contentEncoded = new TextEncoder().encode(content);

  const key = await importKey(rawKey);

  const encryptedData = await operations.encrypt(
    { name: ALGO_NAME, iv },
    key,
    contentEncoded
  );

  return arrayBufferToBase64(encryptedData);
};

export const decrypt = async ({
  encryptedMessage,
  rawKey,
}: {
  encryptedMessage: string;
  rawKey: string;
}): Promise<string> => {
  const encryptedData = base64ToArrayBuffer(encryptedMessage);
  const key = await importKey(rawKey);

  const decryptedData = await operations.decrypt(
    {
      name: ALGO_NAME,
      iv,
    },
    key,
    encryptedData
  );

  return new TextDecoder().decode(decryptedData);
};
