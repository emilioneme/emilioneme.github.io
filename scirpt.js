// Initialize Lucide icons
lucide.createIcons();

// Dark Mode Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
	html.classList.add('dark');
}

// Toggle theme function
if (themeToggle) {
	themeToggle.addEventListener('click', () => {
		html.classList.toggle('dark');
		const isDark = html.classList.contains('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');

		// Re-initialize icons to ensure they render correctly
		lucide.createIcons();
	});
}

// Hamburger / side-panel (mobile)
const hamburger = document.getElementById('hamburger');
const sidePanel = document.getElementById('side-panel');
const navEl = document.querySelector('nav');
if (hamburger && sidePanel) {
	const openPanel = () => {
		hamburger.classList.add('open');
		sidePanel.classList.add('show');
		sidePanel.setAttribute('aria-hidden', 'false');
		if (navEl) navEl.classList.add('panel-open');
		lucide.createIcons();
	};
	const closePanel = () => {
		hamburger.classList.remove('open');
		sidePanel.classList.remove('show');
		sidePanel.setAttribute('aria-hidden', 'true');
		if (navEl) navEl.classList.remove('panel-open');
	};

	hamburger.addEventListener('click', () => {
		if (hamburger.classList.contains('open')) closePanel();
		else openPanel();
	});

	sidePanel.querySelectorAll('a').forEach(a => {
		a.addEventListener('click', () => {
			closePanel();
			// Check if it's the projects link and expand if needed
			if (a.getAttribute('href') === '#projects') {
				// Delay to ensure panel closes smoothly first
				setTimeout(() => expandProjectsSection(), 300);
			}
		});
	});

	// Close panel when viewport becomes wider than mobile breakpoint
	const mq = window.matchMedia('(min-width: 721px)');
	const handleMq = (e) => { if (e.matches) closePanel(); };
	if (mq.addEventListener) mq.addEventListener('change', handleMq);
	else if (mq.addListener) mq.addListener(handleMq);
}

// Smooth scroll for navigation
const projectsAnchor = document.querySelector('a[href="#projects"]');
if (projectsAnchor) {
	projectsAnchor.addEventListener('click', function (e) {
		e.preventDefault();
		expandProjectsSection(); // Ensure it's expanded
		document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
	});
}

// Toggle projects section
let projectsSectionExpanded = false; // Start collapsed
const projectsExtraHeight = 180;
function setProjectsContentHeight(contentEl) {
	if (!contentEl) return;
	contentEl.style.maxHeight = (contentEl.scrollHeight + projectsExtraHeight) + 'px';
}

function toggleProjectsSection() {
	const content = document.getElementById('projects-content');
	const chevron = document.getElementById('projects-chevron');

	projectsSectionExpanded = !projectsSectionExpanded;

	if (projectsSectionExpanded) {
		setProjectsContentHeight(content);
		if (chevron) chevron.style.transform = 'rotate(180deg)';
	} else {
		if (content) content.style.maxHeight = '0px';
		if (chevron) chevron.style.transform = 'rotate(0deg)';
	}
}

// Expand projects section
function expandProjectsSection() {
	const content = document.getElementById('projects-content');
	const chevron = document.getElementById('projects-chevron');

	if (!projectsSectionExpanded) {
		projectsSectionExpanded = true;
		setProjectsContentHeight(content);
		if (chevron) chevron.style.transform = 'rotate(180deg)';
	}
}

