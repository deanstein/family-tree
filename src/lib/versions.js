export const appVersion = '0.15.11';
export const appChangelog = {
	'v0.xx.x': {
		Overview: 'v0.xx.x adds password protection and overhauled temp state management',
		Changes: ['Added password protection to the ChooseTree dialog']
	},
	'v0.15.x': {
		Overview:
			'v0.15.x adds the ability to set a biographic photo which displays in the node and bio views, adds timeline event photos, and adds the ability to add associated people to timeline events.',
		Changes: [
			'Added schema support for a bio photo, timeline event images, and associated people',
			'Replaced Avatar with BioPhoto in Bio and all PersonNode variants',
			'Added event media content like images and associated people',
			'Added image fetch web workers',
			'Added image cache',
			'Added binary large object read support',
			'Added ability to delete files on GitHub',
			'Added radius to input elements',
			'Added $lib notation for all imports'
		]
	},
	'v0.14.x': {
		Overview:
			'v0.14.x adds iconography support via FontAwesome, adds an age readout in the bio and on timeline events, and improves the styling and positioning of the timeline spine',
		Changes: [
			'Added FontAwesome',
			'Added tree selection modal icons',
			'Added timeline event icons',
			'Added age readout to bio and timeline events',
			'Added timeline event count readout to timeline',
			'Improved the timeline spine top and bottom positioning',
			'Fixed various issues arising from bad object upgrade logic',
			'Improve build code generation in footer'
		]
	},
	'v0.13.x': {
		Overview:
			'v0.13.x refactors the timeline to a grid-based system, with better handling of large events and events with very close dates; also adds support for different event types and better special event handling',
		Changes: [
			'Refactored the timeline to use a grid instead of absolute positioning',
			'Added initial logic to shift rows when events land in rows already occupied by other events',
			'Added support for posthumous timeline events',
			'Added a checkbox to space timeline events relatively',
			'Added top-level date display on timeline event items',
			'Fixed issues with timeline event sorting',
			'Forced birthday to be set before adding timeline events'
		]
	},
	'v0.12.x': {
		Overview: 'v0.12.x adds a build mode for the tree view',
		Changes: [
			'Added a button to toggle build mode, hiding the (+) UI until buid mode is active',
			'Fixed performance issues from new person node connection lines and hover from 0.11',
			'Fixed layout issues with generation row',
			'Softened styling by adding border radii',
			'Added transitions on modals'
		]
	},
	'v0.11.x': {
		Overview: 'v0.11.x adds a proper canvas for drawing node connection lines to the active person',
		Changes: [
			'Added a canvas element',
			'Added lines from nodes to center',
			'Added color to connection line when hovering over attached node'
		]
	},
	'v0.10.x': {
		Overview: 'v0.10.x finishes the first pass of the timeline view',
		Changes: [
			'Added dynamically-placed UI to timeline',
			'Added ability to add, edit, and remove timeline events',
			'Added dynamic year and build date to footer'
		]
	},
	'v0.9.x': {
		Overview: 'v0.9.x improves parts of the NodeView and overhauls some legacy NodeView code',
		Changes: [
			'Switched from a node edit view in context to a node actions modal containing a node edit section',
			'Switched PersonNode input fields to static labels'
		]
	},
	'v0.8.x': {
		Overview: 'v0.8.x adds a person detail view, including bio and timeline views',
		Changes: ['Overhauled temporary state management to simplify editing code']
	},
	'v0.7.x': {
		Overview:
			'v0.7.x adds a notification system with notifications for loading and saving, a modal dialog to choose which familyTreeData to start with, plus the ability to scroll the flanks of a GenerationRow.',
		Changes: [
			'Added NotificationBanner and SaveStateBanner',
			'Added a modal dialog to choose between new tree, example tree, and load tree',
			'Added ability to know when unsaved changes are present, and added ability to save to SaveStateBanner',
			'Added scrolling GenerationRow flank, fixed styling issues when view is compressed',
			'Adds support for basic PAT encription for future password protection work'
		]
	},
	'v0.6.x': {
		Overview:
			'v0.6.x adds the ability to read and write the familyTreeData store to a private GitHub repo, and adds DevTools to the footer.',
		Changes: [
			'Added the ability to decrypt a PAT to communicate with GitHub',
			'Added the ability to read the contents of a file from GitHub',
			'Added the ability to write the contens of a json file on GitHub',
			'Refactored StoreView into DevTools',
			'Updated footer to include DevTools entry point'
		]
	},
	'v0.5.x': {
		Overview: 'v0.5.x adds the ability to read and write from the familyTreeData store.',
		Changes: ['Hooked up UI to familyTreeData store']
	},
	'v0.4.x': {
		Overview: 'v0.4.x adds the ability to read and write from the familyTreeData store.',
		Changes: ['Hooked up UI to familyTreeData store']
	},
	'v0.3.x': {
		Overview:
			'v0.3.x adds interactivity via clicking the add person button and clicking on a PersonNode to set the active person.',
		Changes: [
			'Added a button to add a new person',
			'Added the ability to click on a PersonNode to set the active person'
		]
	},
	'v0.2.x': {
		Overview:
			'v0.2.x introduces the GenerationRow and improves the interface by centering major elements horizontally and vertically.',
		Changes: [
			'Created the GenerationRow component',
			'Determined how to center GenerationRows vertically and their contents horizontally'
		]
	},
	'v0.1.x': {
		Overview: 'v0.1.x adds a basic PersonNode element.',
		Changes: ['Created initial PersonNode element', 'Created initial styles']
	},
	'v0.0.x': {
		Overview:
			'v0.0.x represents the initial attempt at creating a very basic interface for the Family Tree app.',
		Changes: ['Initialized repo and Svelte project', 'Created initial UI framework']
	}
};

