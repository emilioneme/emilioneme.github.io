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