// Project expand/collapse functionality
function toggleProject(card) {
	const details = card.querySelector('.project-details');
	const icon = card.querySelector('.project-icon');

	const isOpen = details.style.maxHeight && details.style.maxHeight !== '0px';

	// Ensure the parent projects section is expanded when toggling a card inside it
	const projectsSection = card.closest('#projects');
	const projectsContent = projectsSection ? document.getElementById('projects-content') : null;
	const projectsChevron = document.getElementById('projects-chevron');

	if (projectsContent && (!projectsSectionExpanded || projectsContent.style.maxHeight === '0px')) {
		projectsSectionExpanded = true;
		setProjectsContentHeight(projectsContent);
		if (projectsChevron) projectsChevron.style.transform = 'rotate(180deg)';
	}

	if (!isOpen) {
		details.style.maxHeight = details.scrollHeight + 'px';
		if (icon) icon.style.transform = 'rotate(180deg)';
	} else {
		details.style.maxHeight = '0px';
		if (icon) icon.style.transform = 'rotate(0deg)';
	}

	// Recalculate the projects container height after the card transition finishes
	if (projectsContent) {
		setTimeout(() => {
			setProjectsContentHeight(projectsContent);
		}, 350);
	}
}

function toggleSection(el, targetClass) {
	const section = el.closest('.prose, .project-details').querySelector('.' + targetClass);
	const icon = el.querySelector('[class*="-icon"]');

	section.classList.toggle('hidden');
	if (icon) {
		icon.style.transform = section.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
	}

	// Recalculate parent card's max-height
	const card = el.closest('.project-card');
	const details = card.querySelector('.project-details');
	details.style.maxHeight = 'none';
	details.style.maxHeight = details.scrollHeight + 'px';

	// Also update the projects content container if this card is inside the projects section
	const projectsSection = card.closest('#projects');
	const projectsContent = projectsSection ? document.getElementById('projects-content') : null;
	if (projectsContent) {
		setTimeout(() => {
			setProjectsContentHeight(projectsContent);
		}, 350);
	}
}

class ProjectCard {
	static defaults = {
		cardClasses: 'project-card bg-white dark:bg-black border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/5 self-start',
		titleWrapperClasses: 'p-0',
		titleRowClasses: 'flex flex-col md:flex-row max-height-450',
		detailsClasses: 'project-details border-t border-black/10 dark:border-white/10 bg-gray-50/50 dark:bg-neutral-900/50 overflow-hidden transition-all duration-500 ease-in-out max-height-0',
		footerClasses: 'flex space-x-4 pt-2 border-t border-black/5 dark:border-white/5 bg-gray-300 dark:bg-black px-4 py-3'
	};

	constructor({
		cardId,
		cardClasses,
		titleWrapperClasses,
		titleRowClasses,
		mediaHtml,
		contentHtml,
		detailsClasses,
		detailsHtml,
		footerClasses,
		footerHtml,
		isExpandable
	}) {
		this.cardId = cardId || '';
		this.cardClasses = cardClasses || ProjectCard.defaults.cardClasses;
		this.titleWrapperClasses = titleWrapperClasses || ProjectCard.defaults.titleWrapperClasses;
		this.titleRowClasses = titleRowClasses || ProjectCard.defaults.titleRowClasses;
		this.mediaHtml = mediaHtml;
		this.contentHtml = contentHtml;
		this.detailsClasses = detailsClasses || ProjectCard.defaults.detailsClasses;
		this.detailsHtml = detailsHtml;
		this.footerClasses = footerClasses || ProjectCard.defaults.footerClasses;
		this.footerHtml = footerHtml;
		this.isExpandable = typeof isExpandable === 'boolean' ? isExpandable : true;
	}