export const schemaVersion = '0.11.3';
export const schemaChangelog = {
	'v0.11.x': {
		Overview:
			'v0.11.x adds support for uploading images including a bio photo and adds richer event content support, including images and associated people.',
		Changes: [
			'Added bioUrl field to person schema, restored label field for timeline-event-types schema',
			'Added image support for event content',
			'Added associated people support for event content',
			'Migrated legacy string event content to a description field'
		]
	},
	'v0.10.x': {
		Overview:
			'v0.10.x adds timeline support for each person and support for different timeline event types.',
		Changes: ['Added basic timeline event field in person schema', 'Added timeline event types']
	},
	'v0.9.x': {
		Overview:
			'v0.9.x wraps up the first pass of person bio fields and the initial supported relationship list with the addition of aunts, uncles, nieces, nephews (and great aunts, nieces, etc.) plus second cousins and spouse siblings-in-law.',
		Changes: [
			'Added support for aunts, uncles, great aunts, great uncles, nieces, nephews, great nieces, great nephews, cousins, second cousins, and spouse stepsiblings',
			'Added support for alternate names, birth and death properties'
		]
	},
	'v0.8.x': {
		Overview:
			'v0.8.x makes additional changes as required to support filtering the available people list via text box.',
		Changes: ['Made changes as required to support available people filtering.']
	},
	'v0.7.x': {
		Overview:
			'v0.7.x makes changes as required to support filtering the available people list via text box.',
		Changes: ['Made changes as required to support available people filtering.']
	},
	'v0.6.x': {
		Overview: 'v0.6.x organizes and refactors the ability to get inverse relationships.',
		Changes: ['Organized and refactored the logic to get inverse relationship IDs.']
	},
	'v0.5.x': {
		Overview:
			'v0.5.x updates relationshipMap to use friendly names for relationshipIDs instead of UUIDs.',
		Changes: ['Changed relationship IDs to friendly names instead of UUIDs']
	},
	'v0.4.x': {
		Overview:
			'v0.4.x moves stepsiblings and children-in-law into a proper grouping to match preferred organization.',
		Changes: ['Moved stepsiblings and children-in-law into their own relationship group.']
	},
	'v0.2.x': {
		Overview: 'v0.2.x splits the relationshipMap data into its own separate object.',
		Changes: ['Split relationshipMap from familyTreeData', 'Added UUID support for relationshipIDs']
	},
	'v0.1.x': {
		Overview: 'v0.1.x adds initial support for inverse relationship types.',
		Changes: ['Added inverse relationships for all relationships.']
	}
};
