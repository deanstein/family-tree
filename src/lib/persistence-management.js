import { get } from 'svelte/store';

import { activeFamilyTreeData } from './states/family-tree-state';
import { persistenceStatus } from './states/family-tree-state';
import { activeFamilyTreeId, activePerson } from './states/family-tree-state';

import { persistenceStrings } from '$lib/components/strings';
import { getPersonById, getPersonIdByName } from './tree-management';

export const repoOwner = 'deanstein';
export const dataRepoName = 'family-tree-data';
export const familyTreeDataMapFileName = 'family-tree-data-map.json';
// tree IDs for example and private trees
// these are the folder names containing subfolders of photos, per person
export const exampleFamilyTreeId = 'family-tree-data-0';
export const privateFamilyTreeId = 'family-tree-data-1';
// image paths
export const timelineEventImageFolderName = 'timeline-event-images';
export const imagePlaceholderSrc = './img/image-placeholder.jpg';
export const bioPhotoPlaceholderSrc = './img/avatar-placeholder.jpg';
// Cloudflare workers and GitHub App paths
export const gitHubAppWorkerUrl = 'https://family-tree-data.jdeangoldstein.workers.dev';
export const ghaPathGetToken = '/get-github-app-token';
export const ghaPathGetExampleFamilyTreeData = '/get-example-family-tree-data';
export const ghaPathGetPrivateFamilyTreeData = '/get-private-family-tree-data';

const bioPhotoFileName = 'bio-photo';
const pathPrefixPersonId = 'person';
const pathPrefixTimelineEventId = 'event';
const pathPrefixTimelineEventImageId = 'event-image';
// start the example family tree with this person as the activePerson
const exampleFamilyTreeAuthMemberId = '2'; // Kendall Roy

/*** GITHUB APP WORKER FUNCTIONS ***/
export async function getGitHubToken() {
	try {
		const response = await fetch(gitHubAppWorkerUrl + ghaPathGetToken);
		if (!response.ok) {
			throw new Error(`GitHub Token Error: ${response.status}`);
		}

		const data = await response.json();
		return data.token; // Return the GitHub App installation token
	} catch (error) {
		console.error('Failed to fetch GitHub token:', error);
		return null;
	}
}

export async function fetchExampleFamilyTree() {
	const response = await fetch(
		gitHubAppWorkerUrl + ghaPathGetExampleFamilyTreeData + '?id=' + exampleFamilyTreeAuthMemberId
	);
	const responseJson = await response.json();
	// if we got the tree from the backend
	if (responseJson.success) {
		return responseJson.familyTreeData;
	}
}

export async function fetchExampleFamilyTreeAndSetActive() {
	const exampleFamilyTreeData = await fetchExampleFamilyTree();
	if (exampleFamilyTreeData) {
		activeFamilyTreeData.set(exampleFamilyTreeData);
		activePerson.set(getPersonById(get(activeFamilyTreeData), exampleFamilyTreeAuthMemberId));
		persistenceStatus.set(persistenceStrings.loadSuccessful);
		return exampleFamilyTreeData;
	}
}

// fetches the private family tree if the name and birthdate are present in it
export async function fetchPrivateFamilyTree(firstName, lastName, birthdate) {
	// encode the name and birthdate so they can be checked against the family tree data
	const encodedName = encodeURIComponent(firstName + ' ' + lastName);
	const encodedBirthdate = encodeURIComponent(birthdate);
	const response = await fetch(
		gitHubAppWorkerUrl +
			ghaPathGetPrivateFamilyTreeData +
			'?name=' +
			encodedName +
			'&birthdate=' +
			encodedBirthdate
	);
	const responseJson = await response.json();
	// if we got the tree from the backend
	if (responseJson.success) {
		return responseJson.familyTreeData;
	}
}

export async function fetchPrivateFamilyTreeAndSetActive(firstName, lastName, birthdate) {
	const privateFamilyTreeData = await fetchPrivateFamilyTree(firstName, lastName, birthdate);
	if (privateFamilyTreeData) {
		activeFamilyTreeData.set(privateFamilyTreeData);
		activePerson.set(
			getPersonById(get(activeFamilyTreeData), getPersonIdByName(firstName + ' ' + lastName))
		);
		persistenceStatus.set(persistenceStrings.loadSuccessful);
		return privateFamilyTreeData;
	}
}

export const getBioPhotoPathNoExt = () => {
	return `${get(activeFamilyTreeId)}/${pathPrefixPersonId}-${
		get(activePerson)?.id
	}/${bioPhotoFileName}`;
};
export const getTimelineEventPhotoPathNoExt = (timelineEventId, imageId) => {
	return `${get(activeFamilyTreeId)}/${pathPrefixPersonId}-${
		get(activePerson).id
	}/${pathPrefixTimelineEventId}-${timelineEventId}/${pathPrefixTimelineEventImageId}-${imageId}`;
};