	static fromElement(cardEl) {
		const titleWrapper = Array.from(cardEl.children).find(child => child.classList.contains('p-0'));
		const titleRow = titleWrapper ? Array.from(titleWrapper.children).find(child => child.classList.contains('flex')) : null;
		const detailsEl = Array.from(cardEl.children).find(child => child.classList.contains('project-details'));
		const footerEl = Array.from(cardEl.children).find(child => child !== titleWrapper && child !== detailsEl);

		const isExpandable = Boolean(detailsEl && titleRow);
		const mediaHtml = titleRow && titleRow.children[0] ? titleRow.children[0].outerHTML : '';
		const contentHtml = titleRow && titleRow.children[1] ? titleRow.children[1].outerHTML : '';

		return new ProjectCard({
			cardId: cardEl.dataset.projectCardId || '',
			cardClasses: cardEl.className || ProjectCard.defaults.cardClasses,
			titleWrapperClasses: titleWrapper ? titleWrapper.className : ProjectCard.defaults.titleWrapperClasses,
			titleRowClasses: titleRow ? titleRow.className : ProjectCard.defaults.titleRowClasses,
			mediaHtml,
			contentHtml,
			detailsClasses: detailsEl ? detailsEl.className : ProjectCard.defaults.detailsClasses,
			detailsHtml: detailsEl ? detailsEl.innerHTML : '',
			footerClasses: footerEl ? footerEl.className : ProjectCard.defaults.footerClasses,
			footerHtml: footerEl ? footerEl.innerHTML : '',
			isExpandable
		});
	}
}

