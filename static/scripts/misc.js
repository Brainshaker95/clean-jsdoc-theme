/* global document */
/* global Prism */
/* global Node */

var accordionLocalStorageKey = 'accordion-id';

// eslint-disable-next-line no-undef
var localStorage = window.localStorage;

/**
 *
 * @param {string} value
 */
function copy(value) {
    const el = document.createElement('textarea');
    const editedValue = value.replace(/JAVASCRIPT\nCopied!$/, '');

    el.value = editedValue;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function showTooltip(id) {
    var tooltip = document.getElementById(id);

    tooltip.classList.add('show-tooltip');
    setTimeout(function() {
        tooltip.classList.remove('show-tooltip');
    }, 3000);
}

/* eslint-disable-next-line */
function rainbowBracesFunction(toggle, id)  {
    if (toggle) {
        showTooltip('rb-tooltip-' + id);

        if (localStorage.getItem('rainbow-braces') === 'active') {
            localStorage.setItem('rainbow-braces', 'inactive');
        } else {
            localStorage.setItem('rainbow-braces', 'active');
        }
    }

    document.querySelectorAll('pre').forEach((pre) => {
        pre.classList.toggle('rainbow-braces', localStorage.getItem('rainbow-braces') === 'active');
    });

    Prism.highlightAll();
}

function addDefaultTokensToCss() {
    const cssCodes = document.querySelectorAll('.language-css');

    cssCodes.forEach((cssCode) => {
        cssCode.childNodes.forEach((childNode) => {
            if (childNode.nodeType === Node.TEXT_NODE) {
                if (!childNode.textContent.trim()) {
                    return;
                }

                const span = document.createElement('span');

                childNode.after(span);
                span.appendChild(childNode);
                span.classList.add('token');
                span.classList.add('default');
            }
        });
    });
}

/* eslint-disable-next-line */
function copyFunction(id) {
    // selecting the pre element
    var code = document.getElementById(id);

    // selecting the code block
    var element = code.querySelector('code');

    // copy
    copy(element.innerText);

    // show tooltip
    showTooltip('tooltip-' + id);
}

function removeCallbackLinksFromNav() {
    document.querySelectorAll('.accordion-list').forEach((item) => {
        const link = item.firstChild;

        if (link.href.indexOf('Callback') > -1) {
            item.remove();
        }
    });
}

(function() {
    removeCallbackLinksFromNav();

    // capturing all pre element on the page
    var allPre = document.getElementsByTagName('pre');

    var i, classList, pre;

    for ( i = 0; i < allPre.length; i++) {
        pre = allPre[i];
        // get the list of class in current pre element
        classList = allPre[i].classList;
        var id = 'pre-id-' + i;

        // tooltips
        var tooltip = '<div class="tooltip" id="tooltip-' + id + '">Copied</div>';
        var rainbowBracestooltip = '<div class="tooltip" id="rb-tooltip-' + id + '">Rainbow braces toggled!</div>';

        // template of toggle rainbow braces icon container
        var rainbowBraces = '<div class="icon-container" onclick="rainbowBracesFunction(true, \'' + id + '\')"><div><svg class="sm-icon" alt="click to toggle rainbow braces"><use xlink:href="#brush-icon"></use></svg>' + rainbowBracestooltip + '</div></div>';

        // template of copy to clipboard icon container
        var copyToClipboard = '<div class="icon-container" onclick="copyFunction(\'' + id + '\')"><div><svg class="sm-icon" alt="click to copy"><use xlink:href="#copy-icon"></use></svg>' + tooltip + '</div></div>';

        // extract the code language
        var langName = classList[classList.length - 1].split('-')[1];

        if ( langName === undefined ) { langName = 'JavaScript'; }

        var langNameDiv = '<div class="code-lang-name-container"><div class="code-lang-name">' + langName.toLocaleUpperCase() + '</div></div>';

        if (!pre.classList.contains('match-braces')) {
            pre.classList.add('match-braces');
        }

        // appending everything to the current pre element
        pre.innerHTML += '<div class="pre-top-bar-container">' +
            langNameDiv +
            '<div class="flex">' +
            rainbowBraces +
            copyToClipboard +
            '</div></div>';

        pre.setAttribute('id', id);
    }

    rainbowBracesFunction();

    setTimeout(addDefaultTokensToCss, 100);

    const constructorTutorialItem = document.querySelector('#constructor-tutorial');

    if (constructorTutorialItem) {
        constructorTutorialItem.parentElement.prepend(constructorTutorialItem);
    }

    const tutorialContent = document.querySelector('.tutorial-content');

    if (!tutorialContent) {
        return;
    }

    const headlines = tutorialContent.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headlines.forEach((headline) => {
        headline.setAttribute(
            'id',
            headline.textContent.toLowerCase().replace(' ', '-')
        );
    });
})();


/**
 * Function to set accordion id to localStorage.
 * @param {string} id Accordion id
 */
function setAccordionIdToLocalStorage(id) {
    /**
     * @type {object}
     */
    var ids = JSON.parse(localStorage.getItem(accordionLocalStorageKey));

    ids[id] = id;
    localStorage.setItem(accordionLocalStorageKey, JSON.stringify(ids));
}

/**
 * Function to remove accordion id from localStorage.
 * @param {string} id Accordion id
 */
function removeAccordionIdFromLocalStorage(id) {
    /**
     * @type {object}
     */
    var ids = JSON.parse(localStorage.getItem(accordionLocalStorageKey));

    delete ids[id];
    localStorage.setItem(accordionLocalStorageKey, JSON.stringify(ids));
}

/**
 * Function to get all accordion ids from localStorage.
 *
 * @returns {object}
 */
function getAccordionIdsFromLocalStorage() {
    /**
     * @type {object}
     */
    var ids = JSON.parse(localStorage.getItem(accordionLocalStorageKey));

    return ids || {};
}


function toggleAccordion(element, isImmediate) {
    var currentNode = element;
    var isCollapsed = currentNode.classList.contains('collapsed');
    var currentNodeUL = currentNode.querySelector('.accordion-content');

    if (isCollapsed) {
        if (isImmediate) {
            currentNode.classList.remove('collapsed');
            currentNodeUL.style.height = 'auto';

            return;
        }

        var scrollHeight = currentNodeUL.scrollHeight;

        currentNodeUL.style.height = scrollHeight + 'px';
        currentNode.classList.remove('collapsed');
        setAccordionIdToLocalStorage(currentNode.id);
        setTimeout(function() {
            if (!currentNode.classList.contains('collapsed'))
            { currentNodeUL.style.height = 'auto'; }
        }, 600);
    } else {
        currentNodeUL.style.height = '0px';
        currentNode.classList.add('collapsed');
        removeAccordionIdFromLocalStorage(currentNode.id);
    }
}

(function() {
    if (localStorage.getItem(accordionLocalStorageKey) === undefined ||
    localStorage.getItem(accordionLocalStorageKey) === null
    ) {
        localStorage.setItem(accordionLocalStorageKey, '{}');
    }
    var allAccordion = document.querySelectorAll('.accordion-heading');
    var ids = getAccordionIdsFromLocalStorage();


    allAccordion.forEach(function(item) {
        var parent = item.parentNode;

        item.addEventListener('click', function() { toggleAccordion(parent); } );
        if (parent.id in ids) {
            toggleAccordion(parent, true);
        }
    });
})();


/**
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} navbar
 */
function toggleNavbar(element, navbar) {
    /**
     * If class is present than it is expanded.
     */
    var isExpanded = element.classList.contains('expanded');

    if (isExpanded) {
        element.classList.remove('expanded');
        navbar.classList.remove('expanded');
    } else {
        element.classList.add('expanded');
        navbar.classList.add('expanded');
    }
}

/**
 * Navbar ham
 */
(function() {
    var navbarHam = document.querySelector('#navbar-ham');
    var navbar = document.querySelector('#navbar');

    if (navbarHam && navbar) {
        navbarHam.addEventListener('click', function() {
            toggleNavbar(navbarHam, navbar);
        });
    }
})();
