class Search {
	// 1. describe and create/initiate our object
	constructor() {
		this.addSearchHTML();
		this.resultsDiv = document.querySelector('#search-overlay__results');
		this.openButton = document.querySelectorAll('.js-search-trigger');
		this.closeButton = document.querySelector('.search-overlay__close');
		this.searchBg = document.querySelector('.search-background');
		this.searchOverlay = document.querySelector('.search-overlay');
		this.searchField = document.querySelector('#search-term');
		this.isOverlayOpen = false;
		this.isSpinnerVisible = false;
		this.previousValue;
		this.typingTimer;
		this.events();
	}

	// 2. events
	events() {
		this.openButton.forEach((el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();
				this.openOverlay();
			});
		});

		this.closeButton.addEventListener('click', () => this.closeOverlay());
		document.addEventListener('keydown', (e) => this.keyPressDispatcher(e));
		this.searchField.addEventListener('keyup', () => this.typingLogic());
	}

	// 3. methods (function, action...)
	typingLogic() {
		if (this.searchField.value != this.previousValue) {
			clearTimeout(this.typingTimer);

			if (this.searchField.value) {
				if (!this.isSpinnerVisible) {
					this.resultsDiv.innerHTML =
						'<div class="spinner-loader"></div>';
					this.isSpinnerVisible = true;
				}
				this.typingTimer = setTimeout(this.getResults.bind(this), 750);
			} else {
				this.resultsDiv.innerHTML = '';
				this.isSpinnerVisible = false;
			}
		}

		this.previousValue = this.searchField.value;
	}

	async getResults() {
		const header = new Headers();
		header.append('X-WP-Nonce', searchData.nonce);
		try {
			const response = await fetch(
				searchData.root_url +
					'/wp-json/quotes/v1/search?term=' +
					encodeURIComponent(this.searchField.value),
				{
					headers: header,
				},
			);
			const results = await response.json();
			if (!results.generalInfo.length) {
				this.resultsDiv.innerHTML = '<p>No results found.</p>';
				this.isSpinnerVisible = false;
				return;
			}
			this.resultsDiv.innerHTML = `
            <ul class="list--none result-item scroll">
                ${results.generalInfo
					.map(
						(item) =>
							`<li><a href="${encodeURI(item.permalink)}">${
								item.title
							}</a> <span class="type type--${
								item.postTypeSlug
							}">${
								item.postType != 'page' ? item.postType : ''
							}</span></li>`,
					)
					.join('')}
            </ul>`;
			this.isSpinnerVisible = false;
		} catch (e) {
			console.log(e);
		}
	}

	keyPressDispatcher(e) {
		if (
			e.keyCode == 83 &&
			!this.isOverlayOpen &&
			document.activeElement.tagName != 'INPUT' &&
			document.activeElement.tagName != 'TEXTAREA'
		) {
			this.openOverlay();
		}

		if (e.keyCode == 27 && this.isOverlayOpen) {
			this.closeOverlay();
		}
	}

	openOverlay() {
		this.searchBg.classList.add('search-background--active');
		this.searchOverlay.classList.add('search-overlay--active');
		document.body.classList.add('body-no-scroll');
		this.searchField.value = '';
		setTimeout(() => this.searchField.focus(), 301);
		this.isOverlayOpen = true;
		return false;
	}

	closeOverlay() {
		this.searchBg.classList.remove('search-background--active');
		this.searchOverlay.classList.remove('search-overlay--active');
		document.body.classList.remove('body-no-scroll');
		this.isOverlayOpen = false;
	}

	addSearchHTML() {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
        <div class="search-background">
            <div class="search-overlay">
                <div class="search-overlay__top">
                <div class="search-container">
                    <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                    <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
                    <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                </div>
                </div>
                
                <div class="search-container">
                <div id="search-overlay__results">
                </div>
                </div>

            </div>
        </div>
    `,
		);
	}
}

export default Search;