function escapeHtml(value) {
	return String(value || '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function buildProjectCardMediaHtml(thumbnail) {
	if (!thumbnail || !thumbnail.src) return '';
	const src = escapeHtml(thumbnail.src);
	const alt = escapeHtml(thumbnail.alt || thumbnail.title || 'Project thumbnail');
	return `<div class="md:w-1/3 w-full aspect-video overflow-hidden bg-gray-100 dark:bg-neutral-800">
								<img src="${src}" alt="${alt}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 hover:grayscale-100">
							</div>`;
}

function buildProjectCardTagsHtml(tags) {
	if (!Array.isArray(tags) || tags.length === 0) return '';
	return tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
}

function buildProjectCardContentHtml({ title, description, tags, showViewDetails = true }) {
	const safeTitle = escapeHtml(title || 'Untitled Project');
	const safeDescription = escapeHtml(description || '');
	const tagsHtml = buildProjectCardTagsHtml(tags);
	const viewDetailsHtml = showViewDetails
		? `<div class="mt-4 flex items-center text-sm text-black dark:text-white font-medium">
									<span class="mr-2">View Details</span>
									<i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300 project-icon"></i>
								</div>`
		: '';

	return `<div class="p-6 md:w-2/3 flex flex-col justify-center">
								<h1 class="text-2xl md:text-3xl font-semibold tracking-tight uppercase">
									${safeTitle}
								</h1>
								<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
									${safeDescription}
								</p>
								<div class="flex items-center text-xs uppercase tracking-wider text-gray-400 dark:text-gray-600 space-x-4">
									${tagsHtml}
								</div>
								${viewDetailsHtml}
							</div>`;
}

function buildProjectCardFooterHtml(links) {
	if (!Array.isArray(links) || links.length === 0) return '';
	return links.map(link => {
		const href = escapeHtml(link.href || '#');
		const label = escapeHtml(link.label || 'Link');
		const icon = escapeHtml(link.icon || 'external-link');
		const target = link.target ? ` target="${escapeHtml(link.target)}"` : '';
		const rel = target ? ' rel="noopener noreferrer"' : '';
		return `<a href="${href}"${target}${rel} class="inline-flex items-center space-x-2 text-sm uppercase tracking-wider hover-slide hover:text-gray-600 dark:hover:text-gray-400">
							<i data-lucide="${icon}" class="w-4 h-4"></i>
							<span>${label}</span>
						</a>`;
	}).join('');
}

function getTemplateContent(templateId) {
	if (!templateId) return '';
	const template = document.getElementById(templateId);
	if (!template || !(template instanceof HTMLTemplateElement)) return '';
	return template.innerHTML;
}

function hasAllProjectDetailsTemplates() {
	const requiredTemplateIds = Array.from(new Set(
		(Array.isArray(window.projectCardsData) ? window.projectCardsData : [])
			.map(entry => entry && entry.detailsTemplateId)
			.filter(Boolean)
	));

	if (requiredTemplateIds.length === 0) return true;

	return requiredTemplateIds.every(templateId => {
		const template = document.getElementById(templateId);
		return template instanceof HTMLTemplateElement;
	});
}

async function loadProjectDetailsTemplates(url = 'project-details-templates.html') {
	if (hasAllProjectDetailsTemplates()) return;

	try {
		const response = await fetch(url, { cache: 'no-store' });
		if (!response.ok) {
			throw new Error(`Template fetch failed with status ${response.status}`);
		}

		const htmlText = await response.text();
		const wrapper = document.createElement('div');
		wrapper.innerHTML = htmlText;
		const templates = wrapper.querySelectorAll('template[id]');

		if (templates.length === 0) {
			throw new Error('No templates found in external template file');
		}

		const fragment = document.createDocumentFragment();
		templates.forEach(template => {
			fragment.appendChild(template.cloneNode(true));
		});
		document.body.appendChild(fragment);
	} catch (error) {
		console.warn('Unable to load project detail templates from external file.', error);
	}
}

function resolveProjectCardConfig(entry) {
	const card = entry.card || {};
	const isExpandable = typeof entry.isExpandable === 'boolean'
		? entry.isExpandable
		: (typeof card.isExpandable === 'boolean' ? card.isExpandable : true);

	const mediaHtml = entry.thumbnail
		? buildProjectCardMediaHtml(entry.thumbnail)
		: (card.mediaHtml || '');

	const contentHtml = (entry.title || entry.description || Array.isArray(entry.tags))
		? buildProjectCardContentHtml({
			title: entry.title,
			description: entry.description,
			tags: entry.tags || [],
			showViewDetails: isExpandable
		})
		: (card.contentHtml || '');

	const footerHtml = Array.isArray(entry.links)
		? buildProjectCardFooterHtml(entry.links)
		: (card.footerHtml || '');

	const detailsHtmlFromTemplate = getTemplateContent(entry.detailsTemplateId || card.detailsTemplateId);

	return {
		cardId: entry.cardId || card.cardId || '',
		cardClasses: card.cardClasses || ProjectCard.defaults.cardClasses,
		titleWrapperClasses: card.titleWrapperClasses || ProjectCard.defaults.titleWrapperClasses,
		titleRowClasses: card.titleRowClasses || ProjectCard.defaults.titleRowClasses,
		mediaHtml,
		contentHtml,
		detailsClasses: card.detailsClasses || ProjectCard.defaults.detailsClasses,
		detailsHtml: detailsHtmlFromTemplate || entry.detailsHtml || card.detailsHtml || '',
		footerClasses: card.footerClasses || ProjectCard.defaults.footerClasses,
		footerHtml,
		isExpandable
	};
}

function removeViewDetailsCta(contentHtml) {
	if (!contentHtml) return contentHtml;
	const wrapper = document.createElement('div');
	wrapper.innerHTML = contentHtml;
	const detailsIcon = wrapper.querySelector('.project-icon');
	if (detailsIcon && detailsIcon.parentElement) {
		detailsIcon.parentElement.remove();
	}
	return wrapper.innerHTML;
}

function createProjectCardElement(projectCard) {
	const cardEl = document.createElement('div');
	cardEl.className = projectCard.cardClasses;
	if (projectCard.cardId) {
		cardEl.dataset.projectCardId = projectCard.cardId;
	}

	const titleWrapper = document.createElement('div');
	titleWrapper.className = projectCard.titleWrapperClasses;

	const titleRow = document.createElement('div');
	titleRow.className = projectCard.titleRowClasses;
	titleRow.removeAttribute('onclick');
	if (projectCard.isExpandable) {
		titleRow.setAttribute('data-project-card-toggle', 'true');
		if (!titleRow.classList.contains('cursor-pointer')) {
			titleRow.classList.add('cursor-pointer');
		}
	}
	titleRow.innerHTML = `${projectCard.mediaHtml}${projectCard.contentHtml}`;

	titleWrapper.appendChild(titleRow);
	cardEl.appendChild(titleWrapper);

	if (projectCard.isExpandable) {
		const detailsEl = document.createElement('div');
		detailsEl.className = projectCard.detailsClasses;
		detailsEl.innerHTML = projectCard.detailsHtml;
		cardEl.appendChild(detailsEl);
	}

	if (projectCard.footerHtml) {
		const footerEl = document.createElement('div');
		footerEl.className = projectCard.footerClasses;
		footerEl.innerHTML = projectCard.footerHtml;
		cardEl.appendChild(footerEl);
	}

	return cardEl;
}

function bindProjectCardToggleEvents(root = document) {
	root.querySelectorAll('[data-project-card-toggle="true"]').forEach(row => {
		if (row.dataset.toggleBound === 'true') return;
		row.addEventListener('click', () => {
			const card = row.closest('.project-card');
			if (card) toggleProject(card);
		});
		row.dataset.toggleBound = 'true';
	});
}

function getTopLevelProjectCards() {
	return Array.from(document.querySelectorAll('.project-card')).filter(card => !card.parentElement.closest('.project-card'));
}

function getOrCreateContainerSelector(containerEl, index) {
	if (containerEl.id) return `#${containerEl.id}`;
	if (!containerEl.dataset.projectCardsContainer) {
		containerEl.dataset.projectCardsContainer = `project-cards-container-${index + 1}`;
	}
	return `[data-project-cards-container="${containerEl.dataset.projectCardsContainer}"]`;
}

function getDefaultProjectCardsDataFromDom() {
	return getTopLevelProjectCards().map((cardEl, index) => {
		const containerEl = cardEl.parentElement;
		const containerSelector = getOrCreateContainerSelector(containerEl, index);
		const cardData = ProjectCard.fromElement(cardEl);
		return {
			cardId: cardData.cardId,
			containerSelector,
			card: {
				cardId: cardData.cardId,
				cardClasses: cardData.cardClasses,
				titleWrapperClasses: cardData.titleWrapperClasses,
				titleRowClasses: cardData.titleRowClasses,
				mediaHtml: cardData.mediaHtml,
				contentHtml: cardData.contentHtml,
				detailsClasses: cardData.detailsClasses,
				detailsHtml: cardData.detailsHtml,
				footerClasses: cardData.footerClasses,
				footerHtml: cardData.footerHtml,
				isExpandable: cardData.isExpandable
			}
		};
	});
}

function getCardTitleFromContentHtml(contentHtml) {
	const wrapper = document.createElement('div');
	wrapper.innerHTML = contentHtml || '';
	const heading = wrapper.querySelector('h1');
	return heading ? heading.textContent.trim().toLowerCase() : '';
}

function getCardDataKey(entry) {
	if (!entry) return '';
	const entryCard = entry.card || {};
	const cardId = entry.cardId || entryCard.cardId || '';
	if (cardId) return `id:${cardId}`;
	const titleFromEntry = (entry.title || '').trim().toLowerCase();
	if (titleFromEntry) return `title:${titleFromEntry}`;
	const title = (entry.matchTitle || getCardTitleFromContentHtml(entryCard.contentHtml || '') || '').trim().toLowerCase();
	if (title) return `title:${title}`;
	return '';
}

function mergeProjectCardsData(defaultData, externalData) {
	if (!Array.isArray(defaultData) || defaultData.length === 0) return externalData || [];
	if (!Array.isArray(externalData) || externalData.length === 0) return defaultData;

	const merged = [...defaultData];
	const keyToIndex = new Map();
	merged.forEach((entry, index) => {
		const key = getCardDataKey(entry);
		if (key) keyToIndex.set(key, index);
	});

	externalData.forEach(entry => {
		const key = getCardDataKey(entry);
		if (key && keyToIndex.has(key)) {
			const targetIndex = keyToIndex.get(key);
			const baseEntry = merged[targetIndex];
			const mergedEntry = {
				...baseEntry,
				...entry,
				cardId: entry.cardId || baseEntry.cardId || '',
				containerSelector: entry.containerSelector || baseEntry.containerSelector,
				title: entry.title || baseEntry.title,
				description: entry.description || baseEntry.description,
				tags: Array.isArray(entry.tags) ? entry.tags : baseEntry.tags,
				thumbnail: entry.thumbnail || baseEntry.thumbnail,
				detailsHtml: entry.detailsHtml || baseEntry.detailsHtml,
				links: Array.isArray(entry.links) ? entry.links : baseEntry.links,
				isExpandable: typeof entry.isExpandable === 'boolean' ? entry.isExpandable : baseEntry.isExpandable,
				card: {
					...(baseEntry.card || {}),
					...(entry.card || {}),
					cardId: (entry.card && entry.card.cardId) || entry.cardId || (baseEntry.card && baseEntry.card.cardId) || baseEntry.cardId || ''
				}
			};
			merged[targetIndex] = mergedEntry;
		} else {
			const appendEntry = {
				...entry,
				card: {
					...(entry.card || {}),
					cardId: (entry.card && entry.card.cardId) || entry.cardId || ''
				}
			};
			merged.push(appendEntry);
		}
	});

	return merged;
}

function renderProjectCardsFromData(projectCardsData) {
	if (!Array.isArray(projectCardsData) || projectCardsData.length === 0) return;

	getTopLevelProjectCards().forEach(card => card.remove());

	projectCardsData.forEach(entry => {
		if (!entry || !entry.containerSelector) return;
		const container = document.querySelector(entry.containerSelector);
		if (!container) return;
		const projectCard = new ProjectCard(resolveProjectCardConfig(entry));
		const cardElement = createProjectCardElement(projectCard);
		container.appendChild(cardElement);
	});
}

function getProjectCardsSourceData() {
	if (Array.isArray(window.projectCardsResolvedData) && window.projectCardsResolvedData.length > 0) {
		return window.projectCardsResolvedData;
	}
	return Array.isArray(window.projectCardsData) ? window.projectCardsData : [];
}

function renderEmbeddedProjectCardCollections() {
	const sourceData = getProjectCardsSourceData();
	if (!Array.isArray(sourceData) || sourceData.length === 0) return;

	const entriesById = new Map();
	sourceData.forEach(entry => {
		const cardId = entry && entry.cardId;
		if (cardId) entriesById.set(cardId, entry);
	});

	document.querySelectorAll('[data-project-card-ids]').forEach(container => {
		const ids = (container.dataset.projectCardIds || '')
			.split(',')
			.map(value => value.trim())
			.filter(Boolean);

		container.innerHTML = '';

		ids.forEach(cardId => {
			const entry = entriesById.get(cardId);
			if (!entry) return;

			const config = resolveProjectCardConfig(entry);
			const embeddedContentHtml = (entry.title || entry.description || Array.isArray(entry.tags))
				? buildProjectCardContentHtml({
					title: entry.title,
					description: entry.description,
					tags: entry.tags || [],
					showViewDetails: false
				})
				: removeViewDetailsCta(config.contentHtml);

			const embeddedCard = new ProjectCard({
				...config,
				contentHtml: embeddedContentHtml,
				isExpandable: false,
				detailsHtml: ''
			});

			container.appendChild(createProjectCardElement(embeddedCard));
		});
	});
}

function initializeProjectCardsData() {
	const externalData = Array.isArray(window.projectCardsData) ? window.projectCardsData : [];
	const defaultData = getDefaultProjectCardsDataFromDom();
	const projectCardsData = mergeProjectCardsData(defaultData, externalData);

	renderProjectCardsFromData(projectCardsData);
	window.projectCardsResolvedData = projectCardsData;
}

function renderAllProjectCards() {
	const cards = Array.from(document.querySelectorAll('.project-card'));
	const getProjectCardDepth = (cardEl) => {
		let depth = 0;
		let current = cardEl.parentElement;
		while (current) {
			if (current.classList && current.classList.contains('project-card')) depth += 1;
			current = current.parentElement;
		}
		return depth;
	};
	const cardsDeepestFirst = cards.sort((a, b) => {
		const depthA = getProjectCardDepth(a);
		const depthB = getProjectCardDepth(b);
		return depthB - depthA;
	});

	cardsDeepestFirst.forEach(cardEl => {
		if (!cardEl.isConnected) return;
		const projectCard = ProjectCard.fromElement(cardEl);
		const renderedCard = createProjectCardElement(projectCard);
		cardEl.replaceWith(renderedCard);
	});

	bindProjectCardToggleEvents();
	lucide.createIcons();
}

// Respect system preference if no localStorage
if (!localStorage.getItem('theme')) {
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		html.classList.add('dark');
	}
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	if (!localStorage.getItem('theme')) {
		if (e.matches) {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
	}
});

