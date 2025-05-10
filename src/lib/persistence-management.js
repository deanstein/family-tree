import { get } from 'svelte/store';

import familyTreeData from './stores/family-tree-data';
import {
	activeFamilyTreeDataId,
	activeFamilyTreeFileOrFolderName,
	activePerson,
	saveToRepoStatus
} from './states/ui-state';

import { getRepoFamilyTreeAndSetActive } from '$lib/ui-management';

import { repoStateStrings } from '$lib/components/strings';

export const repoOwner = 'deanstein';
export const dataRepoName = 'family-tree-data';
export const deploymentRepoName = 'family-tree-deploy';
export const familyTreeDataMapFileName = 'family-tree-data-map.json';
export const timelineEventImageFolderName = 'timeline-event-images';
export const imagePlaceholderSrc = './img/image-placeholder.jpg';
export const bioPhotoPlaceholderSrc = './img/avatar-placeholder.jpg';
export const gitHubAppWorkerUrl = 'https://family-tree-data.jdeangoldstein.workers.dev';

const bioPhotoFileName = 'bio-photo';
const pathPrefixPersonId = 'person';
const pathPrefixTimelineEventId = 'event';
const pathPrefixTimelineEventImageId = 'event-image';

export async function getGitHubToken() {
	try {
		const response = await fetch(gitHubAppWorkerUrl);
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

export const getBioPhotoPathNoExt = () => {
	return `${get(activeFamilyTreeFileOrFolderName)}/${pathPrefixPersonId}-${
		get(activePerson)?.id
	}/${bioPhotoFileName}`;
};
export const getTimelineEventPhotoPathNoExt = (timelineEventId, imageId) => {
	return `${get(activeFamilyTreeFileOrFolderName)}/${pathPrefixPersonId}-${
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

export const getFileFromRepo = async (repoOwner, repoName, fileNameWithExt) => {
	let fileData = undefined;
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileNameWithExt}`;

	// ✅ Step 1: Request GitHub App Token from Cloudflare Worker
	const tokenResponse = await fetch(gitHubAppWorkerUrl);
	const { token } = await tokenResponse.json();

	if (!token) {
		console.error('Failed to retrieve GitHub App token.');
		return undefined;
	}

	// ✅ Step 2: Fetch file from GitHub using the App token
	await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
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

export const getFamilyTreeDataFileName = async (repoOwner, repoName, familyTreeDataId) => {
	// first, get the family tree data map
	const familyTreeDataMap = await getFileFromRepo(repoOwner, repoName, familyTreeDataMapFileName);

	// get the family tree data from the map by id
	const foundMapData = Object.values(familyTreeDataMap).find(
		(item) => item.id === familyTreeDataId
	);

	// get the file name from which to read the json data
	const familyTreeDataFileName = foundMapData.fileName;

	return familyTreeDataFileName;
};

export const writeCurrentFamilyTreeDataToRepo = async () => {
	// Get the file name to write to given the family tree ID in UI state
	const familyTreeId = get(activeFamilyTreeDataId);
	let familyTreeDataFileName;
	let currentFamilyTreeData;

	familyTreeData.subscribe((currentValue) => {
		currentFamilyTreeData = currentValue;
	});

	familyTreeDataFileName = await getFamilyTreeDataFileName(repoOwner, dataRepoName, familyTreeId);

	saveToRepoStatus.set(repoStateStrings.saving);

	// ✅ Step 1: Request GitHub App Token from Cloudflare Worker
	const tokenResponse = await fetch(gitHubAppWorkerUrl);
	const { token } = await tokenResponse.json();

	if (!token) {
		console.error('Failed to retrieve GitHub App token.');
		saveToRepoStatus.set(repoStateStrings.saveFailed);
		return;
	}

	// ✅ Step 2: Get repository information
	const response = await fetch(`https://api.github.com/repos/${repoOwner}/${dataRepoName}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json'
		}
	});

	if (!response.ok) {
		console.error('Repository not found: ' + dataRepoName);
		saveToRepoStatus.set(repoStateStrings.saveFailed);
		return;
	}

	const content = JSON.stringify(currentFamilyTreeData, null, 2);

	// ✅ Step 3: Get existing file SHA (if updating)
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

	// ✅ Step 4: Commit JSON file to GitHub
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
		saveToRepoStatus.set(repoStateStrings.saveSuccessful);
		console.log(`File ${familyTreeDataFileName} updated successfully!`);

		// Ensure the latest version of the file is used for the next update
		getRepoFamilyTreeAndSetActive(familyTreeId, false);
	} else {
		saveToRepoStatus.set(repoStateStrings.saveFailed);
		console.error(`Failed to update file ${familyTreeDataFileName}.`);
	}
};

// for binary large objects (blobs)
export const readBlobFromRepo = async (repoOwner, repoName, gitHubUrl) => {
	let sha;

	// ✅ Get GitHub App Token
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

	// ✅ Fetch the Blob using SHA
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
