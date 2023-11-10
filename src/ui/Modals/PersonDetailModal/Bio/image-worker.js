import { repoOwner, dataRepoName } from '../../../../logic/persistence-management';
import { readBlobFromRepo } from '../../../../logic/persistence-management';

self.onmessage = async function (event) {
	const filePath = event.data;

	// get the raw photo content
	const imgBinary = await readBlobFromRepo(repoOwner, dataRepoName, '8890', filePath);

	self.postMessage(imgBinary);
};