async function bootstrapProjectCards() {
	await loadProjectDetailsTemplates();
	initializeProjectCardsData();
	renderEmbeddedProjectCardCollections();
	renderAllProjectCards();
}

bootstrapProjectCards();

// Floater
(function () {
	const speed = 180;
	let currentSize = 200;

	const el = document.createElement('div');
	el.className = 'floater';
	el.innerHTML = '<img src="images\\Megablyte\\megablyteLogo.png" alt="O" class="w-full h-full object-cover rounded-full border border-black/0 dark:border-white/0 contrast-125">';
	document.body.appendChild(el);

	let x = Math.random() * (window.innerWidth - currentSize);
	let y = Math.random() * (window.innerHeight - currentSize);
	let angle = Math.random() * Math.PI * 2;
	let vx = Math.cos(angle) * speed;
	let vy = Math.sin(angle) * speed;

	function randomizeDirection() {
		angle = Math.random() * Math.PI * 2;
		vx = Math.cos(angle) * speed;
		vy = Math.sin(angle) * speed;
	}

	function kill() {
		el.remove();
	}

	el.addEventListener('mouseover', (e) => {
		e.stopPropagation();
		randomizeDirection();
	});

	el.addEventListener('click', () => {
		kill();
	});

	function clampAndBounce(dt) {
		const w = window.innerWidth;
		const h = window.innerHeight;
		x += vx * dt;
		y += vy * dt;

		if (x <= 0) {
			x = 0;
			vx = Math.abs(vx);
		}
		if (x >= w - currentSize) {
			x = w - currentSize;
			vx = -Math.abs(vx);
		}
		if (y <= 0) {
			y = 0;
			vy = Math.abs(vy);
		}
		if (y >= h - currentSize) {
			y = h - currentSize;
			vy = -Math.abs(vy);
		}
	}

	let last = performance.now();
	function frame(now) {
		const dt = (now - last) / 1000;
		last = now;
		currentSize = currentSize * 0.999;
		clampAndBounce(dt);
		el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
		el.style.width = currentSize + 'px';
		el.style.height = currentSize + 'px';
		requestAnimationFrame(frame);
		if (currentSize < 20) {
			kill();
			return;
		}
	}
	requestAnimationFrame(frame);

	window.addEventListener('resize', () => {
		x = Math.min(x, window.innerWidth - currentSize);
		y = Math.min(y, window.innerHeight - currentSize);
	});
})();

window.toggleProjectsSection = toggleProjectsSection;
window.expandProjectsSection = expandProjectsSection;
window.toggleProject = toggleProject;
window.toggleSection = toggleSection;
window.renderProjectCardsFromData = renderProjectCardsFromData;
window.initializeProjectCardsData = initializeProjectCardsData;
window.renderAllProjectCards = renderAllProjectCards;
