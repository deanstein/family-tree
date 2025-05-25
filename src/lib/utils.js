import CryptoJS from 'crypto-js';

export const decrypt = (encrypted, password) => {
	try {
		var encryptedWA = CryptoJS.enc.Base64.parse(encrypted);
		var saltWA = CryptoJS.lib.WordArray.create(encryptedWA.words.slice(8 / 4, 16 / 4));
		var ciphertextWA = CryptoJS.lib.WordArray.create(
			encryptedWA.words.slice(16 / 4, encryptedWA.words.length)
		);

		var keyIvWA = CryptoJS.PBKDF2(password, saltWA, {
			keySize: (32 + 16) / 4,
			iterations: 10000,
			hasher: CryptoJS.algo.SHA256
		});
		var keyWA = CryptoJS.lib.WordArray.create(keyIvWA.words.slice(0, 32 / 4));
		var ivWA = CryptoJS.lib.WordArray.create(keyIvWA.words.slice(32 / 4, (32 + 16) / 4));

		var decryptedWA = CryptoJS.AES.decrypt(
			// @ts-ignore
			{
				ciphertext: ciphertextWA
			},
			keyWA,
			{
				iv: ivWA
			}
		);
		var decrypted = decryptedWA.toString(CryptoJS.enc.Utf8);

		if (decrypted === '') {
			throw new Error('Incorrect password. Decryption failed.');
		}

		return decrypted;
	} catch (error) {
		throw new Error('Error decrypting: ' + error.message);
	}
};

