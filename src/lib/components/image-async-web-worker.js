import { repoOwner, dataRepoName, tempPw } from '$lib/persistence-management';
import { readBlobFromRepo } from '$lib/persistence-management';

self.onmessage = async function (event) {
	const gitHubUrl = event.data;

	// get the raw photo content
	const imgBinary = await readBlobFromRepo(repoOwner, dataRepoName, tempPw, gitHubUrl);

	self.postMessage(imgBinary);
};