export const getRepoContentUrlPrefix = (repoOwner, repoName) => {
	return `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;
};

export const getLatestCommitDateFromPublicRepo = async (repoOwner, repoName) => {
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

export const getLatestBuildDateFromPublicRepo = async (repoOwner, repoName) => {
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

export const getTotalCommitsInPublicRepo = async (repoOwner, repoName) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
	let totalCommits = 0;

	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			if (Array.isArray(data)) {
				data.forEach((contributor) => {
					totalCommits += contributor.contributions;
				});
			} else {
				console.log('Unexpected data:', data);
			}
		})
		.catch((error) => console.error('Error:', error));

	return totalCommits;
};

export const writeCurrentFamilyTreeDataToRepo = async () => {
	// Get the file name to write to given the family tree ID in UI state
	let familyTreeDataFileName;
	let currentFamilyTreeData;

	activeFamilyTreeData.subscribe((currentValue) => {
		currentFamilyTreeData = currentValue;
	});

	familyTreeDataFileName = get(activeFamilyTreeId);

	persistenceStatus.set(persistenceStrings.saving);

	// request GitHub App token from Cloudflare Worker
	const tokenResponse = await fetch(gitHubAppWorkerUrl + ghaPathGetToken);
	const { token } = await tokenResponse.json();

	if (!token) {
		console.error('Failed to retrieve GitHub App token.');
		persistenceStatus.set(persistenceStrings.saveFailed);
		return;
	}

	// get repository information
	const response = await fetch(`https://api.github.com/repos/${repoOwner}/${dataRepoName}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json'
		}
	});

	if (!response.ok) {
		console.error('Repository not found: ' + dataRepoName);
		persistenceStatus.set(persistenceStrings.saveFailed);
		return;
	}

	const content = JSON.stringify(currentFamilyTreeData, null, 2);

	// get existing file SHA (if updating)
	const fileResponse = await fetch(
		`https://api.github.com/repos/${repoOwner}/${dataRepoName}/contents/${familyTreeDataFileName}`,
		{
			method: 'HEAD',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github.v3+json'
			}
		}
	);

	let fileSHA = null;
	if (fileResponse.ok) {
		fileSHA = fileResponse.headers.get('etag').replace(/"/g, '');
	}

	// commit JSON file to GitHub
	const updateResponse = await fetch(
		`https://api.github.com/repos/${repoOwner}/${dataRepoName}/contents/${familyTreeDataFileName}`,
		{
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github.v3+json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: `Update ${familyTreeDataFileName}`,
				content: btoa(content), // Encode content in Base64
				sha: fileSHA // Include SHA if updating an existing file
			})
		}
	);

	if (updateResponse.ok) {
		persistenceStatus.set(persistenceStrings.saveSuccessful);
		console.log(`File ${familyTreeDataFileName} updated successfully!`);

		// Ensure the latest version of the file is used for the next update
		//////////getRepoFamilyTreeAndSetActive(familyTreeId, false);
	} else {
		persistenceStatus.set(persistenceStrings.saveFailed);
		console.error(`Failed to update file ${familyTreeDataFileName}.`);
	}
};

// for binary large objects (blobs)
export const readBlobFromRepo = async (repoOwner, repoName, gitHubUrl) => {
	let sha;

	// get GitHub App Token
	const token = await getGitHubToken();
	if (!token) {
		console.error('Failed to retrieve GitHub App token.');
		return null;
	}

	try {
		const response = await fetch(gitHubUrl, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			sha = data.sha; // Get the file's SHA
		} else {
			console.log('Bad response: ' + JSON.stringify(response));
		}
	} catch (error) {
		console.error(error);
	}

	// fetch the Blob using SHA
	const blobUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs/${sha}`;
	try {
		const response = await fetch(blobUrl, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			const fileContent = atob(data.content); // Decode file content from Base64
			return fileContent;
		} else {
			console.log('Bad response: ' + response);
		}
	} catch (error) {
		console.error(error);
	}
};

export const uploadFileToRepo = async (
	repoOwner,
	repoName,
	filePath,
	fileContent,
	commitMessage
) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

	// ✅ Get GitHub App Token
	const token = await getGitHubToken();
	if (!token) {
		console.error('Failed to retrieve GitHub App token.');
		return null;
	}

	// ✅ Step 1: Check if File Exists
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	});

	let sha = null;

	if (response.ok) {
		// ✅ File exists, get SHA for update
		const existingFileData = await response.json();
		sha = existingFileData.sha;
	} else {
		// ✅ File does not exist, safe to upload a new one
		console.log(
			"%c^^^ Ignore the above error. The file is not present in the repo, either because it didn't exist yet or had been deleted for a full refresh.",
			'color: green; font-weight: bold;'
		);
	}

	// ✅ Step 2: Upload or Update File
	const data = {
		message: commitMessage,
		content: fileContent,
		...(sha && { sha }) // Include SHA only if updating
	};

	const uploadResponse = await fetch(url, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!uploadResponse.ok) {
		console.error(`Failed to upload/update file: ${filePath}`);
		return null;
	}

	const uploadedData = await uploadResponse.json();
	return uploadedData.content.url; // ✅ Return GitHub file URL
};

export const deleteFileFromRepoByUrl = async (url, logFailures = false) => {
	let deleted = false;
	let sha;

	// ✅ Get GitHub App Token
	const token = await getGitHubToken();
	if (!token) {
		console.error('Failed to retrieve GitHub App token.');
		return false;
	}

	// ✅ Step 1: Get the File SHA
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			sha = data.sha; // Get the file's SHA
		} else {
			if (logFailures) {
				console.log('Bad response: ' + JSON.stringify(response));
			}
			return false;
		}
	} catch (error) {
		if (logFailures) {
			console.error(error);
		}
		return false;
	}

	// ✅ Step 2: Delete the File Using SHA
	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: `delete ${url}`,
				sha: sha // ✅ SHA required for deletion
			})
		});

		if (response.ok) {
			deleted = true;
		} else {
			if (logFailures) {
				console.error(
					'Bad response trying to delete file: ' +
						response.status +
						', text: ' +
						(await response.text())
				);
			}
			deleted = false;
		}
	} catch (error) {
		if (logFailures) {
			console.error(error);
		}
		deleted = false;
	}

	return deleted;
};