export const areObjectsEqual = (obj1, obj2) => {
	const logReasons = false;

	// Check if both objects are null or undefined
	if (obj1 === obj2) {
		return true;
	}
	// Check if both objects are not null and have the same type
	if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
		logReasons ? console.log('not equal because of null and type thing') : () => {};
		return false;
	}

	// If both objects are objects
	if (typeof obj1 === 'object') {
		// Get the keys of both objects
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		// Check if the number of keys are the same
		if (keys1.length !== keys2.length) {
			logReasons ? console.log('not equal because of key length', keys1, keys2) : () => {};
			return false;
		}
		// Check each property of the objects recursively
		for (let key of keys1) {
			if (!areObjectsEqual(obj1[key], obj2[key])) {
				logReasons ? console.log('one of the keys not equal', obj1[key], obj2[key]) : () => {};
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

// matches every key and its type between two objects (match object and change object)
export const deepMatchObjects = (dataToMatch, dataToChange, forceChangeToType = undefined) => {
	// console message to alert when forceChangeToType encounters existing mismatched data
	const showConversionConsoleMessage = (existingKey, existingValue, newType) => {
		console.warn(
			"DeepMatchObjects: Existing key '" +
				existingKey +
				"' of type " +
				typeof existingValue +
				' will be force converted to ' +
				newType +
				'.\nPrevious value was: ' +
				existingValue +
				'.'
		);
	};

	// ensure each key in the match object exists and is of the correct type in the change object
	for (var key in dataToMatch) {
		// if the key isn't in the dataToChange, add it
		if (!dataToChange.hasOwnProperty(key)) {
			console.log("DeepMatchObjects: Key '" + key + "' not found and will be added.");
			if (typeof dataToMatch[key] === 'boolean') {
				dataToChange[key] = false;
			} else if (typeof dataToMatch[key] === 'string') {
				dataToChange[key] = '';
			} else if (Array.isArray(dataToMatch[key])) {
				dataToChange[key] = [];
			} else if (typeof dataToMatch[key] === 'object') {
				dataToChange[key] = {};
				deepMatchObjects(dataToMatch[key], dataToChange[key], forceChangeToType);
			}
			// otherwise, if the key already exists in dataToChange, but it's the wrong type
			// note that if any data already existed, it will be deleted
		} else if (
			forceChangeToType &&
			typeof dataToMatch[key] === 'boolean' &&
			typeof dataToChange[key] !== 'boolean'
		) {
			showConversionConsoleMessage(key, dataToChange[key], 'boolean');
			dataToChange[key] = false;
		} else if (
			forceChangeToType &&
			typeof dataToMatch[key] === 'string' &&
			typeof dataToChange[key] !== 'string'
		) {
			showConversionConsoleMessage(key, dataToChange[key], 'string');
			dataToChange[key] = '';
		} else if (
			forceChangeToType &&
			Array.isArray(dataToMatch[key]) &&
			!Array.isArray(dataToChange[key])
		) {
			showConversionConsoleMessage(key, dataToChange[key], 'array');
			dataToChange[key] = [];
		} else if (
			forceChangeToType &&
			typeof dataToMatch[key] === 'object' &&
			typeof dataToChange[key] !== 'object'
		) {
			showConversionConsoleMessage(key, dataToChange[key], 'object');
			dataToChange[key] = {};
			deepMatchObjects(dataToMatch[key], dataToChange[key], forceChangeToType);
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

// gets an object from an array of objects
export const getObjectByKeyValueInArray = (arr, key, value) => {
	if (arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][key] === value) {
				return arr[i];
			}
		}
		return undefined;
	}
};

// replaces an object in an array of objects
export const addOrReplaceObjectInArray = (arr = [], key, value, replacementObject) => {
	const index = arr.findIndex((obj) => obj[key] === value);

	if (index !== -1) {
		// create a new array with the replaced object
		return arr.map((obj, i) => (i === index ? replacementObject : obj));
	} else {
		// return a new array with the new object added
		return [...arr, replacementObject];
	}
};

// deletes an object in an array of objects
export const deleteObjectInArray = (arr = [], key, value) => {
	return arr.filter((obj) => obj[key] !== value);
};

export const getIsDateValid = (dateToTest) => {
	const date = new Date(dateToTest);
	const isValid = !isNaN(date.getTime());
	//console.log("Date to test: " + dateToTest, "Is valid? " + isValid)
	return isValid;
};

export const convertDateToUTC = (date) => {
	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds()
	);
};

export const getNumberOfYearsBetweenEvents = (startDate, endDate) => {
	const correctedStartDate = new Date(startDate);
	const correctedEndDate = new Date(endDate);

	var years = correctedEndDate.getFullYear() - correctedStartDate.getFullYear();

	// Subtract a year if the other date is earlier in the year than the birth date
	if (
		correctedEndDate.getMonth() < correctedStartDate.getMonth() ||
		(correctedEndDate.getMonth() == correctedStartDate.getMonth() &&
			correctedEndDate.getDate() < correctedStartDate.getDate())
	) {
		years--;
	}

	return years;
};

export const largest = (a, b) => {
	if (a > b) return a;
	else if (a === b) return a;
	else return b;
};

export const isUrlValid = (string) => {
	try {
		new URL(string);
		return true;
	} catch (_) {
		return false;
	}
};

export const getExtensionFromUrl = (url) => {
	let fileExtension = '';

	if (url) {
		try {
			const parsedUrl = new URL(url);
			const pathParts = parsedUrl.pathname.split('/');
			const fileNameWithExtension = pathParts.pop();
			fileExtension = fileNameWithExtension.split('.').pop();
		} catch (error) {
			console.error('Failed to parse URL for extension: ', error);
		}
	}

	return fileExtension;
};

export const getExtensionFromFileNameOrPath = (fileName) => {
	return fileName.split('.').pop();
};

export const removeExtensionFromFileNameOrPath = (fileName) => {
	return fileName.split('.').slice(0, -1).join('.');
};

export const getMIMEType = (binaryData) => {
	if (!binaryData) {
		return;
	}

	const signatures = {
		'data:image/jpeg': [[0xff, 0xd8, 0xff]],
		'data:image/png': [
			[0x89, 0x50, 0x4e, 0x47], // PNG signature
			[0x89, 0x4c, 0x4e, 0x47] // Alternate PNG signature
		]
	};

	const bytes = new Uint8Array(binaryData.length);

	for (let i = 0; i < binaryData.length; i++) {
		bytes[i] = binaryData.charCodeAt(i);
	}

	for (const format in signatures) {
		const formatSignatures = signatures[format];
		for (const signature of formatSignatures) {
			const matchesSignature = signature.every((byte, index) => byte === bytes[index]);
			if (matchesSignature) {
				return format;
			}
		}
	}

	return 'data:image/png'; // Unknown format
};
