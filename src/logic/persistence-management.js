import familyTreeData from '../stores/family-tree-data';
import uiState from '../stores/ui-state';
import { repoStateStrings } from '../ui/strings';
import { getRepoFamilyTreeAndSetActive, setRepoState } from './ui-management';
import { decrypt } from './utils';

export const repoOwner = 'deanstein';
export const dataRepoName = 'family-tree-data';
export const deploymentRepoName = 'family-tree-deploy';
export const encryptedPAT =
	'U2FsdGVkX19E4XXmu4s1Y76A+iKILjKYG1n92+pqbtzdoJpeMyl6Pit0H8Kq8G28M+ZuqmdhHEfb/ud4GEe5gw==';

export const getLatestCommitDateFromPublicRepo = async (repoName) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits/main`;
	let latestCommitDate;

	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			latestCommitDate = new Date(data.commit.committer.date);
		})
		.catch((error) => console.error('Failed to get latest commit date. Error:', error));

	return latestCommitDate;
};

export const getLatestBuildDateFromPublicRepo = async (repoName) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?status=success`;
	let latestBuildDate;

	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			if (data.total_count > 0) {
				latestBuildDate = new Date(data.workflow_runs[0].created_at);
			} else {
				console.log('No successful builds found.');
			}
		})
		.catch((error) => console.error('Failed to get latest build date. Error:', error));

	return latestBuildDate;
};

export const getTotalSuccessfulBuildsInPublicRepo = async (repoName) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?status=success`;
	let totalSuccessfulBuilds = 0;

	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			if (Array.isArray(data.workflow_runs)) {
				totalSuccessfulBuilds = data.workflow_runs.length;
			} else {
				console.log('Unexpected data:', data);
			}
		})
		.catch((error) => console.error('Error:', error));

	return totalSuccessfulBuilds;
};

export const getFileFromRepo = async (fileName, password) => {
	let fileData = undefined;
	const url = `https://api.github.com/repos/${repoOwner}/${dataRepoName}/contents/${fileName}`;

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

export const getFamilyTreeDataFromRepo = async (
	familyTreeDataId,
	password,
	showNotifications = true
) => {
	if (!familyTreeDataId || !password) {
		setRepoState(repoStateStrings.saveFailed);
		return;
	}

	if (showNotifications === true) {
		setRepoState(repoStateStrings.loading);
	}

	// get the file name from which to read the json data
	const familyTreeDataFileName = await getFamilyTreeDataFileName(familyTreeDataId, password);

	// the final family tree data is a json object
	const familyTreeData = await getFileFromRepo(familyTreeDataFileName, password);

	if (showNotifications === true) {
		setRepoState(repoStateStrings.loadSuccessful);
	}

	return familyTreeData;
};

export const getFamilyTreeDataFileName = async (familyTreeDataId, password) => {
	// first, get the family tree data map
	const familyTreeDataMap = await getFileFromRepo('family-tree-data-map.json', password);

	// get the family tree data from the map by id
	const foundMapData = Object.values(familyTreeDataMap).find(
		(item) => item.id === familyTreeDataId
	);

	// get the file name from which to read the json data
	const familyTreeDataFileName = foundMapData.fileName;

	return familyTreeDataFileName;
};

export const writeCurrentFamilyTreeDataToRepo = async (password) => {
	if (!password) {
		console.error('No password was provided!');
		return;
	}

	// get the file name to write to given the family tree id in ui state
	let familyTreeId = undefined;
	let familyTreeDataFileName = undefined;
	let currentFamilyTreeData = undefined;
	uiState.subscribe((currentValue) => {
		familyTreeId = currentValue.activeFamilyTreeDataId;
	});

	familyTreeData.subscribe((currentValue) => {
		currentFamilyTreeData = currentValue;
	});

	familyTreeDataFileName = await getFamilyTreeDataFileName(familyTreeId, password);

	setRepoState(repoStateStrings.saving);

	const response = await fetch('https://api.github.com/user/repos', {
		headers: {
			Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
			Accept: 'application/vnd.github.v3+json'
		}
	});

	const repos = await response.json();
	const repo = repos.find((repo) => repo.name === dataRepoName);

	if (!repo) {
		setRepoState(repoStateStrings.saveFailed);
		console.error('Repository not found: ' + dataRepoName);
		return;
	}

	const content = JSON.stringify(currentFamilyTreeData, null, 2);

	const fileResponse = await fetch(
		`https://api.github.com/repos/${repoOwner}/${dataRepoName}/contents/${familyTreeDataFileName}`,
		{
			method: 'HEAD',
			headers: {
				Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
				Accept: 'application/vnd.github.v3+json'
			}
		}
	);

	if (!fileResponse.ok) {
		console.error(`Failed to get file ${familyTreeDataFileName}`);
		setRepoState(repoStateStrings.saveFailed);
		return;
	}

	const fileSHA = fileResponse.headers.get('etag').replace(/"/g, '');

	const updateResponse = await fetch(
		`https://api.github.com/repos/${repoOwner}/${dataRepoName}/contents/${familyTreeDataFileName}`,
		{
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
				Accept: 'application/vnd.github.v3+json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: `Update ${familyTreeDataFileName}`,
				content: btoa(content),
				sha: fileSHA
			})
		}
	);

	if (updateResponse.ok) {
		setRepoState(repoStateStrings.saveSuccessful);
		console.log(`File ${familyTreeDataFileName} updated successfully!`);
	} else {
		setRepoState(repoStateStrings.saveFailed);
		console.error(`Failed to update file ${familyTreeDataFileName}.`);
	}

	// required to ensure the latest version of the file is used for the next update
	getRepoFamilyTreeAndSetActive(familyTreeId, password, false);
};
