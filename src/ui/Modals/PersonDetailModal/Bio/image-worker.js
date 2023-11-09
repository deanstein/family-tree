import { repoOwner, dataRepoName } from '../../../../logic/persistence-management';
import { readFileFromRepo } from '../../../../logic/persistence-management';

self.onmessage = async function (event) {
	const filePath = event.data;

	// get the raw photo content
	const imgBinary = await readFileFromRepo(repoOwner, dataRepoName, '8890', filePath);

	self.postMessage(imgBinary);
};
