import CryptoJS from 'crypto-js';

//const encrypted = 'U2FsdGVkX18x2XAsTT+ga0NaH8JuAQJMIH0suT4KwFD2RFcke1+1GijSWbLsQKGH'

export const decrypt = (encrypted, password) => {
	// TODO: add password input
	// var password = document.getElementById('pw').value;
	// console.log('Decrypting with password: ', password);

	var encryptedWA = CryptoJS.enc.Base64.parse(encrypted);
	var saltWA = CryptoJS.lib.WordArray.create(encryptedWA.words.slice(8 / 4, 16 / 4)); // 8 bytes salt: 0x0123456789ABCDEF
	var ciphertextWA = CryptoJS.lib.WordArray.create(
		encryptedWA.words.slice(16 / 4, encryptedWA.words.length)
	); // ciphertext

	// Determine key and IV using PBKDF2
	var keyIvWA = CryptoJS.PBKDF2(password, saltWA, {
		keySize: (32 + 16) / 4, // key and IV
		iterations: 10000,
		hasher: CryptoJS.algo.SHA256
	});
	var keyWA = CryptoJS.lib.WordArray.create(keyIvWA.words.slice(0, 32 / 4));
	var ivWA = CryptoJS.lib.WordArray.create(keyIvWA.words.slice(32 / 4, (32 + 16) / 4));

	// Decrypt
	var decryptedWA = CryptoJS.AES.decrypt(
		{
			ciphertext: ciphertextWA
		},
		keyWA,
		{
			iv: ivWA
		}
	);
	var decrypted = decryptedWA.toString(CryptoJS.enc.Utf8);
	return decrypted;
};

export const areObjectsEqual = (obj1, obj2) => {
	// Check if both objects are null or undefined
	if (obj1 === obj2) {
		return true;
	}
	// Check if both objects are not null and have the same type
	if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
		//console.log('not equal because of null and type thing');
		return false;
	}

	// If both objects are objects
	if (typeof obj1 === 'object') {
		// Get the keys of both objects
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		// Check if the number of keys are the same
		if (keys1.length !== keys2.length) {
			//console.log('not equal because of key length', keys1, keys2);
			return false;
		}
		// Check each property of the objects recursively
		for (let key of keys1) {
			if (!areObjectsEqual(obj1[key], obj2[key])) {
				//console.log('one of the keys not equal', obj1[key], obj2[key]);
				return false;
			}
		}
		return true;
	}

	// If both objects are not arrays or objects, compare them directly
	return obj1 === obj2;
};

export const instantiateObject = (object) => {
	return JSON.parse(JSON.stringify(object)); // required to make a deep copy
};

export const deepMatchObjects = (dataToMatch, dataToChange) => {
	for (var key in dataToMatch) {
		if (!dataToChange.hasOwnProperty(key)) {
			if (Array.isArray(dataToMatch[key])) {
				dataToChange[key] = [];
			} else if (typeof dataToMatch[key] === 'string') {
				dataToChange[key] = '';
			} else if (typeof dataToMatch[key] === 'boolean') {
				dataToChange[key] = false;
			} else if (typeof dataToMatch[key] === 'object') {
				dataToChange[key] = {};
				deepMatchObjects(dataToMatch[key], dataToChange[key]);
			}
		} else if (typeof dataToMatch[key] === 'object') {
			deepMatchObjects(dataToMatch[key], dataToChange[key]);
		}
	}
	return dataToChange;
};

export const setNestedObjectProperty = (obj, path, value) => {
	let parts = path.split('.');
	let last = parts.pop();
	let target = obj;
	for (let part of parts) {
		target = target[part] || {};
	}
	target[last] = value;
	return obj;
};

export const getObjectByKeyValue = (arr, key, value) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === value) {
			return arr[i];
		}
	}
	return undefined;
};

// operates on an array of objects
export const replaceObjectByKeyValue = (arr, key, value, replacementObject) => {
	for (let i = 0; i < arr.length; i++) {
		console.log('replaced?', arr[i][key], value);
		if (arr[i][key] === value) {
			arr[i] = replacementObject;
			return true; // indicate that object was replaced
		}
	}
	return false; // indicate that object was not found
};

// operates on an array of objects
export const deleteObjectByKeyValue = (arr, key, targetId) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === targetId) {
			arr.splice(i, 1);
			return true; // indicate that object was deleted
		}
	}
	return false; // indicate that object was not found
};
