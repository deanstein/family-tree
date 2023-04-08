import { decrypt } from './utils';

const repoOwner = 'deanstein';
const repoName = 'family-tree-data';
const encryptedPAT =
	'U2FsdGVkX19E4XXmu4s1Y76A+iKILjKYG1n92+pqbtzdoJpeMyl6Pit0H8Kq8G28M+ZuqmdhHEfb/ud4GEe5gw==';

export const getFileFromRepo = async (fileName, password) => {
	let fileData = undefined;
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;

	await fetch(url, {
		headers: {
			Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
			Accept: 'application/vnd.github.v3.raw'
		}
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			fileData = data;
		})
		.catch((error) => {
			console.error('There was a problem fetching the JSON file:', error);
		});

	return fileData;
};

export const getFamilyTreeDataFromRepo = async (familyTreeDataId, password) => {
  if (!familyTreeDataId || !password) {
    return;
  }

	// first, get the family tree data map
	const familyTreeDataMap = await getFileFromRepo('family-tree-data-map.json', password);

	// get the family tree data from the map by id
	const foundMapData = Object.values(familyTreeDataMap).find(
		(item) => item.id === familyTreeDataId
	);

	// get the file name from which to read the json data
	const familyTreeDataFileName = foundMapData.fileName;

	// the final family tree data is a json object
	const familyTreeData = await getFileFromRepo(familyTreeDataFileName, password);
	return familyTreeData;
};

export const writeCurrentFamilyTreeDataToRepo = async (familyTreeData, password) => {
	const response = await fetch('https://api.github.com/user/repos', {
		headers: {
			Authorization: `Bearer ${sPAT}`,
			Accept: 'application/vnd.github.v3+json'
		}
	});

	const repos = await response.json();
	const repo = repos.find((repo) => repo.name === repoName);

	if (!repo) {
		console.error('Repository not found');
		return;
	}

	const content = JSON.stringify(familyTreeData, null, 2);
	const path = `/${fileName}`;

	const fileResponse = await fetch(
		`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents${path}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${sPAT}`,
				Accept: 'application/vnd.github.v3+json'
			}
		}
	);

	if (!fileResponse.ok) {
		console.error(`Failed to get file ${fileName}`);
		return;
	}

	const file = await fileResponse.json();

	const updateResponse = await fetch(
		`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents${path}`,
		{
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${sPAT}`,
				Accept: 'application/vnd.github.v3+json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: `Update ${fileName}`,
				content: btoa(content),
				sha: file.sha
			})
		}
	);

	if (updateResponse.ok) {
		console.log(`File ${fileName} updated successfully`);
	} else {
		console.error(`Failed to update file ${fileName}`);
	}
};
